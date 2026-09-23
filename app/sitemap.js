import { generateSitemapData } from "@/lib/sitemap-builder";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // revalidate every 1 hour

export default async function sitemap() {
  try {
    const { entries } = await generateSitemapData();
    
    return entries.map((entry) => ({
      url: entry.loc,
      lastModified: new Date(entry.lastmod),
      changeFrequency: entry.changefreq || "weekly",
      priority: parseFloat(entry.priority) || 0.7,
    }));
  } catch (error) {
    console.error("Error generating Next.js sitemap:", error);
    return [
      {
        url: "https://yaqeeninstitute.online",
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0,
      }
    ];
  }
}
