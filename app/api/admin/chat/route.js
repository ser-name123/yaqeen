import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hasTab } from "@/lib/roles";

// Same session-token check the other admin routes use.
async function validateSession(request, supabaseAdmin) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  const { data: admin, error } = await supabaseAdmin
    .from("admin_profile")
    .select("*")
    .eq("session_token", token)
    .maybeSingle();
  if (error || !admin) return null;
  if (new Date(admin.session_expires_at) < new Date()) return null;
  return admin;
}

// GET — list sessions, or (with ?sessionId=) the messages of one chat
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "liveChat")) {
      return NextResponse.json({ success: false, message: "You do not have permission for Live Chat." }, { status: 403 });
    }

    const sessionId = new URL(request.url).searchParams.get("sessionId");

    if (sessionId) {
      const { data: messages, error } = await supabase
        .from("chat_messages")
        .select("id, sender, text, audio_url, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const { data: session } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      return NextResponse.json({ success: true, session, messages: messages || [] });
    }

    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("id, name, email, mobile, status, created_at, last_message_at")
      .order("last_message_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ success: true, sessions: sessions || [] });
  } catch (err) {
    console.error("admin chat GET error:", err && err.message ? err.message : err);
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// DELETE ?sessionId= — permanently remove a conversation (messages cascade)
export async function DELETE(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "liveChat")) {
      return NextResponse.json({ success: false, message: "You do not have permission for Live Chat." }, { status: 403 });
    }
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ success: false, message: "Missing sessionId." }, { status: 400 });
    const { error } = await supabase.from("chat_sessions").delete().eq("id", sessionId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin chat DELETE error:", err && err.message ? err.message : err);
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// POST — admin sends a reply. The FIRST admin reply flips the session to
// 'admin' mode, which permanently pauses the AI for that conversation.
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    const admin = await validateSession(request, supabase);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    if (!hasTab(admin, "liveChat")) {
      return NextResponse.json({ success: false, message: "You do not have permission for Live Chat." }, { status: 403 });
    }

    const { sessionId, text } = await request.json();
    if (!sessionId || !text?.trim()) {
      return NextResponse.json({ success: false, message: "Empty reply." }, { status: 400 });
    }

    const { error: insErr } = await supabase.from("chat_messages").insert([
      { session_id: sessionId, sender: "admin", text: text.trim() },
    ]);
    if (insErr) throw insErr;

    // Take over: silence the AI for this chat from now on.
    await supabase
      .from("chat_sessions")
      .update({ status: "admin", admin_joined_at: new Date().toISOString(), last_message_at: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("admin chat POST error:", err && err.message ? err.message : err);
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
