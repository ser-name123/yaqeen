import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getLayoutConfig } from "@/lib/layout";
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

// GET — current footer/header config (merged with defaults)
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "footer")) {
      return NextResponse.json({ success: false, message: "You do not have permission for Header & Footer." }, { status: 403 });
    }
    const config = await getLayoutConfig(supabase);
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

const TEXT_FIELDS = [
  "footer_tagline", "footer_description", "footer_rating_score", "footer_rating_text",
  "footer_whatsapp_label", "explore_title", "courses_title", "connect_title",
  "view_all_label", "view_all_url", "contact_phone_label", "contact_email_label",
  "newsletter_title", "newsletter_desc", "footer_address", "footer_ssl_text", "social_heading",
  "header_cta_label", "header_cta_url",
];

// POST — save the whole config
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "footer")) {
      return NextResponse.json({ success: false, message: "You do not have permission for Header & Footer." }, { status: 403 });
    }
    const c = (await request.json()).config || {};
    const payload = { id: "global", updated_at: new Date().toISOString() };
    for (const f of TEXT_FIELDS) payload[f] = c[f] ?? null;
    payload.explore_links = Array.isArray(c.explore_links)
      ? c.explore_links.filter((l) => l && l.label).map((l) => ({ label: l.label, url: l.url || "#", ...(l.badge ? { badge: l.badge } : {}) }))
      : null;
    payload.trust_badges = Array.isArray(c.trust_badges)
      ? c.trust_badges.filter((b) => b && b.title).map((b) => ({ title: b.title, subtitle: b.subtitle || "" }))
      : null;
    payload.footer_courses = Array.isArray(c.footer_courses)
      ? c.footer_courses.filter((l) => l && l.label).map((l) => ({ label: l.label, url: l.url || "#" }))
      : null;
    payload.header_links = Array.isArray(c.header_links)
      ? c.header_links.filter((l) => l && l.label).map((l) => {
          const dropdown = Array.isArray(l.dropdown)
            ? l.dropdown.filter((d) => d && d.label).map((d) => ({ label: d.label, url: d.url || "#" }))
            : [];
          return dropdown.length ? { label: l.label, dropdown } : { label: l.label, url: l.url || "#" };
        })
      : null;

    const { error } = await supabase.from("layout_config").upsert(payload);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
