// ============================================================================
// Per-page SEO — defaults + merge + Next.js metadata builder.
// Pure JS (no React) so it is safe from server layouts and API routes.
// ============================================================================

export const DEFAULT_SITE_URL = "https://yaqeeninstitute.online";

// Pages that appear in the admin SEO sub-menu. `path` is the real Next route.
export const SEO_PAGE_LIST = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "courses", label: "Courses", path: "/courses" },
  { key: "pricing", label: "Pricing", path: "/pricing" },
  { key: "teachers", label: "Teachers", path: "/teachers" },
  { key: "testimonials", label: "Testimonials", path: "/testimonials" },
  { key: "careers", label: "Careers", path: "/careers" },
  { key: "faqs", label: "FAQs", path: "/faqs" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "bookTrial", label: "Book Free Trial", path: "/book-free-trial" },
  { key: "privacy", label: "Privacy Policy", path: "/privacy" },
  { key: "terms", label: "Terms of Service", path: "/terms" },
];

export function pathForKey(key) {
  return (SEO_PAGE_LIST.find((p) => p.key === key) || {}).path || "/";
}

// Sensible per-page SEO seeds (title / description / keywords). slug = real path.
export const PAGE_SEO_DEFAULTS = {
  home: {
    slug: "/",
    title: "Yaqeen Institute — Learn Quran, Arabic & Islamic Studies Online",
    description: "Learn Quran, Arabic, and Islamic Studies online with one-to-one live classes from qualified native tutors. Flexible scheduling for all ages, in your own language.",
    keywords: "Quran, learn Quran online, online Quran classes, Arabic, Islamic studies, Tajweed, Hifz, Yaqeen Institute",
  },
  about: {
    slug: "/about",
    title: "About Us — Yaqeen Institute",
    description: "Empowering minds and inspiring futures. Learn who we are, what we do, and our mission to make authentic Islamic education accessible worldwide.",
    keywords: "about Yaqeen Institute, online Quran academy, Islamic education, our mission",
  },
  courses: {
    slug: "/courses",
    title: "Online Courses — Quran, Tajweed, Arabic & Islamic Studies",
    description: "Explore expert-led online courses in Quran recitation, Tajweed, Hifz, Arabic language, and Islamic Studies with certified tutors and flexible timings.",
    keywords: "online Quran courses, Tajweed course, Hifz, Arabic classes, Islamic studies courses",
  },
  pricing: {
    slug: "/pricing",
    title: "Pricing & Plans — Yaqeen Institute",
    description: "Flexible, affordable plans with family discounts. Transparent pricing and no hidden fees for quality online Quranic education.",
    keywords: "Quran classes pricing, online Quran fees, family discount, affordable Quran classes",
  },
  teachers: {
    slug: "/teachers",
    title: "Meet Our Teachers — Yaqeen Institute",
    description: "Learn from experienced and caring teachers. Qualified, certified tutors of Quran, Tajweed, Arabic and Islamic Studies for kids and adults.",
    keywords: "Quran teachers, online Quran tutor, female Quran teacher, certified Arabic teacher",
  },
  testimonials: {
    slug: "/testimonials",
    title: "Testimonials — Feedback From Our Students",
    description: "Hear from our learners and parents building a stronger connection with the Quran, Arabic and Islamic knowledge together.",
    keywords: "Yaqeen Institute reviews, student testimonials, Quran class feedback",
  },
  careers: {
    slug: "/careers",
    title: "Careers — Build Your Career With Us",
    description: "Serve Allah through your work. Explore teaching and staff opportunities at Yaqeen Institute and join a purposeful, supportive team.",
    keywords: "Quran teacher jobs, Arabic teacher jobs, online teaching careers, Yaqeen Institute careers",
  },
  faqs: {
    slug: "/faqs",
    title: "FAQs — Frequently Asked Questions | Yaqeen Institute",
    description: "Everything you need to know about Yaqeen Institute — our courses, teachers, scheduling and enrolment.",
    keywords: "Yaqeen Institute FAQ, online Quran classes questions, enrolment help",
  },
  contact: {
    slug: "/contact",
    title: "Contact Us — Yaqeen Institute",
    description: "Have a question or need assistance? Our team is happy to support you on your learning journey. Reach us by email, phone or WhatsApp.",
    keywords: "contact Yaqeen Institute, Quran classes support, book a class",
  },
  bookTrial: {
    slug: "/book-free-trial",
    title: "Book a Free Trial Class — Yaqeen Institute",
    description: "Book your free trial class today. 100% free, no card needed, flexible 24/7 scheduling with certified teachers.",
    keywords: "free Quran trial class, book Quran class, free trial, online Quran demo",
  },
  privacy: {
    slug: "/privacy",
    title: "Privacy Policy — Yaqeen Institute",
    description: "How Yaqeen Institute collects, uses, and protects your personal information.",
    keywords: "privacy policy, data protection, Yaqeen Institute privacy",
  },
  terms: {
    slug: "/terms",
    title: "Terms of Service — Yaqeen Institute",
    description: "The terms governing your use of Yaqeen Institute's website, online classes, and educational services.",
    keywords: "terms of service, terms and conditions, Yaqeen Institute",
  },
};

