// gatsby-config.js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
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
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `venues`,
    //     path: `${__dirname}/src/data/venues.json`,
    //   },
    // },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `shoots`,
    //     path: `${__dirname}/src/data/shoots.json`,
    //   },
    // },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Archery Shoot Finder`,
        short_name: `ASFinder`,
        description: `Find archery shoots, tournaments, and events near you`,
        start_url: `/`,
        scope: `/`,
        display: `standalone`,
        orientation: `portrait`,
        background_color: `#ffffff`,
        theme_color: `#C2410C`,
        lang: `en`,
        categories: [`sports`, `events`, `outdoors`],
        icons: [
          {
            src: `src/images/logo-sticker-192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `src/images/logo-sticker-512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
          {
            src: `src/images/logo-sticker-512.png`,
            sizes: `512x512`,
            type: `image/png`,
            purpose: `maskable`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-transformer-json`,
  ],
}
