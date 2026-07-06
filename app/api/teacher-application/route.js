import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, getAdminRecipients } from "@/lib/mailer";
import { teacherAppAdminEmail, teacherAppUserEmail } from "@/lib/email-templates";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

const FIELDS = [
  "first_name", "last_name", "gender", "email", "dial_code", "mobile", "country",
  "date_of_birth", "nationality", "occupation", "marital_status", "about_me", "facebook", "profile_image_url",
  "education", "years_experience", "mother_language", "other_language", "cv_url",
  "reading_audio_url", "recitation_audio_url",
  "applying_for", "has_ijazah", "teach_tajweed_english", "has_children",
  "preferred_interview_time", "expected_salary", "hours_per_week", "employment_type",
  "ideal_candidate", "how_found", "declaration"
];

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json(
        { success: false, message: "First name, last name and email are required." },
        { status: 400 }
      );
    }

    // Whitelist only known columns
    const row = {};
    for (const key of FIELDS) {
      if (body[key] !== undefined) row[key] = body[key];
    }
    row.declaration = !!body.declaration;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("teacher_applications").insert([row]);

    if (error) {
      // Friendly message when the table has not been created yet
      if (error.message && error.message.toLowerCase().includes("teacher_applications")) {
        return NextResponse.json(
          { success: false, message: "The teacher_applications table is not set up yet. Please run the provided SQL in Supabase." },
          { status: 500 }
        );
      }
      throw error;
    }

    // ---- Send notification + acknowledgment emails via Brevo (non-blocking) ----
    let settings = null;
    try {
      const { data } = await supabase.from("site_settings").select("*").eq("id", "global").single();
      settings = data;
    } catch (e) {
      console.error("Teacher-app settings fetch error:", e);
    }

    const adminRecipients = await getAdminRecipients(supabase);

    try {
      const adminMail = teacherAppAdminEmail({ data: row, settings, siteUrl: SITE_URL });
      await sendMail({ to: adminRecipients, subject: adminMail.subject, html: adminMail.html, text: adminMail.text, replyTo: adminMail.replyTo });
    } catch (e) {
      console.error("Teacher-app ADMIN email failed:", e && e.message ? e.message : e);
    }

    if (row.email) {
      try {
        const userMail = teacherAppUserEmail({ data: row, settings, siteUrl: SITE_URL });
        await sendMail({ to: row.email, subject: userMail.subject, html: userMail.html, text: userMail.text });
      } catch (e) {
        console.error("Teacher-app USER email failed:", e && e.message ? e.message : e);
      }
    }

    return NextResponse.json({ success: true, message: "Application submitted successfully." });
  } catch (err) {
    console.error("Teacher application submission error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to submit application." },
      { status: 500 }
    );
  }
}
