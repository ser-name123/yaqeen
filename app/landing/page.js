import { getSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_LANDING_PAGE_CONTENT, DEFAULT_LANDING_PAGE_SEO } from "@/lib/landing-page-defaults";
import LandingPageTemplate from "@/components/LandingPageTemplate";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function getLandingPageData() {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("slug", "landing")
      .maybeSingle();

    if (data) {
      return {
        ...data,
        seo: { ...DEFAULT_LANDING_PAGE_SEO, ...(data.seo || {}) },
        content: { ...DEFAULT_LANDING_PAGE_CONTENT, ...(data.content || {}) }
      };
    }
  } catch (e) {
    console.warn("Could not fetch /landing page from DB:", e.message);
  }

  return null;
}

export async function generateMetadata() {
  const page = await getLandingPageData();
  if (!page) {
    return {
      title: "Page Not Found | Yaqeen Institute",
      description: "The requested landing page could not be found."
    };
  }

  const seo = page.seo || DEFAULT_LANDING_PAGE_SEO;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

  return {
    title: seo.metaTitle || page.title,
    description: seo.metaDescription,
    keywords: seo.keywords,
    robots: {
      index: !seo.noindex,
      follow: !seo.noindex
    },
    openGraph: {
      title: seo.metaTitle || page.title,
      description: seo.metaDescription,
      url: `${siteUrl}/landing`,
      images: [
        {
          url: seo.ogImage ? (seo.ogImage.startsWith("http") ? seo.ogImage : `${siteUrl}${seo.ogImage}`) : `${siteUrl}/images/hero_student_boy.jpg`,
          width: 1200,
          height: 630,
          alt: page.title
        }
      ],
      type: "website"
    },
    alternates: {
      canonical: `${siteUrl}/landing`
    }
  };
}

export default async function LandingPage() {
  const page = await getLandingPageData();
  if (!page) {
    notFound();
  }
  return <LandingPageTemplate initialPage={page} />;
}

