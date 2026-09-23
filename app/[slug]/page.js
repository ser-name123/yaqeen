import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_LANDING_PAGE_CONTENT, DEFAULT_LANDING_PAGE_SEO } from "@/lib/landing-page-defaults";
import LandingPageTemplate from "@/components/LandingPageTemplate";
import { notFound } from "next/navigation";

export const revalidate = 0; // Fresh fetch

const RESERVED_SLUGS = new Set([
  "about", "admin", "api", "blog", "book-free-trial", "careers", "contact",
  "courses", "faqs", "landing", "pricing", "privacy", "student-form",
  "teacher-application", "teachers", "terms", "testimonials", "favicon.ico"
]);

async function getLandingPageData(slug) {
  try {
    const cleanSlug = String(slug || "").toLowerCase().trim();
    if (RESERVED_SLUGS.has(cleanSlug)) {
      return null;
    }

    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (data) {
      // If page has useLandingPrefix enabled, it must only be accessed via /landing/[slug]
      if (Boolean(data.seo?.useLandingPrefix)) {
        return null;
      }

      return {
        ...data,
        seo: { ...DEFAULT_LANDING_PAGE_SEO, ...(data.seo || {}) },
        content: { ...DEFAULT_LANDING_PAGE_CONTENT, ...(data.content || {}) }
      };
    }
  } catch (e) {
    console.warn("Could not fetch landing page from DB:", e.message);
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getLandingPageData(slug);

  if (!page) {
    return {
      title: "Page Not Found | Yaqeen Institute",
      description: "The requested page could not be found."
    };
  }

  const seo = page.seo || DEFAULT_LANDING_PAGE_SEO;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

  return {
    title: seo.metaTitle || `${page.title} | Yaqeen Institute`,
    description: seo.metaDescription || "Join online Quran classes with certified teachers at Yaqeen Institute.",
    keywords: seo.keywords || "online quran classes, learn quran uk, tajweed, hifz",
    robots: seo.noindex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: `${siteUrl}/${page.slug}`
    },
    openGraph: {
      title: seo.metaTitle || page.title,
      description: seo.metaDescription || "Join online Quran classes with certified teachers at Yaqeen Institute.",
      url: `${siteUrl}/${page.slug}`,
      siteName: "Yaqeen Institute",
      images: [
        {
          url: seo.ogImage || "/images/hero_student_boy.jpg",
          width: 1200,
          height: 630,
          alt: page.title
        }
      ],
      type: "website"
    }
  };
}

export default async function RootLandingDynamicPage({ params }) {
  const { slug } = await params;
  const page = await getLandingPageData(slug);

  if (!page) {
    notFound();
  }

  return <LandingPageTemplate initialPage={page} />;
}
