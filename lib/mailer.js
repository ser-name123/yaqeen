import nodemailer from "nodemailer";

// Cached transporter (reused across warm serverless invocations)
let cachedTransporter = null;

export function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  return cachedTransporter;
}

/**
 * Collect every admin recipient email so notifications reach ALL admin accounts.
 * Sources: all rows in `admin_profile` + the `site_settings.contact_email`.
 * De-duplicated case-insensitively, original casing preserved.
 */
export async function getAdminRecipients(supabase) {
  const seen = new Set();
  const out = [];
  const add = (raw) => {
    const v = (raw || "").trim();
    if (!v) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(v);
  };

  try {
    const { data: admins } = await supabase.from("admin_profile").select("email");
    if (admins) admins.forEach((a) => add(a.email));
  } catch (e) {
    console.error("getAdminRecipients: admin_profile error:", e && e.message ? e.message : e);
  }

  try {
    const { data: settings } = await supabase.from("site_settings").select("contact_email").eq("id", "global").single();
    if (settings) add(settings.contact_email);
  } catch (e) {
    console.error("getAdminRecipients: site_settings error:", e && e.message ? e.message : e);
  }

  if (out.length === 0) add(process.env.MAIL_FROM_EMAIL || "support@yaqeeninstitute.online");
  return out;
}

/**
 * Send an email via Brevo SMTP.
 * The `from` address MUST be a Brevo-verified sender (support@yaqeeninstitute.online).
 */
export async function sendMail({ to, subject, html, text, replyTo, cc, bcc }) {
  const fromName = process.env.MAIL_FROM_NAME || "Yaqeen Institute";
  const fromEmail = process.env.MAIL_FROM_EMAIL || "support@yaqeeninstitute.online";

  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
    replyTo,
    cc,
    bcc,
  });
}
