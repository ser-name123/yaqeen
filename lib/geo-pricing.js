/**
 * Multi-Currency & Geolocation Pricing Utility for Yaqeen Institute
 * 
 * Rules:
 * 1. Gulf / GCC Countries (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman) -> AED
 * 2. Europe & UK (United Kingdom, Ireland, Germany, France, Italy, Spain, etc.) -> GBP
 * 3. Other Countries (USA, Canada, Australia, India, Pakistan, etc.) -> USD
 */

export const CURRENCIES = {
  AED: {
    code: "AED",
    symbol: "AED ",
    symbolShort: "AED",
    name: "UAE Dirham",
    region: "Gulf / GCC",
    flag: "🇦🇪",
    sampleRate: "30.00"
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    symbolShort: "£",
    name: "British Pound",
    region: "Europe & UK",
    flag: "🇬🇧",
    sampleRate: "6.50"
  },
  USD: {
    code: "USD",
    symbol: "$",
    symbolShort: "$",
    name: "US Dollar",
    region: "Other Countries",
    flag: "🇺🇸",
    sampleRate: "8.00"
  }
};

// List of ISO 2-letter codes & names for GCC / Gulf countries
const GULF_COUNTRIES = [
  "AE", "SA", "QA", "KW", "BH", "OM",
  "united arab emirates", "saudi arabia", "qatar", "kuwait", "bahrain", "oman",
  "uae", "dubai", "abu dhabi", "riyadh", "doha"
];

// List of ISO 2-letter codes & names for Europe / UK countries
const EUROPE_COUNTRIES = [
  "GB", "UK", "IE", "DE", "FR", "IT", "ES", "NL", "BE", "CH", "SE", "NO", "DK", "FI", "AT", "PT", "PL", "GR", "CZ", "RO", "HU", "LU", "IS",
  "united kingdom", "great britain", "england", "scotland", "wales", "northern ireland", "ireland",
  "germany", "france", "italy", "spain", "netherlands", "belgium", "switzerland", "sweden", "norway",
  "denmark", "finland", "austria", "portugal", "poland", "greece", "czech republic", "romania", "hungary", "luxembourg", "iceland"
];

/**
 * Detect currency (AED, GBP, USD) from country name or ISO country code
 */
export function detectCurrencyFromCountry(countryOrCode) {
  if (!countryOrCode) return "USD";
  const raw = String(countryOrCode).trim().toLowerCase();

  // 1. Check Gulf / GCC
  if (GULF_COUNTRIES.some(c => c.toLowerCase() === raw || raw.includes(c.toLowerCase()))) {
    return "AED";
  }

  // 2. Check Europe / UK
  if (EUROPE_COUNTRIES.some(c => c.toLowerCase() === raw || raw.includes(c.toLowerCase()))) {
    return "GBP";
  }

  // 3. Default for all other countries
  return "USD";
}

/**
 * Get plan price for the given currency (with fallback calculations if multi-currency values not set yet)
 */
export function getPlanPrice(plan, currency = "USD") {
  if (!plan) return "0.00";
  const curr = String(currency || "USD").toUpperCase();

  if (curr === "AED") {
    if (plan.price_aed && String(plan.price_aed).trim() !== "") {
      return String(plan.price_aed).trim();
    }
    // Fallback: estimate from USD price * 3.75 rounded
    const base = parseFloat(plan.price || plan.price_usd || "8") || 8;
    return (Math.round(base * 3.75)).toFixed(2);
  }

  if (curr === "GBP") {
    if (plan.price_gbp && String(plan.price_gbp).trim() !== "") {
      return String(plan.price_gbp).trim();
    }
    // Fallback: estimate from USD price * 0.8
    const base = parseFloat(plan.price || plan.price_usd || "8") || 8;
    return (base * 0.8).toFixed(2);
  }

  // USD (Default)
  if (plan.price_usd && String(plan.price_usd).trim() !== "") {
    return String(plan.price_usd).trim();
  }
  return plan.price ? String(plan.price).trim() : "8.00";
}

/**
 * Format price with currency symbol
 * Examples: formatPriceWithCurrency("8.00", "USD") -> "$8.00"
 *           formatPriceWithCurrency("6.50", "GBP") -> "£6.50"
 *           formatPriceWithCurrency("30.00", "AED") -> "AED 30.00"
 */
export function formatPriceWithCurrency(amount, currency = "USD") {
  const curr = String(currency || "USD").toUpperCase();
  const meta = CURRENCIES[curr] || CURRENCIES.USD;
  const num = typeof amount === "number" ? amount.toFixed(2) : String(amount || "0.00");
  
  if (curr === "AED") {
    return `AED ${num}`;
  }
  return `${meta.symbol}${num}`;
}
