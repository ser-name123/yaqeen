import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { SettingsProvider } from "@/lib/settings-context";
import { getSEOSettings, getSiteSettings } from "@/lib/db-cached";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Enable Incremental Static Regeneration (ISR) - revalidate cache every 60 seconds
export const revalidate = 60;

export async function generateMetadata() {
  try {
    const data = await getSEOSettings();

    if (data) {
      const fav = data.favicon_url || "/favicon.ico";
      return {
        title: data.title || "Aero - Next-Gen Web Experience",
        description: data.description || "Create premium high-performance web applications.",
        keywords: data.keywords || "",
        icons: {
          icon: fav,
          shortcut: fav,
          apple: fav
        }
      };
    }
  } catch (err) {
    console.warn("Dynamic metadata fetch failed, using fallback:", err);
  }

  // Final fallback metadata
  return {
    title: "Aero - Next-Gen Web Experience",
    description: "Create premium high-performance web applications with stunning visual aesthetics and sleek interactions.",
    icons: {
      icon: "/favicon.ico"
    }
  };
}

export default async function RootLayout({ children }) {
  let logoText = "yaqeen";
  let logoUrl = "";
  let faviconUrl = "";

  let contactEmail = "info@yaqeeninstitute.com";
  let contactPhone = "+447488818192";
  let contactHours = "24x7 - We're always here for you.";
  let contactSupport = "We serve students from around the world.";
  let socialFacebook = "";
  let socialInstagram = "";
  let socialYoutube = "";
  let socialWhatsapp = "";

  try {
    // Run DB queries in parallel using cached results (revalidate: 60s)
    const [siteData, seoData] = await Promise.all([
      getSiteSettings(),
      getSEOSettings()
    ]);

    if (siteData) {
      logoText = siteData.logo_text || "yaqeen";
      logoUrl = siteData.logo_url || "";
      contactEmail = siteData.contact_email || contactEmail;
      contactPhone = siteData.contact_phone || contactPhone;
      contactHours = siteData.contact_hours || contactHours;
      contactSupport = siteData.contact_support || contactSupport;
      socialFacebook = siteData.social_facebook || "";
      socialInstagram = siteData.social_instagram || "";
      socialYoutube = siteData.social_youtube || "";
      socialWhatsapp = siteData.social_whatsapp || "";
    }

    if (seoData && seoData.favicon_url) {
      faviconUrl = seoData.favicon_url;
    }
  } catch (err) {
    console.warn("Could not load site logo or favicon in layout:", err);
  }

  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SettingsProvider 
          logoText={logoText} 
          logoUrl={logoUrl} 
          faviconUrl={faviconUrl}
          contactEmail={contactEmail}
          contactPhone={contactPhone}
          contactHours={contactHours}
          contactSupport={contactSupport}
          socialFacebook={socialFacebook}
          socialInstagram={socialInstagram}
          socialYoutube={socialYoutube}
          socialWhatsapp={socialWhatsapp}
        >
          <LayoutWrapper logoText={logoText} logoUrl={logoUrl} faviconUrl={faviconUrl}>
            {children}
          </LayoutWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
