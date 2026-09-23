import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_LANDING_PAGE_CONTENT, DEFAULT_LANDING_PAGE_SEO } from "@/lib/landing-page-defaults";

// GET /api/landing-pages/by-slug/[slug]
export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const cleanSlug = String(slug || "").toLowerCase().trim();

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (error || !data) {
      // If requested slug matches default or table doesn't exist
      if (cleanSlug === "online-quran-classes-uk" || cleanSlug === "default") {
        return NextResponse.json({
          success: true,
          page: {
            id: "default-uk",
            slug: "online-quran-classes-uk",
            title: "Online Quran Classes in UK",
            status: "published",
            is_default: true,
            seo: DEFAULT_LANDING_PAGE_SEO,
            content: DEFAULT_LANDING_PAGE_CONTENT
          }
        });
      }

      return NextResponse.json(
        { success: false, message: "Landing page not found" },
        { status: 404 }
      );
    }

    // Merge defaults so no field is undefined
    return NextResponse.json({
      success: true,
      page: {
        ...data,
        seo: { ...DEFAULT_LANDING_PAGE_SEO, ...(data.seo || {}) },
        content: { ...DEFAULT_LANDING_PAGE_CONTENT, ...(data.content || {}) }
      }
    });
  } catch (err) {
    console.error("GET /api/landing-pages/by-slug/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
