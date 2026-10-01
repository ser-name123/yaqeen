import { getSupabaseAdmin } from "@/lib/supabase";
import { generateSitemapData } from "@/lib/sitemap-builder";

// Always evaluated at request time so an uploaded custom sitemap takes effect
// immediately and the generated one stays fresh.
export const dynamic = "force-dynamic";

async function getCustomSitemap() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("seo_settings")
      .select("custom_sitemap_xml")
      .eq("id", "global")
      .maybeSingle();
    const xml = data?.custom_sitemap_xml;
    return xml && xml.trim() ? xml.trim() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // 1) If an admin uploaded a custom sitemap, serve ONLY that, verbatim.
  const custom = await getCustomSitemap();
  if (custom) {
    return new Response(custom, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  // 2) Otherwise fall back to the auto-generated sitemap.
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  try {
    const data = await generateSitemapData();
    xml = data.xml;
  } catch (err) {
    console.error("sitemap.xml generation failed:", err);
  }
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
