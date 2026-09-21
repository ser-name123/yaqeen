import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getWelcomeMessage, getSuggestions } from "@/lib/ai-chat";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Resolve the visitor's public IP and geolocation (best-effort).
async function resolveGeo(request) {
  let ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for");
  ip = ip ? ip.split(",")[0].trim() : "127.0.0.1";
  if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

  // On localhost, resolve to the outbound public IP so geo works while testing.
  if (ip === "127.0.0.1") {
    try {
      const r = await fetch("https://api.ipify.org?format=json").catch(() => null);
      if (r && r.ok) { const d = await r.json(); if (d?.ip) ip = d.ip; }
    } catch { /* ignore */ }
  }

  let city = null, state = null, country = null, provider = null;
  try {
    const g = await fetch(`https://ipwho.is/${ip}`).catch(() => null);
    if (g && g.ok) {
      const d = await g.json();
      if (d?.success) { city = d.city; state = d.region; country = d.country; provider = d.connection?.isp; }
    }
    if (!country) {
      const g2 = await fetch(`https://ipapi.co/${ip}/json/`).catch(() => null);
      if (g2 && g2.ok) {
        const d2 = await g2.json();
        city = city || d2.city; state = state || d2.region; country = country || d2.country_name; provider = provider || d2.org;
      }
    }
  } catch { /* ignore */ }

  return { ip, city, state, country, provider };
}

// Start a new chat session. Captures IP + browser details for the admin.
export async function POST(request) {
  try {
    const { name, email, mobile, meta = {} } = await request.json();

    if (!name || !name.trim() || !email || !EMAIL_RE.test(email) || !mobile || !mobile.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name, email and mobile number." },
        { status: 400 }
      );
    }

    const geo = await resolveGeo(request);
    const supabase = getSupabaseAdmin();

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert([{
        name: name.trim(), email: email.trim(), mobile: mobile.trim(), status: "ai",
        ip_address: geo.ip,
        city: geo.city, state: geo.state, country: geo.country, provider: geo.provider,
        user_agent: meta.user_agent || null,
        browser_info: meta.browser_info || null,
        system_info: meta.system_info || null,
        device_type: meta.device_type || null,
        language: meta.language || null,
        timezone: meta.timezone || null,
        screen_size: meta.screen_size || null,
        page_url: meta.page_url || null,
        referrer: meta.referrer || null,
      }])
      .select("id")
      .single();

    if (error) throw error;

    // Admin-editable welcome message (with a sensible default), personalised.
    const firstName = name.trim().split(" ")[0];
    const template = (await getWelcomeMessage(supabase)) ||
      "Assalamu Alaikum! Welcome to Yaqeen Institute. How can I help you today — Quran, Arabic, or Islamic Studies?";
    const greeting = template.includes("Assalamu Alaikum")
      ? template.replace("Assalamu Alaikum", `Assalamu Alaikum ${firstName}`)
      : `Assalamu Alaikum ${firstName}! ${template}`;

    await supabase.from("chat_messages").insert([
      { session_id: session.id, sender: "ai", text: greeting },
    ]);

    const suggestions = await getSuggestions(supabase);
    return NextResponse.json({ success: true, sessionId: session.id, greeting, suggestions });
  } catch (err) {
    console.error("chat/start error:", err && err.message ? err.message : err);
    return NextResponse.json(
      { success: false, message: err.message || "Could not start chat." },
      { status: 500 }
    );
  }
}
