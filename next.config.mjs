/** @type {import('next').NextConfig} */

const SUPABASE = "https://utjadhbdvcrbdlzjcqio.supabase.co";

// Google tag (gtag.js) is loaded in app/layout.js for GA4 and Google Ads.
// The script itself comes from googletagmanager.com, but once running it also
// sends measurement beacons and conversion pixels to the analytics, Ads and
// doubleclick hosts below — whitelisting only the script host is not enough.
const GTAG_SCRIPT = [
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net"
];
// Google Ads remarketing pixels (ga-audiences, 1p-user-list) are sent to the
// visitor's own country Google domain, not google.com — a visitor from India
// hits google.co.in, one from the UK hits google.co.uk. CSP cannot wildcard a
// TLD ("https://www.google.*" is not valid), so each market has to be listed.
// Add a domain here when you start advertising in a new country; without it
// only that country's remarketing audiences break, conversion tracking is fine.
const GOOGLE_COUNTRY = [
  "https://www.google.co.uk",
  "https://www.google.co.in",
  "https://www.google.com.pk",
  "https://www.google.com.bd",
  "https://www.google.ca",
  "https://www.google.com.au",
  "https://www.google.ae",
  "https://www.google.com.sa",
  "https://www.google.com.eg",
  "https://www.google.com.my",
  "https://www.google.co.id",
  "https://www.google.de",
  "https://www.google.fr"
];

const GTAG_IMG = [
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://www.google.com",
  "https://googleads.g.doubleclick.net",
  "https://stats.g.doubleclick.net",
  "https://ad.doubleclick.net",
  ...GOOGLE_COUNTRY
];
const GTAG_CONNECT = [
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://www.googletagmanager.com",
  "https://googleads.g.doubleclick.net",
  "https://ad.doubleclick.net",
  "https://www.google.com",
  ...GOOGLE_COUNTRY
];
const GTAG_FRAME = [
  "https://td.doubleclick.net",
  "https://www.googletagmanager.com"
];

const csp = [
  ["default-src", "'self'"],
  ["script-src", "'self'", "'unsafe-eval'", "'unsafe-inline'", ...GTAG_SCRIPT],
  ["style-src", "'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  ["font-src", "'self'", "https://fonts.gstatic.com", "data:"],
  ["img-src", "'self'", "data:", "blob:", "https://images.unsplash.com", SUPABASE, ...GTAG_IMG],
  ["frame-src", "'self'", ...GTAG_FRAME],
  [
    "connect-src",
    "'self'",
    SUPABASE,
    `wss://${SUPABASE.replace("https://", "")}`,
    "ws://localhost:*",
    "wss://localhost:*",
    "http://localhost:*",
    "http://127.0.0.1:*",
    ...GTAG_CONNECT
  ]
]
  .map((directive) => directive.join(" "))
  .join("; ");

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `${csp};`
          }
        ]
      }
    ];
  }
};

export default nextConfig;
