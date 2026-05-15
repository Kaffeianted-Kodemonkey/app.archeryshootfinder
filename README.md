# Archery Shoot Finder

A Progressive Web App (PWA) for discovering archery shoots, tournaments, and events near you. Built with Gatsby and featuring an interactive Google Map and a tabbed directory layout.

## Features

- **Interactive Google Map**: View all archery shoots on a map with custom markers
- **Tabbed Directory**: Browse upcoming and past shoots in an organized tab layout
- **PWA Support**: Install on your device for offline access
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Shoot Details**: Click on map markers or list items to see detailed information

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/archeryshootfinder/archery-shoot-finder.git
   cd archery-shoot-finder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Google Maps API Key**

   a. Get your API key from [Google Cloud Console](https://developers.google.com/maps/documentation/javascript/get-api-key)

   b. Enable the following APIs:

   - Maps JavaScript API

   c. Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   d. Add your API key to `.env`:

   ```
   GATSBY_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run develop
   ```

5. **Open your browser**
   Visit `http://localhost:8000` to see the app.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── map.js              # Google Map component
│   │   ├── map.module.css      # Map styles
│   │   ├── tabs.js             # Tabbed directory component
│   │   ├── tabs.module.css     # Tabs styles
│   │   ├── header.js           # Header component
│   │   ├── layout.js           # Layout wrapper
│   │   └── seo.js              # SEO component
│   ├── pages/
│   │   ├── index.js            # Home page
│   │   └── index.module.css    # Home page styles
│   ├── templates/
│   │   ├── shoot.js            # Individual shoot page template
│   │   └── shoot.module.css    # Shoot page styles
│   └── data/
│       └── shoots.json         # Shoot data
├── gatsby-config.js            # Gatsby configuration
├── package.json                # Dependencies
└── .env.example                # Environment variables template
```

## Adding Shoot Data

Shoot data is stored in `src/data/shoots.json`. Each shoot object should include:

```json
{
  "id": "unique-id",
  "slug": "shoot-slug",
  "name": "Shoot Name",
  "description": "Description of the shoot",
  "date": "2026-04-15",
  "endDate": "2026-04-16",
  "time": "8:00 AM - 4:00 PM",
  "location": {
    "name": "Venue Name",
    "address": "123 Street Address",
    "city": "City",
    "state": "ST",
    "zip": "12345",
    "lat": 40.015,
    "lng": -105.2705
  },
  "organizer": {
    "name": "Organizer Name",
    "email": "email@example.com",
    "phone": "(123) 456-7890"
  },
  "categories": ["Category1", "Category2"],
  "registrationRequired": true,
  "registrationUrl": "https://registration-url.com",
  "entryFee": "$25 adults, $15 youth",
  "prizes": "Prize information",
  "equipment": "Equipment details"
}
```

**Important**: For shoots to appear on the map, they must include `lat` and `lng` coordinates in the location object.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `public` directory.

## Serving the Production Build

```bash
npm run serve
```

## PWA Features

The app includes PWA functionality through `gatsby-plugin-manifest`:

- **Installable**: Users can add the app to their home screen
- **Offline Support**: Basic offline functionality
- **App Shell**: Fast loading with cached assets

To enable full offline support for the map, consider implementing service worker caching strategies for Google Maps tiles.

## Customization

### Styling

The app uses CSS Modules for scoped styling. Key files:

- `src/components/map.module.css` - Map component styles
- `src/components/tabs.module.css` - Tabs component styles
- `src/pages/index.module.css` - Home page styles
- `src/components/layout.css` - Global styles and CSS variables

### Colors and Theme

Global CSS variables are defined in `src/components/layout.css`:

```css
:root {
  --color-primary: #2d5a27;
  --color-text: #333333;
  --color-background: #f5f5f5;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --border-radius: 8px;
}
```

## Troubleshooting

### Map Not Loading

1. Verify your Google Maps API key is correct
2. Ensure the API key has Maps JavaScript API enabled
3. Check browser console for error messages
4. Confirm the `.env` file is in the root directory

### Build Errors

1. Clear Gatsby cache: `npm run clean`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Ensure all environment variables are set

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please contact us at support@archeryshootfinder.com.
