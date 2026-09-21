"use client";

import { useEffect, useState, useCallback } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { htmlToText } from "@/lib/richtext";
import "./AdminChat.css";
import "./AdminFooter.css";

const token = () => { try { return localStorage.getItem("aero_admin_token"); } catch { return null; } };

const TEXT_FIELDS = [
  ["footer_tagline", "Tagline (under brand name)"],
  ["footer_description", "Brand description", true],
  ["footer_rating_score", "Rating score (e.g. 4.9 / 5.0)"],
  ["footer_rating_text", "Rating sub-text"],
  ["footer_whatsapp_label", "WhatsApp button label"],
  ["explore_title", "Column title: Explore"],
  ["courses_title", "Column title: Courses"],
  ["connect_title", "Column title: Help & Connect"],
  ["view_all_label", "‘View All Courses’ label"],
  ["view_all_url", "‘View All Courses’ link"],
  ["contact_phone_label", "Phone label (e.g. Call / WhatsApp)"],
  ["contact_email_label", "Email label (e.g. Email Us)"],
  ["newsletter_title", "Newsletter title"],
  ["newsletter_desc", "Newsletter sub-text"],
  ["social_heading", "Social heading"],
  ["footer_address", "Address (bottom bar)"],
  ["footer_ssl_text", "Security badge text"],
];

