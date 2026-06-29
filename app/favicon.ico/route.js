import { getSEOSettings } from "@/lib/db-cached";
import { NextResponse } from "next/server";

// Cache this route handler at the Next.js level for 1 hour
export const revalidate = 3600;

export async function GET(request) {
  try {
    const data = await getSEOSettings();

    if (data && data.favicon_url) {
      // Return redirect response with Cache-Control headers to instruct the browser
      // and CDN to cache the redirection URL, avoiding future server calls.
      return new NextResponse(null, {
        status: 307,
        headers: {
          Location: data.favicon_url,
          "Cache-Control": "public, max-age=3600, s-maxage=86400"
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch dynamic favicon in route handler:", err);
  }

  // Fallback to the backup static icon in public/favicon_backup.ico
  const fallbackUrl = new URL("/favicon_backup.ico", request.url).toString();
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: fallbackUrl,
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
