require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require("path")
const { MongoClient } = require("mongodb")

/**
 * SOURCE NODES HOOK: Connect to Atlas and feed documents to GraphQL
 */
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  // Read URI from environment variable (Netlify) or fallback
  const uri = process.env.GATSBY_MONGO_URI || process.env.GATSBY_MONGODB_URI

  // Skip MongoDB connection during Netlify builds if no URI is set
  if (!uri) {
    console.log(
      "No MongoDB URI provided — skipping sourceNodes (safe for CI builds)."
    )
    return
  }

  const client = new MongoClient(uri, {
    tls: true,
    ssl: true,
    // This prevents the underlying OpenSSL layer from throwing "alert 80"
    // during dynamic server selection on cloud runners
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  })

  try {
    await client.connect()
    const db = client.db("ASFinder") // Change to your eact DB name

    // 2. Fetch data from your collections
    const venuesData = await db.collection("venues").find({}).toArray()
    const shootsData = await db.collection("shoots").find({}).toArray()

    // 3. Process Venues
    venuesData.forEach(venue => {
      const nodeMeta = {
        id: createNodeId(`mongo-venue-${venue._id}`),
        parent: null,
        children: [],
        internal: {
          type: `VenuesJson`,
          contentDigest: createContentDigest(venue),
        },
      }

      createNode(
        Object.assign(
          {},
          venue,
          { vname: venue.vname || venue.name }, // ← this makes vname actually eist on the node
          nodeMeta
        )
      )
    })

    // 4. Process Shoots
    shootsData.forEach(shoot => {
      const nodeMeta = {
        id: createNodeId(`mongo-shoot-${shoot._id}`),
        parent: null,
        children: [],
        internal: {
          type: `ShootsJson`,
          contentDigest: createContentDigest(shoot),
        },
      }
      createNode(Object.assign({}, shoot, nodeMeta))
    })
  } catch (error) {
    console.error("Critical error connecting or fetching from MongoDB:", error)
  } finally {
    await client.close()
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // 1. Run a GraphQL query to grab all registered venue IDs and Slugs
  const result = await graphql(`
    query GetSpotlightVenues {
      allVenuesJson {
        nodes {
          id
          venueId
          slug
        }
      }
    }
  `)

  // Handle data query error eceptions safely
  if (result.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query inside gatsby-node.js`,
      result.errors
    )
    return
  }

  const venues = result.data.allVenuesJson.nodes
  const spotlightTemplate = path.resolve(`src/templates/spotlight.js`)

  // 2. Loop through every venue item and programmatically create their public URL
  venues.forEach(venue => {
    // Generate an fallback slug configuration if one isn't eplicitly defined in the file
    const pathSlug = venue.slug ? venue.slug : `venue-${venue.venueId}`

    createPage({
      path: `/venues/${pathSlug}`, // The public URL path structure
      component: spotlightTemplate, // Target layout rendering template file
      contet: {
        // Pass the internal Gatsby node ID to the template page-query as a variable
        id: venue.id,
        venueId: venue.venueId,
      },
    })
  })
}

/**
 * NEW HOOK: Tell Gatsby to treat /portal/ as a client-side route dashboard
 */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // If a file is created inside the /portal path, let the browser handle sub-routes
  if (page.path.match(/^\/portal/)) {
    page.matchPath = "/portal/*"
    createPage(page)
  }
}

/**
 * Schema customization: Define types for JSON data (nested as JSON for raw access)
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
<<<<<<< HEAD
    type VenuesJson implements Node {
      id: ID!
      venueId: String!
      vname: String
      venueType: String
      slug: String
      description: String
      tagline: String
      bio: String
      rulesGuidlines: String
      subscription: String
      membership: String
      tier: String
      img: String
      alt: String
      isClaimed: Boolean!
      sanctioning: [String]
      terrain: [String]
      amenities: [String]
      equipmentAllowed: [String]
      facilities: [String]
      services: [String]
      bowTypes: [String]
      hours: [Hours]
      location: Location
      contact: Contact
    }

    type ShootsJson implements Node {
      id: ID!
      shootId: Int
      sname: String
      slug: String
      venueId: String!
      venue: VenuesJson @link(by: "venueId", from: "venueId")
      shootLocation: Location
      useVenueLocation: Boolean
      date: Date
      endDate: Date
      startTime: String
      endTime: String
      shootFormat: [String]
      shootClass: [String]
      #customClass: [String]
      bowTypes: [String]
      skillLevel: [String]
      terrain: [String]
      entryFee: String
      pricing: [ShootPrice]
      currency: String
      prizes: String
      registrationUrl: String
      amenities: [String]
      isDestination: Boolean
      isVerified: Boolean

    }
=======
     type VenuesJson implements Node {
       venueId: String!              # Your internal Venue Mongo ID mapping
       vname: String                 # Passed from Snipcart (data-item-name or custom fields)
       accOwner: String              # Account owner / Business name from Snipcart Billing
       venueType: String!
       isClaimed: Boolean!           # SET BY SYSTEM TO true ONCE SECURE WEBHOOK FIRES
       isLeague: Boolean!
       isClass: Boolean!
       isMembership: Boolean!
       slug: String
       img: String
       alt: String
       tagline: String
       bio: String
       behavioralRules: [String]
       gearControl: [String]
       safteyEtiquette: [String]
       location: Location            # Populated with Snipcart Billing Address data
       contact: Contact              # Populated with Snipcart Customer Account data
       hours: [Hours]
       rangeType: [String]
       targetType: [String]
       tuningIndoor: [String]
       tuningOutdoor: [String]
       maDistIndoor: String
       maDistOutdoor: String
       laneCapIndoor: String
       laneCapOutdoor: String
       amenities: [String]
       services: [String]
    #   equipmentAllowed: [String]
       sanctioning: [String]
       bowTypes: [String]

       # === NEW SNIPCART V2 FIELDS ADDED HERE ===
       snipcartUserId: String        # Links the venue to their Snipcart Customer Profile ID
       subscriptionId: String        # Tracks active Snipcart V2 Subscription Contract
       subscriptionStatus: String    # e.g., "Active", "Paused", "Cancelled"
       subscriptionPlan: String
    #   invoiceNumber: String         # Last successful transaction reference code
     }

     type ShootsJson implements Node {
       shootId: Int
       sname: String
       slug: String
       venueId: String!
       venue: VenuesJson @link(by: "venueId", from: "venueId")
       description: String
       shootLocation: Location
       useVenueLocation: Boolean
       date: Date
       endDate: Date
       startTime: String
       endTime: String
       shootFormat: [String]
       shootClass: [String]
       bowTypes: [String]
       skillLevel: [String]
       terrain: [String]
       entryFee: String
       pricing: [ShootPrice]
       currency: String
       prizes: String
       registrationUrl: String
       amenities: [String]
       isDestination: Boolean
       isVerified: Boolean
     }
>>>>>>> FixNodeJS

    type Location {
      address: String
      city: String
      state: String
      zip: String
      lat: Float
      lng: Float
    }

<<<<<<< HEAD
    type Contact {
      phone: String
      email: String
      website: String
      socials: [Social]
    }
=======
     type Contact {
       phone: String                 # Maps to Snipcart's billingAddress.phone
       email: String                 # Maps to Snipcart's customer order email
       website: String
       socials: [Social]
     }
>>>>>>> FixNodeJS

    type Social {
      name: String
      url: String
    }

<<<<<<< HEAD
    type Hours {
      day: String
      open: String
      close: String
      isClosed: Boolean
    }
=======
     type Hours {
       day: String
       open: String
       close: String
    #   isClosed: Boolean
     }
>>>>>>> FixNodeJS

    type ShootPrice {
      tier: String     # Fixed: Changed from missing 'ShootClass' enum to flat String
      note: String
      options: [PriceOption]
    }

    type PriceOption {
      days: Int
      cost: Float
      currency: String
    }
  `
  createTypes(typeDefs)
}
