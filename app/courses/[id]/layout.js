import { supabase } from "@/lib/supabase";

export const revalidate = 60;

const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

// Per-course metadata so detail pages don't inherit the /courses canonical.
export async function generateMetadata({ params }) {
  const { id } = await params;
  let course = null;
  try {
    // select("*") so it still works if the seo_* columns are not added yet.
    const { data } = await supabase.from("courses").select("*");
    const list = data || [];
    course = list.find((c) => String(c.id) === id) || list.find((c) => slugify(c.title) === id) || null;
  } catch {
    /* ignore */
  }
  // Per-course SEO wins; otherwise fall back to the course title / short description.
  const title = (course?.seo_title && course.seo_title.trim())
    || (course ? `${course.title} — Yaqeen Institute` : "Course — Yaqeen Institute");
  const description = (course?.seo_description && course.seo_description.trim())
    || course?.short_description
    || "Explore this online course with certified tutors, live interactive sessions, and flexible scheduling at Yaqeen Institute.";
  const meta = {
    title,
    description,
    alternates: { canonical: `/courses/${id}` },
  };
  if (course?.seo_keywords && course.seo_keywords.trim()) {
    meta.keywords = course.seo_keywords.trim();
  }
  return meta;
}

export default function CourseDetailLayout({ children }) {
  return children;
}
