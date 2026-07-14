import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    let ip = request.headers.get("cf-connecting-ip")?.trim() ||
             request.headers.get("x-real-ip")?.trim() ||
             request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    
    // Check if localhost or private IP, then resolve server's public outbound IP
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      const ipifyRes = await fetch("https://api.ipify.org?format=json").catch(() => null);
      if (ipifyRes && ipifyRes.ok) {
        const ipifyData = await ipifyRes.json();
        if (ipifyData && ipifyData.ip) {
          ip = ipifyData.ip;
        }
      }
    }

    if (!ip) {
      return NextResponse.json({ success: false, message: "IP could not be determined" });
    }

    // Lookup IP details from backend (immune to browser adblockers and CORS limitations)
    const geoRes = await fetch(`https://ipwho.is/${ip}`).catch(() => null);
    if (geoRes && geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData && geoData.success && geoData.country) {
        return NextResponse.json({
          success: true,
          country: geoData.country,
          dial_code: geoData.country_phone || "",
          city: geoData.city || ""
        });
      }
    }

    // Fallback resolver
    const geoRes2 = await fetch(`https://ipapi.co/${ip}/json/`).catch(() => null);
    if (geoRes2 && geoRes2.ok) {
      const geoData2 = await geoRes2.json();
      if (geoData2 && geoData2.country_name) {
        return NextResponse.json({
          success: true,
          country: geoData2.country_name,
          dial_code: geoData2.country_calling_code || "",
          city: geoData2.city || ""
        });
      }
    }

    return NextResponse.json({ success: false, message: "Geolocation services unavailable" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
