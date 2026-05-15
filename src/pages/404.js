// src/pages/404.js
import * as React from "react"

import Layout from "../components/layout/Layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <div className="container my-5 text-center"> {/* CLEANUP: Add Bootstrap container for consistency */}
      <div className="alert alert-warning" role="alert"> {/* CLEANUP: Use alert for better design match */}
        <h1 className="alert-heading">404: Not Found</h1>
        <p className="mb-0">You just hit a route that doesn't exist... the sadness.</p>
        <a href="/" className="btn btn-primary mt-3">Go Home</a> {/* CLEANUP: Add home link */}
      </div>
    </div>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
