import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

// Validate the caller's session token and return their admin row (or null)
async function validateSession(request, supabaseAdmin) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const { data: admin, error } = await supabaseAdmin
    .from("admin_profile")
    .select("*")
    .eq("session_token", token)
    .maybeSingle();

  if (error || !admin) return null;
  if (new Date(admin.session_expires_at) < new Date()) return null;
  return admin;
}

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { siteUrl } = await request.json();
    if (!siteUrl) {
      return NextResponse.json({ success: false, message: "Website URL is required." }, { status: 400 });
    }

    // Clean siteUrl (remove trailing slash)
    const cleanedUrl = siteUrl.trim().replace(/\/$/, "");

    // Static pages
    const staticPaths = [
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
      { path: "/book-free-trial", priority: "0.8", changeFrequency: "monthly" },
      { path: "/teacher-application", priority: "0.6", changeFrequency: "monthly" },
      { path: "/privacy", priority: "0.3", changeFrequency: "yearly" },
      { path: "/terms", priority: "0.3", changeFrequency: "yearly" }
    ];

    const slugify = (text) => {
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

    const entries = [...staticPaths.map(r => ({
      loc: `${cleanedUrl}${r.path}`,
      lastmod: new Date().toISOString(),
      changefreq: r.changeFrequency,
      priority: r.priority
    }))];

    // Fetch dynamic routes
    try {
      const [{ data: courses }, { data: blogs }] = await Promise.all([
        supabaseAdmin.from("courses").select("id, title, updated_at"),
        supabaseAdmin.from("blogs").select("slug, updated_at, created_at")
      ]);

      if (courses) {
        for (const c of courses) {
          entries.push({
            loc: `${cleanedUrl}/courses/${slugify(c.title)}`,
            lastmod: c.updated_at ? new Date(c.updated_at).toISOString() : new Date().toISOString(),
            changefreq: "monthly",
            priority: "0.6"
          });
        }
      }

      if (blogs) {
        for (const b of blogs) {
          entries.push({
            loc: `${cleanedUrl}/blog/${b.slug}`,
            lastmod: b.updated_at ? new Date(b.updated_at).toISOString() : (b.created_at ? new Date(b.created_at).toISOString() : new Date().toISOString()),
            changefreq: "monthly",
            priority: "0.6"
          });
        }
      }
    } catch (dbErr) {
      console.warn("Sitemap generator DB read warning:", dbErr);
    }

    // Build sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const entry of entries) {
      xml += `  <url>\n`;
      xml += `    <loc>${entry.loc}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>`;

    // Save to public/sitemap.xml
    const publicPath = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    fs.writeFileSync(path.join(publicPath, "sitemap.xml"), xml, "utf8");

    return NextResponse.json({ 
      success: true, 
      message: "Sitemap generated successfully.", 
      path: "/sitemap.xml",
      urlCount: entries.length
    });
  } catch (err) {
    console.error("Generate sitemap error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to generate sitemap." }, { status: 500 });
  }
}
