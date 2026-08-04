import axios from "axios"
import * as cheerio from "cheerio"
import { saveVenue, saveShoot } from "./saveToMongo.mjs"

// === CONFIG ===
const URL = "https://rockymountainarcheryassociation.com/calendar"

// === Stable Shoot ID Generator ===
function generateShootId(title, date, city) {
  const str = `${title}-${date}-${city}`.toLowerCase()
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

async function scrapeRMAA() {
  try {
    const { data } = await axios.get(URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })

    const $ = cheerio.load(data)
    const venues = []
    const shoots = []

    $("table tr").each((index, element) => {
      const cells = $(element).find("td")
      if (cells.length < 4) return

      const rawDate = $(cells.eq(0)).text().trim()
      const rawTitle = $(cells.eq(1)).text().trim()
      const rawVenue = $(cells.eq(2)).text().trim()
      const rawCityState = $(cells.eq(3)).text().trim()

      if (!rawTitle || rawDate.toLowerCase().includes("date")) return

      // === DATE PARSING ===
      let cleanStr = rawDate
        .toLowerCase()
        .replace(/\s+or\s+/g, "-")
        .replace(/\s+to\s+/g, "-")
      let dateSections = cleanStr.split("-")
      let startParts = dateSections[0].split("/")
      if (startParts.length < 3) return

      let sMonth = startParts[0].padStart(2, "0")
      let sDay = startParts[1].padStart(2, "0")
      let sYear =
        startParts[2].length === 2 ? `20${startParts[2]}` : startParts[2]
      let formattedStartDate = `${sYear}-${sMonth}-${sDay}`
      let formattedEndDate = formattedStartDate

      if (dateSections.length > 1) {
        let endParts = dateSections[1].split("/")
        if (endParts.length === 3) {
          let eMonth = endParts[0].padStart(2, "0")
          let eDay = endParts[1].padStart(2, "0")
          let eYear =
            endParts[2].length === 2 ? `20${endParts[2]}` : endParts[2]
          formattedEndDate = `${eYear}-${eMonth}-${eDay}`
        }
      }

      // === CITY / STATE ===
      const [city, state] = rawCityState.split(",").map(s => s.trim())

      // === VENUE DATA ===
      const venueData = {
        vname: rawVenue,
        location: {
          address: "",
          city: city || "",
          state: state || "",
          zip: "",
        },
        contact: {},
        venueType: "Club",
      }

      // === SHOOT DATA (Stable ID) ===
      const shootData = {
        shootId: generateShootId(rawTitle, formattedStartDate, city),
        sname: rawTitle,
        slug: rawTitle.toLowerCase().replace(/\s+/g, "-"),
        venueId: `${rawVenue}-${city || "unknown"}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        date: formattedStartDate,
        endDate: formattedEndDate,
        startTime: "",
        endTime: "",
        shootFormat: [],
        shootClass: [],
        bowTypes: [],
        skillLevel: [],
        terrain: [],
        entryFee: "",
        description: "",
        location: {
          address: "",
          city: city || "",
          state: state || "",
          zip: "",
        },
      }

      venues.push(venueData)
      shoots.push(shootData)
    })

    // Save to MongoDB
    for (const venue of venues) {
      await saveVenue(venue)
    }

    for (const shoot of shoots) {
      await saveShoot(shoot)
    }

    console.log(
      `✅ Done! Saved ${venues.length} venues and ${shoots.length} shoots to MongoDB.`
    )
  } catch (error) {
    console.error("❌ Error scraping RMAA:", error.message)
  }
}

scrapeRMAA()
