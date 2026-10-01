import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_SITE_URL } from "@/lib/seo";

// Request-time so an uploaded custom robots.txt takes effect immediately.
export const dynamic = "force-dynamic";

async function getSettings() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data } = await supabaseAdmin
      .from("seo_settings")
      .select("custom_robots_txt, site_url")
      .eq("id", "global")
      .maybeSingle();
    return data || {};
  } catch {
    return {};
  }
}

export async function GET() {
  const settings = await getSettings();

  // 1) If an admin uploaded a custom robots.txt, serve ONLY that, verbatim.
  const custom = settings.custom_robots_txt;
  if (custom && custom.trim()) {
    return new Response(custom.trim() + "\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  // 2) Otherwise a sensible default that points crawlers at the sitemap.
  const base = (settings.site_url || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)
    .trim()
    .replace(/\/$/, "");
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
