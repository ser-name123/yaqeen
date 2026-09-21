import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { canManageStaff, isSuperAdmin, resolvePermissions } from "@/lib/roles";
import crypto from "crypto";

const PROTECTED_EMAIL = "objectsquarerajan@gmail.com";

async function validateSession(request, supabaseAdmin) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  const { data: admin, error } = await supabaseAdmin
    .from("admin_profile").select("*").eq("session_token", token).maybeSingle();
  if (error || !admin) return null;
  if (new Date(admin.session_expires_at) < new Date()) return null;
  return admin;
}

function publicShape(a, callerId) {
  return {
    id: a.id,
    email: a.email,
    full_name: a.full_name || "",
    role: a.role || "super_admin",
    status: a.status || "active",
    permissions: Array.isArray(a.permissions) ? a.permissions : [],
    last_login_at: a.last_login_at || null,
    created_at: a.created_at || null,
    is_self: a.id === callerId,
    is_protected: (a.email || "").toLowerCase() === PROTECTED_EMAIL,
  };
}

// GET — list all staff accounts (requires manage-staff permission).
export async function GET(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!canManageStaff(caller)) return NextResponse.json({ success: false, message: "You do not have permission to manage staff." }, { status: 403 });

    // select("*") so the list still loads if the staff columns have not been
    // added yet (they default in publicShape). Password is never exposed below.
    let { data, error } = await supabaseAdmin
      .from("admin_profile")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      // created_at may not exist pre-migration — retry without ordering.
      const retry = await supabaseAdmin.from("admin_profile").select("*");
      if (retry.error) throw retry.error;
      data = retry.data;
    }

    const accounts = (data || []).map((a) => publicShape(a, caller.id));
    return NextResponse.json({ success: true, accounts, callerRole: caller.role || "super_admin", needsMigration: !("role" in ((data && data[0]) || {})) });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed to load accounts." }, { status: 500 });
  }
}

// POST — create a staff account { email, password, full_name, role, permissions, status }
export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!canManageStaff(caller)) return NextResponse.json({ success: false, message: "You do not have permission to add staff." }, { status: 403 });

    const body = await request.json();
    const email = (body.email || "").trim();
    const password = (body.password || "").trim();
    const full_name = (body.full_name || "").trim();
    // Role can be a preset key OR a custom role name the admin typed.
    let role = (body.role || "custom").toString().trim().slice(0, 40) || "custom";
    const status = body.status === "suspended" ? "suspended" : "active";

    if (!email || !password) return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    // Only super admins can mint another super admin.
    if (role === "super_admin" && !isSuperAdmin(caller)) {
      return NextResponse.json({ success: false, message: "Only a Super Admin can grant the Super Admin role." }, { status: 403 });
    }

    const { data: existing } = await supabaseAdmin.from("admin_profile").select("id").ilike("email", email);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 409 });
    }

    const id = `admin_${crypto.randomUUID()}`;
    const permissions = resolvePermissions(role, body.permissions);
    const { error } = await supabaseAdmin.from("admin_profile").insert([{
      id, email, password, full_name, role, status, permissions,
      created_by: caller.email || caller.id,
      created_at: new Date().toISOString(),
    }]);
    if (error) {
      if (error.message && error.message.toLowerCase().includes("column")) {
        return NextResponse.json({ success: false, message: "Staff columns missing. Please run supabase-staff-schema.sql." }, { status: 500 });
      }
      throw error;
    }
    return NextResponse.json({ success: true, message: "Staff account created." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create account." }, { status: 500 });
  }
}

// PATCH — update a staff account { id, full_name?, role?, permissions?, status?, password? }
export async function PATCH(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!canManageStaff(caller)) return NextResponse.json({ success: false, message: "You do not have permission to edit staff." }, { status: 403 });

    const body = await request.json();
    const id = body.id;
    if (!id) return NextResponse.json({ success: false, message: "Account id is required." }, { status: 400 });

    const { data: target } = await supabaseAdmin.from("admin_profile").select("*").eq("id", id).maybeSingle();
    if (!target) return NextResponse.json({ success: false, message: "Account not found." }, { status: 404 });

    const targetIsProtected = (target.email || "").toLowerCase() === PROTECTED_EMAIL;
    const callerIsProtected = (caller.email || "").toLowerCase() === PROTECTED_EMAIL;
    if (targetIsProtected && !callerIsProtected) {
      return NextResponse.json({ success: false, message: "This owner account can only be edited by itself." }, { status: 403 });
    }

    const update = {};
    if (typeof body.full_name === "string") update.full_name = body.full_name.trim();
    if (typeof body.password === "string" && body.password.trim()) {
      if (body.password.trim().length < 6) return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
      update.password = body.password.trim();
    }

    if (typeof body.role === "string") {
      let role = (body.role || "custom").toString().trim().slice(0, 40) || "custom";
      if (role === "super_admin" && !isSuperAdmin(caller)) {
        return NextResponse.json({ success: false, message: "Only a Super Admin can grant the Super Admin role." }, { status: 403 });
      }
      // Don't let an admin demote the protected owner or themselves out of super admin by accident.
      if (target.id === caller.id && caller.role === "super_admin" && role !== "super_admin") {
        return NextResponse.json({ success: false, message: "You cannot remove your own Super Admin role." }, { status: 400 });
      }
      update.role = role;
      update.permissions = resolvePermissions(role, body.permissions);
    } else if (Array.isArray(body.permissions)) {
      update.permissions = resolvePermissions(target.role === "custom" ? "custom" : "custom", body.permissions);
    }

    if (typeof body.status === "string") {
      const status = body.status === "suspended" ? "suspended" : "active";
      if (status === "suspended" && (target.id === caller.id || targetIsProtected)) {
        return NextResponse.json({ success: false, message: "You cannot suspend this account." }, { status: 400 });
      }
      update.status = status;
    }

    if (Object.keys(update).length === 0) return NextResponse.json({ success: false, message: "Nothing to update." }, { status: 400 });
    update.updated_at = new Date().toISOString();

    const { error } = await supabaseAdmin.from("admin_profile").update(update).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Staff account updated." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update account." }, { status: 500 });
  }
}

// DELETE — remove a staff account by id (?id=...)
export async function DELETE(request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const caller = await validateSession(request, supabaseAdmin);
    if (!caller) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    if (!canManageStaff(caller)) return NextResponse.json({ success: false, message: "You do not have permission to remove staff." }, { status: 403 });

    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Account id is required." }, { status: 400 });
    if (id === caller.id) return NextResponse.json({ success: false, message: "You cannot delete the account you are logged in with." }, { status: 400 });

    const { data: all } = await supabaseAdmin.from("admin_profile").select("id");
    if (all && all.length <= 1) return NextResponse.json({ success: false, message: "At least one admin account must remain." }, { status: 400 });

    const { data: target } = await supabaseAdmin.from("admin_profile").select("*").eq("id", id).maybeSingle();
    if (target && (target.email || "").toLowerCase() === PROTECTED_EMAIL && (caller.email || "").toLowerCase() !== PROTECTED_EMAIL) {
      return NextResponse.json({ success: false, message: "This owner account is protected." }, { status: 403 });
    }

    const { error } = await supabaseAdmin.from("admin_profile").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Staff account deleted." });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Failed to delete account." }, { status: 500 });
  }
}
