import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAllPageContent, mergePageContent, PAGE_DEFAULTS, PAGE_LIST } from "@/lib/pages";

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

// GET — all pages' merged content + the page list for the sub-menu.
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const pages = await getAllPageContent(supabase);
    return NextResponse.json({ success: true, pages, list: PAGE_LIST });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// POST — save one page's content. Body: { slug, content }.
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const { slug, content } = await request.json();
    if (!slug || !PAGE_DEFAULTS[slug]) {
      return NextResponse.json({ success: false, message: "Unknown page." }, { status: 400 });
    }
    // Merge over defaults so we always store a complete, valid shape.
    const merged = mergePageContent(slug, content || {});
    const { error } = await supabase
      .from("page_content")
      .upsert({ id: slug, content: merged, updated_at: new Date().toISOString() });
    if (error) throw error;
    return NextResponse.json({ success: true, content: merged });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
