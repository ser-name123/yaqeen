import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, getAdminRecipients } from "@/lib/mailer";
import { freeTrialUserEmail, freeTrialAdminEmail } from "@/lib/email-templates";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

export async function POST(request) {
  try {
    const form = await request.json();

    const firstName = (form.firstName || "").trim();
    const lastName = (form.lastName || "").trim();
    const email = (form.email || "").trim();

    if (!firstName || !lastName || !email || !form.learn) {
      return NextResponse.json({ success: false, message: "Missing required booking fields." }, { status: 400 });
    }

    const name = `${firstName} ${lastName}`.trim();
    const time = [form.hh, form.mm].filter(Boolean).join(":") + (form.ap ? ` ${form.ap}` : "");

    // ---- Server-side IP + geolocation (for the admin record) ----
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    ip = ip ? ip.split(",")[0].trim() : "127.0.0.1";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    let city = "Unknown", state = "Unknown", country = form.country || "Unknown", provider = "Unknown";
    try {
      const geoUrl = ip === "127.0.0.1" ? "http://ip-api.com/json/" : `http://ip-api.com/json/${ip}`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        const g = await geoRes.json();
        if (g.status === "success") {
          city = g.city || city;
          state = g.regionName || state;
          if (!form.country) country = g.country || country;
          provider = g.isp || provider;
          if (ip === "127.0.0.1" && g.query) ip = g.query;
        }
      }
    } catch (geoErr) {
      console.error("Free-trial geo lookup error:", geoErr);
    }

    // ---- Message blob (kept identical to the admin detail view format) ----
    const message =
      `New Free Trial Booking\n` +
      `-----------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${form.dialCode || ""} ${form.phone || ""}\n` +
      `Country: ${form.country || ""}\n` +
      `Interested In: ${form.learn || ""}\n` +
      `Session For: ${form.sessionFor || ""}\n` +
      `Preferred Teacher: ${form.teacher || ""}\n` +
      `How they found us: ${form.source || "Not specified"}\n` +
      `Preferred Date: ${form.date || ""}\n` +
      `Preferred Time: ${time}`;

    const subject = `Free Trial Booking — ${form.learn || "General"}`;

    // ---- Save into Supabase (so it appears under admin → Free Trial Bookings) ----
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase.from("contacts").insert([{
      name,
      email,
      subject,
      message,
      ip_address: ip,
      browser_info: form.browser_info || "Unknown Browser",
      system_info: form.system_info || "Unknown System",
      city,
      state,
      country,
      provider,
    }]);

    if (insertError) throw insertError;

    // ---- Fetch site settings (admin recipient + branding) ----
    let settings = null;
    try {
      const { data } = await supabase.from("site_settings").select("*").eq("id", "global").single();
      settings = data;
    } catch (e) {
      console.error("Free-trial settings fetch error:", e);
    }

    const adminRecipients = await getAdminRecipients(supabase);
    const location = [city, state, country].filter((v) => v && v !== "Unknown").join(", ");

    // ---- Send emails (failures are logged but do not fail the booking) ----
    const emailStatus = { user: false, admin: false };

    try {
      const userMail = freeTrialUserEmail({ form, settings, siteUrl: SITE_URL });
      await sendMail({ to: email, subject: userMail.subject, html: userMail.html, text: userMail.text });
      emailStatus.user = true;
    } catch (e) {
      console.error("Free-trial USER email failed:", e && e.message ? e.message : e);
    }

    try {
      const adminMail = freeTrialAdminEmail({ form, settings, siteUrl: SITE_URL, meta: { ip, location } });
      await sendMail({ to: adminRecipients, subject: adminMail.subject, html: adminMail.html, text: adminMail.text, replyTo: adminMail.replyTo });
      emailStatus.admin = true;
    } catch (e) {
      console.error("Free-trial ADMIN email failed:", e && e.message ? e.message : e);
    }

    return NextResponse.json({ success: true, message: "Booking submitted successfully.", emailStatus });
  } catch (err) {
    console.error("Free-trial submission error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to submit booking." }, { status: 500 });
  }
}
