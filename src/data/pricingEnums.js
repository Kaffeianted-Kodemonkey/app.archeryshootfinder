// src/data/pricingEnums.js
// Extensible map of pricing codes to user-friendly labels

export const pricingEnums = {
  inclusions: {
    'shooting_days:1': '1 day of shooting access',
    'shooting_days:2': '2 days of shooting access',
    'shooting_days:full': 'Full event access',
    'targets:standard': 'Standard targets',
    'targets:extra': 'Extra target faces',
    'competition:yes': 'Competition round and scoring',
    'prizes:eligible': 'Eligible for prizes/trophies',
    'equipment:provided': 'Equipment provided',
    'side_events:elk': 'Elk side shoot (100+ yards)',
    'max_shots:6': 'Limited to 6 shots/arrows'
  },
  exclusions: {
    'competition': 'No competition round',
    'side_events': 'No side events included'
  },
  prerequisites: {
    'base_registration': 'Requires base event registration'
  },
  availability: {
    'sat': 'Saturday only',
    'sun': 'Sunday only',
    'both': 'Both days'
  },
  discounts: {
    'youth:50_percent_under_18': 'Youth under 18: 50% off',
    'family:20_percent_min_3': 'Family (3+): 20% off'
  }
  // Add new codes here as needed, e.g., 'prizes:cash': 'Cash prizes'
};

export const getLabel = (code, category = 'inclusions') => {
  return pricingEnums[category]?.[code] || code; // Fallback to raw code
};