function clean(v) {
  return typeof v === "string" ? v.trim() : v;
}

// Merge a page's stored SEO over its defaults (non-empty values win).
export function mergePageSeo(key, db) {
  const def = PAGE_SEO_DEFAULTS[key] || { slug: pathForKey(key), title: "", description: "", keywords: "" };
  const src = db || {};
  const out = { ...def };
  for (const f of ["slug", "title", "description", "keywords"]) {
    const v = clean(src[f]);
    if (v) out[f] = v;
  }
  if (!out.slug) out.slug = pathForKey(key);
  return out;
}

// Server-side: one page's merged SEO.
export async function getPageSeo(supabase, key) {
  try {
    const { data } = await supabase.from("page_seo").select("*").eq("id", key).maybeSingle();
    return mergePageSeo(key, data);
  } catch {
    return mergePageSeo(key, null);
  }
}

// Server-side: every page's merged SEO, keyed by page key.
export async function getAllPageSeo(supabase) {
  const byId = {};
  try {
    const { data } = await supabase.from("page_seo").select("*");
    for (const r of data || []) byId[r.id] = r;
  } catch {
    /* fall back to defaults */
  }
  const out = {};
  for (const { key } of SEO_PAGE_LIST) out[key] = mergePageSeo(key, byId[key]);
  return out;
}

// Server-side: canonical base URL (stored on seo_settings, else default).
export async function getSiteUrl(supabase) {
  try {
    const { data } = await supabase.from("seo_settings").select("site_url").eq("id", "global").maybeSingle();
    const u = clean(data?.site_url);
    if (u) return u.replace(/\/$/, "");
  } catch {
    /* ignore */
  }
  return DEFAULT_SITE_URL;
}

// Build a Next.js metadata object from a merged SEO record.
// `siteUrl` is the canonical base; `favicon` optionally sets icons.
export function buildMetadata(seo, { siteUrl = DEFAULT_SITE_URL, favicon = "" } = {}) {
  const base = (siteUrl || DEFAULT_SITE_URL).replace(/\/$/, "");
  const slug = seo.slug && seo.slug.startsWith("/") ? seo.slug : `/${seo.slug || ""}`;
  const meta = {
    metadataBase: (() => { try { return new URL(base); } catch { return undefined; } })(),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: slug },
  };
  if (favicon) {
    meta.icons = { icon: favicon, shortcut: favicon, apple: favicon };
  }
  return meta;
}

// Convenience for a route's generateMetadata: fetch + build in one call.
export async function pageMetadata(supabase, key, { favicon = "" } = {}) {
  const [seo, siteUrl] = await Promise.all([getPageSeo(supabase, key), getSiteUrl(supabase)]);
  return buildMetadata(seo, { siteUrl, favicon });
}
