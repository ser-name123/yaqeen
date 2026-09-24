import { NextResponse } from "next/server";
import { verifyAdminGeoAccess } from "@/lib/geo-guard";

export async function GET(request) {
  try {
    const geo = await verifyAdminGeoAccess(request);
    return NextResponse.json({
      success: true,
      allowed: geo.allowed,
      country: geo.country,
      ip: geo.ip
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      allowed: true, // Fail-open gracefully on unexpected network error or handle locally
      error: err.message
    });
  }
}
