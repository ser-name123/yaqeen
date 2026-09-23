import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_SITE_URL } from "@/lib/seo";

export const STATIC_SITEMAP_PATHS = [
  { path: "", priority: "1.0", changeFrequency: "weekly" },
  { path: "/courses", priority: "0.9", changeFrequency: "weekly" },
  { path: "/pricing", priority: "0.8", changeFrequency: "monthly" },
  { path: "/about", priority: "0.7", changeFrequency: "monthly" },
  { path: "/teachers", priority: "0.7", changeFrequency: "weekly" },
  { path: "/testimonials", priority: "0.6", changeFrequency: "monthly" },
  { path: "/blog", priority: "0.7", changeFrequency: "weekly" },
  { path: "/faqs", priority: "0.6", changeFrequency: "monthly" },
  { path: "/careers", priority: "0.6", changeFrequency: "monthly" },
  { path: "/contact", priority: "0.6", changeFrequency: "monthly" },
  { path: "/register", priority: "0.8", changeFrequency: "monthly" },
  { path: "/teacher-application", priority: "0.6", changeFrequency: "monthly" },
  { path: "/privacy", priority: "0.3", changeFrequency: "yearly" },
  { path: "/terms", priority: "0.3", changeFrequency: "yearly" },
  { path: "/refund", priority: "0.3", changeFrequency: "yearly" },
  { path: "/cookies", priority: "0.3", changeFrequency: "yearly" }
];

export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Builds the complete list of sitemap URLs and the XML document.
 * @param {string} [overrideSiteUrl] - Optional URL passed from caller or DB.
 * @returns {Promise<{ xml: string, entries: Array<object>, siteUrl: string }>}
 */
export async function generateSitemapData(overrideSiteUrl = "") {
  let supabaseAdmin = null;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (e) {
    console.warn("Could not get supabase admin client for sitemap:", e.message);
  }

  // 1. Determine siteUrl
  let resolvedSiteUrl = (overrideSiteUrl || "").trim().replace(/\/$/, "");
  if (!resolvedSiteUrl && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from("seo_settings").select("site_url").eq("id", "global").maybeSingle();
      if (data?.site_url) {
        resolvedSiteUrl = data.site_url.trim().replace(/\/$/, "");
      }
    } catch (e) {
      console.warn("Could not read site_url from seo_settings:", e.message);
    }
  }
  if (!resolvedSiteUrl) {
    resolvedSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
  }

  // 2. Map static paths with custom seo slugs
  const keyByPath = {
    "": "home", "/courses": "courses", "/pricing": "pricing", "/about": "about",
    "/teachers": "teachers", "/testimonials": "testimonials", "/faqs": "faqs",
    "/careers": "careers", "/contact": "contact", "/register": "bookTrial",
    "/teacher-application": "teacherApplication",
    "/privacy": "privacy", "/terms": "terms",
    "/refund": "refund", "/cookies": "cookies",
  };

  let seoSlugByKey = {};
  if (supabaseAdmin) {
    try {
      const { data: seoRows } = await supabaseAdmin.from("page_seo").select("id, slug");
      for (const r of seoRows || []) {
        if (r.slug) seoSlugByKey[r.id] = r.slug.startsWith("/") ? r.slug : `/${r.slug}`;
      }
    } catch (e) {
      console.warn("Sitemap: page_seo read skipped:", e.message);
    }
  }

  const entries = [...STATIC_SITEMAP_PATHS.map(r => {
    const key = keyByPath[r.path];
    const slug = key && seoSlugByKey[key];
    const finalPath = slug !== undefined && slug !== null ? (slug === "/" ? "" : slug) : r.path;
    return {
      loc: `${resolvedSiteUrl}${finalPath}`,
      lastmod: new Date().toISOString(),
      changefreq: r.changeFrequency,
      priority: r.priority
    };
  })];

  // 3. Dynamic routes from DB (Courses, Blogs, Landing Pages)
  if (supabaseAdmin) {
    try {
      const [{ data: courses }, { data: blogs }, { data: landingPages }] = await Promise.all([
        supabaseAdmin.from("courses").select("id, title, updated_at"),
        supabaseAdmin.from("blogs").select("slug, updated_at, created_at"),
        supabaseAdmin.from("landing_pages").select("slug, status, updated_at, created_at, seo")
      ]);

      if (courses && courses.length > 0) {
        for (const c of courses) {
          const slug = slugify(c.title);
          if (slug) {
            entries.push({
              loc: `${resolvedSiteUrl}/courses/${slug}`,
              lastmod: c.updated_at ? new Date(c.updated_at).toISOString() : new Date().toISOString(),
              changefreq: "monthly",
              priority: "0.6"
            });
          }
        }
      }

      if (blogs && blogs.length > 0) {
        for (const b of blogs) {
          if (b.slug) {
            entries.push({
              loc: `${resolvedSiteUrl}/blog/${b.slug}`,
              lastmod: b.updated_at ? new Date(b.updated_at).toISOString() : (b.created_at ? new Date(b.created_at).toISOString() : new Date().toISOString()),
              changefreq: "monthly",
              priority: "0.6"
            });
          }
        }
      }

      if (landingPages && landingPages.length > 0) {
        for (const lp of landingPages) {
          // Only include published pages that are not set to noindex
          if (lp.status === "published" && lp.slug && !lp.seo?.noindex) {
            const pathPrefix = Boolean(lp.seo?.useLandingPrefix) ? "/landing" : "";
            const pagePath = `${pathPrefix}/${lp.slug.replace(/^\//, "")}`;
            entries.push({
              loc: `${resolvedSiteUrl}${pagePath}`,
              lastmod: lp.updated_at ? new Date(lp.updated_at).toISOString() : (lp.created_at ? new Date(lp.created_at).toISOString() : new Date().toISOString()),
              changefreq: "weekly",
              priority: "0.8"
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn("Sitemap generator DB read warning:", dbErr.message);
    }
  }

  // 4. Build sitemap XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += `  </url>\n`;
  }
  xml += `</urlset>`;

  return { xml, entries, siteUrl: resolvedSiteUrl };
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
