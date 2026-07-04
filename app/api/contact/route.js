import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      browser_info, 
      system_info, 
      ip_address, 
      city: clientCity, 
      state: clientState, 
      country: clientCountry 
    } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    let ip = ip_address;
    let city = clientCity;
    let state = clientState;
    let country = clientCountry;
    let provider = "Unknown";

    // If client-side failed to resolve IP or geo, extract IP server-side
    if (!ip || ip === "Unknown / Client-side only") {
      ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
      if (ip) {
        ip = ip.split(",")[0].trim();
      } else {
        ip = "127.0.0.1";
      }
    }

    // Clean up local IPv6 loopback
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    // Perform server-side geolocation lookup if city/state/country are unresolved
    if (!city || city === "Unknown" || !country || country === "Unknown") {
      try {
        const geoUrl = ip === "127.0.0.1" 
          ? "http://ip-api.com/json/" // Geocodes server's public IP when testing locally
          : `http://ip-api.com/json/${ip}`;
        
        const geoResponse = await fetch(geoUrl);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === "success") {
            city = geoData.city || "Unknown";
            state = geoData.regionName || "Unknown";
            country = geoData.country || "Unknown";
            provider = geoData.isp || "Unknown";
            // If local loopback geocoded host public IP, record the public IP for dashboard display clarity
            if (ip === "127.0.0.1" && geoData.query) {
              ip = geoData.query;
            }
          }
        }
      } catch (geoErr) {
        console.error("Server-side geolocation error:", geoErr);
      }
    } else {
      // If client resolved the geo, try a quick look up of ISP using the IP
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === "success") {
            provider = geoData.isp || "Unknown";
          }
        }
      } catch (e) {}
    }

    // Insert into Supabase
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("contacts")
      .insert([{
        name,
        email,
        subject,
        message,
        ip_address: ip,
        browser_info: browser_info || "Unknown Browser",
        system_info: system_info || "Unknown System",
        city: city || "Unknown",
        state: state || "Unknown",
        country: country || "Unknown",
        provider: provider || "Unknown"
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully." });
  } catch (err) {
    console.error("Server contact submission error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to submit inquiry." }, { status: 500 });
  }
}
