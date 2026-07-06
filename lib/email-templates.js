/* ==========================================================================
   Branded HTML email templates (Yaqeen Institute)
   Brand: gold #C99B4D · olive green #556B3B · cream #FBF8F3
   All CSS is inlined for email-client compatibility.
   ========================================================================== */

const BRAND = {
  gold: "#C99B4D",
  green: "#556B3B",
  greenDark: "#45592f",
  cream: "#FBF8F3",
  ink: "#2B1F14",
  muted: "#5C4D3C",
  border: "#EFE7DA",
};

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Header — logo image if an absolute URL is configured, else styled brand text
function headerHtml(settings, siteUrl) {
  const logo = settings && settings.logo_url;
  const isAbsolute = typeof logo === "string" && /^https?:\/\//i.test(logo);
  const inner = isAbsolute
    ? `<img src="${escapeHtml(logo)}" alt="Yaqeen Institute" height="46" style="height:46px;width:auto;display:block;margin:0 auto;" />`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:800;letter-spacing:1px;color:#ffffff;">YAQEEN INSTITUTE</span>`;
  return `
    <tr>
      <td style="background:linear-gradient(135deg,${BRAND.green} 0%,${BRAND.greenDark} 100%);padding:26px 30px;text-align:center;">
        <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">${inner}</a>
        <div style="height:3px;width:60px;background:${BRAND.gold};margin:14px auto 0 auto;border-radius:99px;"></div>
      </td>
    </tr>`;
}

function footerHtml(settings, siteUrl) {
  const email = escapeHtml((settings && settings.contact_email) || "support@yaqeeninstitute.online");
  const phone = escapeHtml((settings && settings.contact_phone) || "");
  const site = escapeHtml(siteUrl || "https://yaqeeninstitute.online");
  const siteLabel = site.replace(/^https?:\/\//, "");

  const socials = [];
  if (settings && settings.social_facebook) socials.push(`<a href="${escapeHtml(settings.social_facebook)}" style="color:${BRAND.green};text-decoration:none;">Facebook</a>`);
  if (settings && settings.social_instagram) socials.push(`<a href="${escapeHtml(settings.social_instagram)}" style="color:${BRAND.green};text-decoration:none;">Instagram</a>`);
  if (settings && settings.social_youtube) socials.push(`<a href="${escapeHtml(settings.social_youtube)}" style="color:${BRAND.green};text-decoration:none;">YouTube</a>`);
  if (settings && settings.social_whatsapp) socials.push(`<a href="${escapeHtml(settings.social_whatsapp)}" style="color:${BRAND.green};text-decoration:none;">WhatsApp</a>`);

  return `
    <tr>
      <td style="background:#F5EFE6;padding:26px 30px;text-align:center;border-top:1px solid ${BRAND.border};">
        <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:16px;font-weight:700;color:${BRAND.green};">Yaqeen Institute</p>
        <p style="margin:0 0 4px 0;font-size:13px;color:${BRAND.muted};">
          ✉️ <a href="mailto:${email}" style="color:${BRAND.muted};text-decoration:none;">${email}</a>
          ${phone ? `&nbsp;&nbsp;·&nbsp;&nbsp; 📞 <a href="tel:${phone.replace(/[^\d+]/g, "")}" style="color:${BRAND.muted};text-decoration:none;">${phone}</a>` : ""}
        </p>
        <p style="margin:0 0 10px 0;font-size:13px;color:${BRAND.muted};">
          🌐 <a href="${site}" style="color:${BRAND.green};text-decoration:none;font-weight:600;">${siteLabel}</a>
        </p>
        ${socials.length ? `<p style="margin:0 0 10px 0;font-size:13px;">${socials.join(" &nbsp;·&nbsp; ")}</p>` : ""}
        <p style="margin:12px 0 0 0;font-size:11px;color:#A69A86;">© ${new Date().getFullYear()} Yaqeen Institute. All rights reserved.</p>
      </td>
    </tr>`;
}

// Full HTML document shell
function shell({ preheader, contentHtml, settings, siteUrl }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>Yaqeen Institute</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.ink};">
<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader || "")}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.cream};padding:28px 14px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 30px rgba(44,37,30,0.08);border:1px solid ${BRAND.border};">
        ${headerHtml(settings, siteUrl)}
        <tr><td style="padding:34px 34px 26px 34px;">${contentHtml}</td></tr>
        ${footerHtml(settings, siteUrl)}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// A tidy label/value details table
