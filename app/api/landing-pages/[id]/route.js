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

function isUuid(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str || "").trim());
}

// GET /api/landing-pages/[id] - Fetch single page details
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    let query = supabase.from("landing_pages").select("*");
    if (isUuid(id)) {
      query = query.eq("id", id);
    } else {
      const targetSlug = id === "default-uk" ? "online-quran-classes-uk" : id;
      query = query.eq("slug", targetSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // If default-uk or not found in DB, return clean fallback
      return NextResponse.json({
        success: true,
        page: {
          id: id || "default-uk",
          slug: "online-quran-classes-uk",
          title: "Online Quran Classes in UK",
          status: "published",
          is_default: true,
          seo: DEFAULT_LANDING_PAGE_SEO,
          content: DEFAULT_LANDING_PAGE_CONTENT
        }
      });
    }

    return NextResponse.json({
      success: true,
      page: {
        ...data,
        seo: { ...DEFAULT_LANDING_PAGE_SEO, ...(data.seo || {}) },
        content: { ...DEFAULT_LANDING_PAGE_CONTENT, ...(data.content || {}) }
      }
    });
  } catch (err) {
    console.error("GET /api/landing-pages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id] - Update landing page
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug: rawSlug, status, is_default, seo, content } = body;

    const supabase = getSupabaseAdmin();

    let updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title.trim();
    if (status !== undefined) updateData.status = status;
    if (is_default !== undefined) updateData.is_default = Boolean(is_default);
    if (seo !== undefined) updateData.seo = seo;
    if (content !== undefined) updateData.content = content;

    let finalSlug = rawSlug ? formatSlug(rawSlug) : undefined;
    if (finalSlug) {
      updateData.slug = finalSlug;
    }

    let targetId = null;

    if (isUuid(id)) {
      targetId = id;
    } else {
      // Try to find if a page with this slug exists
      const targetSlug = finalSlug || (id === "default-uk" ? "online-quran-classes-uk" : id);
      const { data: existingPage } = await supabase
        .from("landing_pages")
        .select("id")
        .eq("slug", targetSlug)
        .maybeSingle();

      if (existingPage?.id) {
        targetId = existingPage.id;
      }
    }

    if (targetId) {
      // Check slug collision if slug changed
      if (finalSlug) {
        const { data: collision } = await supabase
          .from("landing_pages")
          .select("id")
          .eq("slug", finalSlug)
          .neq("id", targetId)
          .maybeSingle();

        if (collision) {
          return NextResponse.json(
            { success: false, message: `The slug "${finalSlug}" is already in use by another page.` },
            { status: 400 }
          );
        }
      }

      const { data, error } = await supabase
        .from("landing_pages")
        .update(updateData)
        .eq("id", targetId)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, page: data });
    } else {
      // If record not in DB yet (e.g. first save of default page), insert it cleanly
      const slugToInsert = finalSlug || "online-quran-classes-uk";
      const { data, error } = await supabase
        .from("landing_pages")
        .insert({
          title: (title || "Online Quran Classes in UK").trim(),
          slug: slugToInsert,
          status: status || "published",
          is_default: Boolean(is_default),
          seo: seo || DEFAULT_LANDING_PAGE_SEO,
          content: content || DEFAULT_LANDING_PAGE_CONTENT,
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
    }
  } catch (err) {
    console.error("PUT /api/landing-pages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-pages/[id] - Delete landing page
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    let query = supabase.from("landing_pages").delete();
    if (isUuid(id)) {
      query = query.eq("id", id);
    } else {
      const targetSlug = id === "default-uk" ? "online-quran-classes-uk" : id;
      query = query.eq("slug", targetSlug);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/landing-pages/[id] error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete page" },
      { status: 500 }
    );
  }
}
