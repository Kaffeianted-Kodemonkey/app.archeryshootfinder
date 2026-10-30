import mongoose from "mongoose"

const ShootSchema = new mongoose.Schema({
  shootId: { type: Number, required: true, unique: true },
  sname: { type: String, default: "" },
  seriesName: { type: String, default: "" },
  isLeague: { type: Boolean, default: false },
  isDestination: { type: Boolean, default: null },
  slug: { type: String, default: "" },
  venueId: { type: String, required: true },
  associationType: String,
  associationID: String,
  guidelines: String,
  rulesReg: String,
  pricing: [
    {
      tier: String,
      note: String,
      cost1Day: Number,
      cost2Days: Number,
      cost3Days: Number,
      cost4Days: Number,
    },
  ],
  currency: String,
  prizes: String,
  registrationUrl: String,
  amenities: [String],
  isVerified: Boolean,

  date: Date,
  endDate: Date,
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
    lat: Number, // ← Add this
    lng: Number, // ← Add this
  },
  shootLocation: {
    address: String,
    city: String,
    state: String,
    zip: String,
    lat: Number,
    lng: Number,
  },
  useVenueLocation: Boolean,

  // V2 fields are additive so existing records and consumers remain supported.
  eventLocations: [
    {
      name: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      lat: Number,
      lng: Number,
    },
  ],
  group: {
    groupId: String,
    groupName: String,
    groupType: String,
    ownerAssociationId: String,
  },
  sanctioningAssociationIds: [String],
  source: {
    name: String,
    url: String,
    externalId: String,
    relatedUrls: [String],
    lastSeenAt: Date,
  },

  // Reference to Venue (for easy population)
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
  },
})

const Shoot = mongoose.models.Shoot || mongoose.model("Shoot", ShootSchema)

export default Shoot
