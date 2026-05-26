/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require("path")

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // TODO: In future phase, add DSG for venue landing pages (non-basic tiers only)
  // For now, no dynamic pages - all content in directory tabs
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
    }

    type ShootsJson implements Node {
      id: ID!            # Gatsby internal ID
      shootId: Int!   # Unique Venue Identifier
      venueId: Int!    # Unique Venue Identifier
      venue: VenuesJson @link(by: "venueId", from: "venueId") 
      name: String
      description: String
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
      isRegistration: Boolean # this lets shooters know they if they have to sign up or can walk in. Exp: TAC must reg online before event
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
      tier: ShootClass  # e.g., "Adult", "Youth", "Cubs", "Member"
      cost: Float       # e.g., 25.00
      currency: String  # Default to "USD"
      note: String      # e.g., "Includes lunch", "Per day"
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
      EQUIPMENT_RENTAL
      LESSONS
      PICNIC_AREA
      WIFI
    }

    enum VenueTier {
      BASIC       # Scraped
      FREEMIUM    # Claimed (Non-Profit)
      PREMIUM     # Paid
      DESTINATION # Top Tier
    }

    enum Facility {
      THREE_D_COURSE
      INDOOR_RANGE
      OUTDOOR_RANGE
      PRO_SHOP
      KITCHEN
      CAMPING
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
    }

    enum ShootFormat {
      THREE_D
      TARGET
      FIELD_ARCHERY
      INDOOR
      OUTDOOR
      SMOKER_ROUND
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
    }

    enum SkillLevel {
      BEGINNER
      INTERMEDIATE
      PRO_EXPERIENCED
      EXPERT
    }

    enum BowTypes {
      TRADITIONAL
      COMPOUND
      RECURVE
      LONGBOW
      BAREBOW
    }

    enum Terrain {
      WOODED
      FLAT
      ROCKY
      MOUNTAIN
      DESERT
      FIELD
      URBAN
    }


  `
  createTypes(typeDefs)
}
