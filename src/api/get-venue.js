import mongoose from "mongoose"
import Venue from "../../models/Venue"

const connectDB = async () => {
  if (mongoose.connections.readyState) return
  await mongoose.connect(process.env.MONGODB_URI)
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: "userId is required" })
  }

  try {
    await connectDB()

    const venue = await Venue.findOne({ snipcartUserId: userId })

    if (!venue) {
      return res.status(200).json({ venue: null })
    }

    return res.status(200).json({ venue })
  } catch (error) {
    console.error("Get Venue Error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
