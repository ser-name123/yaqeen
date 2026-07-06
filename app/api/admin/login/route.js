import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail } from "@/lib/mailer";
import { adminOtpEmail } from "@/lib/email-templates";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch the admin account matching this email (supports multiple admin accounts)
    const { data: admins, error: fetchError } = await supabaseAdmin
      .from("admin_profile")
      .select("*")
      .ilike("email", email.trim());

    if (fetchError) {
      console.error("Error fetching admin profile:", fetchError);
      return NextResponse.json(
        {
          success: false,
          message: `Database connection failed: ${fetchError.message || JSON.stringify(fetchError)}. Please ensure the 'admin_profile' table is created using the SQL schema.`
        },
        { status: 500 }
      );
    }

    const admin = admins && admins.length ? admins[0] : null;

    // Verify credentials
    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save OTP to database
    const { error: updateError } = await supabaseAdmin
      .from("admin_profile")
      .update({
        otp_code: otp,
        otp_expires_at: expiresAt.toISOString()
      })
      .eq("id", admin.id);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to generate OTP in database." },
        { status: 500 }
      );
    }

    // Fetch site settings for email branding (logo, contact info)
    let settings = null;
    try {
      const { data } = await supabaseAdmin.from("site_settings").select("*").eq("id", "global").single();
      settings = data;
    } catch (e) {
      console.error("Login settings fetch error:", e);
    }

    // Send OTP email via Brevo SMTP (branded)
    const otpMail = adminOtpEmail({ otp, settings, siteUrl: SITE_URL });
    await sendMail({ to: admin.email, subject: otpMail.subject, html: otpMail.html, text: otpMail.text });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to admin email."
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
