// This is the main page that runs the whole app.
import * as React from "react"
import { useState } from "react"
//import { graphql } from "gatsby"
import { navigate } from "gatsby"

import Layout from "../components/layout/Layout"
import Seo from "../components/seo"
import logoSticker from "../../static/images/logo-sticker-pop.png" // Adjust relative path dots based on your current component folder

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
      <div className="home-page">
        <div className="container my-4 my-md-5">
          {/* Logo and header */}
          <div className="row text-center">
            <div className="col">
              <img
                className="pb-2 img-fluid"
                src={logoSticker}
                alt="Archery Shoot Finder Logo"
                style={{ maxWidth: "260px" }}
              />
            </div>
          </div>
          {/* Event search */}
          <div className="row justify-content-center mt-3">
            <div className="col-12 col-lg-9 col-xl-8">
              <section className="home-hero px-3 px-md-5 py-4 py-md-5 text-center">
                <h1 className="fw-bold mb-2">Find your next shoot</h1>
                <p className="text-secondary mb-4">
                  Search upcoming archery events by name, venue, or location.
                </p>
                <form onSubmit={handleSearchSubmit}>
                  <div className="row g-2 justify-content-center">
                    <div className="col-12 col-md-8">
                      <input
                        type="text"
                        placeholder="Event name, venue, or location"
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                        className="form-control form-control-lg border-secondary-subtle"
                        aria-label="Search events by name, venue, or location"
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <button
                        className="btn btn-lg btn-success w-100"
                        type="submit"
                      >
                        <i
                          className="bi bi-search me-2"
                          aria-hidden="true"
                        ></i>
                        Search events
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>

          {/* Account links */}
          <div className="row justify-content-center g-3 mt-3 mb-5 pb-5">
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <a
                href="/login?signin=shooter"
                className="btn btn-lg account-link w-100 py-3"
              >
                <i className="bi bi-person-circle me-2" aria-hidden="true"></i>
                Shooter Account
              </a>
            </div>
            <div className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <a
                href="/login?signin=venue"
                className="btn btn-lg account-link w-100 py-3"
              >
                <i className="bi bi-shop-window me-2" aria-hidden="true"></i>
                Venue Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Home" />

export default IndexPage
