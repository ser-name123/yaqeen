"use client";

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import "./AdminTopbar.css";

const swal = (o) => Swal.fire({ background: "#fdfcf9", color: "#2c251e", confirmButtonColor: "#8c5d31", ...o });

const IconBell = () => (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
const IconGlobe = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconBroom = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19.4 8.6 12 16l-4-4 7.4-7.4a2.1 2.1 0 0 1 3 3z" /><path d="m12 16-1.5 4.5L5 22l1.5-5.5L11 15" /><path d="M8 12 4.5 15.5" /></svg>);
const IconChevron = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
const IconUser = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconGear = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
const IconLogout = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);

export default function AdminTopbar({ adminEmail = "", counts = {}, onNavigate, onLogout }) {
  const [openMenu, setOpenMenu] = useState(null); // 'notif' | 'profile' | null
  const [clearing, setClearing] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openMenu]);

  const notifItems = [
    { label: "Free Trial Bookings", tab: "freeTrials", n: counts.freeTrials || 0 },
    { label: "Contact Inquiries", tab: "contacts", n: counts.inquiries || 0 },
    { label: "Teacher Applications", tab: "teacherApps", n: counts.teacherApps || 0 },
    { label: "Student Registrations", tab: "studentApps", n: counts.studentApps || 0 },
    { label: "Live Chat", tab: "liveChat", n: counts.chats || 0 },
  ];
  const notifTotal = notifItems.reduce((s, i) => s + (i.n || 0), 0);

  const go = (tab) => { setOpenMenu(null); onNavigate && onNavigate(tab); };

  const clearCache = async () => {
    setClearing(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aero_admin_token") : null;
      const res = await fetch("/api/admin/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed.");
      swal({ icon: "success", title: "Cache Cleared", text: data.message, timer: 1800, showConfirmButton: false });
    } catch (err) {
      swal({ icon: "error", title: "Failed", text: err.message });
    } finally {
      setClearing(false);
    }
  };

  const initial = (adminEmail || "A").trim().charAt(0).toUpperCase();

  return (
    <div className="atb" ref={rootRef}>
      <div className="atb-left">
        <span className="atb-brand">Admin Console</span>
        <span className="atb-sub">Yaqeen Institute</span>
      </div>

      <div className="atb-right">
        {/* Visit website */}
        <a className="atb-btn" href="/" target="_blank" rel="noopener noreferrer" title="Open live website">
          <IconGlobe /><span className="atb-btn-label">Visit Website</span>
        </a>

        {/* Clear cache */}
        <button className="atb-btn" onClick={clearCache} disabled={clearing} title="Clear the server cache so live site updates now">
          <IconBroom /><span className="atb-btn-label">{clearing ? "Clearing…" : "Clear Cache"}</span>
        </button>

        {/* Notifications */}
        <div className="atb-pop-wrap">
          <button className="atb-icon-btn" onClick={() => setOpenMenu(openMenu === "notif" ? null : "notif")} title="Notifications">
            <IconBell />
            {notifTotal > 0 && <span className="atb-badge">{notifTotal > 99 ? "99+" : notifTotal}</span>}
          </button>
          {openMenu === "notif" && (
            <div className="atb-pop">
              <div className="atb-pop-head">Notifications</div>
              {notifItems.map((it) => (
                <button key={it.tab} className="atb-pop-item" onClick={() => go(it.tab)}>
                  <span>{it.label}</span>
                  <span className={`atb-pop-count ${it.n ? "hot" : ""}`}>{it.n}</span>
                </button>
              ))}
              <div className="atb-pop-foot" onClick={() => go("overview")}>View overview →</div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="atb-pop-wrap">
          <button className="atb-profile" onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}>
            <span className="atb-avatar">{initial}</span>
            <span className="atb-profile-email">{adminEmail || "Admin"}</span>
            <IconChevron />
          </button>
          {openMenu === "profile" && (
            <div className="atb-pop atb-pop-right">
              <div className="atb-pop-head">
                <div className="atb-pop-name">Signed in as</div>
                <div className="atb-pop-email">{adminEmail || "Admin"}</div>
              </div>
              <button className="atb-pop-item" onClick={() => go("profile")}><IconUser /> Profile Settings</button>
              <button className="atb-pop-item" onClick={() => go("seo")}><IconGear /> SEO Manager</button>
              <button className="atb-pop-item danger" onClick={() => { setOpenMenu(null); onLogout && onLogout(); }}><IconLogout /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
