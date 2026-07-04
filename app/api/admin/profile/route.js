import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

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

export async function GET(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const admin = await validateSession(request, supabaseAdmin);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Session invalid or expired." },
        { status: 401 }
      );
    }

    // Fetch site settings
    const { data: settings } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .eq("id", "global")
      .single();

    return NextResponse.json({
      success: true,
      email: admin.email,
      password: admin.password,
      logo_text: settings?.logo_text || "yaqeen",
      logo_url: settings?.logo_url || "",
      contact_email: settings?.contact_email || "info@yaqeeninstitute.com",
      contact_phone: settings?.contact_phone || "+447488818192",
      contact_hours: settings?.contact_hours || "24x7 - We're always here for you.",
      contact_support: settings?.contact_support || "We serve students from around the world.",
      social_facebook: settings?.social_facebook || "",
      social_instagram: settings?.social_instagram || "",
      social_youtube: settings?.social_youtube || "",
      social_whatsapp: settings?.social_whatsapp || ""
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const admin = await validateSession(request, supabaseAdmin);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Session invalid or expired." },
        { status: 401 }
      );
    }

    const { 
      email, 
      password, 
      logo_text, 
      logo_url,
      contact_email,
      contact_phone,
      contact_hours,
      contact_support,
      social_facebook,
      social_instagram,
      social_youtube,
      social_whatsapp
    } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password cannot be empty." },
        { status: 400 }
      );
    }

    // Update the logged-in admin's own email and password
    const { error: updateError } = await supabaseAdmin
      .from("admin_profile")
      .update({
        email: email.trim(),
        password: password.trim(),
        updated_at: new Date().toISOString()
      })
      .eq("id", admin.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update admin credentials." },
        { status: 500 }
      );
    }

    // Update site settings
    const { error: settingsError } = await supabaseAdmin
      .from("site_settings")
      .upsert({
        id: "global",
        logo_text: logo_text || "yaqeen",
        logo_url: logo_url || null,
        contact_email: contact_email || "info@yaqeeninstitute.com",
        contact_phone: contact_phone || "+447488818192",
        contact_hours: contact_hours || "24x7 - We're always here for you.",
        contact_support: contact_support || "We serve students from around the world.",
        social_facebook: social_facebook || "",
        social_instagram: social_instagram || "",
        social_youtube: social_youtube || "",
        social_whatsapp: social_whatsapp || "",
        updated_at: new Date().toISOString()
      });

    if (settingsError) {
      console.error("Site settings update error:", settingsError);
      return NextResponse.json(
        { success: false, message: "Credentials updated, but failed to update site logo configurations." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile and logo settings updated successfully."
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
