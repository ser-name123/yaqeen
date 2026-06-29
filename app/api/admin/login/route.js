import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";

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
    
    // Fetch current admin profile
    const { data: admin, error: fetchError } = await supabaseAdmin
      .from("admin_profile")
      .select("*")
      .eq("id", "admin")
      .single();

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

    // Verify credentials
    if (admin.email.trim().toLowerCase() !== email.trim().toLowerCase() || admin.password !== password) {
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
      .eq("id", "admin");

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to generate OTP in database." },
        { status: 500 }
      );
    }

    // Send OTP email using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "objectsquarerajan@gmail.com",
        pass: "qfum qrps ncvl kymo"
      }
    });

    const mailOptions = {
      from: '"yaqeen" <objectsquarerajan@gmail.com>',
      to: admin.email, // Send OTP to the configured admin email
      subject: "Yaqeen Admin Verification Code",
      text: `Your Admin Verification Code is: ${otp}. This code is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #7c3aed; margin: 0; font-size: 24px;">yaqeen</h2>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Admin Portal Security</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-bottom: 20px;" />
          <p>Hello Admin,</p>
          <p>A login attempt was detected for the Yaqeen Admin Console. Please use the verification code below to authorize your session:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 30px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; color: #111827;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            This security code is only valid for <strong>5 minutes</strong>. If you did not initiate this login request, please update your admin password immediately to keep your console secure.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
            This is an automated security message from yaqeen.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

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
