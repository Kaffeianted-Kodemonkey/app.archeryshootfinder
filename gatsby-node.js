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
    type VenuesJson implements Node @infer {
      id: ID!
      name: String
      venueType: VenueType
      slug: String
      description: String
      tier: String
      icon: String
      iconColor: String
      location: JSON  # Raw JSON; access as venue.location.city in components
      contact: JSON
      facilities: [String]
      amenities: [Amenities]
      equipment: JSON
      hours: JSON
      membership: JSON
      hostedShoots: [String]  # Raw IDs; join manually
      imageUrl: String
      isClaimed: Boolean
      affiliates: [JSON]
    }

    type ShootsJson implements Node @infer {
      id: ID!
      name: String
      slug: String
      description: String
      date: Date
      endDate: Date
      time: String
      venueId: String
      useVenueLocation: Boolean
      shootLocation: ShootsJsonShootLocation
      unverified: Boolean
      shootFormat: [String]
      shootClass: [String]
      bowTypes: [String]
      skillLevel: [String]
      terrain: String
      pricing: JSON
      prizes: String
      amenities: [Amenities]
      registrationRequired: Boolean
      registrationUrl: String
      entryFee: String
      status: String
      affiliates: [JSON]
    }

    type ShootsJsonShootLocation {
      address: String
      city: String
      state: String
      zip: String
      lat: Float
      lng: Float
      country: String
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
      FREEMIUM
      BASIC
      PREMIUM
      DESTINATION
    }
  `
  createTypes(typeDefs)
}
