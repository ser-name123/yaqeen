"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { ADMIN_TABS, ROLE_PRESETS, ROLE_KEYS, roleLabel, resolvePermissions } from "@/lib/roles";
import "./AdminStaff.css";

const swal = (o) => Swal.fire({ background: "#fdfcf9", color: "#2c251e", confirmButtonColor: "#8c5d31", ...o });
const token = () => { try { return localStorage.getItem("aero_admin_token"); } catch { return null; } };
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const EMPTY = { id: null, full_name: "", email: "", password: "", role: "content_editor", customName: "", status: "active", permissions: resolvePermissions("content_editor") };

function fmtDate(d) {
  if (!d) return "Never";
  try { return new Date(d).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return "—"; }
}

const roleColors = {
  super_admin: "#8c5d31", manager: "#3C6B2E", content_editor: "#2563a8",
  support: "#A9631E", seo_specialist: "#6b4bA8", custom: "#7a6a4f",
};

export default function AdminStaff() {
  const [accounts, setAccounts] = useState([]);
  const [callerRole, setCallerRole] = useState("");
  const [needsMigration, setNeedsMigration] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // form object or null
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) { setAccounts(data.accounts || []); setCallerRole(data.callerRole || ""); setNeedsMigration(!!data.needsMigration); }
      else if (res.status === 403) swal({ icon: "warning", title: "No access", text: data.message });
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const canGrantSuper = callerRole === "super_admin";
  const roleOptions = ROLE_KEYS.filter((r) => r !== "super_admin" || canGrantSuper);

  const openCreate = () => setEditing({ ...EMPTY });
  const openEdit = (a) => {
    const preset = ROLE_PRESETS[a.role];
    setEditing({
      id: a.id, full_name: a.full_name || "", email: a.email, password: "",
      role: preset ? a.role : "custom",
      customName: preset ? "" : (a.role || "Custom Role"),
      status: a.status || "active",
      permissions: Array.isArray(a.permissions) ? a.permissions : resolvePermissions(a.role, a.permissions),
    });
  };

  // Changing the role pre-fills the section checkboxes from that role's preset.
  const changeRole = (r) => setEditing((e) => ({
    ...e, role: r,
    customName: r === "custom" ? (e.customName || "Custom Role") : "",
    permissions: resolvePermissions(r, e.permissions),
  }));

  // Toggling a section makes it a Custom role (so the exact choices are honoured).
  const togglePerm = (key) => setEditing((e) => {
    let role = e.role, customName = e.customName;
    let perms = Array.isArray(e.permissions) ? [...e.permissions] : [];
    if (role !== "custom" && role !== "super_admin") {
      // starting from a preset -> switch to custom, keep the preset's sections
      perms = resolvePermissions(e.role, e.permissions);
      customName = customName || (ROLE_PRESETS[role] ? `${ROLE_PRESETS[role].label} (Custom)` : "Custom Role");
      role = "custom";
    }
    const has = perms.includes(key);
    return { ...e, role, customName, permissions: has ? perms.filter((k) => k !== key) : [...perms, key] };
  });

  const setAllPerms = (on) => setEditing((e) => ({
    ...e,
    role: e.role === "super_admin" ? e.role : "custom",
    customName: e.role === "custom" || e.role === "super_admin" ? e.customName : (e.customName || "Custom Role"),
    permissions: on ? ADMIN_TABS.map((t) => t.key) : [],
  }));

  const save = async () => {
    if (!editing) return;
    if (!editing.id && (!editing.email.trim() || !editing.password.trim())) {
      swal({ icon: "warning", title: "Missing details", text: "Email and password are required." }); return;
    }
    const roleToSend = editing.role === "custom" ? (editing.customName.trim() || "Custom") : editing.role;
    setSaving(true);
    try {
      const method = editing.id ? "PATCH" : "POST";
      const payload = editing.id
        ? { id: editing.id, full_name: editing.full_name, role: roleToSend, status: editing.status, permissions: editing.permissions, ...(editing.password.trim() ? { password: editing.password } : {}) }
        : { email: editing.email, password: editing.password, full_name: editing.full_name, role: roleToSend, status: editing.status, permissions: editing.permissions };
      const res = await fetch("/api/admin/accounts", { method, headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed.");
      setEditing(null);
      load();
      swal({ icon: "success", title: editing.id ? "Updated" : "Staff added", timer: 1400, showConfirmButton: false });
    } catch (err) {
      swal({ icon: "error", title: "Failed", text: err.message });
    } finally { setSaving(false); }
  };

  const toggleStatus = async (a) => {
    const next = a.status === "suspended" ? "active" : "suspended";
    const r = await swal({ title: next === "suspended" ? "Suspend account?" : "Reactivate account?", text: next === "suspended" ? `${a.email} will not be able to log in.` : `${a.email} can log in again.`, icon: "question", showCancelButton: true, confirmButtonText: next === "suspended" ? "Suspend" : "Reactivate", confirmButtonColor: next === "suspended" ? "#c0392b" : "#3C6B2E" });
    if (!r.isConfirmed) return;
    try {
      const res = await fetch("/api/admin/accounts", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ id: a.id, status: next }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      load();
    } catch (err) { swal({ icon: "error", title: "Failed", text: err.message }); }
  };

  const remove = async (a) => {
    const r = await swal({ title: "Delete staff account?", text: `${a.email} will be permanently removed.`, icon: "warning", showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#c0392b" });
    if (!r.isConfirmed) return;
    try {
      const res = await fetch(`/api/admin/accounts?id=${encodeURIComponent(a.id)}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      load();
    } catch (err) { swal({ icon: "error", title: "Failed", text: err.message }); }
  };

  return (
    <div className="astaff">
      <div className="astaff-head">
        <div>
          <h3>Staff Accounts</h3>
          <p>Create staff, assign roles, control which sections each person can access, and suspend or remove access.</p>
        </div>
        <button className="astaff-add" onClick={openCreate}>+ Add Staff</button>
      </div>

      {needsMigration && (
        <div className="astaff-migrate">
          <strong>⚠️ Database setup pending.</strong> Roles &amp; permissions won’t save yet. Run <code>supabase-staff-schema.sql</code> in your Supabase SQL editor, then reload this page.
        </div>
      )}

      {loading ? (
        <div className="astaff-loading">Loading staff…</div>
      ) : accounts.length === 0 ? (
        <div className="astaff-empty">No staff accounts yet. Click “Add Staff” to create one.</div>
      ) : (
        <div className="astaff-list">
          {accounts.map((a) => (
            <div className={`astaff-card ${a.status === "suspended" ? "suspended" : ""}`} key={a.id}>
              <div className="astaff-avatar" style={{ background: roleColors[a.role] || "#8c5d31" }}>
                {(a.full_name || a.email || "?").trim().charAt(0).toUpperCase()}
              </div>
              <div className="astaff-info">
                <div className="astaff-name-row">
                  <span className="astaff-name">{a.full_name || a.email.split("@")[0]}</span>
                  {a.is_self && <span className="astaff-tag self">You</span>}
                  {a.is_protected && <span className="astaff-tag owner">Owner</span>}
                </div>
                <div className="astaff-email">{a.email}</div>
                <div className="astaff-meta">
                  <span className="astaff-role" style={{ color: roleColors[a.role] || "#7a6a4f", borderColor: (roleColors[a.role] || "#7a6a4f") + "44" }}>{roleLabel(a.role)}</span>
                  <span className={`astaff-status ${a.status}`}>{a.status === "suspended" ? "Suspended" : "Active"}</span>
                  <span className="astaff-perms">{a.role === "super_admin" ? "All sections" : `${(a.permissions || []).length} sections`}</span>
                  <span className="astaff-login">Last login: {fmtDate(a.last_login_at)}</span>
                </div>
              </div>
              <div className="astaff-actions">
                <button onClick={() => openEdit(a)}>Edit</button>
                {!a.is_self && !a.is_protected && (
                  <button className={a.status === "suspended" ? "ok" : "warn"} onClick={() => toggleStatus(a)}>
                    {a.status === "suspended" ? "Reactivate" : "Suspend"}
                  </button>
                )}
                {!a.is_self && !a.is_protected && <button className="del" onClick={() => remove(a)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="astaff-overlay" onClick={() => setEditing(null)}>
          <div className="astaff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="astaff-modal-head">
              <span>{editing.id ? "Edit Staff Account" : "Add Staff Account"}</span>
              <button onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="astaff-modal-body">
              <label className="astaff-lbl">Full Name</label>
              <input className="astaff-input" value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} placeholder="e.g. Ayesha Khan" />

              <label className="astaff-lbl">Email {editing.id && <span className="astaff-hint">(cannot be changed)</span>}</label>
              <input className="astaff-input" type="email" value={editing.email} disabled={!!editing.id} onChange={(e) => setEditing({ ...editing, email: e.target.value })} placeholder="staff@example.com" />

              <label className="astaff-lbl">{editing.id ? "Reset Password " : "Password "}<span className="astaff-hint">{editing.id ? "(leave blank to keep current)" : "(min 6 characters)"}</span></label>
              <input className="astaff-input" type="text" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} placeholder={editing.id ? "New password (optional)" : "Set a password"} />

              <label className="astaff-lbl">Role</label>
              <select className="astaff-input" value={editing.role} onChange={(e) => changeRole(e.target.value)}>
                {roleOptions.map((r) => <option key={r} value={r}>{r === "custom" ? "Custom role" : ROLE_PRESETS[r].label}</option>)}
              </select>
              {editing.role === "custom" ? (
                <>
                  <label className="astaff-lbl">Role name <span className="astaff-hint">(your own label)</span></label>
                  <input className="astaff-input" value={editing.customName} onChange={(e) => setEditing({ ...editing, customName: e.target.value })} placeholder="e.g. Blog Editor, Front Desk, Finance" />
                </>
              ) : (
                <p className="astaff-role-desc">{ROLE_PRESETS[editing.role]?.desc}</p>
              )}

              {editing.role === "super_admin" ? (
                <>
                  <label className="astaff-lbl">Section Access</label>
                  <div className="astaff-allnote">✓ Full access to every section, including Staff Accounts.</div>
                </>
              ) : (
                <>
                  <div className="astaff-lbl-row">
                    <label className="astaff-lbl">Section Access <span className="astaff-hint">(tick what this staff can open)</span></label>
                    <span className="astaff-perm-tools">
                      <button type="button" onClick={() => setAllPerms(true)}>Select all</button>
                      <button type="button" onClick={() => setAllPerms(false)}>Clear</button>
                    </span>
                  </div>
                  <div className="astaff-perm-grid">
                    {ADMIN_TABS.map((t) => (
                      <label key={t.key} className={`astaff-perm ${editing.permissions.includes(t.key) ? "on" : ""}`}>
                        <input type="checkbox" checked={editing.permissions.includes(t.key)} onChange={() => togglePerm(t.key)} />
                        <span>{t.icon} {t.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="astaff-role-desc">{editing.permissions.length} of {ADMIN_TABS.length} sections selected.</p>
                </>
              )}

              {editing.id && (
                <>
                  <label className="astaff-lbl">Status</label>
                  <div className="astaff-status-toggle">
                    <button type="button" className={editing.status === "active" ? "on" : ""} onClick={() => setEditing({ ...editing, status: "active" })}>Active</button>
                    <button type="button" className={editing.status === "suspended" ? "on danger" : ""} onClick={() => setEditing({ ...editing, status: "suspended" })}>Suspended</button>
                  </div>
                </>
              )}

              <button className="astaff-save" onClick={save} disabled={saving}>{saving ? "Saving…" : editing.id ? "Save Changes" : "Create Staff Account"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
