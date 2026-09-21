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
    const { data } = await supabase.from("courses").select("id, title, short_description");
    const list = data || [];
    course = list.find((c) => String(c.id) === id) || list.find((c) => slugify(c.title) === id) || null;
  } catch {
    /* ignore */
  }
  const title = course ? `${course.title} — Yaqeen Institute` : "Course — Yaqeen Institute";
  const description = course?.short_description ||
    "Explore this online course with certified tutors, live interactive sessions, and flexible scheduling at Yaqeen Institute.";
  return {
    title,
    description,
    alternates: { canonical: `/courses/${id}` },
  };
}

export default function CourseDetailLayout({ children }) {
  return children;
}
