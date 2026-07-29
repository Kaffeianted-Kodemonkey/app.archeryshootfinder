// src/api/snipcart-webhook.js
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

  // 1. Validate Snipcart request token
  const snipcartToken = req.headers["x-snipcart-requesttoken"]
  if (!snipcartToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing request token." })
  }

  try {
    // 2. Verify token with Snipcart (security check)
    const secretApiKey = process.env.SNIPCART_SECRET_API_KEY
    const base64Auth = Buffer.from(`${secretApiKey}:`).toString("base64")

    const validationResponse = await fetch(
      `https://app.snipcart.com/api/requestvalidation/${snipcartToken}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          Accept: "application/json",
        },
      }
    )

    if (!validationResponse.ok) {
      return res
        .status(401)
        .json({ message: "Handshake failed. Impostor request blocked." })
    }

    // 3. Only process completed orders
    const eventName = req.headers["x-snipcart-eventtype"] || req.body.eventName
    if (eventName !== "order.completed") {
      return res
        .status(200)
        .json({ message: "Event skipped. Non-order entity." })
    }

    await connectDB()
    const orderData = req.body.content

    // 4. Generate venueId from company name + city
    const companyName =
      orderData.billingAddress?.company ||
      orderData.billingAddress?.name ||
      "unknown-company"

    const city = orderData.billingAddress?.city || "unknown-city"

    const venueId = `${companyName}-${city}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // 5. Create or update the Venue
    await Venue.findOneAndUpdate(
      { venueId },
      {
        $set: {
          vname: companyName,
          isClaimed: true,
          accOwner: orderData.billingAddress?.name || "",

          location: {
            address: `${orderData.billingAddress?.address1 || ""} ${
              orderData.billingAddress?.address2 || ""
            }`.trim(),
            city: orderData.billingAddress?.city || "",
            state: orderData.billingAddress?.province || "",
            zip: orderData.billingAddress?.postalCode || "",
          },

          contact: {
            phone: orderData.billingAddress?.phone || "",
            email: orderData.email || "",
          },

          snipcartUserId: orderData.user ? orderData.user.id : null,
          subscriptionId: orderData.subscriptionId || null,
          subscriptionStatus: "Active",
        },
      },
      { upsert: true, new: true }
    )

    return res
      .status(200)
      .json({ success: true, message: "Venue created/updated successfully." })
  } catch (error) {
    console.error("Webhook Error:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
