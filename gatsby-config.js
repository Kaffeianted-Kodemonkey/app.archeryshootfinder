/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `ASFinder`,
    description: `Find your Next Target!`,
    author: `@archeryshootfinder`,
    siteUrl: `https://archeryshootfinder.com`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    // Nodes: allDataJson; filter by name for specific files (e.g., {name: {eq: "shoots"}})
    // Separate sourcing for venues and shoots to create dedicated allVenuesJson and allShootsJson types
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `venues`,
        path: `${__dirname}/src/data/venues.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `shoots`,
        path: `${__dirname}/src/data/shoots.json`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Archery Shoot Finder`,
        short_name: `ASFinder`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#C2410C`, // Terracotta
        icons: [
          {
            src: `src/images/gatsby-icon.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `src/images/gatsby-icon.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-transformer-json`, // Parses JSON files into GraphQL nodes
  ],
}
