import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    // Fetch the admin record matching this email
    const { data: admins, error: fetchError } = await supabaseAdmin
      .from("admin_profile")
      .select("*")
      .ilike("email", email.trim());

    const admin = admins && admins.length ? admins[0] : null;

    if (fetchError || !admin) {
      return NextResponse.json(
        { success: false, message: "Admin record not found." },
        { status: 404 }
      );
    }

    // Check if OTP matches
    if (!admin.otp_code || admin.otp_code !== otp.trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 401 }
      );
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(admin.otp_expires_at);
    if (expiresAt < now) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please log in again to receive a new code." },
        { status: 401 }
      );
    }

    // Credentials & OTP verified! Create a session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours session lifetime

    // Update session in database and clear OTP fields
    const { error: updateError } = await supabaseAdmin
      .from("admin_profile")
      .update({
        session_token: sessionToken,
        session_expires_at: sessionExpiresAt.toISOString(),
        otp_code: null,
        otp_expires_at: null
      })
      .eq("id", admin.id);

    if (updateError) {
      console.error("Session update error:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to establish admin session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionToken,
      message: "Authentication successful."
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