function detailsTable(rows) {
  const body = rows
    .filter((r) => r && r[1] != null && String(r[1]).trim() !== "")
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:9px 14px;font-size:13px;color:${BRAND.muted};font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid ${BRAND.border};width:42%;">${escapeHtml(label)}</td>
        <td style="padding:9px 14px;font-size:13px;color:${BRAND.ink};font-weight:500;border-bottom:1px solid ${BRAND.border};">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">${body}</table>`;
}

function ctaButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 6px 0;"><tr><td style="border-radius:99px;background:${BRAND.green};">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 30px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:99px;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

function nl2br(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

/* -------------------- Admin login: OTP verification code ------------------ */
export function adminOtpEmail({ otp, settings, siteUrl }) {
  const content = `
    <div style="text-align:center;">
      <div style="display:inline-block;background:rgba(85,107,59,0.12);color:${BRAND.green};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:99px;">Admin Portal Security</div>
    </div>
    <h1 style="margin:16px 0 6px 0;font-family:Georgia,serif;font-size:22px;font-weight:800;color:${BRAND.ink};text-align:center;">Your Verification Code</h1>
    <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:${BRAND.muted};text-align:center;">
      A login attempt was detected for the Yaqeen Institute admin console. Use the code below to authorize your session.
    </p>
    <div style="font-size:34px;font-weight:800;letter-spacing:10px;text-align:center;margin:26px auto;padding:18px 10px;max-width:320px;background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:12px;color:${BRAND.green};">${escapeHtml(otp)}</div>
    <p style="margin:0;font-size:13px;line-height:1.6;color:${BRAND.muted};text-align:center;">
      This code is valid for <b style="color:${BRAND.ink};">5 minutes</b>. If you did not request this, please change your admin password immediately.
    </p>`;
  return {
    subject: "Your Admin Verification Code — Yaqeen Institute",
    html: shell({ preheader: `Your admin verification code is ${otp} (valid 5 minutes).`, contentHtml: content, settings, siteUrl }),
    text: `Your Yaqeen Institute admin verification code is: ${otp}\nThis code is valid for 5 minutes. If you did not request this, change your password immediately.`,
  };
}

/* -------------------- Contact form: notification to ADMIN ----------------- */
export function contactAdminEmail({ data, settings, siteUrl, meta }) {
  const content = `
    <div style="display:inline-block;background:rgba(201,155,77,0.14);color:#A97B2E;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:99px;">New Website Inquiry</div>
    <h1 style="margin:14px 0 6px 0;font-family:Georgia,serif;font-size:22px;font-weight:800;color:${BRAND.ink};">${escapeHtml(data.subject || "New Inquiry")}</h1>
    <p style="margin:0 0 18px 0;font-size:14px;color:${BRAND.muted};">A new message was submitted through the website contact form.</p>
    ${detailsTable([
      ["Name", data.name],
      ["Email", data.email],
      ["Subject", data.subject],
      ["Location", meta && meta.location],
      ["IP Address", meta && meta.ip],
    ])}
    <p style="margin:18px 0 6px 0;font-size:13px;font-weight:700;color:${BRAND.ink};">Message</p>
    <div style="background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.65;color:${BRAND.muted};">${nl2br(data.message)}</div>
    <p style="margin:18px 0 0 0;font-size:13px;color:${BRAND.muted};">Reply directly to this email to respond to the sender.</p>`;
  return {
    subject: `New Inquiry — ${data.subject || data.name || "Website"}`,
    html: shell({ preheader: `${data.name} sent a message via the contact form.`, contentHtml: content, settings, siteUrl }),
    text: `New Website Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
    replyTo: data.email,
  };
}

/* -------------------- Contact form: acknowledgment to USER ---------------- */
export function contactUserEmail({ data, settings, siteUrl }) {
  const first = (data.name || "").trim().split(/\s+/)[0] || "there";
  const content = `
    <h1 style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:23px;font-weight:800;color:${BRAND.green};">Thank you, ${escapeHtml(first)}! 🤍</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      We&rsquo;ve received your message and our team will get back to you as soon as possible — usually within 24 hours.
    </p>
    <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;color:${BRAND.ink};">Your message</p>
    <div style="background:${BRAND.cream};border:1px solid ${BRAND.border};border-radius:12px;padding:14px 16px;font-size:14px;line-height:1.65;color:${BRAND.muted};">${nl2br(data.message)}</div>
    ${ctaButton(siteUrl, "Visit Our Website")}
    <p style="margin:18px 0 0 0;font-size:14px;color:${BRAND.ink};">Warm regards,<br/><b>The Yaqeen Institute Team</b></p>`;
  return {
    subject: "We've received your message — Yaqeen Institute",
    html: shell({ preheader: "Thanks for contacting Yaqeen Institute. We'll reply within 24 hours.", contentHtml: content, settings, siteUrl }),
    text: `Thank you, ${first}!\n\nWe've received your message and will get back to you within 24 hours.\n\nYour message:\n${data.message}\n\nWarm regards,\nThe Yaqeen Institute Team`,
  };
}

/* -------------------- Teacher application: notification to ADMIN ---------- */
export function teacherAppAdminEmail({ data, settings, siteUrl }) {
  const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
  const phone = `${data.dial_code || ""} ${data.mobile || ""}`.trim();
  const content = `
    <div style="display:inline-block;background:rgba(85,107,59,0.12);color:${BRAND.green};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:99px;">New Teacher Application</div>
    <h1 style="margin:14px 0 6px 0;font-family:Georgia,serif;font-size:22px;font-weight:800;color:${BRAND.ink};">${escapeHtml(name || "New Applicant")}</h1>
    <p style="margin:0 0 18px 0;font-size:14px;color:${BRAND.muted};">A new teacher job application was submitted on the website.</p>
    ${detailsTable([
      ["Name", name],
      ["Email", data.email],
      ["Phone", phone],
      ["Gender", data.gender],
      ["Country", data.country],
      ["Applying For", data.applying_for],
      ["Experience", data.years_experience],
      ["Education", data.education],
      ["Mother Language", data.mother_language],
      ["Has Ijazah", data.has_ijazah],
      ["Employment Type", data.employment_type],
      ["Expected Salary", data.expected_salary],
      ["How they found us", data.how_found],
    ])}
    <p style="margin:18px 0 0 0;font-size:13px;color:${BRAND.muted};">
      View full application details in the
      <a href="${escapeHtml(siteUrl)}/admin" style="color:${BRAND.green};font-weight:600;text-decoration:none;">admin panel</a>.
    </p>`;
  return {
    subject: `New Teacher Application — ${name || data.email || "Website"}`,
    html: shell({ preheader: `${name} applied for ${data.applying_for || "a teaching role"}.`, contentHtml: content, settings, siteUrl }),
    text: `New Teacher Application\n\nName: ${name}\nEmail: ${data.email}\nPhone: ${phone}\nApplying For: ${data.applying_for}\nExperience: ${data.years_experience}\n\nView full details in the admin panel: ${siteUrl}/admin`,
    replyTo: data.email,
  };
}

/* -------------------- Teacher application: acknowledgment to USER --------- */
export function teacherAppUserEmail({ data, settings, siteUrl }) {
  const first = (data.first_name || "").trim() || "there";
  const content = `
    <h1 style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:23px;font-weight:800;color:${BRAND.green};">Assalamu Alaikum, ${escapeHtml(first)}! 🌙</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      Thank you for applying to join <b style="color:${BRAND.ink};">Yaqeen Institute</b> as a teacher${data.applying_for ? ` (<b style="color:${BRAND.ink};">${escapeHtml(data.applying_for)}</b>)` : ""}.
      We&rsquo;ve received your application and our team will carefully review it.
    </p>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      If your profile matches our requirements, we will contact you to schedule the next steps. This may take a few days, so we appreciate your patience.
    </p>
    ${ctaButton(siteUrl, "Visit Our Website")}
    <p style="margin:18px 0 0 0;font-size:14px;color:${BRAND.ink};">Warm regards,<br/><b>The Yaqeen Institute Team</b></p>`;
  return {
    subject: "We've received your application — Yaqeen Institute",
    html: shell({ preheader: "Thanks for applying to teach at Yaqeen Institute. Our team will review your application.", contentHtml: content, settings, siteUrl }),
    text: `Assalamu Alaikum, ${first}!\n\nThank you for applying to join Yaqeen Institute as a teacher. We've received your application and our team will review it. If your profile matches, we'll contact you for the next steps.\n\nWarm regards,\nThe Yaqeen Institute Team`,
  };
}

/* -------------------- Free Trial: email to the STUDENT -------------------- */
export function freeTrialUserEmail({ form, settings, siteUrl }) {
  const first = (form.firstName || "").trim() || "there";
  const time = [form.hh, form.mm].filter(Boolean).join(":") + (form.ap ? ` ${form.ap}` : "");

  const content = `
    <h1 style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:24px;font-weight:800;color:${BRAND.green};">Assalamu Alaikum, ${escapeHtml(first)}! 🌙</h1>
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      Thank you for booking your <b style="color:${BRAND.ink};">Free Trial Class</b> with Yaqeen Institute.
      We&rsquo;re delighted to begin this journey with you. Here is a summary of your request:
    </p>
    ${detailsTable([
      ["Interested In", form.learn],
      ["Session For", form.sessionFor],
      ["Preferred Teacher", form.teacher],
      ["Preferred Date", form.date],
      ["Preferred Time", time],
    ])}
    <p style="margin:22px 0 0 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      Our academic advisor will contact you within <b style="color:${BRAND.ink};">24 hours</b> to confirm your class
      timing and share the joining details. No payment or card is required for the trial.
    </p>
    ${ctaButton(siteUrl, "Visit Our Website")}
    <p style="margin:22px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
      If you have any questions, simply reply to this email — we&rsquo;re always happy to help.
    </p>
    <p style="margin:16px 0 0 0;font-size:14px;color:${BRAND.ink};">
      Warm regards,<br/><b>The Yaqeen Institute Team</b>
    </p>`;

  return {
    subject: "Your Free Trial Class is Booked — Yaqeen Institute",
    html: shell({ preheader: "We've received your free trial request. Our advisor will contact you within 24 hours.", contentHtml: content, settings, siteUrl }),
    text:
      `Assalamu Alaikum, ${first}!\n\n` +
      `Thank you for booking your Free Trial Class with Yaqeen Institute.\n\n` +
      `Summary:\n` +
      `- Interested In: ${form.learn}\n` +
      `- Session For: ${form.sessionFor}\n` +
      `- Preferred Teacher: ${form.teacher}\n` +
      `- Preferred Date: ${form.date}\n` +
      `- Preferred Time: ${time}\n\n` +
      `Our academic advisor will contact you within 24 hours to confirm your class.\n\n` +
      `Warm regards,\nThe Yaqeen Institute Team\n${siteUrl}`,
  };
}

/* -------------------- Free Trial: email to the ADMIN ---------------------- */
export function freeTrialAdminEmail({ form, settings, siteUrl, meta }) {
  const name = `${form.firstName || ""} ${form.lastName || ""}`.trim();
  const time = [form.hh, form.mm].filter(Boolean).join(":") + (form.ap ? ` ${form.ap}` : "");
  const phone = `${form.dialCode || ""} ${form.phone || ""}`.trim();

  const content = `
    <div style="display:inline-block;background:rgba(201,155,77,0.14);color:#A97B2E;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:99px;">New Free Trial Booking</div>
    <h1 style="margin:14px 0 6px 0;font-family:Georgia,serif;font-size:22px;font-weight:800;color:${BRAND.ink};">${escapeHtml(name || "New Booking")}</h1>
    <p style="margin:0 0 18px 0;font-size:14px;color:${BRAND.muted};">A new free trial class request was submitted on the website.</p>
    ${detailsTable([
      ["Name", name],
      ["Email", form.email],
      ["Phone", phone],
      ["Country", form.country],
      ["Interested In", form.learn],
      ["Session For", form.sessionFor],
      ["Preferred Teacher", form.teacher],
      ["How they found us", form.source || "Not specified"],
      ["Preferred Date", form.date],
      ["Preferred Time", time],
      ["Location", meta && meta.location],
      ["IP Address", meta && meta.ip],
    ])}
    <p style="margin:20px 0 0 0;font-size:13px;color:${BRAND.muted};">
      Reply directly to this email to reach the student, or manage this booking from the
      <a href="${escapeHtml(siteUrl)}/admin" style="color:${BRAND.green};font-weight:600;text-decoration:none;">admin panel</a>.
    </p>`;

  return {
    subject: `New Free Trial Booking — ${name || form.email || "Website"}`,
    html: shell({ preheader: `${name} booked a free trial (${form.learn || "General"}).`, contentHtml: content, settings, siteUrl }),
    text:
      `New Free Trial Booking\n-----------------------------\n` +
      `Name: ${name}\nEmail: ${form.email}\nPhone: ${phone}\nCountry: ${form.country}\n` +
      `Interested In: ${form.learn}\nSession For: ${form.sessionFor}\nPreferred Teacher: ${form.teacher}\n` +
      `How they found us: ${form.source || "Not specified"}\n` +
      `Preferred Date: ${form.date}\nPreferred Time: ${time}\n` +
      `${meta && meta.location ? `Location: ${meta.location}\n` : ""}${meta && meta.ip ? `IP: ${meta.ip}\n` : ""}`,
    replyTo: form.email,
  };
}
