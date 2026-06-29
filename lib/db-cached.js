import { supabase } from "./supabase";
import { unstable_cache } from "next/cache";

export const getSEOSettings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("title, description, keywords, favicon_url")
        .eq("id", "global")
        .single();
      if (error) {
        // Fallback in case favicon_url column is missing in database table (old schema fallback)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("seo_settings")
          .select("title, description, keywords")
          .eq("id", "global")
          .single();
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      return data;
    } catch (err) {
      console.warn("Cached SEO settings fetch failed:", err);
      return null;
    }
  },
  ["seo-settings-global"],
  { revalidate: 60, tags: ["seo-settings"] }
);

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("logo_text, logo_url")
        .eq("id", "global")
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Cached Site settings fetch failed:", err);
      return null;
    }
  },
  ["site-settings-global"],
  { revalidate: 60, tags: ["site-settings"] }
);
