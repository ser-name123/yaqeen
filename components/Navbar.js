"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { FOOTER_DEFAULTS } from "@/lib/layout";

const IconCaret = () => (
  <svg className="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.91.72A2 2 0 0 1 22 16.92z" /></svg>
);

const linkStyle = { textDecoration: "none", fontSize: "16.5px", fontWeight: "600", color: "#5C4D3C", transition: "color 0.2s ease", letterSpacing: "0.2px" };

export default function Navbar({ faviconUrl = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  const [layout, setLayout] = useState(FOOTER_DEFAULTS);
  const { contactPhone } = useSettings();
  const phone = contactPhone || "+44 7700 183483";
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    fetch("/api/layout").then((r) => r.json()).then((d) => { if (d?.config) setLayout(d.config); }).catch(() => {});
  }, []);

  const navLinks = layout.header_links || [];

  return (
    <header 
      className="header-wrapper-outer" 
      style={{ 
        position: isHomePage ? "fixed" : "sticky",
        left: isHomePage ? 0 : "auto",
        right: isHomePage ? 0 : "auto",
        width: "100%"
      }}
    >
      <div className="header-pill-container">
        
        {/* Brand Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/images/logo.png" alt="YAQEEN Logo" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
        </Link>

        {/* Desktop Menu */}
        <nav className="header-nav-menu">
          {navLinks.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <li><span className="header-item-divider" /></li>}
              {item.dropdown && item.dropdown.length ? (
                <li
                  className={`nav-dropdown ${openDrop === i ? "open" : ""}`}
                  onMouseEnter={() => setOpenDrop(i)}
                  onMouseLeave={() => setOpenDrop(null)}
                >
                  <button
                    type="button"
                    className={`nav-dropdown-trigger ${openDrop === i ? "active" : ""}`}
                    onClick={() => setOpenDrop((o) => (o === i ? null : i))}
                    aria-expanded={openDrop === i}
                    suppressHydrationWarning
                    style={{ ...linkStyle, background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    {item.label} <IconCaret />
                  </button>
                  <div className="nav-dropdown-menu">
                    {item.dropdown.map((d, j) => (
                      <Link key={j} href={d.url || "#"} onClick={() => setOpenDrop(null)}>{d.label}</Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li><Link href={item.url || "#"} className="header-nav-link" style={linkStyle}>{item.label}</Link></li>
              )}
            </Fragment>
          ))}
        </nav>

        {/* Header CTA Actions */}
        <div className="header-actions">
          {/* Phone Badge Button */}
          <a href={telHref} className="header-phone-pill">
            <span className="header-phone-icon-badge">
              <IconPhone />
            </span>
            {phone}
          </a>

          {/* Book Trial Badge */}
          <Link href={layout.header_cta_url || "/register"} className="header-cta-pill">{layout.header_cta_label}</Link>

          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" suppressHydrationWarning style={{ border: "none", background: "none", cursor: "pointer" }}>
            <span style={{ transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none", backgroundColor: "var(--fg-color)" }}></span>
            <span style={{ opacity: isOpen ? 0 : 1, backgroundColor: "var(--fg-color)" }}></span>
            <span style={{ transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", backgroundColor: "var(--fg-color)" }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", left: "16px", right: "16px", marginTop: "12px", padding: "22px",
          display: "flex", flexDirection: "column", gap: "16px", zIndex: 999,
          backgroundColor: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(44, 37, 30, 0.08)", maxHeight: "78vh", overflowY: "auto"
        }}>
          {navLinks.map((item, i) => (
            item.dropdown && item.dropdown.length ? (
              <div key={i}>
                <span className="nav-mob-group-title">{item.label}</span>
                <div className="nav-mob-sub">
                  {item.dropdown.map((d, j) => (
                    <Link key={j} href={d.url || "#"} style={linkStyle} onClick={() => setIsOpen(false)}>{d.label}</Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={i} href={item.url || "#"} style={linkStyle} onClick={() => setIsOpen(false)}>{item.label}</Link>
            )
          ))}
          <a href={telHref} className="nav-phone" style={{ display: "inline-flex", justifyContent: "center", marginTop: "6px" }}><IconPhone /> {phone}</a>
          <Link href={layout.header_cta_url || "/register"} className="nav-cta" style={{ display: "inline-flex", justifyContent: "center" }} onClick={() => setIsOpen(false)}>{layout.header_cta_label}</Link>
        </div>
      )}
    </header>
  );
}
