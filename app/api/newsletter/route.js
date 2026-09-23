import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendMail, getAdminRecipients } from "@/lib/mailer";
import { newsletterAdminEmail, newsletterUserEmail } from "@/lib/email-templates";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://yaqeeninstitute.online").replace(/\/$/, "");

// Public POST: Subscribe to Newsletter
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      source = "Website Footer",
      browser_info,
      system_info,
      ip_address,
      city: clientCity,
      state: clientState,
      country: clientCountry
    } = body;

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    let ip = ip_address;
    let city = clientCity;
    let state = clientState;
    let country = clientCountry;
    let provider = "Unknown";

    // If client didn't resolve IP, extract server-side
    if (!ip || ip === "Unknown / Client-side only") {
      ip = request.headers.get("cf-connecting-ip") ||
           request.headers.get("x-real-ip") ||
           request.headers.get("x-forwarded-for");
      if (ip) {
        ip = ip.split(",")[0].trim();
      } else {
        ip = "127.0.0.1";
      }
    }

    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    // Geolocation resolution
    if (!city || city === "Unknown" || !country || country === "Unknown") {
      try {
        const geoUrl = ip === "127.0.0.1" 
          ? "http://ip-api.com/json/" 
          : `http://ip-api.com/json/${ip}`;
        
        const geoResponse = await fetch(geoUrl);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === "success") {
            city = geoData.city || "Unknown";
            state = geoData.regionName || "Unknown";
            country = geoData.country || "Unknown";
            provider = geoData.isp || "Unknown";
            if (ip === "127.0.0.1" && geoData.query) {
              ip = geoData.query;
            }
          }
        }
      } catch (geoErr) {
        console.warn("Geolocation lookup error for newsletter:", geoErr);
      }
    }

    const supabase = getSupabaseAdmin();
    let dbSuccess = false;

    if (supabase) {
      // 1. Try inserting into newsletter_subscribers
      try {
        const { error: subErr } = await supabase
          .from("newsletter_subscribers")
          .insert([{
            email: cleanEmail,
            source: source || "Website Footer",
            ip_address: ip || "Unknown",
            browser_info: browser_info || "Unknown Browser",
            system_info: system_info || "Unknown Device",
            city: city || "Unknown",
            state: state || "Unknown",
            country: country || "Unknown",
            provider: provider || "Unknown",
            status: "subscribed"
          }]);

        if (!subErr) {
          dbSuccess = true;
        } else {
          // If table doesn't exist yet, insert into leads / contacts table as graceful fallback
          console.warn("newsletter_subscribers table notice, using leads fallback:", subErr.message);
          await supabase.from("leads").insert([{
            email: cleanEmail,
            name: "Newsletter Subscriber",
            message: `Subscribed via ${source || "website"}`
          }]);
          dbSuccess = true;
        }
      } catch (insertErr) {
        console.warn("Newsletter DB insertion error:", insertErr);
        // Secondary fallback to leads
        try {
          await supabase.from("leads").insert([{
            email: cleanEmail,
            name: "Newsletter Subscriber",
            message: `Subscribed via ${source || "website"}`
          }]);
        } catch (e) {}
      }
    }

    // Send emails (admin notification and user welcome email)
    (async () => {
      const locationStr = [city, state, country].filter(v => v && v !== "Unknown").join(", ");

      // 1. Admin notification email
      try {
        const adminTemplate = newsletterAdminEmail({
          email: cleanEmail,
          source,
          location: locationStr,
          ip
        });
        
        const adminRecipients = await getAdminRecipients(supabase);
        if (adminRecipients && adminRecipients.length > 0) {
          await sendMail({
            to: adminRecipients,
            subject: adminTemplate.subject,
            html: adminTemplate.html,
            text: adminTemplate.text,
            replyTo: adminTemplate.replyTo || cleanEmail
          });
          console.log("Newsletter admin notification sent to:", adminRecipients);
        }
      } catch (adminMailErr) {
        console.error("Newsletter admin email sending error:", adminMailErr);
      }

      // 2. User confirmation / welcome email
      try {
        const userTemplate = newsletterUserEmail({
          email: cleanEmail,
          siteUrl: SITE_URL
        });
        
        await sendMail({
          to: cleanEmail,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text
        });
        console.log("Newsletter user welcome email sent to:", cleanEmail);
      } catch (userMailErr) {
        console.error("Newsletter user welcome email sending error:", userMailErr);
      }
    })();

    return NextResponse.json({
      success: true,
      message: "JazakAllah Khair! You have successfully subscribed to our newsletter."
    });

  } catch (err) {
    console.error("Newsletter subscription route error:", err);
    return NextResponse.json(
      { success: false, message: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}

// Admin GET: List all newsletter subscribers
export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: true, subscribers: [] });
    }

    // Try fetching from newsletter_subscribers
    let { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    // If table not found or empty, also check leads table
    if (error || !subscribers || subscribers.length === 0) {
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .ilike("name", "%Newsletter%")
        .order("created_at", { ascending: false });

      if (leads && leads.length > 0) {
        subscribers = leads.map(l => ({
          id: l.id,
          email: l.email,
          source: l.message || "Website",
          ip_address: l.ip_address || "Unknown",
          city: l.city || "Unknown",
          country: l.country || "Unknown",
          status: "subscribed",
          created_at: l.created_at
        }));
      }
    }

    return NextResponse.json({
      success: true,
      subscribers: subscribers || []
    });

  } catch (err) {
    console.error("Error fetching newsletter subscribers:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// Admin DELETE: Remove a subscriber
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json({ success: false, message: "ID or email required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "Database unavailable" }, { status: 500 });
    }

    if (id) {
      await supabase.from("newsletter_subscribers").delete().eq("id", id);
      await supabase.from("leads").delete().eq("id", id);
    } else if (email) {
      await supabase.from("newsletter_subscribers").delete().eq("email", email);
      await supabase.from("leads").delete().eq("email", email);
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully."
    });

  } catch (err) {
    console.error("Error deleting newsletter subscriber:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
