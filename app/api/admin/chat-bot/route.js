import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function validateSession(request, supabase) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  const { data: admin, error } = await supabase
    .from("admin_profile").select("*").eq("session_token", token).maybeSingle();
  if (error || !admin) return null;
  if (new Date(admin.session_expires_at) < new Date()) return null;
  return admin;
}

// GET — welcome message config + all Q&A
export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const { data: config } = await supabase.from("chat_config").select("*").eq("id", "global").single();
    const { data: qa } = await supabase.from("chat_qa").select("*").order("sort_order").order("created_at");
    return NextResponse.json({ success: true, config: config || {}, qa: qa || [] });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// POST — save welcome message OR add/update a Q&A item
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json();

    if (body.type === "config") {
      const c = body.config || body;
      const { error } = await supabase.from("chat_config").upsert({
        id: "global",
        welcome_message: c.welcome_message ?? "",
        assistant_name: c.assistant_name ?? null,
        assistant_status: c.assistant_status ?? null,
        prechat_title: c.prechat_title ?? null,
        prechat_subtitle: c.prechat_subtitle ?? null,
        privacy_text: c.privacy_text ?? null,
        widget_logo_url: c.widget_logo_url ?? null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body.type === "qa") {
      const item = body.item || {};
      if (!item.question?.trim() || !item.answer?.trim()) {
        return NextResponse.json({ success: false, message: "Question and answer are required." }, { status: 400 });
      }
      const payload = {
        question: item.question.trim(),
        keywords: item.keywords?.trim() || null,
        answer: item.answer.trim(),
        is_suggestion: item.is_suggestion !== false,
        sort_order: Number.isFinite(+item.sort_order) ? +item.sort_order : 0,
      };
      if (item.id) {
        const { error } = await supabase.from("chat_qa").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("chat_qa").insert([payload]);
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown request." }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}

// DELETE ?id= — remove a Q&A item
export async function DELETE(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing id." }, { status: 400 });
    const { error } = await supabase.from("chat_qa").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
