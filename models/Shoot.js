import mongoose from "mongoose"

const ShootSchema = new mongoose.Schema({
  shootId: { type: Number, required: true, unique: true },
  sname: { type: String, default: "" },
  slug: { type: String, default: "" },
  venueId: { type: String, required: true },

  date: String,
  endDate: String,
  startTime: String,
  endTime: String,

  shootFormat: [String],
  shootClass: [String],
  bowTypes: [String],
  skillLevel: [String],
  terrain: [String],
  entryFee: String,
  description: String,

  location: {
    address: String,
    city: String,
    state: String,
    zip: String,
  },

  // Reference to Venue (for easy population)
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
  },
})

const Shoot = mongoose.models.Shoot || mongoose.model("Shoot", ShootSchema)

export default Shoot
