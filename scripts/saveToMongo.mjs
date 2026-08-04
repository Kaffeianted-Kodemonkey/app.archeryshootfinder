import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  if (mongoose.connections.readyState) return
  await mongoose.connect(process.env.MONGODB_URI)
}

// Models
import Venue from "../models/Venue.js"
import Shoot from "../models/Shoot.js"

// === Save Venue (no duplicates) ===
async function saveVenue(venueData) {
  await connectDB()

  const venueId = `${venueData.vname}-${venueData.location?.city || "unknown"}`
    .toLowerCase()
    .replace(/\s+/g, "-")

  const savedVenue = await Venue.findOneAndUpdate(
    { venueId },
    {
      $set: {
        venueId,
        vname: venueData.vname,
        isClaimed: false,
        location: venueData.location || {},
        contact: venueData.contact || {},
        venueType: venueData.venueType || "Club",
        amenities: venueData.amenities || [],
        sanctioning: venueData.sanctioning || [],
        subscriptionStatus: "Inactive",
      },
    },
    { upsert: true, new: true }
  )

  console.log(`✅ Saved venue: ${venueData.vname}`)
  return savedVenue
}

// === Save Shoot (linked to venue, no duplicates) ===
async function saveShoot(shootData) {
  await connectDB()

  // Try to find the linked venue
  let venueRef = null
  if (shootData.venueId) {
    const venue = await Venue.findOne({ venueId: shootData.venueId })
    if (venue) venueRef = venue._id
  }

  await Shoot.findOneAndUpdate(
    { shootId: shootData.shootId },
    {
      $set: {
        ...shootData,
        venue: venueRef, // ObjectId reference (optional but useful)
      },
    },
    { upsert: true }
  )

  console.log(`✅ Saved shoot: ${shootData.sname}`)
}

export { saveVenue, saveShoot }
