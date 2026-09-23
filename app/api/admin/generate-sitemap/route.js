import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hasTab } from "@/lib/roles";
import { generateSitemapData } from "@/lib/sitemap-builder";

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
    if (!hasTab(caller, "seo")) {
      return NextResponse.json({ success: false, message: "You do not have permission for the SEO Manager." }, { status: 403 });
    }

    const { siteUrl } = await request.json().catch(() => ({}));

    // Generate sitemap XML and all entries dynamically
    const { entries, siteUrl: resolvedUrl } = await generateSitemapData(siteUrl);

    // Save site_url to seo_settings if passed
    if (siteUrl && resolvedUrl) {
      try {
        await supabaseAdmin.from("seo_settings").upsert({
          id: "global",
          site_url: resolvedUrl,
          updated_at: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn("Could not save site_url to seo_settings:", dbErr.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Sitemap generated and updated successfully.", 
      path: "/sitemap.xml",
      urlCount: entries.length
    });
  } catch (err) {
    console.error("Generate sitemap error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to generate sitemap." }, { status: 500 });
  }
}
