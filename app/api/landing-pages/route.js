import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_LANDING_PAGE_CONTENT, DEFAULT_LANDING_PAGE_SEO } from "@/lib/landing-page-defaults";

function formatSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/landing-pages - List all landing pages
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("landing_pages")
      .select("id, slug, title, status, is_default, seo, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      // If table does not exist in DB yet, return default page array gracefully
      console.warn("Error fetching landing_pages (table might need migration):", error.message);
      return NextResponse.json({
        success: true,
        pages: [
          {
            id: "default-uk",
            slug: "online-quran-classes-uk",
            title: "Online Quran Classes in UK",
            status: "published",
            is_default: true,
            seo: DEFAULT_LANDING_PAGE_SEO,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });
    }

    // If table is completely empty, insert and return the initial default
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        pages: [
          {
            id: "default-uk",
            slug: "online-quran-classes-uk",
            title: "Online Quran Classes in UK",
            status: "published",
            is_default: true,
            seo: DEFAULT_LANDING_PAGE_SEO,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });
    }

    return NextResponse.json({ success: true, pages: data });
  } catch (err) {
    console.error("GET /api/landing-pages error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch landing pages" },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages - Create new or duplicate landing page
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug: rawSlug, status = "published", is_default = false, seo, content, cloneFromId } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Page title is required." },
        { status: 400 }
      );
    }

    let slug = formatSlug(rawSlug || title);
    if (!slug) {
      slug = `page-${Date.now()}`;
    }

    const supabase = getSupabaseAdmin();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("landing_pages")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let finalContent = content;
    let finalSeo = seo;

    // If cloning from an existing page
    if (cloneFromId) {
      const { data: source } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", cloneFromId)
        .maybeSingle();

      if (source) {
        finalContent = source.content || DEFAULT_LANDING_PAGE_CONTENT;
        finalSeo = {
          ...source.seo,
          metaTitle: `${title} | Yaqeen Institute`,
          canonicalSlug: slug
        };
      }
    }

    // Fallbacks
    if (!finalContent || Object.keys(finalContent).length === 0) {
      finalContent = JSON.parse(JSON.stringify(DEFAULT_LANDING_PAGE_CONTENT));
    }
    if (!finalSeo || Object.keys(finalSeo).length === 0) {
      finalSeo = {
        ...DEFAULT_LANDING_PAGE_SEO,
        metaTitle: `${title} | Yaqeen Institute`,
        canonicalSlug: slug
      };
    }

    const { data, error } = await supabase
      .from("landing_pages")
      .insert({
        title: title.trim(),
        slug,
        status: status === "draft" ? "draft" : "published",
        is_default: Boolean(is_default),
        seo: finalSeo,
        content: finalContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, page: data });
  } catch (err) {
    console.error("POST /api/landing-pages error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create landing page" },
      { status: 500 }
    );
  }
}
