import mongoose from "mongoose"
import Venue from "../../models/Venue"

const connectDB = async () => {
  if (mongoose.connections.readyState) return
  await mongoose.connect(process.env.MONGODB_URI)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    await connectDB()

    const venueData = req.body

    if (!venueData.venueId) {
      return res.status(400).json({ message: "venueId is required" })
    }

    const savedVenue = await Venue.findOneAndUpdate(
      { venueId: venueData.venueId },
      { $set: venueData },
      { new: true, upsert: true }
    )

    return res.status(200).json({
      success: true,
      message: "Venue saved successfully",
      venue: savedVenue,
    })
  } catch (error) {
    console.error("Save Venue Error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
