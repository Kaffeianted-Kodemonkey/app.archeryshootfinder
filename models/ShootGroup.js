import mongoose from "mongoose"

const GROUP_TYPES = ["league", "series", "destination"]

const ShootGroupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true, trim: true },
    groupName: { type: String, required: true, trim: true },
    groupType: { type: String, enum: [...GROUP_TYPES, null], default: null },
    ownerAssociationId: { type: String, default: null, trim: true },
    description: { type: String, default: null, trim: true },
    source: {
      name: { type: String, default: null },
      url: { type: String, default: null },
      externalId: { type: String, default: null },
    },
  },
  { collection: "shootGroups", timestamps: true }
)

const ShootGroup =
  mongoose.models.ShootGroup || mongoose.model("ShootGroup", ShootGroupSchema)

export default ShootGroup
