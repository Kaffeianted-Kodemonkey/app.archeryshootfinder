// This is the main page that runs the whole app.
import * as React from "react"
import { useState, useEffect, useMemo } from "react"
//import { graphql } from "gatsby"
import { Link, navigate } from "gatsby"

import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import logoSticker from "../../static/images/logo-sticker-pop.png" // Adjust relative path dots based on your current component folder
import ropetarges from "../images/ropetarges-58.png"

export const IndexPage = () => {
  const [searchVal, setSearchVal] = useState("")

  const handleSearchSubmit = e => {
    e.preventDefault()

    const trimmedQuery = searchVal.trim()
    if (!trimmedQuery) return

    // Programmatically navigate to the events page with the search query appended
    // encodeURIComponent ensures special characters or spaces don't break the URL string
    navigate(`/events?search=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <Layout>
      <div>
        <div className="container my-5 pt-4">
          {/* Logo and header */}
          <div className="row text-center">
            <div className="col">
              <img
                className="pb-2"
                src={logoSticker}
                alt="Archery Shoot Finder Logo"
                width="30%"
              />
              <h1 className="fw-bold mb-4">
                <span className="text-success">Archery Shoot</span>{" "}
                <span className="text-warning">Finder</span>
              </h1>
            </div>
          </div>
          {/* Directory Search */}
          <div
            className="row position-relative overflow-hidden py-4 text-white"
            style={{
              backgroundImage: `url(${ropetarges})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="col position-relative z-1">
              <h1 className=" fw-bold mb-3 text-center">
                Find your Next Shoot
              </h1>
              <form onSubmit={handleSearchSubmit} style={styles.form}>
                <div className="row g-3 justify-content-center">
                  <div className="col col-md-6">
                    <input
                      type="text"
                      placeholder="Enter Location - City, State, or Zip"
                      value={searchVal}
                      onChange={e => setSearchVal(e.target.value)}
                      style={styles.input}
                      className="form-control form-control-lg border-secondary-subtle"
                      aria-label="Enter Location"
                    />
                    <br />
                    <button
                      className="btn btn-lg btn-success px-4"
                      type="submit"
                      style={styles.button}
                    >
                      <i className="className me-2"></i>Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Directories */}
          <div className="row align-items-center justify-content-between pt-0 pb-3 mt-3 g-0">
            <div className="col-6 d-flex flex-column align-items-center">
              <p>
                <a
                  href="/login?signin=shooter"
                  className="btn btn-lg btn-success"
                >
                  <i className="bi bi-person-circle"></i> Shooter <br /> Account
                </a>
              </p>
            </div>
            <div className="col-6 d-flex flex-column align-items-center text-nowrap">
              <p>
                <a
                  href="/login"
                  className="btn btn-lg btn-success snipcart-user-profile"
                >
                  <i className="bi bi-shop-window"></i> Venue <br /> Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Inline styles object definition added to resolve the no-undef compilation errors
const styles = {
  form: {
    margin: 0,
    padding: 0,
  },
  input: {
    width: "100%",
  },
  button: {
    width: "100%",
    marginTop: "5px",
  },
}

export const Head = () => <Seo title="Home" />

export default IndexPage

// export const query = graphql`
//   query IndexPageData {
//     allShootsJson {
//       nodes {
//         shootId
//         sname
//         isVerified
//         venueId
//         date
//         endDate
//         startTime
//         endTime
//         shootFormat
//         shootClass
//         bowTypes
//         skillLevel
//         terrain
//         entryFee
//         description
//         useVenueLocation
//         shootLocation {
//           address
//           city
//           state
//           zip
//           lat
//           lng
//         }
//         venue {
//           vname
//           venueType
//           isClaimed
//           location {
//             city
//             state
//             lat
//             lng
//           }
//         }
//       }
//     }
//     allVenuesJson {
//       nodes {
//         venueId
//         vname
//         slug
//         venueType
//         isClaimed
//         subscriptionPlan
//         bio
//         location {
//           city
//           state
//           lat
//           lng
//         }
//       }
//     }
//   }
// `
