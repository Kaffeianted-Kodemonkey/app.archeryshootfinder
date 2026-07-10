const path = require("path")

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */

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

  // 1. Replace with your connection string (or use process.env.MONGODB_URI)
  const uri =
    "mongodb+srv://kodemonkey:Girlz4x42!@cluster0.9kztbpj.mongodb.net/?appName=Cluster0"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("ASFinder") // Change to your exact DB name

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
          type: `VenuesJson`, // Keeps the exact type name your app already expects
          contentDigest: createContentDigest(venue),
        },
      }
      createNode(Object.assign({}, venue, nodeMeta))
    })

    // 4. Process Shoots
    shootsData.forEach(shoot => {
      const nodeMeta = {
        id: createNodeId(`mongo-shoot-${shoot._id}`),
        parent: null,
        children: [],
        internal: {
          type: `ShootsJson`, // Keeps the exact type name your app already expects
          contentDigest: createContentDigest(shoot),
        },
      }
      createNode(Object.assign({}, shoot, nodeMeta))
    })

    console.log(
      `Successfully sourced ${venuesData.length} Venues and ${shootsData.length} Shoots from MongoDB.`
    )
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

  // Handle data query error exceptions safely
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
    // Generate an fallback slug configuration if one isn't explicitly defined in the file
    const pathSlug = venue.slug ? venue.slug : `venue-${venue.venueId}`

    createPage({
      path: `/venues/${pathSlug}`, // The public URL path structure
      component: spotlightTemplate, // Target layout rendering template file
      context: {
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
    type VenuesJson implements Node {
      id: ID!
      venueId: Int!
      name: String
      venueType: String
      slug: String
      description: String
      tagline: String
      bio: String
      rulesGuidlines: String
      subscription: String
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
      name: String
      slug: String
      venueId: Int
      venue: VenuesJson @link(by: "venueId")
      shootLocation: Location
      useVenueLocation: Boolean
      dates: [Date]
      shootFormat: [String]
      shootClass: [String]
      customClass: [String]
      bowTypes: [String]
      skillLevel: [String]
      terrain: [String]
      cost: Float
      currency: String
      registrationUrl: String
    }

    type Location {
      address: String
      city: String
      state: String
      zip: String
      lat: Float
      lng: Float
    }

    type Contact {
      phone: String
      email: String
      website: String
      socials: [Social]
    }

    type Social {
      name: String
      url: String
    }

    type Hours {
      day: String
      open: String
      close: String
      isClosed: Boolean
    }


    # Enums for validation
    # enum VenueType {
    #   CLUB
    #   ASSOCIATION
    #   PRO_SHOP
    #   RANGE
    #   ORGANIZATION
    # }

    # enum Amenities {
    #   RESTROOMS
    #   FOOD
    #   CAMPING
    #   PET_FRIENDLY
    #   WHEELCHAIR_ACCESSIBLE
    #   PARKING
    #   PICNIC_AREA
    #   WIFI
    #   KITCHEN
    # }

    # enum VenueTier {
    #   BASIC       # Scraped
    #   FREEMIUM    # Claimed (Non-Profit)
    #   PREMIUM     # Paid
    #   DESTINATION # Top Tier
    # }

    # enum Services {
    #   BOW_TUNING_STATION
    #   CUSTOM_TUNING
    #   EQUIPMENT_RENTAL
    #   EQUIPMENT_SALES
    #   LESSONS
    # }

    # enum Facility {
    #   THREE_D_COURSE
    #   INDOOR_RANGE
    #   OUTDOOR_RANGE
    #   ARENA_FAIR_GROUNDS
    # }

    # enum Association {
    #   ASA
    #   IBO
    #   NFAA
    #   S3DA
    #   USA_ARCHERY
    #   TAC
    #   CBA
    #   UAA
    #   RMAA
    # }

    # enum EquipmentType {
    #   COMPOUND
    #   RECURVE
    #   LONGBOW
    #   CROSSBOW
    #   TARGET_ARROWS_ONLY
    #   MAX_SPEED_LIMIT # e.g., 300fps
    # }

    # enum DayOfWeek {
    #   MONDAY
    #   TUESDAY
    #   WEDNESDAY
    #   THURSDAY
    #   FRIDAY
    #   SATURDAY
    #   SUNDAY
    # }

    # enum ShootClass {
    #   CUB
    #   YOUTH
    #   ADULT
    #   SENIOR_50
    #   MASTER_60
    #   BOWHUNTER
    #   BOWHUNTER_PIN
    #   OPEN_FREESTYLE
    #   TRADITIONAL
    #   PROFESSIONAL
    #   CAMP
    #   CLINIC
    #   FLIGHTS
    #   CHAMPIONSHIP
    #   NONSHOOTER
    #   TARGET
    #   ALL_PARTICIPANTS
    # }

    # enum ShootFormat {
    #   THREE_D
    #   TARGET
    #   FIELD_ARCHERY
    #   INDOOR
    #   OUTDOOR
    #   SMOKER_ROUND
    #   FIVE_SPOT
    #   VEGAS
    #   LONG_DISTANCE_CHALLENGE
    #   NOVELTY # Good catch-all for "Fun Shoots" or "Iron Man" rounds
    # }

    # enum EventType {
    #   TOURNAMENT
    #   LEAGUE
    #   CLINIC
    #   WORKSHOP
    #   CERTIFICATION
    #   CAMP
    #   FUN_SHOOT
    #   EDUCATIONAL
    #   WEEKLY_SHOOT
    # }

    # enum SkillLevel {
    #   BEGINNER
    #   INTERMEDIATE
    #   EXPERT
    # }

    # enum BowTypes {
    #   TRADITIONAL
    #   COMPOUND
    #   RECURVE
    #   LONGBOW
    #   BAREBOW
    #   CROSSBOW
    # }

    # enum Terrain {
    #   WOODED
    #   FLAT
    #   ROCKY
    #   MOUNTAIN
    #   DESERT
    #   FIELD
    #   URBAN
    #   HILLS
    #   INDOOR
    #   OUTDOOR
    # }


  `
  createTypes(typeDefs)
}
