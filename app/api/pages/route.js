import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPageContent, getAllPageContent, PAGE_DEFAULTS } from "@/lib/pages";

// Public GET — a single page's merged content (?page=slug), or all pages (no param).
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    const slug = new URL(request.url).searchParams.get("page");
    if (slug) {
      const content = await getPageContent(supabase, slug);
      return NextResponse.json({ success: true, content });
    }
    const pages = await getAllPageContent(supabase);
    return NextResponse.json({ success: true, pages });
  } catch (err) {
    const slug = new URL(request.url).searchParams.get("page");
    if (slug) {
      return NextResponse.json({ success: true, content: PAGE_DEFAULTS[slug] || {} });
    }
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
