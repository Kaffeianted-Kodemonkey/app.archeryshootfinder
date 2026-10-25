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
        entryFee
        description
        isDestination
        isLeague
        seriesName
        associationType
        association {
          acronym
          assocName
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
