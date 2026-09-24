import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, getAdminRecipients } from "@/lib/mailer";

// Helper to validate session token
async function validateSession(request, supabaseAdmin) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const { data: admin, error } = await supabaseAdmin
    .from("admin_profile")
    .select("*")
    .eq("session_token", token)
    .maybeSingle();

  if (error || !admin) return null;

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(admin.session_expires_at);
  if (expiresAt < now) {
    return null;
  }

  return admin;
}

const ALL_TABLES = [
  "contacts",
  "blogs",
  "seo_settings",
  "admin_profile",
  "site_settings",
  "leads",
  "teachers",
  "testimonials",
  "courses",
  "pricing_plans",
  "career_jobs",
  "teacher_applications",
  "student_applications",
  "newsletter_subscribers"
];

export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const admin = await validateSession(request, supabaseAdmin);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Session invalid or expired." },
        { status: 401 }
      );
    }

    const now = new Date();
    const formattedDate = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const readableDate = now.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Asia/Kolkata"
    });

    const backupData = {
      metadata: {
        system: "Yaqeen Institute Admin Platform",
        backup_created_at: now.toISOString(),
        backup_date_ist: readableDate,
        initiated_by_admin: admin.email,
        total_tables: ALL_TABLES.length
      },
      table_counts: {},
      tables: {}
    };

    // Fetch data from all tables in parallel
    const tablePromises = ALL_TABLES.map(async (tableName) => {
      try {
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select("*");
        if (error) {
          console.warn(`Backup table fetch warning for ${tableName}:`, error.message);
          return { name: tableName, rows: [], count: 0, status: "error", error: error.message };
        }
        return { name: tableName, rows: data || [], count: (data || []).length, status: "ok" };
      } catch (err) {
        return { name: tableName, rows: [], count: 0, status: "error", error: err.message };
      }
    });

    const results = await Promise.all(tablePromises);

    let totalRecords = 0;
    results.forEach(({ name, rows, count }) => {
      backupData.tables[name] = rows;
      backupData.table_counts[name] = count;
      totalRecords += count;
    });

    const jsonString = JSON.stringify(backupData, null, 2);
    const backupFileName = `yaqeen-db-backup-${formattedDate}.json`;
    const fileSizeKB = (Buffer.byteLength(jsonString, "utf8") / 1024).toFixed(2);

    // Get all admin recipients
    const recipients = await getAdminRecipients(supabaseAdmin);
    if (!recipients.includes(admin.email)) {
      recipients.push(admin.email);
    }

    // Build Table Summary HTML Rows
    const tableSummaryRows = Object.entries(backupData.table_counts)
      .map(
        ([table, count]) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 8px 12px; font-family: monospace; font-size: 13px; color: #1f2937;"><strong>${table}</strong></td>
          <td style="padding: 8px 12px; text-align: right; font-size: 13px; color: #4b5563;">${(Number(count) || 0).toLocaleString()} records</td>
        </tr>
      `
      )
      .join("");

    const emailSubject = `📦 Database Backup (${readableDate}) - Yaqeen Institute`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #111827; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; }
          .header { background: linear-gradient(135deg, #2b1f14 0%, #4a3828 100%); color: #ffffff; padding: 28px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; color: #d6c7b2; font-size: 13px; }
          .body { padding: 28px; }
          .badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
          .stat-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-value { font-size: 20px; font-weight: 700; color: #8c5d31; }
          .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          th { background: #f9fafb; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; font-size: 12px; color: #92400e; margin-top: 20px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Yaqeen Institute</h1>
            <p>Admin Database Backup Service</p>
          </div>
          <div class="body">
            <span class="badge">✓ Backup Successfully Generated</span>
            <p style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">
              Hello Admin,<br><br>
              A full database backup was requested by <strong>${admin.email}</strong> on <strong>${readableDate}</strong>. The complete database snapshot file is attached to this email as <code>${backupFileName}</code>.
            </p>

            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">${totalRecords.toLocaleString()}</div>
                <div class="stat-label">Total Records</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${fileSizeKB} KB</div>
                <div class="stat-label">Backup File Size</div>
              </div>
            </div>

            <h3 style="font-size: 14px; color: #111827; margin: 24px 0 8px 0;">Database Tables Breakdown:</h3>
            <table>
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th style="text-align: right;">Count</th>
                </tr>
              </thead>
              <tbody>
                ${tableSummaryRows}
              </tbody>
            </table>

            <div class="note">
              <strong>🔒 Security Note:</strong> This backup contains sensitive application data. Keep the attached JSON file secure and do not share it over unverified channels.
            </div>
          </div>
          <div class="footer">
            Sent automatically to all active system administrators.<br>
            © ${new Date().getFullYear()} Yaqeen Institute. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email with attachment to all admins
    const sendPromises = recipients.map((toEmail) =>
      sendMail({
        to: toEmail,
        subject: emailSubject,
        html: emailHtml,
        text: `Full database backup generated on ${readableDate}. Total records: ${totalRecords}. File attached: ${backupFileName}.`,
        attachments: [
          {
            filename: backupFileName,
            content: jsonString,
            contentType: "application/json"
          }
        ]
      }).catch((err) => {
        console.error(`Failed to send backup email to ${toEmail}:`, err);
        return { error: err.message, to: toEmail };
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({
      success: true,
      message: `Database backup (${totalRecords} records across ${ALL_TABLES.length} tables) sent successfully to ${recipients.length} admin email(s).`,
      recipients,
      totalRecords,
      fileSizeKB,
      fileName: backupFileName,
      tableCounts: backupData.table_counts,
      timestamp: readableDate
    });
  } catch (error) {
    console.error("Database backup error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate and email database backup." },
      { status: 500 }
    );
  }
}
