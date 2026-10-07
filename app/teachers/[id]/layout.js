import { supabase } from "@/lib/supabase";

export const revalidate = 60;

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

// Per-teacher metadata (SEO title / description / keywords managed from admin),
// with sensible fallbacks derived from the teacher's own database fields.
export async function generateMetadata({ params }) {
  const { id } = await params;
  let teacher = null;
  try {
    // select("*") so it still works before the seo_* columns are added.
    const { data } = await supabase.from("teachers").select("*");
    const list = data || [];
    teacher = list.find((t) => String(t.id) === id)
      || list.find((t) => t.slug === id)
      || list.find((t) => slugify(t.name) === id)
      || null;
  } catch {
    /* ignore */
  }

  const title = (teacher?.seo_title && teacher.seo_title.trim())
    || (teacher ? `${teacher.name}${teacher.title ? " — " + teacher.title : ""} | Yaqeen Institute` : "Teacher — Yaqeen Institute");

  const description = (teacher?.seo_description && teacher.seo_description.trim())
    || (teacher?.short_bio && teacher.short_bio.trim())
    || (teacher
      ? `Learn with ${teacher.name}, an experienced online Quran & Arabic teacher at Yaqeen Institute${teacher.specialization ? " specialising in " + teacher.specialization : ""}.`
      : "Meet our certified online Quran and Arabic teachers at Yaqeen Institute.");

  // Canonicalise to the teacher's managed slug (falls back to name slug, then the raw param).
  const canonicalId = (teacher?.slug && teacher.slug.trim()) || (teacher ? slugify(teacher.name) : "") || id;
  const meta = {
    title,
    description,
    alternates: { canonical: `/teachers/${canonicalId}` },
  };
  if (teacher?.seo_keywords && teacher.seo_keywords.trim()) {
    meta.keywords = teacher.seo_keywords.trim();
  }
  return meta;
}

export default function TeacherDetailLayout({ children }) {
  return children;
}
