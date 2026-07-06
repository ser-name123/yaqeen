import { supabase } from "@/lib/supabase";

// Set NEXT_PUBLIC_SITE_URL in your environment to your live domain.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.com").replace(/\/$/, "");

// Public, indexable routes (admin, thank-you and dynamic templates excluded)
const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/teachers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/testimonials", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faqs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/book-free-trial", priority: 0.8, changeFrequency: "monthly" },
  { path: "/teacher-application", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" }
];

export default async function sitemap() {
  const now = new Date();

  const entries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority
  }));

  // Dynamic pages — courses and blog posts (fail silently if the DB is unavailable)
  try {
    const [{ data: courses }, { data: blogs }] = await Promise.all([
      supabase.from("courses").select("id"),
      supabase.from("blogs").select("slug, created_at")
    ]);

    if (courses) {
      for (const c of courses) {
        entries.push({ url: `${SITE_URL}/courses/${c.id}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
      }
    }
    if (blogs) {
      for (const b of blogs) {
        entries.push({
          url: `${SITE_URL}/blog/${b.slug}`,
          lastModified: b.created_at ? new Date(b.created_at) : now,
          changeFrequency: "monthly",
          priority: 0.6
        });
      }
    }
  } catch (err) {
    console.warn("Sitemap: could not load dynamic routes:", err);
  }

  return entries;
}
