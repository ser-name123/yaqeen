import { supabase } from "@/lib/supabase";

export const revalidate = 60;

// Per-blog metadata so every article gets an automatic canonical URL + SEO,
// with sensible fallbacks derived from the blog's own fields. Managed from the
// blog's SEO fields in admin; nothing has to be set by hand per post.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let blog = null;
  try {
    // select("*") so it keeps working even if some SEO columns are missing.
    const { data } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
    blog = data || null;
  } catch {
    /* ignore */
  }

  const title = (blog?.seo_title && blog.seo_title.trim())
    || (blog ? `${blog.title} — Yaqeen Institute` : "Blog — Yaqeen Institute");

  const stripHtml = (s) => (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const description = (blog?.seo_description && blog.seo_description.trim())
    || (blog?.body ? stripHtml(blog.body).slice(0, 160) : "")
    || "Read the latest articles on Quran, Arabic and Islamic learning at Yaqeen Institute.";

  const meta = {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: "article",
      images: blog?.featured_image ? [blog.featured_image] : undefined,
    },
  };
  if (blog?.seo_keywords && blog.seo_keywords.trim()) {
    meta.keywords = blog.seo_keywords.trim();
  }
  return meta;
}

export default function BlogDetailLayout({ children }) {
  return children;
}
