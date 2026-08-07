// src/api/snipcart-webhook.js
import mongoose from "mongoose"
import Venue from "../../models/Venue"
import Shoot from "../../models/Shoot"

const connectDB = async () => {
  if (mongoose.connections.readyState) return
  await mongoose.connect(process.env.MONGODB_URI)
}

export default async function handler(req, res) {
  console.log("=== Webhook received ===")
  console.log("Method:", req.method)

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const snipcartToken = req.headers["x-snipcart-requesttoken"]
  console.log("Token present:", !!snipcartToken)

  if (!snipcartToken) {
    return res.status(401).json({ message: "Missing token" })
  }

  try {
    // Validate with Snipcart
    const secretApiKey = process.env.SNIPCART_SECRET_API_KEY
    const base64Auth = Buffer.from(`${secretApiKey}:`).toString("base64")

    const validation = await fetch(
      `https://app.snipcart.com/api/requestvalidation/${snipcartToken}`,
      {
        headers: {
          Authorization: `Basic ${base64Auth}`,
          Accept: "application/json",
        },
      }
    )

    console.log("Validation status:", validation.status)

    if (!validation.ok) {
      return res.status(401).json({ message: "Token validation failed" })
    }

    const eventName = req.headers["x-snipcart-eventtype"] || req.body.eventName
    console.log("Event:", eventName)

    if (eventName !== "order.completed") {
      return res.status(200).json({ message: "Ignored non-order event" })
    }

    await connectDB()
    const order = req.body.content

    // Generate venueId
    const companyName =
      order.billingAddress?.company || order.billingAddress?.name || "unknown"
    const city = order.billingAddress?.city || "unknown"
    const venueId = `${companyName}-${city}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    console.log("Generated venueId:", venueId)

    // Save to MongoDB
    const result = await Venue.findOneAndUpdate(
      { venueId },
      {
        $set: {
          vname: companyName,
          isClaimed: true,
          accOwner: order.billingAddress?.name || "",
          location: {
            address: `${order.billingAddress?.address1 || ""} ${
              order.billingAddress?.address2 || ""
            }`.trim(),
            city: order.billingAddress?.city || "",
            state: order.billingAddress?.province || "",
            zip: order.billingAddress?.postalCode || "",
          },
          contact: {
            phone: order.billingAddress?.phone || "",
            email: order.email || "",
          },
          snipcartUserId: order.user?.id || null,
          subscriptionId: order.subscriptionId || null,
          subscriptionStatus: "Active",
        },
      },
      { upsert: true, new: true }
    )

    console.log("Venue saved successfully:", result.venueId)
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Webhook Error:", error)
    return res.status(500).json({ message: "Internal error" })
  }
}
