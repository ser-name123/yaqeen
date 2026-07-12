"use client";

import { useState } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

const DISCOVER = [
  { label: "About Us", href: "/about" },
  { label: "Our Teachers", href: "/teachers" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faqs" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" }
];

const IconCaret = () => (
  <svg className="caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.91.72A2 2 0 0 1 22 16.92z" /></svg>
);

const linkStyle = { textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease", textTransform: "uppercase", letterSpacing: "0.6px" };

export default function Navbar({ faviconUrl = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const { contactPhone } = useSettings();
  const phone = contactPhone || "+44 7700 183483";
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <header className="header" style={{
      position: "sticky", top: 0, width: "100%", zIndex: 1000,
      backgroundColor: "rgba(251, 248, 243, 0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--card-border)", boxShadow: "0 2px 16px rgba(44, 37, 30, 0.07)", transition: "all 0.3s ease"
    }}>
      <div className="nav-container" style={{ maxWidth: "1350px", margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {faviconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={faviconUrl} alt="YAQEEN INSTITUTE" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
            ) : (
              <svg width="56" height="48" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
                <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
                <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
                <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            <span style={{ textTransform: "uppercase", fontWeight: "800", color: "var(--fg-color)", fontSize: "16px", letterSpacing: "1.5px" }}>YAQEEN INSTITUTE</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="nav-menu" style={{ gap: "20px" }}>
          <li><Link href="/" className="nav-link-custom" style={linkStyle}>Home</Link></li>
          <li><span className="nav-item-divider" /></li>
          <li><Link href="/courses" className="nav-link-custom" style={linkStyle}>Our Courses</Link></li>
          <li><span className="nav-item-divider" /></li>
          <li><Link href="/pricing" className="nav-link-custom" style={linkStyle}>Pricing</Link></li>
          <li><span className="nav-item-divider" /></li>
          <li
            className={`nav-dropdown ${discoverOpen ? "open" : ""}`}
            onMouseEnter={() => setDiscoverOpen(true)}
            onMouseLeave={() => setDiscoverOpen(false)}
          >
            <button type="button" className={`nav-dropdown-trigger ${discoverOpen ? "active" : ""}`} onClick={() => setDiscoverOpen((o) => !o)} aria-expanded={discoverOpen} suppressHydrationWarning>
              Discover <IconCaret />
            </button>
            <div className="nav-dropdown-menu">
              {DISCOVER.map((d) => (
                <Link key={d.href} href={d.href} onClick={() => setDiscoverOpen(false)}>{d.label}</Link>
              ))}
            </div>
          </li>
        </nav>

        <div className="nav-actions">
          <a href={telHref} className="nav-phone"><IconPhone /> {phone}</a>
          <Link href="/book-free-trial" className="nav-cta">Book a Free Trial</Link>

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
          <Link href="/" style={linkStyle} onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/courses" style={linkStyle} onClick={() => setIsOpen(false)}>Our Courses</Link>
          <Link href="/pricing" style={linkStyle} onClick={() => setIsOpen(false)}>Pricing</Link>
          <span className="nav-mob-group-title">Discover</span>
          <div className="nav-mob-sub">
            {DISCOVER.map((d) => (
              <Link key={d.href} href={d.href} style={linkStyle} onClick={() => setIsOpen(false)}>{d.label}</Link>
            ))}
          </div>
          <a href={telHref} className="nav-phone" style={{ display: "inline-flex", justifyContent: "center", marginTop: "6px" }}><IconPhone /> {phone}</a>
          <Link href="/book-free-trial" className="nav-cta" style={{ display: "inline-flex", justifyContent: "center" }} onClick={() => setIsOpen(false)}>Book a Free Trial</Link>
        </div>
      )}
    </header>
  );
}
