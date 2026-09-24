/**
 * Geo-Fencing Protection for Admin Console (Restricted to India only).
 */

const IS_GEO_RESTRICT_ENABLED = process.env.ADMIN_GEO_RESTRICT_INDIA !== "false";

/**
 * Checks if the incoming request originates from India or a local network.
 * @param {Request} request 
 * @returns {Promise<{ allowed: boolean, country: string, ip: string }>}
 */
export async function verifyAdminGeoAccess(request) {
  if (!IS_GEO_RESTRICT_ENABLED) {
    return { allowed: true, country: "India", ip: "127.0.0.1" };
  }

  // 1. Check Cloudflare / Vercel Edge Headers
  const cfCountry = request.headers.get("cf-ipcountry")?.trim().toUpperCase();
  const vercelCountry = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  const countryHeader = cfCountry || vercelCountry;

  // 2. Extract Client IP
  const ip = request.headers.get("cf-connecting-ip")?.trim() ||
             request.headers.get("x-real-ip")?.trim() ||
             request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

  // 3. Localhost and private intranet subnets are always allowed
  const isLocal = !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.");

  if (isLocal) {
    return { allowed: true, country: "Localhost / India", ip: ip || "127.0.0.1" };
  }

  // If edge header explicitly provided country
  if (countryHeader) {
    const isIndia = countryHeader === "IN" || countryHeader === "IND";
    return { allowed: isIndia, country: countryHeader, ip };
  }

  // 4. Fallback: Lookup IP geolocation
  try {
    const geoRes = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) }).catch(() => null);
    if (geoRes && geoRes.ok) {
      const data = await geoRes.json();
      if (data && data.success && data.country_code) {
        const code = String(data.country_code).trim().toUpperCase();
        const isIndia = code === "IN" || code === "IND";
        return { allowed: isIndia, country: data.country || code, ip };
      }
    }

    const geoRes2 = await fetch(`https://ipapi.co/${ip}/json/`, { signal: AbortSignal.timeout(3000) }).catch(() => null);
    if (geoRes2 && geoRes2.ok) {
      const data2 = await geoRes2.json();
      if (data2 && data2.country_code) {
        const code = String(data2.country_code).trim().toUpperCase();
        const isIndia = code === "IN" || code === "IND";
        return { allowed: isIndia, country: data2.country_name || code, ip };
      }
    }
  } catch (err) {
    console.warn("Admin geo-verification lookup failed:", err);
  }

  // Default to false for unknown remote non-India IPs when geo restriction is active
  return { allowed: false, country: "Unknown", ip };
}
