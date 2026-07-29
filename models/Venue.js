import mongoose from "mongoose"

const VenueSchema = new mongoose.Schema({
  // === Core / Webhook Fields ===
  venueId: { type: String, required: true, unique: true },
  vname: { type: String, default: "" },
  isClaimed: { type: Boolean, default: false },
  accOwner: { type: String, default: "" },

  // === Location & Contact ===
  location: {
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
  contact: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    socials: [{ name: String, url: String }],
  },

  // === Snipcart Tracking ===
  snipcartUserId: { type: String, default: null },
  subscriptionId: { type: String, default: null },
  subscriptionStatus: { type: String, default: "Inactive" },

  // === Basic Info ===
  tagline: { type: String, default: "" },
  bio: { type: String, default: "" },
  img: { type: String, default: "" },
  alt: { type: String, default: "" },

  // === Membership & Type ===
  isMembership: { type: String, default: "No" },
  venueType: { type: String, default: "" },
  isLeague: { type: String, default: "No" },
  isClass: { type: String, default: "No" },

  // === Amenities & Sanctions ===
  amenities: { type: [String], default: [] },
  sanctioning: { type: [String], default: [] },

  // === Hours of Operation ===
  hours: {
    day: { type: [String], default: [] },
    open: { type: String, default: "" },
    close: { type: String, default: "" },
  },

  // === Pro Shop Services ===
  services: { type: [String], default: [] },

  // === Rules & Regulations ===
  behavioralRules: { type: [String], default: [] },
  gearControl: { type: [String], default: [] },
  safetyEtiquette: { type: [String], default: [] },

  // === Range Specifications ===
  bowTypes: { type: [String], default: [] },
  tuningIndoors: { type: Boolean, default: false },
  tuningOutdoors: { type: Boolean, default: false },

  rangeType: { type: [String], default: [] },
  targetType: { type: [String], default: [] },

  laneCapIndoor: { type: String, default: "" },
  laneCapOutdoor: { type: String, default: "" },
  maxDistIndoor: { type: String, default: "" },
  maxDistOutdoor: { type: String, default: "" },
})

export default mongoose.models.Venue || mongoose.model("Venue", VenueSchema)
