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

    {
      resolve: `gatsby-plugin-snipcart-advanced`,
      options: {
        version: "2.0.",
        publicApiKey:
          "ZDY2ZThjZmMtYTQzYS00YTVjLWFhMTQtYTMyOTE3NWEyNmJkNjM2ODAyNjEzODcxNDY5NTQ3", // use public api key here or in environment variable
        defaultLang: "en",
        currency: "usd",
        openCartOnAdd: false,
        useSideCart: true,
        // be careful with this mode cart. The cart in this mode has a bug of scroll in firefox
        locales: {
          fr: {
            actions: {
              checkout: "Valider le panier",
            },
          },
        },
        templatesUrl: null,
        // "path on your template file. Set file in the static folder, ex: '/snipcart/index.html'",
        // not work on dev. Gatsby not serve html file in dev https://github.com/gatsbyjs/gatsby/issues/13072
        innerHTML: `
            <billing section="bottom">
                <!-- Customization goes here -->
            </billing>`,
      },
    },
  ],
}
