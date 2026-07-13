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
  const formattedDateTime = `Requested Date: ${form.date || "TBD"} &nbsp;&nbsp;·&nbsp;&nbsp; Time: ${time || "TBD"}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>Trial Session Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF6F0;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#2B1F14;-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Your free trial booking confirmation from Yaqeen Institute.</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF6F0;padding:28px 14px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 36px rgba(44,37,30,0.06);border:1.5px solid #EFE7DA;">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color:#FAF8F3;padding:28px 30px;text-align:center;border-bottom:1.5px solid #EFE7DA;">
              <table role="presentation" align="center" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <img src="https://yaqeeninstitute.online/favicon.ico" alt="YAQEEN Logo" width="46" height="46" style="width:46px;height:46px;display:block;" />
                  </td>
                  <td style="vertical-align:middle;text-align:left;line-height:1.15;">
                    <div style="font-size:22px;font-weight:800;color:#2B1F14;letter-spacing:1px;font-family:Georgia,serif;">YAQEEN</div>
                    <div style="font-size:11px;font-weight:600;color:#5C4D3C;letter-spacing:3px;">INSTITUTE</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- BODY CONTENT -->
          <tr>
            <td style="padding:40px 40px 30px 40px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="font-size:22px;font-weight:800;color:#2B1F14;padding-bottom:18px;">
                    📚 &nbsp;Trial Session Confirmation
                  </td>
                </tr>
                <tr>
                  <td style="font-size:16px;font-weight:700;color:#2B1F14;padding-bottom:10px;">
                    Dear ${escapeHtml(first)},
                  </td>
                </tr>
                <tr>
                  <td style="font-size:15px;line-height:1.6;color:#5C4D3C;padding-bottom:20px;">
                    Thank you for requesting a <b style="color:#2B1F14;">trial session</b> with Yaqeen Institute.
                  </td>
                </tr>
                
                <!-- Requested Date & Time Box -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF5EE;border-left:4px solid #C99B4D;border-radius:6px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:14px 20px;font-size:15px;font-weight:700;color:#2B1F14;">
                          📅 &nbsp; ${escapeHtml(formattedDateTime)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- What Happens Next Wrapper -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #EFE7DA;border-radius:16px;padding:24px;margin-bottom:10px;">
                      <tr>
                        <td style="font-size:16px;font-weight:700;color:#556B3B;padding-bottom:16px;">
                          ✨ What Happens Next
                        </td>
                      </tr>
                      
                      <!-- Step 1 -->
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F3;border-left:4px solid #556B3B;border-radius:6px;">
                            <tr>
                              <td style="padding:12px 16px;font-size:14px;line-height:1.5;color:#2B1F14;font-weight:600;">
                                ✅ &nbsp; Our team will connect with you to confirm all session details.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Step 2 -->
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF5EE;border-left:4px solid #C99B4D;border-radius:6px;">
                            <tr>
                              <td style="padding:12px 16px;font-size:14px;line-height:1.5;color:#2B1F14;font-weight:600;">
                                ☎️ &nbsp; Need help? Call or WhatsApp: <a href="https://wa.me/447700183406" style="color:#C99B4D;text-decoration:underline;">+44 7700 183406</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Step 3 -->
                      <tr>
                        <td>
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F3;border-left:4px solid #A69A86;border-radius:6px;">
                            <tr>
                              <td style="padding:12px 16px;font-size:14px;line-height:1.5;color:#5C4D3C;font-weight:600;">
                                ⏱️ &nbsp; Please allow up to 12 hours for a response.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#FAF8F3;padding:32px 30px;text-align:center;border-top:1.5px solid #EFE7DA;">
              <p style="margin:0 0 12px 0;font-size:12.5px;color:#5C4D3C;font-weight:600;">
                📥 &nbsp;<a href="mailto:support@yaqeeninstitute.online" style="color:#5C4D3C;text-decoration:none;">support@yaqeeninstitute.online</a> &nbsp;|&nbsp; 
                ☎️ &nbsp;<a href="tel:+447488848483" style="color:#5C4D3C;text-decoration:none;">+44 7488 848483</a> &nbsp;|&nbsp; 
                🌐 &nbsp;<a href="${escapeHtml(siteUrl)}" style="color:#5C4D3C;text-decoration:none;">www.yaqeeninstitute.online</a>
              </p>
              <p style="margin:0 0 14px 0;font-size:12px;color:#8E7E6B;">
                📍 &nbsp;128, City Road, London, EC1V 2NX, United Kingdom
              </p>
              <p style="margin:0 0 16px 0;font-size:12.5px;font-weight:700;">
                <a href="${escapeHtml(siteUrl)}/privacy" style="color:#556B3B;text-decoration:none;">Privacy Policy</a> &nbsp;&nbsp;·&nbsp;&nbsp; 
                <a href="${escapeHtml(siteUrl)}/terms" style="color:#556B3B;text-decoration:none;">Terms & Conditions</a>
              </p>
              <p style="margin:0;font-size:11.5px;color:#A69A86;">
                © 2026 <b>Yaqeen Institute</b>. All Rights Reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: "Trial Session Confirmation — Yaqeen Institute",
    html,
    text:
      `Assalamu Alaikum, ${first}!\n\n` +
      `Thank you for requesting a trial session with Yaqeen Institute.\n\n` +
      `Requested Date & Time:\n` +
      `- Date: ${form.date || "TBD"}\n` +
      `- Time: ${time || "TBD"}\n\n` +
      `What Happens Next:\n` +
      `- Our team will connect with you to confirm all session details.\n` +
      `- Need help? Call or WhatsApp: +44 7700 183406\n` +
      `- Please allow up to 12 hours for a response.\n\n` +
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

/* -------------------- Student Application: email to the USER ------------------ */
export function studentAppUserEmail({ form, settings, siteUrl }) {
  const first = (form.first_name || "there").trim();
  const daysString = Array.isArray(form.preferred_days) ? form.preferred_days.join(", ") : form.preferred_days || "Not specified";

  const content = `
    <h2 style="margin:0 0 10px 0;font-family:Georgia,serif;font-size:20px;font-weight:700;color:${BRAND.green};">Assalamu Alaikum, ${escapeHtml(first)}!</h2>
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      Thank you for submitting your <b style="color:${BRAND.ink};">Student Registration Form</b> with Yaqeen Institute.
      Here is a summary of your selected options:
    </p>
    ${detailsTable([
      ["Course", form.course],
      ["Hours per Week", `${form.hours_per_week} Hour(s)`],
      ["Pricing Plan", form.pricing_plan],
      ["Estimated Price/Month", `$${form.monthly_price}`],
      ["Preferred Days", daysString],
      ["Start Date", form.preferred_date],
      ["Start Time", form.preferred_time],
    ])}
    <p style="margin:22px 0 0 0;font-size:15px;line-height:1.65;color:${BRAND.muted};">
      Our team will review your application and get in touch with you shortly to finalize your schedule and set up your student dashboard.
    </p>
    ${ctaButton(siteUrl, "Visit Our Website")}
    <p style="margin:22px 0 0 0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
      If you have any questions or need to make changes, please reply directly to this email.
    </p>
    <p style="margin:16px 0 0 0;font-size:14px;color:${BRAND.ink};">
      Warm regards,<br/><b>The Yaqeen Institute Team</b>
    </p>`;

  return {
    subject: "Student Registration Received — Yaqeen Institute",
    html: shell({ preheader: "We've received your student registration form details.", contentHtml: content, settings, siteUrl }),
    text:
      `Assalamu Alaikum, ${first}!\n\n` +
      `Thank you for registering as a student with Yaqeen Institute.\n\n` +
      `Summary:\n` +
      `- Course: ${form.course}\n` +
      `- Hours per Week: ${form.hours_per_week}\n` +
      `- Plan: ${form.pricing_plan}\n` +
      `- Estimated Monthly Price: $${form.monthly_price}\n` +
      `- Preferred Days: ${daysString}\n` +
      `- Start Date: ${form.preferred_date}\n` +
      `- Start Time: ${form.preferred_time}\n\n` +
      `Our team will contact you shortly.\n\n` +
      `Warm regards,\nThe Yaqeen Institute Team\n${siteUrl}`,
  };
}

/* -------------------- Student Application: email to the ADMIN ------------------ */
export function studentAppAdminEmail({ form, settings, siteUrl, meta }) {
  const name = `${form.first_name || ""} ${form.last_name || ""}`.trim();
  const phone = `${form.dial_code || ""} ${form.mobile || ""}`.trim();
  const daysString = Array.isArray(form.preferred_days) ? form.preferred_days.join(", ") : form.preferred_days || "Not specified";

  const content = `
    <div style="display:inline-block;background:rgba(201,155,77,0.14);color:#A97B2E;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:99px;">New Student Registration</div>
    <h1 style="margin:14px 0 6px 0;font-family:Georgia,serif;font-size:22px;font-weight:800;color:${BRAND.ink};">${escapeHtml(name || "New Student")}</h1>
    <p style="margin:0 0 18px 0;font-size:14px;color:${BRAND.muted};">A new student registration form was submitted on the website.</p>
    ${detailsTable([
      ["Name", name],
      ["Email", form.email],
      ["Phone", phone],
      ["Country", form.country],
      ["Age Group", form.age_group],
      ["Gender", form.gender],
      ["Course", form.course],
      ["Hours/Week", `${form.hours_per_week} Hour(s)`],
      ["Plan", form.pricing_plan],
      ["Monthly Price", `$${form.monthly_price}`],
      ["Preferred Days", daysString],
      ["Start Date", form.preferred_date],
      ["Start Time", form.preferred_time],
      ["Location", meta && meta.location],
      ["IP Address", meta && meta.ip],
    ])}
    <p style="margin:20px 0 0 0;font-size:13px;color:${BRAND.muted};">
      Manage this registration from the
      <a href="${escapeHtml(siteUrl)}/admin" style="color:${BRAND.green};font-weight:600;text-decoration:none;">admin panel</a>.
    </p>`;

  return {
    subject: `New Student Registration — ${name || form.email || "Website"}`,
    html: shell({ preheader: `${name} registered for ${form.course || "Courses"}.`, contentHtml: content, settings, siteUrl }),
    text:
      `New Student Registration\n-----------------------------\n` +
      `Name: ${name}\nEmail: ${form.email}\nPhone: ${phone}\nCountry: ${form.country}\n` +
      `Age Group: ${form.age_group}\nGender: ${form.gender}\nCourse: ${form.course}\n` +
      `Hours/Week: ${form.hours_per_week}\nPlan: ${form.pricing_plan}\nMonthly Price: $${form.monthly_price}\n` +
      `Preferred Days: ${daysString}\nStart Date: ${form.preferred_date}\nStart Time: ${form.preferred_time}\n` +
      `${meta && meta.location ? `Location: ${meta.location}\n` : ""}${meta && meta.ip ? `IP: ${meta.ip}\n` : ""}`,
    replyTo: form.email,
  };
}

