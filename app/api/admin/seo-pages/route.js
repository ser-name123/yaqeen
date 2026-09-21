import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAllPageSeo, getSiteUrl, mergePageSeo, PAGE_SEO_DEFAULTS, SEO_PAGE_LIST } from "@/lib/seo";
import { hasTab } from "@/lib/roles";

async function validateSession(request, supabase) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  const { data: admin, error } = await supabase
    .from("admin_profile").select("*").eq("session_token", token).maybeSingle();
  if (error || !admin) return null;
  if (new Date(admin.session_expires_at) < new Date()) return null;
  return admin;
}

// GET — every page's merged SEO + the list + the canonical site URL.
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "seo")) {
      return NextResponse.json({ success: false, message: "You do not have permission for the SEO Manager." }, { status: 403 });
    }
    const [pages, siteUrl] = await Promise.all([getAllPageSeo(supabase), getSiteUrl(supabase)]);
    return NextResponse.json({ success: true, pages, list: SEO_PAGE_LIST, siteUrl });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// POST — save one page's SEO ({ key, seo }) and/or the canonical site URL ({ siteUrl }).
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "seo")) {
      return NextResponse.json({ success: false, message: "You do not have permission for the SEO Manager." }, { status: 403 });
    }
    const body = await request.json();

    // Save canonical site URL on the global seo_settings row.
    if (typeof body.siteUrl === "string") {
      const clean = body.siteUrl.trim().replace(/\/$/, "");
      await supabase.from("seo_settings").upsert({ id: "global", site_url: clean || null, updated_at: new Date().toISOString() });
    }

    if (body.key) {
      if (!PAGE_SEO_DEFAULTS[body.key]) {
        return NextResponse.json({ success: false, message: "Unknown page." }, { status: 400 });
      }
      const s = body.seo || {};
      let slug = (s.slug || "").trim();
      if (slug && !slug.startsWith("/")) slug = `/${slug}`;
      const payload = {
        id: body.key,
        slug: slug || null,
        title: (s.title || "").trim() || null,
        description: (s.description || "").trim() || null,
        keywords: (s.keywords || "").trim() || null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("page_seo").upsert(payload);
      if (error) throw error;
      return NextResponse.json({ success: true, seo: mergePageSeo(body.key, payload) });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
