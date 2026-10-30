// src/pages/events.js
import * as React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Seo from "../components/seo"
import EventLayout from "../components/layout/EventLayout"

const EventPage = ({ data, location }) => {
  return (
    <EventLayout masterRawShoots={data.allShootsJson.nodes} location={location}>
      <Seo title="Home" />
    </EventLayout>
  )
}

EventPage.propTypes = {
  data: PropTypes.shape({
    allShootsJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export const Head = () => <Seo title="Home" />

export default EventPage

export const query = graphql`
  query EventPageData {
    allShootsJson {
      nodes {
        shootId
        sname
        venueId
        isVerified
        date
        endDate
        shootFormat
        shootClass
        bowTypes
        skillLevel
        entryFee
        description
        amenities
        registrationUrl
        isDestination
        isLeague
        seriesName
        group {
          groupId
          groupName
          groupType
          ownerAssociationId
        }
        shootGroup {
          ownerAssociation {
            acronym
            assocName
            websiteUrl
          }
        }
        associationType
        association {
          acronym
          assocName
          websiteUrl
          ruleBooks {
            ruleName
            rulebookUrl
          }
        }
        useVenueLocation
        location {
          address
          city
          state
          zip
          lat
          lng
        }
        shootLocation {
          address
          city
          state
          zip
          lat
          lng
        }
        venue {
          venueId
          vname
          venueType
          isClaimed
          isMembership
          contact {
            phone
            email
            website
            socials {
              name
              url
            }
            membershipUrl
          }
          location {
            address
            city
            state
            zip
            lat
            lng
          }
        }
      }
    }
  }
`
