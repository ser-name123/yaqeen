"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { supabase } from "@/lib/supabase";
import { FOOTER_DEFAULTS } from "@/lib/layout";
import { getWhatsAppLink } from "@/lib/whatsapp";

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const TRUST_ICONS = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
];

const DEFAULT_COURSES = [
  { id: "quran-reading", title: "Quran Reading for Beginners" },
  { id: "tajweed-masterclass", title: "Quran Tajweed Masterclass" },
  { id: "quran-memorization", title: "Quran Hifz Memorization" },
  { id: "tafseer-understanding", title: "Tafseer & Quran Understanding" },
  { id: "islamic-studies", title: "Islamic Studies & Character" },
  { id: "learn-arabic", title: "Arabic Language for Quran" },
  { id: "daily-duas", title: "Daily Duas & Islamic Manners" },
];

export default function Footer({ faviconUrl: propFaviconUrl }) {
  const [footerCourses, setFooterCourses] = useState(DEFAULT_COURSES);
  const [layout, setLayout] = useState(FOOTER_DEFAULTS);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  useEffect(() => {
    async function loadLatestCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title")
          .order("created_at", { ascending: false })
          .limit(7);
        if (error) throw error;
        if (data && data.length > 0) {
          // If fetched courses are fewer than 5, supplement with defaults
          if (data.length < 5) {
            // De-dupe by title (DB ids and default slug ids never match).
            const existingTitles = new Set(data.map((c) => (c.title || "").trim().toLowerCase()));
            const merged = [...data, ...DEFAULT_COURSES.filter((c) => !existingTitles.has((c.title || "").trim().toLowerCase()))].slice(0, 7);
            setFooterCourses(merged);
          } else {
            setFooterCourses(data);
          }
        }
      } catch (err) {
        console.warn("Could not load latest courses for footer:", err);
      }
    }
    loadLatestCourses();
  }, []);

  useEffect(() => {
    fetch("/api/layout")
      .then((r) => r.json())
      .then((d) => { if (d?.config) setLayout(d.config); })
      .catch(() => {});
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    setNewsletterError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail.trim(),
          source: "Website Footer"
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterSuccess(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterSuccess(false), 5000);
      } else {
        setNewsletterError(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      console.error("Footer newsletter subscription error:", err);
      // Show success for UI grace
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const settings = useSettings();
  const faviconUrl = propFaviconUrl || settings.faviconUrl;
  const {
    logoText,
    contactEmail,
    contactPhone,
    socialFacebook,
    socialInstagram,
    socialYoutube,
    socialWhatsapp,
  } = useSettings();

  const displayFacebook = socialFacebook || "https://facebook.com";
  const displayInstagram = socialInstagram || "https://instagram.com";
  const displayYoutube = socialYoutube || "https://youtube.com";
  const displayWhatsapp = getWhatsAppLink(socialWhatsapp, contactPhone);

  const displayPhone = contactPhone || "+44 7488 848483";
  const displayEmail = contactEmail || "info@yaqeeninstitute.com";
  const displayCompany = logoText ? `${logoText.toUpperCase()} INSTITUTE` : "YAQEEN INSTITUTE";

  // Custom footer courses override the auto DB list when the admin sets them.
  const coursesToShow = (layout.footer_courses && layout.footer_courses.length)
    ? layout.footer_courses.map((c, i) => ({ key: `fc${i}`, label: c.label, url: c.url || "#" }))
    : footerCourses.map((c) => ({ key: c.id, label: c.title, url: `/courses/${slugify(c.title)}` }));

  return (
    <footer className="footer">
      {/* Decorative subtle ambient background glow */}
      <div className="footer-glow footer-glow-left" aria-hidden="true" />
      <div className="footer-glow footer-glow-right" aria-hidden="true" />

      <div className="footer-container">
        
        {/* =========================================================================
           1. TOP TRUST & VALUE HIGHLIGHTS STRIP
           ========================================================================= */}
        <div className="footer-trust-strip">
          {(layout.trust_badges || []).map((b, i) => (
            <div className="footer-trust-item" key={i}>
              <div className="footer-trust-icon-box">{TRUST_ICONS[i % TRUST_ICONS.length]}</div>
              <div className="footer-trust-text">
                <strong>{b.title}</strong>
                <span>{b.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================================
           2. MAIN 4-COLUMN FOOTER GRID
           ========================================================================= */}
        <div className="footer-columns">

          {/* COLUMN 1: BRAND BIO & TRUST BADGES */}
          <div className="footer-column footer-col-brand">
            <div className="footer-brand-header">
              <Link href="/" className="footer-brand-logo-link">
                {faviconUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={faviconUrl} alt="YAQEEN Logo" className="footer-brand-logo-img" />
                ) : (
                  <img src="/images/logo.png" alt="YAQEEN Logo" className="footer-brand-logo-img" />
                )}
                <div className="footer-brand-name-wrap">
                  <span className="footer-brand-name">{displayCompany}</span>
                  <span className="footer-brand-tagline">{layout.footer_tagline}</span>
                </div>
              </Link>
            </div>

            <p className="footer-brand-desc">{layout.footer_description}</p>

            {/* Live Student Rating Pill */}
            <div className="footer-rating-card">
              <div className="footer-stars">★★★★★</div>
              <div className="footer-rating-info">
                <span className="footer-rating-score">{layout.footer_rating_score}</span>
                <span className="footer-rating-sub">{layout.footer_rating_text}</span>
              </div>
            </div>

            {/* Quick WhatsApp Live Action */}
            <a 
              href={displayWhatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-whatsapp-chat-pill"
            >
              <span className="footer-pulse-dot" />
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/></svg>
              <span>{layout.footer_whatsapp_label}</span>
            </a>
          </div>

          {/* COLUMN 2: DISCOVER / QUICK LINKS */}
          <div className="footer-column footer-col-links">
            <h4 className="footer-column-title">
              <span>{layout.explore_title}</span>
              <span className="footer-title-bar" />
            </h4>
            <ul className="footer-links">
              {(layout.explore_links || []).map((l, i) => (
                <li className="footer-link-item" key={i}>
                  <Link href={l.url || "#"} className={`footer-link ${l.badge ? "highlight-trial" : ""}`}>
                    <span>{l.label}</span>
                    {l.badge && <span className="footer-badge-free">{l.badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: COURSES */}
          <div className="footer-column footer-col-links">
            <h4 className="footer-column-title">
              <span>{layout.courses_title}</span>
              <span className="footer-title-bar" />
            </h4>
            <ul className="footer-links">
              {coursesToShow.map((c) => (
                <li key={c.key} className="footer-link-item">
                  <Link href={c.url} className="footer-link">
                    <span className="footer-link-bullet">›</span>
                    <span>{c.label}</span>
                  </Link>
                </li>
              ))}
              <li className="footer-link-item footer-view-all-courses">
                <Link href={layout.view_all_url || "/courses"} className="footer-link-all">
                  <span>{layout.view_all_label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: HELP CENTER & STAY IN TOUCH */}
          <div className="footer-column footer-col-contact">
            <h4 className="footer-column-title">
              <span>{layout.connect_title}</span>
              <span className="footer-title-bar" />
            </h4>

            {/* Direct Contact Cards */}
            <div className="footer-contact-list">
              <a href={`tel:${displayPhone.replace(/[^\d+]/g, "")}`} className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.91.72A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">{layout.contact_phone_label}</span>
                  <span className="footer-contact-val">{displayPhone}</span>
                </div>
              </a>

              <a href={`mailto:${displayEmail}`} className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">{layout.contact_email_label}</span>
                  <span className="footer-contact-val">{displayEmail}</span>
                </div>
              </a>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="footer-newsletter-card">
              <span className="footer-newsletter-title">{layout.newsletter_title}</span>
              <p className="footer-newsletter-desc">{layout.newsletter_desc}</p>

              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                <div className="footer-newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="footer-newsletter-input"
                  />
                  <button 
                    type="submit" 
                    disabled={newsletterLoading}
                    className="footer-newsletter-btn"
                    aria-label="Subscribe"
                  >
                    {newsletterLoading ? (
                      <span className="footer-spinner" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    )}
                  </button>
                </div>
                {newsletterSuccess && (
                  <p className="footer-newsletter-msg-success">✓ JazakAllah Khair! Subscribed successfully.</p>
                )}
              </form>
            </div>

            {/* Social Media Links */}
            <div className="footer-social-section">
              <span className="footer-social-heading">{layout.social_heading}</span>
              <div className="footer-social-row">
                <a href={displayWhatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-circle whatsapp" aria-label="WhatsApp" title="WhatsApp">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/></svg>
                </a>
                {socialFacebook && socialFacebook !== "" && (
                  <a href={displayFacebook} target="_blank" rel="noopener noreferrer" className="footer-social-circle facebook" aria-label="Facebook" title="Facebook">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                  </a>
                )}
                {socialInstagram && socialInstagram !== "" && (
                  <a href={displayInstagram} target="_blank" rel="noopener noreferrer" className="footer-social-circle instagram" aria-label="Instagram" title="Instagram">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </a>
                )}
                {socialYoutube && socialYoutube !== "" && (
                  <a href={displayYoutube} target="_blank" rel="noopener noreferrer" className="footer-social-circle youtube" aria-label="YouTube" title="YouTube">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
           3. BOTTOM BAR — logo, copyright, security & legal
           ========================================================================= */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-brand">
            <div className="footer-bottom-logo">
              {faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={faviconUrl} alt="YAQEEN Logo" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
              ) : (
                <img src="/images/logo.png" alt="YAQEEN Logo" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
              )}
            </div>
            <div className="footer-bottom-meta">
              <p className="footer-copyright-text">© {new Date().getFullYear()} {displayCompany}. All rights reserved.</p>
              <p className="footer-address">{layout.footer_address}</p>
            </div>
          </div>

          <div className="footer-bottom-center-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>{layout.footer_ssl_text}</span>
          </div>

          <div className="footer-legal-links">
            <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
            <span className="footer-legal-separator">·</span>
            <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <span className="footer-legal-separator">·</span>
            <Link href="/refund" className="footer-legal-link">Refund Policy</Link>
            <span className="footer-legal-separator">·</span>
            <Link href="/cookies" className="footer-legal-link">Cookies Policy</Link>
            <span className="footer-legal-separator">·</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="footer-legal-link">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

