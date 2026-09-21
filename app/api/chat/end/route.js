import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Visitor ended the chat from the widget → mark the session as ended
// so it shows as "Ended" in the admin panel.
export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ success: false, message: "Missing session." }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    await supabase
      .from("chat_sessions")
      .update({ status: "ended", last_message_at: new Date().toISOString() })
      .eq("id", sessionId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("chat/end error:", err && err.message ? err.message : err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
