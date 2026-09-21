import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getLayoutConfig, FOOTER_DEFAULTS } from "@/lib/layout";

// Public: footer/header content for the website.
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const config = await getLayoutConfig(supabase);
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ success: true, config: FOOTER_DEFAULTS });
  }
}
