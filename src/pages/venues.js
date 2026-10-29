// src/pages/venue.js
import * as React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"
import Seo from "../components/seo"
import VenueLayout from "../components/layout/VenueLayout"

const Directory = ({ data, location }) => {
  return (
    <VenueLayout
      venues={data.allVenuesJson.nodes}
      shoots={data.allShootsJson.nodes}
      location={location}
    >
      <Seo title="Venue Directory" />
    </VenueLayout>
  )
}

Directory.propTypes = {
  data: PropTypes.shape({
    allVenuesJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    allShootsJson: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export const Head = () => <Seo title="Venue Directory" />

export default Directory

export const query = graphql`
  query VenuesPageData {
    allShootsJson {
      nodes {
        shootId
        sname
        venueId
        venue {
          venueId
        }
        date
        endDate
        isDestination
        isLeague
        seriesName
        group {
          groupId
          groupName
          groupType
        }
      }
    }
    allVenuesJson {
      nodes {
        venueId
        vname
        venueType
        isClaimed
        subscriptionPlan
        bio
        location {
          address
          city
          state
          zip
          lat
          lng
        }
        contact {
          phone
          email
          membershipUrl
        }
        isMembership
        hours {
          day
          open
          close
        }
        amenities
      }
    }
  }
`
