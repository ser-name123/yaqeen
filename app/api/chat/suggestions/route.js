import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSuggestions, getPublicConfig } from "@/lib/ai-chat";

// Public: suggestion chips + admin-editable widget texts for the chat widget.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const [suggestions, ui] = await Promise.all([getSuggestions(supabase), getPublicConfig(supabase)]);
    return NextResponse.json({ success: true, suggestions, ui });
  } catch {
    return NextResponse.json({ success: true, suggestions: [], ui: null });
  }
}
