import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, getAdminRecipients } from "@/lib/mailer";
import { studentAppAdminEmail, studentAppUserEmail } from "@/lib/email-templates";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

const FIELDS = [
  "first_name", "last_name", "email", "age_group", "gender", "dial_code", "mobile", "country",
  "course", "hours_per_week", "pricing_plan", "monthly_price", "preferred_days", "preferred_date",
  "preferred_time"
];

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { success: false, message: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    // Whitelist columns
    const row = {};
    for (const key of FIELDS) {
      if (body[key] !== undefined) {
        row[key] = body[key];
      }
    }

    // Join days array to string if array
    if (Array.isArray(row.preferred_days)) {
      row.preferred_days = row.preferred_days.join(", ");
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("student_applications").insert([row]);

    if (error) {
      if (error.message && error.message.toLowerCase().includes("student_applications")) {
        return NextResponse.json(
          { success: false, message: "The student_applications table is not set up yet. Please run the SQL script in your Supabase dashboard." },
          { status: 500 }
        );
      }
      throw error;
    }

    // ---- Server-side IP + Geolocation Lookup ----
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    ip = ip ? ip.split(",")[0].trim() : "127.0.0.1";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    let city = "Unknown", state = "Unknown", country = row.country || "Unknown";
    try {
      const geoUrl = ip === "127.0.0.1" ? "http://ip-api.com/json/" : `http://ip-api.com/json/${ip}`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const g = await geoRes.json();
        if (g.status === "success") {
          city = g.city || city;
          state = g.regionName || state;
          if (!row.country) country = g.country || country;
        }
      }
    } catch (geoErr) {
      console.error("Student registration geo lookup error:", geoErr);
    }

    const meta = {
      ip,
      location: `${city}, ${state}, ${country}`.replace(/^Unknown,\s*Unknown,\s*/, "").replace(/^Unknown,\s*/, "")
    };

    // ---- Send Email Alerts via Brevo SMTP (Non-blocking) ----
    let settings = null;
    try {
      const { data } = await supabase.from("site_settings").select("*").eq("id", "global").single();
      settings = data;
    } catch (e) {
      console.error("Student-app settings fetch error:", e);
    }

    const adminRecipients = await getAdminRecipients(supabase);
    
    // 1. Send confirmation email to student
    try {
      const studentMailOptions = studentAppUserEmail({ form: row, settings, siteUrl: SITE_URL });
      await sendMail({
        to: row.email,
        subject: studentMailOptions.subject,
        html: studentMailOptions.html,
        text: studentMailOptions.text
      });
    } catch (studentMailErr) {
      console.error("Failed to send student confirmation email:", studentMailErr);
    }

    // 2. Send alert email to admins
    if (adminRecipients && adminRecipients.length > 0) {
      try {
        const adminMailOptions = studentAppAdminEmail({ form: row, settings, siteUrl: SITE_URL, meta });
        await sendMail({
          to: adminRecipients,
          subject: adminMailOptions.subject,
          html: adminMailOptions.html,
          text: adminMailOptions.text,
          replyTo: row.email
        });
      } catch (adminMailErr) {
        console.error("Failed to send admin notification email:", adminMailErr);
      }
    }

    return NextResponse.json({ success: true, message: "Student registration submitted successfully!" });
  } catch (error) {
    console.error("Student form submission handler error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
