/** @type {import('next').NextConfig} */

const SUPABASE = "https://utjadhbdvcrbdlzjcqio.supabase.co";

// Cloudflare Web Analytics injects beacon.min.js at the edge, so this script is
// not in our own markup — it only appears on deployed environments. Its RUM data
// is posted back to cloudflareinsights.com. Turning Web Analytics off in the
// Cloudflare dashboard makes both entries below unnecessary.
const CLOUDFLARE_SCRIPT = ["https://static.cloudflareinsights.com"];
const CLOUDFLARE_CONNECT = ["https://cloudflareinsights.com"];

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

// The dev server talks to localhost over ws for hot reload. Those origins are
// meaningless in a deployed build, so keep them out of the production policy.
const DEV_CONNECT =
  process.env.NODE_ENV === "production"
    ? []
    : ["ws://localhost:*", "wss://localhost:*", "http://localhost:*", "http://127.0.0.1:*"];

const csp = [
  ["default-src", "'self'"],
  ["script-src", "'self'", "'unsafe-eval'", "'unsafe-inline'", ...GTAG_SCRIPT, ...CLOUDFLARE_SCRIPT],
  ["style-src", "'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  ["font-src", "'self'", "https://fonts.gstatic.com", "data:"],
  ["img-src", "'self'", "data:", "blob:", "https://images.unsplash.com", "https://res.cloudinary.com", SUPABASE, ...GTAG_IMG],
  ["frame-src", "'self'", ...GTAG_FRAME],
  [
    "connect-src",
    "'self'",
    SUPABASE,
    `wss://${SUPABASE.replace("https://", "")}`,
    ...DEV_CONNECT,
    ...GTAG_CONNECT,
    ...CLOUDFLARE_CONNECT
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
  },
  // Serve /sitemap.xml from a normal route handler. Next reserves the
  // /sitemap.xml path for its metadata convention, so a route handler folder
  // named "sitemap.xml" breaks in dev ("Cannot find module './sitemap.js'").
  // Hosting the handler at /api/sitemap and rewriting avoids that conflict and
  // works in both dev and production.
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap" }
    ];
  },
  // Landing pages now live at the root ( /{slug} ). Permanently redirect any
  // legacy /landing/{slug} link (and old search-engine results) to the clean
  // root URL so nothing 404s.
  async redirects() {
    return [
      { source: "/landing/:slug", destination: "/:slug", permanent: true }
    ];
  }
};

export default nextConfig;
