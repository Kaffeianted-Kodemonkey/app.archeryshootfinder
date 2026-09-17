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
        date
        endDate
        shootFormat
        entryFee
        description
        isDestination
        associationType
        shootLocation {
          address
          city
          state
          zip
          lat
          lng
        }
        venue {
          vname
          venueType
          isClaimed
          location {
            city
            state
            lat
            lng
          }
        }
      }
    }
    allVenuesJson {
      nodes {
        venueId
        vname
        slug
        venueType
        isClaimed
        sanctioning
        subscriptionPlan
        location {
          city
          state
          lat
          lng
        }
      }
    }
  }
`
