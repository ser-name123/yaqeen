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

function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr || dateStr === "TBD" || dateStr === "Either") return dateStr;
  
  // Match YYYY-MM-DD
  const matchYMD = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (matchYMD) {
    return `${matchYMD[3]}-${matchYMD[2]}-${matchYMD[1]}`;
  }

  // Match DD-MM-YYYY (if already formatted)
  const matchDMY = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (matchDMY) {
    return dateStr;
  }

  // Fallback try parsing as Date object
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  } catch (e) {
    // ignore
  }

  return dateStr;
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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Yaqeen Institute | New Teacher Application</title>
<style>
*{box-sizing:border-box;}
body{margin:0;background:#f5f5f5;font-family:Segoe UI,Arial,sans-serif;color:#352E2A}
.wrapper{padding:24px 10px;box-sizing:border-box;}
.container{max-width:620px;margin:auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{text-align:center;padding:26px 20px;border-bottom:3px solid #C99B4D}
.logo{width:220px;max-width:220px}
.content{padding:30px 34px}
.card{margin-top:20px;background:#fff;border:1px solid #E2D4B2;border-radius:12px;padding:20px}
table{width:100%;border-collapse:collapse}
td{padding:10px 0;border-bottom:1px solid #EEE4D0}
td:first-child{font-weight:600;width:45%}
.footer{text-align:center;padding:22px 20px;border-top:1px solid #E6D7B7;font-size:12px;line-height:1.7}
.footer a{color:#2B1F14;text-decoration:none}
</style>
</head>
<body>
<div class="wrapper">
<div class="container">
<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>
<div class="content">
<h1 style="font-size:22px;margin:0 0 16px;color:#2B1F14;font-weight:700;">New Teacher Application Received</h1>
<p><strong>Dear Admin Team,</strong></p>
<p>A new teacher has submitted a job application with the following details:</p>
<div class="card">
<h2>Teacher Application Details</h2>
<table>
<tr><td>First Name</td><td>${escapeHtml(data.first_name || "")}</td></tr>
<tr><td>Last Name</td><td>${escapeHtml(data.last_name || "")}</td></tr>
<tr><td>Gender</td><td>${escapeHtml(data.gender || "")}</td></tr>
<tr><td>Email</td><td>${escapeHtml(data.email || "")}</td></tr>
<tr><td>Contact No.</td><td>${escapeHtml(phone)}</td></tr>
<tr><td>Nationality</td><td>${escapeHtml(data.nationality || "")}</td></tr>
</table>
</div>
</div>
<div class="footer">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;">📩 <a href="mailto:support@yaqeeninstitute.online">support@yaqeeninstitute.online</a></span> | 
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;">📱 <a href="tel:+447488848483">+44 7488 848483</a></span> | 
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;">🌐 <a href="https://www.yaqeeninstitute.online">www.yaqeeninstitute.online</a></span><br>
📍 128, City Road, London, EC1V 2NX, United Kingdom<br>
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a> | <a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a><br>
© 2026 Yaqeen Institute. All Rights Reserved.
</div>
</div>
</div>
</body>
</html>`;

  return {
    subject: `New Teacher Application — ${name || data.email || "Website"}`,
    html,
    text: `New Teacher Application Received\n\nName: ${name}\nEmail: ${data.email}\nPhone: ${phone}\nNationality: ${data.nationality}\n\nView full details in the admin panel: ${siteUrl}/admin`,
    replyTo: data.email,
  };
}


export function teacherAppUserEmail({ data, settings, siteUrl }) {
  const first = (data.first_name || "").trim();
  const last = (data.last_name || "").trim();
  const name = last ? `${first} ${last}` : first || "Applicant";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yaqeen Institute | Application Received</title>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;color:#352E2A}
.wrapper{padding:24px 10px;box-sizing:border-box;}
.container{max-width:620px;margin:auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{text-align:center;padding:26px 20px;border-bottom:3px solid #C99B4D}
.logo{width:220px;max-width:220px;height:auto}
.content{padding:30px 34px}
h1{margin:0 0 18px;font-size:22px;color:#2B1F14}
p{margin:0 0 16px;font-size:15px;line-height:1.8}
.card{margin-top:22px;background:#fff;border:1px solid #E2D4B2;border-radius:12px;padding:20px}
.card h2{margin:0 0 14px;font-size:18px;color:#556B3B}
.step{background:#FBF8F3;border-left:4px solid #C99B4D;border-radius:8px;padding:12px 14px;margin:10px 0;font-size:14px;line-height:1.6}
.footer{text-align:center;padding:22px 20px;border-top:1px solid #E6D7B7}
.footer,.footer a{font-size:12px;line-height:1.7;color:#2B1F14;text-decoration:none}
.address{margin-top:8px;color:#666}
.links{margin-top:12px}
.copy{margin-top:12px;color:#999}
@media(max-width:640px){
.content{padding:22px 18px}
.logo{width:180px}
.contact a{display:block;margin:6px 0}
.sep{display:none}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="container">

<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>

<div class="content">
<h1>Application Received</h1>

<p><strong>Dear ${escapeHtml(name)},</strong></p>

<p>Thank you for applying to join <strong>Yaqeen Institute</strong>. We're delighted by your interest in becoming part of our growing team of passionate educators.</p>

<p>Your application has been successfully received, and our recruitment team is now reviewing your submission carefully.</p>

<div class="card">
<h2>What Happens Next</h2>

<div class="step">🔍 We'll review your qualifications, experience, and application details.</div>

<div class="step">📞 If your profile matches our current requirements, our recruitment team will contact you for the next stage.</div>

<div class="step">🕒 Please allow a few days for our team to complete the review process and respond.</div>

</div>

<p style="margin-top:24px;">We truly value your passion for education and look forward to the possibility of working together to inspire and educate learners around the world.</p>

<p style="margin-top:24px;">
Warm regards,<br>
<strong>Yaqeen Institute Recruitment Team</strong>
</p>

</div>

<div class="footer">
<div class="contact">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="mailto:support@yaqeeninstitute.online">📩 support@yaqeeninstitute.online</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="tel:+447488848483">📱 +44 7488 848483</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="https://www.yaqeeninstitute.online">🌐 www.yaqeeninstitute.online</a></span>
</div>

<div class="address">📍 128, City Road, London, EC1V 2NX, United Kingdom</div>

<div class="links">
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a> |
<a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a>
</div>

<div class="copy">© 2026 Yaqeen Institute. All Rights Reserved.</div>
</div>

</div>
</div>
</body>
</html>`;

  return {
    subject: "Assalamu Alaikum — Yaqeen Institute Application Received",
    html,
    text:
      `Assalamu Alaikum, ${name}!\n\n` +
      `Thank you for applying to join Yaqeen Institute as a teacher. We've received your application and our recruitment team will review it carefully. If your profile matches, we'll contact you for the next steps.\n\n` +
      `Warm regards,\nYaqeen Institute Recruitment Team`,
  };
}

/* -------------------- Free Trial: email to the STUDENT -------------------- */
export function freeTrialUserEmail({ form, settings, siteUrl }) {
  const first = (form.firstName || "").trim() || "there";
  const last = (form.lastName || "").trim();
  const fullName = last ? `${first} ${last}` : first;
  const time = [form.hh, form.mm].filter(Boolean).join(":") + (form.ap ? ` ${form.ap}` : "");
  const formattedDateTime = `Requested Date: ${escapeHtml(formatDateToDDMMYYYY(form.date) || "TBD")} &nbsp;&nbsp;·&nbsp;&nbsp; Time: ${escapeHtml(time || "TBD")}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yaqeen Institute | Trial Session Confirmation</title>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;}
.outer{padding:24px 8px;background:#fff;box-sizing:border-box;}
.container{max-width:620px;width:100%;margin:0 auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{padding:24px;text-align:center;border-bottom:3px solid #C99B4D;}
.logo{width:220px;max-width:220px;height:auto;}
.content{padding:28px 34px;color:#352E2A;line-height:1.65;font-size:15px;}
.card{background:#fff;border:1px solid #D8C7A3;border-radius:12px;padding:18px;margin-top:20px;}
.note{background:#F5EBDD;border-left:5px solid #C99B4D;padding:12px 16px;border-radius:0 8px 8px 0;font-weight:600;}
.item{padding:10px 14px;border-radius:8px;margin-top:10px;background:#FBF8F3;border-left:3px solid #556B3B;}
.footer{border-top:1px solid #E6D7B7;padding:22px 20px;text-align:center;}
.footer a{color:#2B1F14;text-decoration:none;font-weight:600;}
.links{margin-top:10px;font-size:13px;}
.copy{margin-top:10px;font-size:12px;color:#888;}
@media only screen and (max-width:640px){
.outer{padding:0}
.content{padding:22px 18px}
.logo{width:180px;max-width:180px}
.contact a{display:block;margin:6px 0}
.sep{display:none}
}
</style>
</head>
<body>
<div class="outer">
<div class="container">
<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>

<div class="content">
<h2>📚 Trial Session Confirmation</h2>
<p><strong>Dear ${escapeHtml(fullName)},</strong></p>
<p>Thank you for requesting a <strong style="color:#556B3B;">trial session</strong> with Yaqeen Institute.</p>

<div class="note">📅 ${formattedDateTime}</div>

<div class="card">
<h3 style="margin-top:0;color:#556B3B;">✨ What Happens Next</h3>

<div class="item">✅ Our team will connect with you to confirm all session details.</div>

<div class="item" style="background:#F5EBDD;border-left-color:#C99B4D;">
📱 Need help? Call or WhatsApp:
<a href="https://wa.me/447488848483">+44 7488 848483</a>
</div>

<div class="item" style="border-left-color:#A69A86;">
<strong>⏱️ Please allow up to 12 hours for a response.</strong>
</div>
</div>
</div>


<div class="footer">
<div class="contact" style="font-size:12px;line-height:1.6;color:#555;text-align:center;">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="mailto:support@yaqeeninstitute.online">📩 support@yaqeeninstitute.online</a></span>
<span class="sep" style="color:#C99B4D;"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="tel:+447488848483">📱 +44 7488 848483</a></span>
<span class="sep" style="color:#C99B4D;"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="https://www.yaqeeninstitute.online">🌐 www.yaqeeninstitute.online</a></span>
</div>

<div style="margin-top:8px;font-size:12px;color:#777;line-height:1.5;">
📍 128, City Road, London, EC1V 2NX, United Kingdom
</div>

<div class="links" style="margin-top:12px;font-size:12px;">
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a>
<span style="color:#C99B4D;"> | </span>
<a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a>
</div>

<div class="copy" style="margin-top:12px;font-size:11px;color:#999;">
© 2026 <strong>Yaqeen Institute</strong>. All Rights Reserved.
</div>
</div>

</div>
</div>
</body>
</html>`;

  return {
    subject: "Trial Session Confirmation — Yaqeen Institute",
    html,
    text:
      `Assalamu Alaikum, ${first}!\n\n` +
      `Thank you for requesting a trial session with Yaqeen Institute.\n\n` +
      `Requested Date & Time:\n` +
      `- Date: ${formatDateToDDMMYYYY(form.date) || "TBD"}\n` +
      `- Time: ${time || "TBD"}\n\n` +
      `What Happens Next:\n` +
      `- Our team will connect with you to confirm all session details.\n` +
      `- Need help? Call or WhatsApp: +44 7488 848483\n` +
      `- Please allow up to 12 hours for a response.\n\n` +
      `Warm regards,\nThe Yaqeen Institute Team\n${siteUrl}`,
  };
}

/* -------------------- Free Trial: email to the ADMIN ---------------------- */
export function freeTrialAdminEmail({ form, settings, siteUrl, meta }) {
  const name = `${form.firstName || ""} ${form.lastName || ""}`.trim();
  const time = [form.hh, form.mm].filter(Boolean).join(":") + (form.ap ? ` ${form.ap}` : "");
  const phone = `${form.dialCode || ""} ${form.phone || ""}`.trim();
  const cityStr = meta && meta.location ? meta.location.split(",")[0] : "TBD";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yaqeen Institute | New Trial Request</title>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:0;background:#f5f5f5;font-family:Segoe UI,Arial,sans-serif;color:#352E2A}
.wrapper{padding:24px 10px;box-sizing:border-box;}
.container{max-width:620px;margin:auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{text-align:center;padding:26px 20px;border-bottom:3px solid #C99B4D;}
.logo{width:220px;max-width:220px;height:auto;}
.content{padding:30px 34px;}
h1{margin:0 0 16px;font-size:28px;color:#2B1F14;}
p{margin:0 0 16px;font-size:15px;line-height:1.7;}
.card{margin-top:20px;background:#fff;border:1px solid #E2D4B2;border-radius:12px;padding:20px;}
.card h2{margin:0 0 16px;color:#556B3B;font-size:20px;}
table{width:100%;border-collapse:collapse;}
td{padding:10px 0;border-bottom:1px solid #EEE4D0;font-size:14px;vertical-align:top;}
td:first-child{font-weight:600;width:45%;}
.footer{padding:22px 20px;text-align:center;border-top:1px solid #E6D7B7;}
.contact,.address,.links,.copy{font-size:12px;line-height:1.7;}
.footer a{color:#2B1F14;text-decoration:none;}
.address{margin-top:8px;color:#666;}
.links{margin-top:12px;}
.copy{margin-top:12px;color:#999;}
@media only screen and (max-width:640px){
.content{padding:22px 18px}
.logo{width:180px}
.contact a{display:block;margin:6px 0}
.sep{display:none}
td{display:block;width:100%;padding:8px 0}
td:first-child{border-bottom:none;padding-bottom:2px}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="container">

<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>

<div class="content">
<h1>📥 New Trial Request from ${escapeHtml(form.country || "TBD")}</h1>
<p>A student has just submitted a trial session registration. Below are the registration details.</p>

<div class="card">
<h2>📋 Student Information</h2>
<table>
<tr><td>First Name</td><td>${escapeHtml(form.firstName || "")}</td></tr>
<tr><td>Last Name</td><td>${escapeHtml(form.lastName || "")}</td></tr>
<tr><td>Email</td><td>${escapeHtml(form.email || "")}</td></tr>
<tr><td>Mobile</td><td>${escapeHtml(phone)}</td></tr>
<tr><td>Country</td><td>${escapeHtml(form.country || "")}</td></tr>
<tr><td>City</td><td>${escapeHtml(cityStr)}</td></tr>
<tr><td>What would you like to learn?</td><td>${escapeHtml(form.learn || "General")}</td></tr>
<tr><td>How many students will join?</td><td>${escapeHtml(form.sessionFor || "Myself")}</td></tr>
<tr><td>Your Preferred Teacher</td><td>${escapeHtml(form.teacher || "Either")}</td></tr>
<tr><td>When do you want to start?</td><td>${escapeHtml(formatDateToDDMMYYYY(form.date) || "TBD")}</td></tr>
<tr><td>Preferred Time</td><td>${escapeHtml(time || "TBD")}</td></tr>
<tr><td>How did you hear about us?</td><td>${escapeHtml(form.source || "Not specified")}</td></tr>
</table>
</div>
</div>

<div class="footer">
<div class="contact">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="mailto:support@yaqeeninstitute.online">📩 support@yaqeeninstitute.online</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="tel:+447488848483">📱 +44 7488 848483</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="https://www.yaqeeninstitute.online">🌐 www.yaqeeninstitute.online</a></span>
</div>

<div class="address">📍 128, City Road, London, EC1V 2NX, United Kingdom</div>

<div class="links">
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a> |
<a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a>
</div>

<div class="copy">© 2026 Yaqeen Institute. All Rights Reserved.</div>
</div>

</div>
</div>
</body>
</html>`;

  return {
    subject: `New Free Trial Booking — ${name || form.email || "Website"}`,
    html,
    text:
      `New Free Trial Booking\n-----------------------------\n` +
      `Name: ${name}\nEmail: ${form.email}\nPhone: ${phone}\nCountry: ${form.country}\n` +
      `Interested In: ${form.learn}\nSession For: ${form.sessionFor}\nPreferred Teacher: ${form.teacher}\n` +
      `How they found us: ${form.source || "Not specified"}\n` +
      `Preferred Date: ${formatDateToDDMMYYYY(form.date)}\nPreferred Time: ${time}\n` +
      `${meta && meta.location ? `Location: ${meta.location}\n` : ""}${meta && meta.ip ? `IP: ${meta.ip}\n` : ""}`,
    replyTo: form.email,
  };
}

/* -------------------- Student Application: email to the USER ------------------ */
export function studentAppUserEmail({ form, settings, siteUrl }) {
  const first = (form.first_name || "").trim();
  const last = (form.last_name || "").trim();
  const name = last ? `${first} ${last}` : first || "Student";
  const daysString = Array.isArray(form.preferred_days) ? form.preferred_days.join(", ") : form.preferred_days || "Not specified";
  const monthlyClasses = form.hours_per_week ? Number(form.hours_per_week) * 4 : "TBD";
  const startDateTime = `${formatDateToDDMMYYYY(form.preferred_date) || "TBD"} · ${form.preferred_time || "TBD"}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yaqeen Institute | Welcome Email</title>
<style>
*{box-sizing:border-box;}
body{margin:0;background:#f6f6f6;font-family:Segoe UI,Arial,sans-serif;color:#352E2A}
.wrapper{padding:24px 10px;box-sizing:border-box;}
.container{max-width:620px;margin:0 auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{text-align:center;padding:26px 20px;border-bottom:3px solid #C99B4D}
.logo{width:220px;max-width:220px;height:auto}
.content{padding:32px}
h1{margin:0 0 20px;font-size:28px;color:#2B1F14}
p{font-size:15px;line-height:1.8;margin:0 0 16px}
.card{margin-top:24px;background:#fff;border:1px solid #E2D4B2;border-radius:12px;padding:20px}
.card h2{margin:0 0 16px;font-size:20px;color:#556B3B}
table{width:100%;border-collapse:collapse}
td{padding:11px 0;border-bottom:1px solid #EFE6D5;font-size:14px}
td:first-child{font-weight:600;width:48%}
.note{margin-top:22px;background:#F5EBDD;border-left:5px solid #C99B4D;padding:16px;border-radius:0 8px 8px 0}
.footer{text-align:center;padding:24px 20px;border-top:1px solid #E6D7B7}
.contact,.links,.copy,.addr{font-size:12px;line-height:1.7}
.contact a,.links a{color:#2B1F14;text-decoration:none}
.addr{color:#666;margin-top:8px}
.links{margin-top:12px}
.copy{margin-top:12px;color:#999}
@media(max-width:640px){
.content{padding:22px 18px}
.logo{width:180px}
.contact a{display:block;margin:5px 0}
.sep{display:none}
td{display:block;width:100%;padding:8px 0}
td:first-child{border-bottom:none;padding-bottom:2px}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="container">
<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>

<div class="content">
<h1>🎉 Welcome to Yaqeen Institute!</h1>

<p><strong>Dear ${escapeHtml(name)},</strong></p>

<p>Welcome! We're excited to have you with us.</p>

<p>Your classes will begin soon, and we're here to support you throughout your learning journey. We wish you every success!</p>

<div class="card">
<h2>📋 Student Registration Details</h2>
<table>
<tr><td>💼 Pricing Package</td><td>${escapeHtml(form.pricing_plan || "Not specified")}</td></tr>
<tr><td>🗓️ Number of Classes Monthly</td><td>${escapeHtml(String(monthlyClasses))}</td></tr>
<tr><td>📅 Preferred Days</td><td>${escapeHtml(daysString)}</td></tr>
<tr><td>⏰ Class Start Date &amp; Time</td><td>${escapeHtml(startDateTime)}</td></tr>
</table>
</div>

<div class="note">
<strong>👩🏫 What's Next?</strong><br><br>
Your assigned teacher will contact you soon with your first class details. If you need any help, please contact our support team.
</div>

<p style="margin-top:24px;">We pray that your learning journey is enjoyable, productive, and filled with success.</p>

<p style="margin-top:20px;">
Warm regards,<br>
<strong>Yaqeen Institute Team</strong>
</p>

</div>

<div class="footer">
<div class="contact">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="mailto:support@yaqeeninstitute.online">📩 support@yaqeeninstitute.online</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="tel:+447488848483">📱 +44 7488 848483</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="https://www.yaqeeninstitute.online">🌐 www.yaqeeninstitute.online</a></span>
</div>

<div class="addr">📍 128, City Road, London, EC1V 2NX, United Kingdom</div>

<div class="links">
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a>
 |
<a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a>
</div>

<div class="copy">© 2026 Yaqeen Institute. All Rights Reserved.</div>
</div>

</div>
</div>
</body>
</html>`;

  return {
    subject: "Welcome to Yaqeen Institute! 🎉",
    html,
    text:
      `Dear ${name},\n\n` +
      `Welcome to Yaqeen Institute! We're excited to have you with us.\n\n` +
      `Summary:\n` +
      `- Pricing Package: ${form.pricing_plan}\n` +
      `- Monthly Classes: ${monthlyClasses}\n` +
      `- Preferred Days: ${daysString}\n` +
      `- Class Start Date & Time: ${startDateTime}\n\n` +
      `Your assigned teacher will contact you soon.\n\n` +
      `Warm regards,\nThe Yaqeen Institute Team\n${siteUrl}`,
  };
}


export function studentAppAdminEmail({ form, settings, siteUrl, meta }) {
  const name = `${form.first_name || ""} ${form.last_name || ""}`.trim();
  const phone = `${form.dial_code || ""} ${form.mobile || ""}`.trim();
  const daysString = Array.isArray(form.preferred_days) ? form.preferred_days.join(", ") : form.preferred_days || "Not specified";
  const monthlyHours = form.hours_per_week ? Number(form.hours_per_week) * 4 : "TBD";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yaqeen Institute | New Student Joined</title>
<style>
*{box-sizing:border-box;}
body{margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;color:#352E2A}
.wrapper{padding:24px 10px;box-sizing:border-box;}
.container{max-width:620px;margin:auto;background:#FBF8F3;border:1px solid #C99B4D;border-radius:16px;overflow:hidden;box-sizing:border-box;}
.header{text-align:center;padding:26px 20px;border-bottom:3px solid #C99B4D}
.logo{width:220px;max-width:220px;height:auto}
.content{padding:30px 34px}
h1{margin:0 0 16px;font-size:28px;color:#2B1F14}
p{margin:0 0 16px;font-size:15px;line-height:1.7}
.card{margin-top:20px;background:#fff;border:1px solid #E2D4B2;border-radius:12px;padding:20px}
.card h2{margin:0 0 16px;color:#556B3B;font-size:20px}
table{width:100%;border-collapse:collapse}
td{padding:10px 0;border-bottom:1px solid #EEE4D0;font-size:14px;vertical-align:top}
td:first-child{font-weight:600;width:45%}
.footer{text-align:center;padding:22px 20px;border-top:1px solid #E6D7B7}
.contact,.address,.links,.copy{font-size:12px;line-height:1.7}
.footer a{color:#2B1F14;text-decoration:none}
.address{margin-top:8px;color:#666}
.links{margin-top:12px}
.copy{margin-top:12px;color:#999}
@media only screen and (max-width:640px){
.content{padding:22px 18px}
.logo{width:180px}
.contact a{display:block;margin:6px 0}
.sep{display:none}
td{display:block;width:100%;padding:8px 0}
td:first-child{border-bottom:none;padding-bottom:2px}
}
</style>
</head>
<body>
<div class="wrapper">
<div class="container">

<div class="header">
<img class="logo" src="https://res.cloudinary.com/az6stpg2/image/upload/v1783424854/yaqeenlogo.png" alt="Yaqeen Institute">
</div>

<div class="content">
<h1>🎉 New Student Joined</h1>

<p><strong>Dear Admin Team,</strong></p>

<p>A new student has successfully registered. Below are their enrollment details:</p>

<div class="card">
<h2>📋 Student Enrollment Details</h2>

<table>
<tr><td>Full Name</td><td>${escapeHtml(name)}</td></tr>
<tr><td>Age Group</td><td>${escapeHtml(form.age_group || "")}</td></tr>
<tr><td>Gender</td><td>${escapeHtml(form.gender || "")}</td></tr>
<tr><td>Email</td><td>${escapeHtml(form.email || "")}</td></tr>
<tr><td>Phone / Mobile</td><td>${escapeHtml(phone)}</td></tr>
<tr><td>Country</td><td>${escapeHtml(form.country || "")}</td></tr>
<tr><td>Selected Courses</td><td>${escapeHtml(form.course || "")}</td></tr>
<tr><td>Hours per Week</td><td>${escapeHtml(form.hours_per_week || "")}</td></tr>
<tr><td>Total Hours per Month</td><td>${escapeHtml(String(monthlyHours))}</td></tr>
<tr><td>Pricing Plan</td><td>${escapeHtml(form.pricing_plan || "")}</td></tr>
<tr><td>Monthly Pricing</td><td>$${escapeHtml(form.monthly_price || "")}</td></tr>
<tr><td>Preferred Days</td><td>${escapeHtml(daysString)}</td></tr>
<tr><td>Class Start Date</td><td>${escapeHtml(formatDateToDDMMYYYY(form.preferred_date) || "")}</td></tr>
<tr><td>Preferred Time</td><td>${escapeHtml(form.preferred_time || "")}</td></tr>
</table>

</div>
</div>

<div class="footer">
<div class="contact">
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="mailto:support@yaqeeninstitute.online">📩 support@yaqeeninstitute.online</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="tel:+447488848483">📱 +44 7488 848483</a></span>
<span class="sep"> | </span>
<span style="display:inline-block;white-space:nowrap;margin:4px 8px;"><a href="https://www.yaqeeninstitute.online">🌐 www.yaqeeninstitute.online</a></span>
</div>

<div class="address">
📍 128, City Road, London, EC1V 2NX, United Kingdom
</div>

<div class="links">
<a href="https://www.yaqeeninstitute.online/privacy">Privacy Policy</a> |
<a href="https://www.yaqeeninstitute.online/terms">Terms &amp; Conditions</a>
</div>

<div class="copy">
© 2026 Yaqeen Institute. All Rights Reserved.
</div>
</div>

</div>
</div>
</body>
</html>`;

  return {
    subject: `New Student Registration — ${name || form.email || "Website"}`,
    html,
    text:
      `New Student Registration\n-----------------------------\n` +
      `Name: ${name}\nEmail: ${form.email}\nPhone: ${phone}\nCountry: ${form.country}\n` +
      `Age Group: ${form.age_group}\nGender: ${form.gender}\nCourse: ${form.course}\n` +
      `Hours/Week: ${form.hours_per_week}\nPlan: ${form.pricing_plan}\nMonthly Price: $${form.monthly_price}\n` +
      `Preferred Days: ${daysString}\nStart Date: ${formatDateToDDMMYYYY(form.preferred_date)}\nStart Time: ${form.preferred_time}\n` +
      `${meta && meta.location ? `Location: ${meta.location}\n` : ""}${meta && meta.ip ? `IP: ${meta.ip}\n` : ""}`,
    replyTo: form.email,
  };
}

