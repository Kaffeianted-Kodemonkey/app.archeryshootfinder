import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  venueId: { type: String, required: true, unique: true },
  vname: { type: String, default: "" },
  isClaimed: { type: Boolean, default: false },
  accOwner: { type: String, default: "" },

  location: {
    address: String,
    city: String,
    state: String,
    zip: String,
    lat: Number, // ← Add this
    lng: Number, // ← Add this
  },

  contact: {
    phone: String,
    email: String,
    website: String,
    socials: [{ name: String, url: String }],
  },

  snipcartUserId: { type: String, default: null },
  subscriptionId: { type: String, default: null },
  subscriptionStatus: { type: String, default: "Inactive" },

  tagline: String,
  bio: String,
  img: String,
  alt: String,
  venueType: String,
  isMembership: String,
  isLeague: String,
  isClass: String,

  amenities: [String],
  sanctioning: [String],
  services: [String],
  hours: {
    day: [String],
    open: String,
    close: String,
  },

  behavioralRules: [String],
  gearControl: [String],
  safetyEtiquette: [String],
  bowTypes: [String],
  tuningIndoors: Boolean,
  tuningOutdoors: Boolean,
  rangeType: [String],
  targetType: [String],
  laneCapIndoor: String,
  laneCapOutdoor: String,
  maxDistIndoor: String,
  maxDistOutdoor: String,
});

const Venue = mongoose.models.Venue || mongoose.model("Venue", VenueSchema);

export default Venue;
