import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateAiReply } from "@/lib/ai-chat";

// Visitor sends a message. We store it, and — only while the session is
// still in 'ai' mode (no human has taken over) — generate an AI reply.
export async function POST(request) {
  try {
    const { sessionId, text, audioUrl } = await request.json();

    if (!sessionId || (!text?.trim() && !audioUrl)) {
      return NextResponse.json({ success: false, message: "Empty message." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: session, error: sErr } = await supabase
      .from("chat_sessions")
      .select("id, status")
      .eq("id", sessionId)
      .single();

    if (sErr || !session) {
      return NextResponse.json({ success: false, message: "Chat session not found." }, { status: 404 });
    }

    // Store the visitor's message.
    const { error: insErr } = await supabase.from("chat_messages").insert([
      { session_id: sessionId, sender: "user", text: text?.trim() || null, audio_url: audioUrl || null },
    ]);
    if (insErr) throw insErr;

    await supabase
      .from("chat_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", sessionId);

    // If a human admin has taken over, the AI stays silent for this chat.
    if (session.status !== "ai") {
      return NextResponse.json({ success: true, aiReplied: false });
    }

    // Build short history for context and generate the AI reply.
    const { data: history } = await supabase
      .from("chat_messages")
      .select("sender, text")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(20);

    const reply = await generateAiReply(history || []);

    await supabase.from("chat_messages").insert([
      { session_id: sessionId, sender: "ai", text: reply },
    ]);

    return NextResponse.json({ success: true, aiReplied: true, reply });
  } catch (err) {
    console.error("chat send error:", err && err.message ? err.message : err);
    return NextResponse.json(
      { success: false, message: err.message || "Could not send message." },
      { status: 500 }
    );
  }
}
