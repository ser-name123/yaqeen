import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminGeoAccess } from "@/lib/geo-guard";
import crypto from "crypto";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "842924769302-4tqdpi3jo87q7438ka4gi0md0urdirbd.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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";

export async function POST(request) {
  try {
    // 0. Geo-Fencing: Restrict Admin access to India only
    const geo = await verifyAdminGeoAccess(request);
    if (!geo.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Access Restricted: Admin console is only accessible within India. Your detected location: ${geo.country || "Non-India"}.`
        },
        { status: 403 }
      );
    }

    const { credential, code, redirectUri } = await request.json();

    let email = null;
    let name = null;
    let picture = null;

    if (credential) {
      // 1. Verify Google ID token via Google TokenInfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      const tokenInfo = await verifyRes.json();

      if (!verifyRes.ok || tokenInfo.error) {
        return NextResponse.json(
          { success: false, message: tokenInfo.error_description || "Invalid Google credential token." },
          { status: 401 }
        );
      }

      // Check audience (client ID)
      if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
        return NextResponse.json(
          { success: false, message: "Google token audience mismatch." },
          { status: 401 }
        );
      }

      if (!tokenInfo.email_verified && tokenInfo.email_verified !== "true") {
        return NextResponse.json(
          { success: false, message: "Google email address is not verified." },
          { status: 400 }
        );
      }

      email = tokenInfo.email;
      name = tokenInfo.name;
      picture = tokenInfo.picture;
    } else if (code) {
      // 2. Exchange OAuth authorization code for tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri || `${request.nextUrl.origin}/admin`,
          grant_type: "authorization_code"
        })
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || tokenData.error) {
        return NextResponse.json(
          { success: false, message: tokenData.error_description || "Failed to exchange Google OAuth code." },
          { status: 401 }
        );
      }

      // Fetch user profile info
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userRes.json();

      if (!userRes.ok || !userData.email) {
        return NextResponse.json(
          { success: false, message: "Failed to retrieve Google user profile." },
          { status: 401 }
        );
      }

      email = userData.email;
      name = userData.name;
      picture = userData.picture;
    } else {
      return NextResponse.json(
        { success: false, message: "Google credential or authorization code is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: "No email returned from Google SSO." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabaseAdmin = getSupabaseAdmin();

    // Query admin accounts in admin_profile table
    const { data: admins, error: fetchError } = await supabaseAdmin
      .from("admin_profile")
      .select("*")
      .ilike("email", cleanEmail);

    if (fetchError) {
      console.error("Database query error for admin profile:", fetchError);
      return NextResponse.json(
        { success: false, message: "Database connection failed while verifying admin account." },
        { status: 500 }
      );
    }

    const admin = admins && admins.length > 0 ? admins[0] : null;

    // Reject users that are NOT registered in admin_profile
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: `Access Denied: The Google account (${cleanEmail}) is not authorized as an admin. Only authorized administrators can log in.`
        },
        { status: 403 }
      );
    }

    // Check if account is suspended
    if (admin.status === "suspended") {
      return NextResponse.json(
        { success: false, message: "This admin account has been suspended. Please contact the administrator." },
        { status: 403 }
      );
    }

    // Generate secure 32-byte session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update session in database and clear any pending OTPs (No OTP required for Google SSO)
    const { error: updateError } = await supabaseAdmin
      .from("admin_profile")
      .update({
        session_token: sessionToken,
        session_expires_at: sessionExpiresAt.toISOString(),
        last_login_at: new Date().toISOString(),
        otp_code: null,
        otp_expires_at: null
      })
      .eq("id", admin.id);

    if (updateError) {
      console.error("Session update error on Google SSO:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to establish admin session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionToken,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name || name || "Admin",
        role: admin.role,
        permissions: admin.permissions
      },
      message: "Google SSO verification successful. Welcome back!"
    });
  } catch (error) {
    console.error("Google SSO API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred during Google SSO." },
      { status: 500 }
    );
  }
}
