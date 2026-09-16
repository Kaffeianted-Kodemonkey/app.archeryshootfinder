require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require("path")
const { MongoClient } = require("mongodb")

const VENUE_PROJECTION = {
  _id: 1,
  venueId: 1,
  vname: 1,
  name: 1,
  accOwner: 1,
  venueType: 1,
  isClaimed: 1,
  isLeague: 1,
  isClass: 1,
  isMembership: 1,
  slug: 1,
  img: 1,
  alt: 1,
  tagline: 1,
  bio: 1,
  behavioralRules: 1,
  gearControl: 1,
  safteyEtiquette: 1,
  location: 1,
  contact: 1,
  hours: 1,
  rangeType: 1,
  targetType: 1,
  tuningIndoor: 1,
  tuningOutdoor: 1,
  maDistIndoor: 1,
  maDistOutdoor: 1,
  laneCapIndoor: 1,
  laneCapOutdoor: 1,
  amenities: 1,
  services: 1,
  sanctioning: 1,
  bowTypes: 1,
  snipcartUserId: 1,
  subscriptionId: 1,
  subscriptionStatus: 1,
  subscriptionPlan: 1,
}

const SHOOT_PROJECTION = {
  _id: 1,
  shootId: 1,
  sname: 1,
  slug: 1,
  venueId: 1,
  associationType: 1,
  description: 1,
  shootLocation: 1,
  location: 1,
  useVenueLocation: 1,
  date: 1,
  endDate: 1,
  startTime: 1,
  endTime: 1,
  shootFormat: 1,
  shootClass: 1,
  bowTypes: 1,
  skillLevel: 1,
  terrain: 1,
  entryFee: 1,
  pricing: 1,
  currency: 1,
  prizes: 1,
  registrationUrl: 1,
  amenities: 1,
  isDestination: 1,
  isVerified: 1,
}

function createMongoNode(
  { createNode, createNodeId, createContentDigest },
  { type, prefix, doc, extra = {} }
) {
  const { _id, ...fields } = doc
  const data = { ...fields, ...extra }
  createNode({
    ...data,
    id: createNodeId(`${prefix}-${_id}`),
    parent: null,
    children: [],
    internal: {
      type,
      contentDigest: createContentDigest(data),
    },
  })
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNode } = actions
  const nodeApi = { createNode, createNodeId, createContentDigest }

  const uri =
    process.env.MONGO_URI ||
    process.env.GATSBY_MONGO_URI ||
    process.env.GATSBY_MONGODB_URI

  if (!uri) {
    reporter.info("No MongoDB URI — skipping sourceNodes.")
    return
  }

  const client = new MongoClient(uri, {
    tls: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    maxPoolSize: 1,
  })

  try {
    await client.connect()
    const db = client.db("ASFinder")

    const [venuesData, shootsData] = await Promise.all([
      db.collection("venues").find({}, { projection: VENUE_PROJECTION }).toArray(),
      db.collection("shoots").find({}, { projection: SHOOT_PROJECTION }).toArray(),
    ])

    venuesData.forEach(venue => {
      createMongoNode(nodeApi, {
        type: "VenuesJson",
        prefix: "mongo-venue",
        doc: venue,
        extra: {
          vname: venue.vname || venue.name,
          hours: Array.isArray(venue.hours) ? venue.hours : [],
        },
      })
    })

    shootsData.forEach(shoot => {
      createMongoNode(nodeApi, {
        type: "ShootsJson",
        prefix: "mongo-shoot",
        doc: shoot,
      })
    })
  } catch (error) {
    reporter.panicOnBuild("MongoDB sourceNodes failed", error)
  } finally {
    await client.close()
  }
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
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

  if (result.errors) {
    reporter.panicOnBuild(
      "GraphQL query failed in createPages",
      result.errors
    )
    return
  }

  const spotlightTemplate = path.resolve("src/templates/spotlight.js")

  result.data.allVenuesJson.nodes.forEach(venue => {
    createPage({
      path: `/venues/${venue.venueId}`,
      component: spotlightTemplate,
      context: {
        id: venue.id,
        venueId: venue.venueId,
      },
    })
  })
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(/^\/portal/)) {
    page.matchPath = "/portal/*"
    createPage(page)
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type VenuesJson implements Node {
      venueId: String!
      vname: String
      accOwner: String
      venueType: [String]
      isClaimed: Boolean!
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
      location: Location
      contact: Contact
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
      sanctioning: [String]
      bowTypes: [String]
      snipcartUserId: String!
      subscriptionId: String
      subscriptionStatus: String
      subscriptionPlan: String
    }

    type ShootsJson implements Node {
      shootId: String!
      sname: String
      venueId: String!
      venue: VenuesJson @link(by: "venueId", from: "venueId")
      description: String
      associationType: [String]
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
      isDestination: Boolean!
      isVerified: Boolean!
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
      day: [String]
      open: String
      close: String
    }

    type ShootPrice {
      tier: String
      note: String
      options: [PriceOption]
    }

    type PriceOption {
      days: Int
      cost: Float
      currency: String
    }
  `)
}
