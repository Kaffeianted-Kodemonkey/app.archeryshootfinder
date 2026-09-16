import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import { saveVenue, saveShoot } from "../saveToMongo.mjs";
import { logRejectedListing } from "../rejectedListings.mjs";
import { getGeocodingCoordinates } from "../utils/geocode.mjs";
import { normalizeStateCode } from "../utils/stateParser.mjs";

const PRO_AM_URL = "https://asaarchery.com/events/hoyt-easton-pro-am/";

// Utility helper to halt execution for a set number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function generateShootId(title, city, state, date) {
  const cleanTitle = title || "unknown";
  const cleanCity = city || "unknown";
  const cleanState = state || "unknown";
  const cleanDate = date || "unknown";
  const str = (
    cleanTitle +
    "-" +
    cleanCity +
    "-" +
    cleanState +
    "-" +
    cleanDate
  ).toLowerCase();

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// STRICT THREE-TOKEN COMPOSITE SLUG RULE: venueName + city + state
function getVenueSlugId(vname, city, state) {
  if (!vname || !city || !state) return null;
  const rawSlug = `${vname}-${city}-${state}`;
  return rawSlug.trim().toLowerCase().replace(/[\s\u00A0]+/g, "-");
}

function parseDynamicAsaDates(dateText, lineText) {
  if (!dateText) return { startDate: null, endDate: null };

  const monthMap = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const cleanText = dateText.toLowerCase().replace(/–|—/g, "-");
  let monthValue = "01";
  for (const [key, value] of Object.entries(monthMap)) {
    if (cleanText.includes(key)) {
      monthValue = value;
      break;
    }
  }

  const yearMatch =
    (lineText && lineText.match(/\b(20\d{2})\b/)) ||
    dateText.match(/\b(20\d{2})\b/);
  const yearValue = yearMatch ? yearMatch : "2026";

  const dayNumbers = cleanText.match(/\b\d{1,2}\b/g);
  let startDay = "01";
  let endDay = "01";

  if (dayNumbers && dayNumbers.length > 0) {
    startDay = String(dayNumbers[0]).padStart(2, "0");
    endDay = String(dayNumbers[dayNumbers.length - 1]).padStart(2, "0");
  }

  return {
    startDate: `${yearValue}-${monthValue}-${startDay}`,
    endDate: `${yearValue}-${monthValue}-${endDay}`,
  };
}
async function scrapeAsaProAm() {
  let totalScanned = 0;
  let totalDiscarded = 0;
  let venuesAddedCount = 0;
  let shootsAddedCount = 0;

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    console.log("📡 Fetching live structured data from ASA Pro/Am directory links...");

    const response = await axios.get(PRO_AM_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const validVenueIdsInRun = new Set();
    const venues = [];
    const shoots = [];

    // Real facility identities mapped to tournament locations
    const venueMapping = {
      "foley": "Graham Creek Interpretive Center",
      "russel county": "Uchee Creek Campground Activity Center",
      "russell county": "Uchee Creek Campground Activity Center",
      "camp minden": "Camp Minden Training Site",
      "london": "Laurel County Fairgrounds",
      "metropolis": "Mermet Lake State Conservation Area",
      "cullman": "St. Bernard Abbey",
      "belknap": "Mermet Lake State Conservation Area"
    };

    // Read page globally as flat layout string text to avoid class name breaking issues
    const rawTextContext = $("body").text().replace(/[\s\u00A0\r\n\t]+/g, " ");

    // Dynamic pattern captures tournament metadata streams cleanly on the fly
    const eventRegex = /([A-Z0-9\s/.\-&]+(?:Pro\/AM|Classic|Championship))\s+([^,]+),\s*([A-Z]{2})([A-Z][a-z]{2}\s+\d{1,2}\s*[\u2013\u2014-]\s*\d{1,2}(?:st|nd|rd|th)?,\s*\d{4})/gi;

    let match;
    while ((match = eventRegex.exec(rawTextContext)) !== null) {
      const rawTournamentName = match[1].trim();
      const rawCity = match[2].trim();
      const rawState = match[3].trim();
      const rawDateText = match[4].trim();

      if (!rawTournamentName || !rawCity || !rawState) continue;

      // Clean name parameters identically across seeder layers
      let cleanTournamentName = rawTournamentName.replace(/^\b\d+[A-Z]+\b\s*/i, "").trim();
      cleanTournamentName = cleanTournamentName
        .replace(/\b(asa|charter|sanctioned|governing|body|league|circuit)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      const city = rawCity === "Russel County" ? "Russell County" : rawCity;
      const state = normalizeStateCode(rawState);

      const lookupKey = city.toLowerCase();
      const venueName = venueMapping[lookupKey] || `${city} Event Grounds`;

      totalScanned++;
      const derivedVenueId = getVenueSlugId(venueName, city, state);
      const dates = parseDynamicAsaDates(rawDateText, cleanTournamentName);

      venues.push({
        venueId: derivedVenueId,
        vname: venueName,
        venueType: "Association",
        location: {
          address: venueName,
          city: city,
          state: state,
          zip: null,
          lat: null,
          lng: null,
        },
        contact: { phone: null, email: null, website: PRO_AM_URL },
        isClaimed: false,
        isLeague: false,
        isClass: false,
        isMembership: false,
        sourcePage: PRO_AM_URL
      });

      if (dates.endDate && dates.endDate < todayStr) {
        totalDiscarded++;
        console.log(`   ⏩ Dropping expired national tournament payload: [${cleanTournamentName}] (Ended: ${dates.endDate})`);
        continue;
      }

      shoots.push({
        shootId: generateShootId(cleanTournamentName, city, state, dates.startDate),
        sname: cleanTournamentName,
        venueId: derivedVenueId,
        associationType: "ASA",
        isDestination: true,
        isVerified: false,
        date: dates.startDate,
        endDate: dates.endDate,
        startTime: null,
        endTime: null,
        shootFormat: "3D",
        shootClass: "PRO_AM",
        bowTypes: null,
        skillLevel: null,
        terrain: null,
        entryFee: null,
        description: `Official ASA Archery Pro/Am Event hosted at ${venueName}.`,
        location: {
          address: venueName,
          city: city,
          state: state,
          zip: null,
          lat: null,
          lng: null,
        },
      });
    }

    console.log(`\n--- Processing ${venues.length} Discovered Venues ---`);
    const geocodedByVenueId = {};

    for (const venue of venues) {
      let coords = null;
      try {
        coords = await getGeocodingCoordinates(venue.location.city, venue.location.state);
        await sleep(2000);
      } catch (apiError) {
        totalDiscarded++;
        await logRejectedListing(
          "ASA_Dest_Geocode_API_Failure",
          { venueId: venue.venueId, error: apiError.message },
          "Rejected: Geocoding endpoint block fault."
        );
        continue;
      }

      if (!coords || coords.lat == null || coords.lng == null) {
        totalDiscarded++;
        await logRejectedListing(
          "ASA_ProAm_Geocode_Failure",
          { vname: venue.vname, city: venue.location.city, state: venue.location.state },
          "Dropped: Geocoder resolved to null coordinate parameters."
        );
        continue;
      }

      venue.location.lat = coords.lat;
      venue.location.lng = coords.lng;
      geocodedByVenueId[venue.venueId] = coords;

      try {
        await saveVenue(venue);
        venuesAddedCount++;
        console.log(`   ✅ Saved Destination Venue: ${venue.vname} (${venue.location.city}, ${venue.location.state})`);
        validVenueIdsInRun.add(venue.venueId);
        await sleep(100);
      } catch (err) {
        console.error(`   ❌ DB Error saving venue ${venue.venueId}:`, err.message);
      }
    }

    console.log(`\n--- Processing ${shoots.length} Active/Upcoming Tournaments ---`);
    for (const shoot of shoots) {
      if (!validVenueIdsInRun.has(shoot.venueId)) {
        continue;
      }

      const matchingCoords = geocodedByVenueId[shoot.venueId];
      if (matchingCoords) {
        shoot.location.lat = matchingCoords.lat;
        shoot.location.lng = matchingCoords.lng;
      }

      try {
        await saveShoot(shoot);
        shootsAddedCount++;
        console.log(`   🏆 Saved Tournament: ${shoot.sname} scheduled for ${shoot.date}`);
        await sleep(100);
      } catch (err) {
        console.error(`   ❌ DB Error saving tournament ${shoot.shootId}:`, err.message);
      }
    }

    console.log("\n🏁 --- Execution Scrape Complete ---");
    console.log(`📊 Scanned Matches: ${totalScanned} | Discarded/Expired: ${totalDiscarded}`);
    console.log(`💾 Saved to DB -> Venues: ${venuesAddedCount} | Active Tournaments: ${shootsAddedCount}\n`);

  } catch (outerError) {
    console.error("🚨 Critical Error inside main web scraper processing loop:", outerError);
  }
}

(async () => {
  try {
    console.log("🔌 Connecting to MongoDB cluster database...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/archery_platform");
    console.log("✅ Database connection established successfully.");

    await scrapeAsaProAm();
    console.log("👋 Script execution completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("🚨 Process crashed during runtime execution:", error);
    process.exit(1);
  }
})();

export { scrapeAsaProAm };
