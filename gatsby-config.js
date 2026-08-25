// gatsby-config.js
// require("dotenv").config({
//   path: `.env.${process.env.NODE_ENV}`,
// })
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `ASFinder`,
    description: `Find your Next Target!`,
    author: `@archeryshootfinder`,
    siteUrl: `https://app.archeryshootfinder.com`,
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
    `gatsby-plugin-netlify`,
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
        icon: `src/images/logo-sticker-512.png`,
        icon_options: {
          purpose: `any maskable`,
        },
        // REMOVE the manual icons array entirely
      },
    },
    // gatsby-config.js
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              // Intercept your dynamic MongoDB routes
              urlPattern: /(\/api\/venues|\/api\/events|graphql)/,
              // NetworkFirst forces a live DB look, instantly serving the last cache if offline
              handler: `NetworkFirst`,
            },
          ],
        },
      },
    },
    `gatsby-transformer-json`,
  ],
}