export default function AdminFooter() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [view, setView] = useState("header");   // 'header' | 'footer'

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/layout", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setCfg({ ...data.config, explore_links: data.config.explore_links || [], trust_badges: data.config.trust_badges || [], footer_courses: data.config.footer_courses || [], header_links: data.config.header_links || [] });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true); setSavedMsg("");
    try {
      const cleanCfg = { ...cfg, footer_description: htmlToText(cfg.footer_description) };
      const res = await fetch("/api/admin/layout", { method: "POST", headers: authHeaders(), body: JSON.stringify({ config: cleanCfg }) });
      const data = await res.json();
      setSavedMsg(data.success ? "Saved! Refresh the website to see changes." : (data.message || "Failed to save."));
    } catch { setSavedMsg("Failed to save."); }
    finally { setSaving(false); setTimeout(() => setSavedMsg(""), 5000); }
  }

  if (!cfg) return <div className="glass-panel" style={{ padding: 24 }}>Loading footer settings…</div>;

  const setField = (k, v) => setCfg((c) => ({ ...c, [k]: v }));

  // explore_links helpers
  const updLink = (i, key, v) => setCfg((c) => { const a = [...c.explore_links]; a[i] = { ...a[i], [key]: v }; return { ...c, explore_links: a }; });
  const addLink = () => setCfg((c) => ({ ...c, explore_links: [...c.explore_links, { label: "", url: "/", badge: "" }] }));
  const delLink = (i) => setCfg((c) => ({ ...c, explore_links: c.explore_links.filter((_, x) => x !== i) }));
  const moveLink = (i, dir) => setCfg((c) => { const a = [...c.explore_links]; const j = i + dir; if (j < 0 || j >= a.length) return c; [a[i], a[j]] = [a[j], a[i]]; return { ...c, explore_links: a }; });

  // footer_courses helpers (optional custom list)
  const updCourse = (i, key, v) => setCfg((c) => { const a = [...c.footer_courses]; a[i] = { ...a[i], [key]: v }; return { ...c, footer_courses: a }; });
  const addCourse = () => setCfg((c) => ({ ...c, footer_courses: [...c.footer_courses, { label: "", url: "/courses/" }] }));
  const delCourse = (i) => setCfg((c) => ({ ...c, footer_courses: c.footer_courses.filter((_, x) => x !== i) }));

  // trust_badges helpers
  const updBadge = (i, key, v) => setCfg((c) => { const a = [...c.trust_badges]; a[i] = { ...a[i], [key]: v }; return { ...c, trust_badges: a }; });
  const addBadge = () => setCfg((c) => ({ ...c, trust_badges: [...c.trust_badges, { title: "", subtitle: "" }] }));
  const delBadge = (i) => setCfg((c) => ({ ...c, trust_badges: c.trust_badges.filter((_, x) => x !== i) }));

  // header_links helpers (nav items + dropdown sub-items)
  const updNav = (i, key, v) => setCfg((c) => { const a = [...c.header_links]; a[i] = { ...a[i], [key]: v }; return { ...c, header_links: a }; });
  const addNav = () => setCfg((c) => ({ ...c, header_links: [...c.header_links, { label: "", url: "/" }] }));
  const delNav = (i) => setCfg((c) => ({ ...c, header_links: c.header_links.filter((_, x) => x !== i) }));
  const moveNav = (i, dir) => setCfg((c) => { const a = [...c.header_links]; const j = i + dir; if (j < 0 || j >= a.length) return c; [a[i], a[j]] = [a[j], a[i]]; return { ...c, header_links: a }; });
  const addSub = (i) => setCfg((c) => { const a = [...c.header_links]; const d = [...(a[i].dropdown || []), { label: "", url: "/" }]; a[i] = { ...a[i], dropdown: d }; return { ...c, header_links: a }; });
  const updSub = (i, j, key, v) => setCfg((c) => { const a = [...c.header_links]; const d = [...(a[i].dropdown || [])]; d[j] = { ...d[j], [key]: v }; a[i] = { ...a[i], dropdown: d }; return { ...c, header_links: a }; });
  const delSub = (i, j) => setCfg((c) => { const a = [...c.header_links]; const d = (a[i].dropdown || []).filter((_, x) => x !== j); a[i] = { ...a[i], dropdown: d }; return { ...c, header_links: a }; });

  return (
    <div className="af-wrap">
      <div className="glass-panel af-panel">
        <div className="af-head">
          <div className="ac-tabs">
            <button className={view === "header" ? "active" : ""} onClick={() => setView("header")}>🔝 Header</button>
            <button className={view === "footer" ? "active" : ""} onClick={() => setView("footer")}>🦶 Footer</button>
          </div>
          <div className="af-save-area">
            {savedMsg && <span className="af-saved">{savedMsg}</span>}
            <button className="ac-save-btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </div>

        {/* ============ HEADER ============ */}
        {view === "header" && (
          <>
            <p className="ac-set-hint">Manage the top navigation menu. Logo and phone number come from Site Settings.</p>
            <div className="af-grid">
              <div className="af-field"><label className="ac-lbl">CTA button label</label><input className="ac-set-input" value={cfg.header_cta_label || ""} onChange={(e) => setField("header_cta_label", e.target.value)} /></div>
              <div className="af-field"><label className="ac-lbl">CTA button link</label><input className="ac-set-input" value={cfg.header_cta_url || ""} onChange={(e) => setField("header_cta_url", e.target.value)} /></div>
            </div>

            <div className="af-section">
              <div className="af-section-head"><h4>Menu items</h4><button className="ac-add-btn" onClick={addNav}>+ Add menu item</button></div>
              <p className="ac-set-hint">Add dropdown items to turn a menu into a dropdown (like “Discover”). No dropdown items = a simple link.</p>
              {(cfg.header_links || []).map((item, i) => (
                <div className="af-navcard" key={i}>
                  <div className="af-row">
                    <input className="ac-set-input" placeholder="Menu label" value={item.label || ""} onChange={(e) => updNav(i, "label", e.target.value)} />
                    <input className="ac-set-input" placeholder="Link (ignored if it has dropdown items)" value={item.url || ""} onChange={(e) => updNav(i, "url", e.target.value)} />
                    <div className="af-row-actions">
                      <button onClick={() => moveNav(i, -1)} title="Up">↑</button>
                      <button onClick={() => moveNav(i, 1)} title="Down">↓</button>
                      <button className="del" onClick={() => delNav(i)} title="Delete">🗑</button>
                    </div>
                  </div>
                  <div className="af-sublist">
                    {(item.dropdown || []).map((d, j) => (
                      <div className="af-subrow" key={j}>
                        <span className="af-sub-arrow">↳</span>
                        <input className="ac-set-input" placeholder="Dropdown label" value={d.label || ""} onChange={(e) => updSub(i, j, "label", e.target.value)} />
                        <input className="ac-set-input" placeholder="URL" value={d.url || ""} onChange={(e) => updSub(i, j, "url", e.target.value)} />
                        <button className="af-subdel" onClick={() => delSub(i, j)} title="Delete">🗑</button>
                      </div>
                    ))}
                    <button className="af-addsub" onClick={() => addSub(i)}>+ Add dropdown item</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============ FOOTER ============ */}
        {view === "footer" && (
        <>
        <p className="ac-set-hint">Contact number, email, social links and logo are managed in your general Site Settings. Everything else in the footer is here.</p>

        {/* text fields */}
        <div className="af-grid">
          {TEXT_FIELDS.map(([key, label, area]) => (
            <div className={`af-field ${area ? "full" : ""}`} key={key}>
              <label className="ac-lbl">{label}</label>
              {area
                ? <RichTextEditor value={cfg[key] || ""} onChange={(html) => setField(key, html)} placeholder={label} minHeight="90px" />
                : <input className="ac-set-input" value={cfg[key] || ""} onChange={(e) => setField(key, e.target.value)} />}
            </div>
          ))}
        </div>

        {/* explore links */}
        <div className="af-section">
          <div className="af-section-head"><h4>Explore links</h4><button className="ac-add-btn" onClick={addLink}>+ Add link</button></div>
          {cfg.explore_links.map((l, i) => (
            <div className="af-row" key={i}>
              <input className="ac-set-input" placeholder="Label" value={l.label || ""} onChange={(e) => updLink(i, "label", e.target.value)} />
              <input className="ac-set-input" placeholder="URL (e.g. /about)" value={l.url || ""} onChange={(e) => updLink(i, "url", e.target.value)} />
              <input className="ac-set-input af-badge" placeholder="Badge (optional)" value={l.badge || ""} onChange={(e) => updLink(i, "badge", e.target.value)} />
              <div className="af-row-actions">
                <button onClick={() => moveLink(i, -1)} title="Up">↑</button>
                <button onClick={() => moveLink(i, 1)} title="Down">↓</button>
                <button className="del" onClick={() => delLink(i)} title="Delete">🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* footer courses (optional) */}
        <div className="af-section">
          <div className="af-section-head"><h4>Footer courses (optional)</h4><button className="ac-add-btn" onClick={addCourse}>+ Add course</button></div>
          <p className="ac-set-hint">Leave empty to auto-show your latest courses from “Manage Courses”. Add items here to set a custom list instead.</p>
          {cfg.footer_courses.map((l, i) => (
            <div className="af-row" key={i}>
              <input className="ac-set-input" placeholder="Course label" value={l.label || ""} onChange={(e) => updCourse(i, "label", e.target.value)} />
              <input className="ac-set-input" placeholder="URL (e.g. /courses/quran)" value={l.url || ""} onChange={(e) => updCourse(i, "url", e.target.value)} />
              <div className="af-row-actions"><button className="del" onClick={() => delCourse(i)} title="Delete">🗑</button></div>
            </div>
          ))}
        </div>

        {/* trust badges */}
        <div className="af-section">
          <div className="af-section-head"><h4>Top trust badges</h4><button className="ac-add-btn" onClick={addBadge}>+ Add badge</button></div>
          {cfg.trust_badges.map((b, i) => (
            <div className="af-row" key={i}>
              <input className="ac-set-input" placeholder="Title" value={b.title || ""} onChange={(e) => updBadge(i, "title", e.target.value)} />
              <input className="ac-set-input" placeholder="Subtitle" value={b.subtitle || ""} onChange={(e) => updBadge(i, "subtitle", e.target.value)} />
              <div className="af-row-actions"><button className="del" onClick={() => delBadge(i)} title="Delete">🗑</button></div>
            </div>
          ))}
        </div>
        </>
        )}

        <div className="af-foot">
          {savedMsg && <span className="af-saved">{savedMsg}</span>}
          <button className="ac-save-btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}
