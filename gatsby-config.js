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
        // Point this to your master high-res asset
        icon: `src/images/logo-sticker-512.png`,
        // This allows Gatsby to generate standard variants while honoring your specific masks
        icon_options: {
          purpose: `any maskable`,
        },
        // If you absolutely need to use specific custom built filenames instead of auto-generation,
        // ensure they are exactly mapped relative to your static/ folder or project asset root:
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
