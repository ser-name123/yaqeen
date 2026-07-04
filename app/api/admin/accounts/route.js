import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

// Validate the caller's session token and return their admin row (or null)
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

// GET — list all admin accounts (no secrets)
export async function GET(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("admin_profile")
      .select("id, email, updated_at")
      .order("updated_at", { ascending: true });

    if (error) throw error;

    const accounts = (data || []).map((a) => ({ ...a, is_self: a.id === caller.id }));
    return NextResponse.json({ success: true, accounts });
  } catch (err) {
    console.error("List admin accounts error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to load accounts." }, { status: 500 });
  }
}

// POST — create a new admin account { email, password }
export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Ensure the email is not already used by another admin
    const { data: existing } = await supabaseAdmin
      .from("admin_profile")
      .select("id")
      .ilike("email", email.trim());
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, message: "An admin account with this email already exists." }, { status: 409 });
    }

    const id = `admin_${crypto.randomUUID()}`;
    const { error } = await supabaseAdmin
      .from("admin_profile")
      .insert([{ id, email: email.trim(), password: password.trim() }]);

    if (error) {
      if (error.message && error.message.toLowerCase().includes("admin_profile")) {
        return NextResponse.json({ success: false, message: "The admin_profile table is not set up. Please run the SQL schema." }, { status: 500 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: "Admin account created successfully." });
  } catch (err) {
    console.error("Create admin account error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to create account." }, { status: 500 });
  }
}

// DELETE — remove an admin account by id (?id=...)
export async function DELETE(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Account id is required." }, { status: 400 });
    }
    if (id === caller.id) {
      return NextResponse.json({ success: false, message: "You cannot delete the account you are currently logged in with." }, { status: 400 });
    }

    // Never allow removing the last remaining admin
    const { data: all } = await supabaseAdmin.from("admin_profile").select("id");
    if (all && all.length <= 1) {
      return NextResponse.json({ success: false, message: "At least one admin account must remain." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("admin_profile").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Admin account deleted." });
  } catch (err) {
    console.error("Delete admin account error:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to delete account." }, { status: 500 });
  }
}
