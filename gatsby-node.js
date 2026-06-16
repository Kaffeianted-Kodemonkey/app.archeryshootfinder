const path = require("path")

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
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
      id: ID!          # Gatsby internal ID
      venueId: Int! # Unique veneu ID
      name: String
      venueType: VenueType
      slug: String
      description: String
      tagline: String
      bio: String
      subscription: VenueTier # Pay teir, Freemium, Premium, Destination
      icon: String
      iconColor: String
      hours: [BusinessHours]
      location: Location  # access as venue.location.city in components
      contact: Contact   # Raw JSON; access as venue.contact.phone in components
      facilities: [Facility] # not shoot spacifice as a venue may have [3D_COURSE, INDOOR_RANGE, OUTDOOR_RANGE, PRO_SHOP_ON_SITE, KITCHEN, CAMPGROUND]
      amenities: [Amenities]
      equipmentAllowed: [EquipmentType]
      customEquipmentRules: [String]
      membership: String # URL to mebership registration/signup
      hostedShoots: [ShootsJson] @link(by: "venueId", from: "venueId")
      imageUrl: String
      isClaimed: Boolean!
      sanctioning: [Association]
      terrain: [Terrain]
      amenities: [Amenities]
      equipmentAllowed: [EquipmentType]
      bowTypes: [BowTypes]
    }

    type ShootsJson implements Node {
      id: ID!            # Gatsby internal ID
      shootId: Int!   # Unique Venue Identifier
      venueId: Int!    # Unique Venue Identifier
      venue: VenuesJson @link(by: "venueId", from: "venueId")
      name: String
      date: Date # @dateformat # if null then show TBD
      endDate: Date # if null then show TBD
      time: String # if null then show TBD
      useVenueLocation: Boolean # if true then the shoot uses the Venue Location
      shootLocation: Location
      isVerified: Boolean # shows if a shoot has been verified by a claimed venue
      shootFormat: [ShootFormat]
      eventType: [EventType]
      customFormat: [String]      # For events not in list this adds them to other
      shootClass: [ShootClass]
      customClass: [String]
      bowTypes: [BowTypes]
      skillLevel: [SkillLevel]
      terrain: [Terrain]
      pricing: [ShootPrice]
      prizes: String
      amenities: [Amenities]
      isDestination: Boolean!
      isMember: Boolean # some may require a membership to sign up
      isRegistration: Boolean # this lets shooters know they have to sign up or can walk in. Exp: TAC must reg online before event
      registrationUrl: String # if there is a url set isRegistration to true
      entryFee: String
    }

    type Location {
      address: String
      city: String
      state: String
      zip: String
      lat: Float
      lng: Float
      country: String
    }

    type Contact {
      phone: String
      email: String
      website: String
      facebook: String
      instagram: String
    }

    type BusinessHours {
      day: DayOfWeek
      open: String # e.g., "09:00"
      close: String # e.g., "17:00"
      closed: Boolean
    }

    type ShootPrice {
      tier: ShootClass
      note: String
      options: [PriceOption]
    }

    type PriceOption {
      days: Int
      cost: Float
      currency: String
    }

    # Enums for validation
    enum VenueType {
      CLUB
      ASSOCIATION
      PRO_SHOP
      RANGE
      ORGANIZATION
    }

    enum Amenities {
      RESTROOMS
      FOOD
      CAMPING
      PET_FRIENDLY
      WHEELCHAIR_ACCESSIBLE
      PARKING
      PICNIC_AREA
      WIFI
      KITCHEN
    }

    enum VenueTier {
      BASIC       # Scraped
      FREEMIUM    # Claimed (Non-Profit)
      PREMIUM     # Paid
      DESTINATION # Top Tier
    }

    enum Services {
      BOW_TUNING_STATION
      CUSTOM_TUNING
      EQUIPMENT_RENTAL
      EQUIPMENT_SALES
      LESSONS
    }

    enum Facility {
      THREE_D_COURSE
      INDOOR_RANGE
      OUTDOOR_RANGE
      ARENA_FAIR_GROUNDS
    }

    enum Association {
      ASA
      IBO
      NFAA
      S3DA
      USA_ARCHERY
      TAC
    }

    enum EquipmentType {
      COMPOUND
      RECURVE
      LONGBOW
      CROSSBOW
      TARGET_ARROWS_ONLY
      MAX_SPEED_LIMIT # e.g., 300fps
    }

    enum DayOfWeek {
      MONDAY
      TUESDAY
      WEDNESDAY
      THURSDAY
      FRIDAY
      SATURDAY
      SUNDAY
    }

    enum ShootClass {
      CUB
      YOUTH
      ADULT
      SENIOR_50
      MASTER_60
      BOWHUNTER
      BOWHUNTER_PIN
      OPEN_FREESTYLE
      TRADITIONAL
      PROFESSIONAL
      CAMP
      CLINIC
      FLIGHTS
      CHAMPIONSHIP
      NONSHOOTER
      TARGET
      ALL_PARTICIPANTS
    }

    enum ShootFormat {
      THREE_D
      TARGET
      FIELD_ARCHERY
      INDOOR
      OUTDOOR
      SMOKER_ROUND
      FIVE_SPOT
      VEGAS
      LONG_DISTANCE_CHALLENGE
      NOVELTY # Good catch-all for "Fun Shoots" or "Iron Man" rounds
    }

    enum EventType {
      TOURNAMENT
      LEAGUE
      CLINIC
      WORKSHOP
      CERTIFICATION
      CAMP
      FUN_SHOOT
      EDUCATIONAL
      WEEKLY_SHOOT
    }

    enum SkillLevel {
      BEGINNER
      INTERMEDIATE
      EXPERT
    }

    enum BowTypes {
      TRADITIONAL
      COMPOUND
      RECURVE
      LONGBOW
      BAREBOW
      CROSSBOW
    }

    enum Terrain {
      WOODED
      FLAT
      ROCKY
      MOUNTAIN
      DESERT
      FIELD
      URBAN
      HILLS
      INDOOR
      OUTDOOR
    }


  `
  createTypes(typeDefs)
}
