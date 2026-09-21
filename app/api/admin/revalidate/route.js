import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
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

// POST — clear the server-side ISR/data cache so the live site picks up edits now.
export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin();
    if (!(await validateSession(request, supabase))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    // Cached data tags (see lib/db-cached.js)
    for (const tag of ["site-settings", "seo-settings"]) {
      try { revalidateTag(tag); } catch { /* ignore */ }
    }
    // Rebuild the whole site (all routes) on next request.
    try { revalidatePath("/", "layout"); } catch { /* ignore */ }

    return NextResponse.json({ success: true, message: "Cache cleared. The live site will refresh on the next visit." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed." }, { status: 500 });
  }
}
