import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hasTab } from "@/lib/roles";

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

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB safety cap

// GET: return the current custom sitemap / robots state so the admin UI can
// show whether an uploaded version is active.
export async function GET(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!hasTab(caller, "seo")) {
      return NextResponse.json({ success: false, message: "You do not have permission for the SEO Manager." }, { status: 403 });
    }

    const { data } = await supabaseAdmin
      .from("seo_settings")
      .select("custom_sitemap_xml, custom_robots_txt")
      .eq("id", "global")
      .maybeSingle();

    const sitemap = (data?.custom_sitemap_xml || "").trim();
    const robots = (data?.custom_robots_txt || "").trim();

    return NextResponse.json({
      success: true,
      sitemap: { active: Boolean(sitemap), content: sitemap },
      robots: { active: Boolean(robots), content: robots },
    });
  } catch (err) {
    console.error("sitemap-files GET error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to load." }, { status: 500 });
  }
}

// POST: save or clear a custom sitemap.xml / robots.txt.
//  body: { type: "sitemap" | "robots", content?: string, clear?: boolean }
export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!hasTab(caller, "seo")) {
      return NextResponse.json({ success: false, message: "You do not have permission for the SEO Manager." }, { status: 403 });
    }

    const { type, content, clear } = await request.json().catch(() => ({}));
    if (type !== "sitemap" && type !== "robots") {
      return NextResponse.json({ success: false, message: "Invalid type. Use 'sitemap' or 'robots'." }, { status: 400 });
    }

    const column = type === "sitemap" ? "custom_sitemap_xml" : "custom_robots_txt";
    let value = null;

    if (!clear) {
      const text = (content || "").toString();
      if (!text.trim()) {
        return NextResponse.json({ success: false, message: "File is empty. Upload a non-empty file or choose Remove." }, { status: 400 });
      }
      if (Buffer.byteLength(text, "utf8") > MAX_BYTES) {
        return NextResponse.json({ success: false, message: "File is too large (max 5 MB)." }, { status: 413 });
      }
      // Light sanity check for sitemap uploads.
      if (type === "sitemap" && !/<urlset|<sitemapindex|<\?xml/i.test(text)) {
        return NextResponse.json({ success: false, message: "This does not look like a valid XML sitemap." }, { status: 400 });
      }
      value = text;
    }

    const { error } = await supabaseAdmin
      .from("seo_settings")
      .upsert({ id: "global", [column]: value, updated_at: new Date().toISOString() });

    if (error) {
      // Likely the migration columns do not exist yet.
      if (error.message && (error.message.includes("column") || error.message.includes("does not exist"))) {
        return NextResponse.json({
          success: false,
          message: "Database not ready. Please run supabase-sitemap-robots.sql first (adds custom_sitemap_xml / custom_robots_txt).",
        }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: clear
        ? `Custom ${type === "sitemap" ? "sitemap.xml" : "robots.txt"} removed. The generated version is now served.`
        : `Custom ${type === "sitemap" ? "sitemap.xml" : "robots.txt"} uploaded. It is now served and overrides the generated one.`,
      active: !clear,
    });
  } catch (err) {
    console.error("sitemap-files POST error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to save." }, { status: 500 });
  }
}
