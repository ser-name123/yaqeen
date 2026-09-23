"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-page-defaults";

function getIconSvg(name, color = "#556B3B", size = 20) {
  if (!name) return null;
  const raw = String(name).trim();
  
  // Custom Image URL / Uploaded Icon Support
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/") ||
    raw.startsWith("data:image") ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(raw)
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={raw}
        alt="icon"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "inline-block",
          borderRadius: "3px"
        }}
      />
    );
  }

  const icon = raw.toLowerCase();
  switch (icon) {
    case "users":
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "calendar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "shield":
    case "shield-check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "headset":
    case "headphones":
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    case "book":
    case "book-open":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "book-bookmark":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M10 2v8l3-2.5 3 2.5V2" />
        </svg>
      );
    case "books-stack":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 0-2.5 2.5z" />
          <path d="M4 15.5A2.5 2.5 0 0 1 6.5 13H20" />
          <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7H20" />
        </svg>
      );
    case "chat":
    case "speech":
    case "message":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill={color} />
          <circle cx="12" cy="10" r="1" fill={color} />
          <circle cx="15" cy="10" r="1" fill={color} />
        </svg>
      );
    case "clock":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "document":
    case "file":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "screen":
    case "laptop":
    case "monitor":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "tool":
    case "gear":
    case "settings":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "video":
    case "play":
    case "live":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <polygon points="10 7 15 10 10 13 10 7" fill={color} stroke="none" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "teacher":
    case "graduation":
    case "scholar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "chart":
    case "bar-chart":
    case "analytics":
    case "graph":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "globe":
    case "world":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "bulb":
    case "lightbulb":
    case "idea":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      );
    case "trophy":
    case "award":
    case "cup":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
        </svg>
      );
    case "diamond":
    case "gem":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M11 3L8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    case "gift":
    case "present":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
}

function renderRichText(content, fallback = "") {
  const text = content !== undefined && content !== null && content !== "" ? content : fallback;
  if (!text) return null;
  const str = String(text);
  if (/<[a-z][\s\S]*>/i.test(str)) {
    return <div className="lp-rich-text" dangerouslySetInnerHTML={{ __html: str }} />;
  }
  return text;
}

export default function LandingPageTemplate({ initialPage }) {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-stagger");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Safe data extraction with complete fallbacks
  const rawContent = initialPage?.content || {};
  const hero = { ...DEFAULT_LANDING_PAGE_CONTENT.hero, ...(rawContent.hero || {}) };
  const whyChoose = { ...DEFAULT_LANDING_PAGE_CONTENT.whyChoose, ...(rawContent.whyChoose || {}) };
  const difference = { ...DEFAULT_LANDING_PAGE_CONTENT.difference, ...(rawContent.difference || {}) };
  const ukTrust = { ...DEFAULT_LANDING_PAGE_CONTENT.ukTrust, ...(rawContent.ukTrust || {}) };
  const courses = { ...DEFAULT_LANDING_PAGE_CONTENT.courses, ...(rawContent.courses || {}) };
  const journey = { ...DEFAULT_LANDING_PAGE_CONTENT.journey, ...(rawContent.journey || {}) };
  const faqs = { ...DEFAULT_LANDING_PAGE_CONTENT.faqs, ...(rawContent.faqs || {}) };

  const trustStripItems = hero.trustStrip && hero.trustStrip.length ? hero.trustStrip : DEFAULT_LANDING_PAGE_CONTENT.hero.trustStrip;
  const whyFeatures = whyChoose.features && whyChoose.features.length ? whyChoose.features : DEFAULT_LANDING_PAGE_CONTENT.whyChoose.features;
  
  const diffLeftCards = difference.leftCards && difference.leftCards.length ? difference.leftCards : DEFAULT_LANDING_PAGE_CONTENT.difference.leftCards;
  const diffCenterParas = difference.centerParagraphs && difference.centerParagraphs.length ? difference.centerParagraphs : DEFAULT_LANDING_PAGE_CONTENT.difference.centerParagraphs;
  const diffCenterPillars = difference.centerPillars && difference.centerPillars.length ? difference.centerPillars : DEFAULT_LANDING_PAGE_CONTENT.difference.centerPillars;
  const diffRight = difference.rightCard || DEFAULT_LANDING_PAGE_CONTENT.difference.rightCard;

  const courseCards = courses.courseCards && courses.courseCards.length ? courses.courseCards : DEFAULT_LANDING_PAGE_CONTENT.courses.courseCards;
  const journeySteps = journey.steps && journey.steps.length ? journey.steps : DEFAULT_LANDING_PAGE_CONTENT.journey.steps;
  const journeyPillars = journey.pillars && journey.pillars.length ? journey.pillars : DEFAULT_LANDING_PAGE_CONTENT.journey.pillars;
  const faqList = faqs.items && faqs.items.length ? faqs.items : DEFAULT_LANDING_PAGE_CONTENT.faqs.items;

  return (
    <div style={{ backgroundColor: "#FAF7F2", background: "linear-gradient(180deg, #FAF6F0 0%, #FFFDF9 25%, #FAF7F2 60%, #FFFDF9 100%)", minHeight: "100vh", color: "#2B1F14", fontFamily: "var(--font-poppins), sans-serif" }}>
      <style>{`
        .lp-rich-text {
          display: block;
          width: 100%;
        }
        .lp-rich-text p {
          margin: 0 0 0.5em 0;
          line-height: inherit;
          color: inherit;
          font-size: inherit;
        }
        .lp-rich-text p:last-child {
          margin-bottom: 0;
        }
        .lp-rich-text strong, .lp-rich-text b {
          font-weight: 700;
        }
        .lp-rich-text em, .lp-rich-text i {
          font-style: italic;
        }
        .lp-rich-text u {
          text-decoration: underline;
        }
        .lp-rich-text ul, .lp-rich-text ol {
          margin: 0.4em 0;
          padding-left: 1.25rem;
        }
        .lp-rich-text li {
          margin-bottom: 0.2em;
        }
        .lp-rich-text a {
          color: inherit;
          text-decoration: underline;
        }
      `}</style>
      
      {/* =========================================================================
         SECTION 1: HERO & HIGHLIGHTS
         ========================================================================= */}
      <section style={{ background: "radial-gradient(ellipse at 50% 0%, #FAF1E4 0%, #FAF6F0 55%, #FFFDF9 100%)", padding: "16px 0 36px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          {/* TOP HERO GRID */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.95fr",
              gap: "50px",
              alignItems: "flex-start",
              marginBottom: "28px"
            }}
            className="landing-hero-grid"
          >
            
            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} className="scroll-reveal-left">
              
              {/* Main Headline */}
              <h1 style={{ 
                fontSize: "clamp(28px, 3.2vw, 44px)", 
                fontWeight: "700", 
                color: "#111111", 
                lineHeight: "1.2", 
                marginBottom: "20px",
                letterSpacing: "-0.3px"
              }}>
                {hero.headlinePrefix}<br />
                <span style={{ color: "#C99B4D", fontWeight: "700" }}>{hero.headlineHighlight1}</span>{hero.headlineMiddle || " with"}<br />
                <span style={{ color: "#556B3B", fontWeight: "700" }}>{hero.headlineHighlight2}</span><br />
                {hero.headlineSuffix}
              </h1>

              {/* Subheading / Tag with Gold Vertical Line */}
              {hero.tagline && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <div style={{ width: "3.5px", height: "22px", backgroundColor: "#C99B4D", borderRadius: "2px", flexShrink: 0 }} />
                  <p style={{ fontSize: "clamp(15px, 1.35vw, 17.5px)", fontWeight: "600", color: "#2B1F14", margin: 0 }}>
                    {hero.tagline}
                  </p>
                </div>
              )}

              {/* Description Paragraph */}
              <div style={{ 
                fontSize: "clamp(13.5px, 1.1vw, 14.8px)", 
                lineHeight: "1.65", 
                color: "#5C4D3C", 
                marginBottom: "32px", 
                fontWeight: "400",
                maxWidth: "620px"
              }}>
                {renderRichText(hero.description)}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                {hero.primaryBtnText && (
                  <Link
                    href={hero.primaryBtnUrl || "/register"}
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "13px 28px",
                      borderRadius: "9999px",
                      backgroundColor: "#C99B4D",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontWeight: "600",
                      boxShadow: "0 6px 18px rgba(201, 155, 77, 0.28)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#B3853B";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#C99B4D";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {hero.primaryBtnText} <span style={{ fontSize: "16px" }}>→</span>
                  </Link>
                )}

                {hero.secondaryBtnText && (
                  <Link
                    href={hero.secondaryBtnUrl || "/courses"}
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 26px",
                      borderRadius: "9999px",
                      backgroundColor: "#FFFFFF",
                      border: "1.5px solid #C99B4D",
                      color: "#C99B4D",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#FDF8F0";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {hero.secondaryBtnText} <span style={{ fontSize: "16px" }}>→</span>
                  </Link>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: HERO IMAGE & BADGES */}
            <div style={{ position: "relative" }} className="scroll-reveal-right">
              
              <div 
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px -15px rgba(43, 31, 20, 0.12)",
                  border: "1px solid #F5EBDD",
                  backgroundColor: "#FAF8F5"
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.heroImage || "/images/quran_kid_desk.png"}
                  alt={hero.heroImageAlt || "Quran student"}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    aspectRatio: "1.25",
                    objectFit: "cover"
                  }}
                />

                {/* Top-Left Floating Badge */}
                <div 
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    boxShadow: "0 6px 20px rgba(43, 31, 20, 0.08)",
                    border: "1px solid rgba(245, 235, 221, 0.9)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    maxWidth: "160px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ 
                      width: "24px", 
                      height: "24px", 
                      borderRadius: "6px", 
                      backgroundColor: "rgba(85, 107, 59, 0.12)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: "#556B3B" 
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#2B1F14", lineHeight: "1.2" }}>
                      {hero.badgeLiveText}
                    </span>
                  </div>
                  <span style={{ fontSize: "9px", color: "#7C7267", marginTop: "4px", lineHeight: "1.2" }}>
                    {hero.badgeLiveSubtext}
                  </span>
                </div>

                {/* Top-Right Badge 1: 80+ Students */}
                <div 
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "12px",
                    padding: "8px 14px",
                    boxShadow: "0 6px 20px rgba(43, 31, 20, 0.08)",
                    border: "1px solid rgba(245, 235, 221, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <div style={{ color: "#556B3B" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "9px", color: "#7C7267", lineHeight: "1.1" }}>Students Worldwide</span>
                    <span style={{ fontSize: "14px", fontWeight: "800", color: "#2B1F14", lineHeight: "1.1" }}>{hero.badgeStudentsNumber || "80+"}</span>
                  </div>
                </div>

                {/* Top-Right Badge 2: Flexible Timings */}
                <div 
                  style={{
                    position: "absolute",
                    top: "68px",
                    right: "16px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    boxShadow: "0 6px 20px rgba(43, 31, 20, 0.08)",
                    border: "1px solid rgba(245, 235, 221, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <div style={{ color: "#556B3B" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "10.5px", fontWeight: "700", color: "#2B1F14" }}>
                    {hero.badgeTimingsText}
                  </span>
                </div>

              </div>

              {/* Quote / Sub-text Under Image */}
              {hero.quoteText && (
                <div style={{ marginTop: "18px" }}>
                  <p style={{ 
                    fontSize: "12.5px", 
                    lineHeight: "1.6", 
                    color: "#5C4D3C", 
                    margin: 0,
                    whiteSpace: "pre-line"
                  }}>
                    {hero.quoteText}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* BOTTOM HIGHLIGHT STRIP */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "1.72fr 1.28fr",
              gap: "18px",
              alignItems: "stretch"
            }}
            className="landing-bottom-strip scroll-reveal-scale"
          >
            {/* Left Card: 4 Features with vertical dividers */}
            <div 
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F5EBDD",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "14px",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(43, 31, 20, 0.03)"
              }}
              className="strip-features-box"
            >
              {trustStripItems.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingLeft: idx === 0 ? "0" : "14px",
                    borderLeft: idx === 0 ? "none" : "1px solid #F5EBDD"
                  }}
                  className="strip-feature-item"
                >
                  <div style={{ color: "#556B3B", flexShrink: 0, display: "flex", alignItems: "center" }}>
                    {getIconSvg(item.icon, "#556B3B", 26)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0", lineHeight: "1.25" }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: "10.5px", color: "#7C7267", margin: 0, lineHeight: "1.35" }}>
                      {renderRichText(item.description)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Card: Journey box with solid olive green icon, title, divider & description */}
            <div 
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #F5EBDD",
                borderRadius: "16px",
                padding: "16px 22px",
                display: "grid",
                gridTemplateColumns: "auto auto 1px 1fr",
                gap: "16px",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(43, 31, 20, 0.03)"
              }}
              className="strip-journey-card-box"
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#556B3B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div style={{ minWidth: "120px", maxWidth: "145px" }}>
                <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: "#2B1F14", margin: 0, lineHeight: "1.25" }}>
                  {hero.stripRightCard?.title || "Begin Your Quran Learning Journey"}
                </h4>
              </div>
              <div style={{ width: "1px", height: "46px", backgroundColor: "#F5EBDD" }} className="strip-right-divider" />
              <div>
                <div style={{ fontSize: "10.5px", color: "#5C4D3C", margin: 0, lineHeight: "1.4" }}>
                  {renderRichText(hero.stripRightCard?.text, "Whether you are a beginner or looking to improve your Tajweed, memorization, or Islamic knowledge, we have the right course for you. Learn in a way that fits your pace, your goals, and your lifestyle.")}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 2: WHY CHOOSE US
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FFFDF9 0%, #FAF6F0 50%, #FAF7F2 100%)", padding: "44px 0" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          {/* Section Heading with Accent Line */}
          <div style={{ marginBottom: "22px" }} className="scroll-reveal">
            <h2 style={{ 
              fontSize: "clamp(26px, 3.2vw, 38px)", 
              fontWeight: "700", 
              color: "#2B1F14", 
              lineHeight: "1.25", 
              margin: "0 0 10px 0",
              letterSpacing: "-0.4px",
              whiteSpace: "pre-line"
            }}>
              {whyChoose.headingPrefix ? (
                <>
                  {whyChoose.headingPrefix}
                  <span style={{ color: "#C99B4D" }}>{whyChoose.headingHighlight || "Institute?"}</span>
                </>
              ) : (
                <>
                  Why Choose Online Quran Classes<br />
                  <span style={{ color: "#556B3B" }}>at Yaqeen </span>
                  <span style={{ color: "#C99B4D" }}>Institute?</span>
                </>
              )}
            </h2>
            <div style={{ width: "38px", height: "3.5px", backgroundColor: "#556B3B", borderRadius: "2px" }} />
          </div>

          {/* Lead Intro Text */}
          <div style={{ marginBottom: "32px", maxWidth: "980px" }} className="scroll-reveal delay-1">
            <p style={{ 
              fontSize: "clamp(13px, 1.05vw, 14.5px)", 
              lineHeight: "1.7", 
              color: "#5C4D3C", 
              margin: 0,
              whiteSpace: "pre-line"
            }}>
              {renderRichText(whyChoose.intro)}
            </p>
          </div>

          {/* 8 Features Grid (2 columns x 4 rows) */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px 44px",
              marginBottom: "36px"
            }}
            className="why-choose-grid"
          >
            {whyFeatures.map((feat, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }} className="scroll-reveal delay-1">
                <div style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(85, 107, 59, 0.08)",
                  border: "1px solid rgba(85, 107, 59, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#556B3B",
                  flexShrink: 0
                }}>
                  {getIconSvg(feat.icon || "monitor", "#556B3B", 22)}
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#2B1F14", margin: "0 0 4px 0", lineHeight: "1.3" }}>
                    {feat.title}
                  </h3>
                  <div style={{ fontSize: "12.5px", lineHeight: "1.55", color: "#5C4D3C", margin: 0 }}>
                    {renderRichText(feat.description)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div 
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F5EBDD",
              borderRadius: "18px",
              padding: "24px 32px",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "24px",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(43, 31, 20, 0.04)"
            }}
            className="why-bottom-action-card scroll-reveal-scale delay-2"
          >
            {/* Left Big Dark Forest Star Icon Circle */}
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#3C4E28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(60, 78, 40, 0.2)"
            }}>
              {getIconSvg("star", "#C99B4D", 26)}
            </div>

            {/* Middle Title & Description */}
            <div>
              <h3 style={{ fontSize: "16.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 6px 0", lineHeight: "1.3" }}>
                {whyChoose.bottomBox?.title || "Start Your Online Quran Learning Journey Today"}
              </h3>
              <div style={{ fontSize: "12px", color: "#5C4D3C", margin: 0, lineHeight: "1.5" }}>
                {renderRichText(whyChoose.bottomBox?.description, "Whether you are looking for online Quran classes for kids, Quran lessons for beginners, Quran memorization (Hifz) program, or Islamic Studies courses - Yaqeen Institute is here to help you every step of the way.")}
              </div>
            </div>

            {/* Right Buttons & Trust Note */}
            <div style={{ 
              borderLeft: "1px solid #F5EBDD", 
              paddingLeft: "24px", 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px", 
              minWidth: "220px" 
            }} className="why-action-right-box">
              <Link
                href={whyChoose.bottomBox?.primaryBtnUrl || "/register"}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#C99B4D",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 3px 10px rgba(201, 155, 77, 0.25)",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#B3853B";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#C99B4D";
                }}
              >
                {whyChoose.bottomBox?.primaryBtnText || "Book Free Trial Class"} <span>→</span>
              </Link>

              <Link
                href={whyChoose.bottomBox?.secondaryBtnUrl || "/contact"}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #C99B4D",
                  color: "#C99B4D",
                  padding: "9px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#FDF8F0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                }}
              >
                {whyChoose.bottomBox?.secondaryBtnText || "Contact Us"} <span>→</span>
              </Link>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "10px", color: "#7C7267", marginTop: "2px" }}>
                {getIconSvg("globe", "#7C7267", 12)}
                <span>{whyChoose.bottomBox?.trustBadgeText || "Trusted by thousands of students and parents worldwide."}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 3: THE YAQEEN INSTITUTE DIFFERENCE
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FAF7F2 0%, #FFFDF9 45%, #FAF5EE 100%)", padding: "40px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "310px 1fr 310px",
              gap: "36px",
              alignItems: "stretch"
            }}
            className="diff-main-grid"
          >
            {/* COLUMN 1: 5 LEFT STACKED FEATURE CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "space-between" }} className="scroll-reveal-left">
              {diffLeftCards.map((card, idx) => {
                const isGold = card.colorTheme === "orange" || idx % 2 === 0;
                const iconBg = isGold ? "rgba(201, 155, 77, 0.12)" : "rgba(85, 107, 59, 0.12)";
                const iconColor = isGold ? "#C99B4D" : "#556B3B";

                return (
                  <div key={idx} style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F5EBDD",
                    borderRadius: "14px",
                    padding: "11px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 2px 8px rgba(43, 31, 20, 0.02)"
                  }}>
                    <div style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: iconColor,
                      flexShrink: 0
                    }}>
                      {getIconSvg(card.icon, iconColor, 18)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "12.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0", lineHeight: "1.25" }}>
                        {card.title}
                      </h4>
                      <div style={{ fontSize: "10.5px", color: "#7C7267", margin: 0, lineHeight: "1.35" }}>
                        {renderRichText(card.description)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COLUMN 2: CENTER MAIN CONTENT & 4 PILLARS */}
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
              className="scroll-reveal"
            >
              <div>
                {/* Badge */}
                <div style={{ marginBottom: "12px" }}>
                  <span style={{
                    display: "inline-block",
                    backgroundColor: "rgba(201, 155, 77, 0.12)",
                    color: "#8C5D31",
                    border: "1px solid rgba(201, 155, 77, 0.3)",
                    padding: "4px 14px",
                    borderRadius: "12px",
                    fontSize: "10px",
                    fontWeight: "700",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase"
                  }}>
                    {difference.centerBadge || "THE YAQEEN INSTITUTE DIFFERENCE"}
                  </span>
                </div>

                {/* Heading */}
                <h2 style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: "700",
                  color: "#2B1F14",
                  lineHeight: "1.15",
                  margin: "0 0 18px 0",
                  letterSpacing: "-0.5px"
                }}>
                  {difference.centerHeadingPrefix || "The Yaqeen Institute"}
                  <span style={{ color: "#C99B4D", display: "block" }}>
                    {difference.centerHeadingHighlight || "Difference"}
                  </span>
                </h2>

                {/* Paragraphs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
                  {diffCenterParas.map((para, idx) => (
                    <p key={idx} style={{
                      fontSize: "12.5px",
                      lineHeight: "1.65",
                      color: "#5C4D3C",
                      margin: 0
                    }}>
                      {renderRichText(para)}
                    </p>
                  ))}
                </div>
              </div>

              {/* 4 Bottom Pillars */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "8px",
                  alignItems: "flex-start",
                  borderTop: "1px solid #F5EBDD",
                  paddingTop: "16px"
                }}
                className="diff-pillars-row"
              >
                {diffCenterPillars.map((pillar, idx) => {
                  const isGold = pillar.colorTheme === "orange" || idx % 2 === 0;
                  const iconBg = isGold ? "rgba(201, 155, 77, 0.12)" : "rgba(85, 107, 59, 0.12)";
                  const iconColor = isGold ? "#C99B4D" : "#556B3B";

                  return (
                    <div 
                      key={idx}
                      style={{
                        paddingLeft: idx === 0 ? "0" : "12px",
                        paddingRight: "8px",
                        borderLeft: idx === 0 ? "none" : "1px solid #F5EBDD"
                      }}
                      className="diff-pillar-item"
                    >
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: iconColor,
                        marginBottom: "6px"
                      }}>
                        {getIconSvg(pillar.icon, iconColor, 16)}
                      </div>
                      <h4 style={{ fontSize: "11.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0", lineHeight: "1.25" }}>
                        {pillar.title}
                      </h4>
                      <p style={{ fontSize: "10px", color: "#7C7267", margin: 0, lineHeight: "1.3" }}>
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* COLUMN 3: RIGHT DARK FOREST CARD */}
            <div 
              style={{
                backgroundColor: "#3C4E28",
                borderRadius: "22px",
                padding: "30px 24px",
                color: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 12px 32px rgba(60, 78, 40, 0.25)"
              }}
              className="scroll-reveal-right"
            >
              <div>
                <span style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "2px", color: "#C99B4D", textTransform: "uppercase", display: "block" }}>
                  — {diffRight.tag || "START YOUR"}
                </span>
                
                <h3 style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.2", margin: "10px 0 0 0", color: "#FFFFFF", whiteSpace: "pre-line" }}>
                  {diffRight.title || "Quran Journey\nToday"}
                </h3>

                <div style={{ width: "36px", height: "2px", backgroundColor: "#C99B4D", margin: "14px 0 16px 0", borderRadius: "1px" }} />

                <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#E5EBDD", margin: "0 0 24px 0" }}>
                  {diffRight.description || "Join thousands of families worldwide who trust Yaqeen Institute for authentic, high-quality, and personalized Quran education."}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  <Link
                    href={diffRight.primaryBtnUrl || "/register"}
                    style={{
                      textDecoration: "none",
                      backgroundColor: "#C99B4D",
                      color: "#FFFFFF",
                      padding: "12px 20px",
                      borderRadius: "9999px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textAlign: "center",
                      display: "block",
                      boxShadow: "0 4px 12px rgba(201, 155, 77, 0.35)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#B3853B";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#C99B4D";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {diffRight.primaryBtnText || "Book a Free Trial Class"} <span style={{ marginLeft: "4px" }}>→</span>
                  </Link>

                  <Link
                    href={diffRight.secondaryBtnUrl || "/contact"}
                    style={{
                      textDecoration: "none",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255,255,255,0.4)",
                      color: "#FFFFFF",
                      padding: "10px 20px",
                      borderRadius: "9999px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textAlign: "center",
                      display: "block",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                    }}
                  >
                    {diffRight.secondaryBtnText || "Contact Us"}
                  </Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ color: "#C99B4D", flexShrink: 0 }}>
                    {getIconSvg("shield", "#C99B4D", 16)}
                  </div>
                  <span style={{ fontSize: "10.5px", color: "#C5D6C8", lineHeight: "1.3" }}>
                    {diffRight.trustBadgeText || "Trusted by families who value Islamic education."}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Tagline */}
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #F5EBDD"
            }}
            className="diff-bottom-bar scroll-reveal delay-1"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "24px", height: "2px", backgroundColor: "#C99B4D", borderRadius: "1px" }} />
              <span style={{ fontSize: "10.5px", fontWeight: "700", letterSpacing: "1.4px", color: "#7C7267", textTransform: "uppercase" }}>
                {difference.taglineLeft || "MORE THAN CLASSES. A BRIGHTER TOMORROW."}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ 
                fontFamily: "var(--font-lora), 'Caveat', cursive, serif", 
                fontStyle: "italic", 
                fontSize: "20px", 
                color: "#2B1F14", 
                letterSpacing: "0.2px",
                fontWeight: "500"
              }}>
                {difference.taglineRight || "Knowledge for a Brighter Tomorrow"}
              </span>
              <div style={{ width: "24px", height: "2px", backgroundColor: "#C99B4D", borderRadius: "1px" }} />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 4: TRUSTED BY MUSLIM FAMILIES ACROSS THE UK
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FAF5EE 0%, #FAF8F5 50%, #FAF5EE 100%)", padding: "32px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          <div 
            style={{
              backgroundColor: "#FFFDF9",
              borderRadius: "24px",
              border: "1px solid #EADDC8",
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 24px rgba(43, 31, 20, 0.03)"
            }}
            className="uk-families-wrapper scroll-reveal"
          >
            {/* Top Dot Pattern Accent */}
            <div style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              width: "80px",
              height: "60px",
              opacity: 0.15,
              backgroundImage: "radial-gradient(#C99B4D 1.5px, transparent 1.5px)",
              backgroundSize: "8px 8px",
              pointerEvents: "none"
            }} />

            {/* TOP ROW: LOGO & TAGLINE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", position: "relative", zIndex: 1 }}>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ukTrust.logoUrl || "/images/logo.png"} alt="Yaqeen Institute Logo" style={{ height: "42px", width: "auto", display: "block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", color: "#7C7267", textTransform: "uppercase" }}>
                  {ukTrust.tagline || "LEARN • GROW • BELONG"}
                </span>
                <div style={{ width: "36px", height: "2px", backgroundColor: "#C99B4D", borderRadius: "1px" }} />
              </div>
            </div>

            {/* MAIN 2-COLUMN GRID */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1.05fr 1.22fr",
                gap: "36px",
                alignItems: "stretch",
                position: "relative",
                zIndex: 1
              }}
              className="uk-main-grid"
            >
              
              {/* LEFT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="scroll-reveal-left">
                <div>
                  {/* Badge */}
                  <div style={{ marginBottom: "14px" }}>
                    <span style={{
                      display: "inline-block",
                      backgroundColor: "rgba(201, 155, 77, 0.12)",
                      color: "#8C5D31",
                      border: "1px solid rgba(201, 155, 77, 0.3)",
                      padding: "5px 14px",
                      borderRadius: "14px",
                      fontSize: "10.5px",
                      fontWeight: "700",
                      letterSpacing: "1.2px",
                      textTransform: "uppercase"
                    }}>
                      {ukTrust.badgeText || "TRUSTED BY MUSLIM FAMILIES"}
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 style={{
                    fontSize: "clamp(26px, 2.6vw, 36px)",
                    fontWeight: "700",
                    color: "#2B1F14",
                    lineHeight: "1.24",
                    margin: "0 0 16px 0",
                    letterSpacing: "-0.4px"
                  }}>
                    {ukTrust.headingPrefix || "Trusted by Muslim Families Across the "}
                    <span style={{ color: "#C99B4D" }}>{ukTrust.headingHighlight || "United Kingdom"}</span>
                  </h2>

                  {/* Paragraph */}
                  <p style={{
                    fontSize: "13px",
                    lineHeight: "1.65",
                    color: "#5C4D3C",
                    margin: "0 0 24px 0"
                  }}>
                    {renderRichText(ukTrust.leadParagraph, "At Yaqeen Institute, thousands of families across England, Scotland, Wales, and Northern Ireland place their trust in us for high-quality Quran education. Our commitment to academic excellence, strong values, and student development has made us a preferred choice for parents who want the best Islamic education for their children.")}
                  </p>
                </div>

                {/* Key Highlights Card */}
                <div style={{
                  backgroundColor: "#F5EFE6",
                  borderRadius: "16px",
                  padding: "20px 22px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#2B1F14", margin: 0 }}>
                      {ukTrust.highlightsBoxTitle || "Key Highlights of Yaqeen Institute"}
                    </h4>
                    <div style={{ width: "28px", height: "2px", backgroundColor: "#C99B4D", borderRadius: "1px" }} />
                  </div>

                  <div 
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "16px 18px"
                    }}
                    className="uk-highlights-grid"
                  >
                    {(ukTrust.highlights && ukTrust.highlights.length ? ukTrust.highlights : DEFAULT_LANDING_PAGE_CONTENT.ukTrust.highlights).map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #EADDC8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#556B3B",
                          flexShrink: 0,
                          marginTop: "2px"
                        }}>
                          {getIconSvg(item.icon, "#556B3B", 16)}
                        </div>
                        <div>
                          <h5 style={{ fontSize: "12px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0", lineHeight: "1.25" }}>
                            {item.title}
                          </h5>
                          <p style={{ fontSize: "10px", color: "#7C7267", margin: 0, lineHeight: "1.3" }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: BIG WHITE CARD */}
              <div 
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  padding: "32px 34px",
                  border: "1px solid #F5EBDD",
                  boxShadow: "0 4px 20px rgba(43, 31, 20, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
                className="scroll-reveal-right"
              >
                <h3 style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#2B1F14",
                  margin: 0,
                  lineHeight: "1.25"
                }}>
                  {ukTrust.whyCardHeadingPrefix || "Why Families Choose "}
                  <span style={{ color: "#C99B4D" }}>{ukTrust.whyCardHeadingHighlight || "Yaqeen Institute"}</span>
                </h3>

                <div style={{ width: "42px", height: "2.5px", backgroundColor: "#C99B4D", borderRadius: "2px", margin: "12px 0 18px 0" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(ukTrust.whyCardParagraphs && ukTrust.whyCardParagraphs.length ? ukTrust.whyCardParagraphs : DEFAULT_LANDING_PAGE_CONTENT.ukTrust.whyCardParagraphs).map((para, idx) => (
                    <p key={idx} style={{
                      fontSize: "12px",
                      lineHeight: "1.65",
                      color: "#5C4D3C",
                      margin: 0
                    }}>
                      {renderRichText(para)}
                    </p>
                  ))}
                </div>
              </div>

            </div>

            {/* BOTTOM WHITE STRIP BANNER */}
            <div 
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "18px",
                border: "1px solid #F5EBDD",
                padding: "14px 24px",
                marginTop: "28px",
                display: "grid",
                gridTemplateColumns: "1.35fr auto 1.1fr auto 0.95fr",
                gap: "20px",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(43, 31, 20, 0.03)",
                position: "relative",
                zIndex: 1
              }}
              className="uk-bottom-bar scroll-reveal-scale delay-1"
            >
              {/* Segment 1 */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(85, 107, 59, 0.1)",
                  color: "#556B3B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {getIconSvg("calendar", "#556B3B", 18)}
                </div>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0" }}>
                    {ukTrust.bottomStrip?.item1Title || "Start Your Quran Learning Journey Today"}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#7C7267", margin: 0, lineHeight: "1.3" }}>
                    {ukTrust.bottomStrip?.item1Desc || "Take the first step towards a brighter future with quality, flexible, and personalized Quran education."}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: "1px", height: "38px", backgroundColor: "#F5EBDD" }} className="uk-bar-divider" />

              {/* Segment 2 */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(85, 107, 59, 0.1)",
                  color: "#556B3B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {getIconSvg("shield", "#556B3B", 16)}
                </div>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0" }}>
                    {ukTrust.bottomStrip?.item2Title || "Safe & Authentic"}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#7C7267", margin: 0, lineHeight: "1.3" }}>
                    {ukTrust.bottomStrip?.item2Desc || "A trusted learning environment for your peace of mind."}
                  </p>
                </div>
              </div>

              {/* Segment 3: CTA Button */}
              <div>
                <Link
                  href={ukTrust.bottomStrip?.btnUrl || "/register"}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "#C99B4D",
                    color: "#FFFFFF",
                    padding: "11px 24px",
                    borderRadius: "9999px",
                    fontSize: "13px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(201, 155, 77, 0.28)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#B3853B";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#C99B4D";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {ukTrust.bottomStrip?.btnText || "Book Your Free Trial Class"} <span>→</span>
                </Link>
              </div>

              {/* Segment 4 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", borderLeft: "1px solid #F5EBDD", paddingLeft: "16px" }} className="uk-bar-right-item">
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(201, 155, 77, 0.12)",
                  color: "#C99B4D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {getIconSvg("heart", "#C99B4D", 16)}
                </div>
                <div>
                  <h4 style={{ fontSize: "11.5px", fontWeight: "700", color: "#2B1F14", margin: 0, lineHeight: "1.25", whiteSpace: "pre-line" }}>
                    {ukTrust.bottomStrip?.item4Title || "Nurturing\nBrighter Futures"}
                  </h4>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 5: COURSES SHOWCASE
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FAF5EE 0%, #FAF1E4 50%, #FAF7F2 100%)", padding: "48px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }} className="scroll-reveal">
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", color: "#C99B4D", textTransform: "uppercase", display: "inline-block", marginBottom: "10px" }}>
              {courses.tag || "EXPLORE OUR COMPREHENSIVE PROGRAMS"}
            </span>
            <h2 style={{ fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: "700", color: "#2B1F14", lineHeight: "1.25", margin: "0 0 16px 0", whiteSpace: "pre-line" }}>
              {courses.mainHeadingPrefix || "Online Quran Courses\nat "}
              <span style={{ color: "#C99B4D" }}>{courses.mainHeadingHighlight || "Yaqeen Institute"}</span>
            </h2>
            <div style={{ fontSize: "clamp(12.5px, 1.05vw, 14px)", lineHeight: "1.65", color: "#5C4D3C", maxWidth: "860px", margin: "0 auto" }}>
              {renderRichText(courses.subheading)}
            </div>
          </div>

          {/* 5 Course Cards Grid */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(5, 1fr)", 
              gap: "14px",
              alignItems: "stretch"
            }} 
            className="courses-5card-grid"
          >
            {courseCards.map((card, idx) => {
              const isGreen = card.colorTheme === "green";
              const themeColor = isGreen ? "#556B3B" : "#C99B4D";
              const themeBg = isGreen ? "rgba(85, 107, 59, 0.1)" : "rgba(201, 155, 77, 0.12)";
              const numStr = card.number || card.id || `0${idx + 1}`;

              return (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #F5EBDD",
                    borderRadius: "16px",
                    padding: "20px 15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 10px rgba(43, 31, 20, 0.02)",
                    transition: "all 0.3s ease",
                    position: "relative"
                  }}
                  className="course-card-hover scroll-reveal"
                >
                  <div>
                    {/* Card Top: Badge Number & Course Icon */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                      <span style={{ 
                        fontSize: "12px", 
                        fontWeight: "800", 
                        color: themeColor, 
                        backgroundColor: themeBg, 
                        padding: "3px 9px", 
                        borderRadius: "8px",
                        lineHeight: "1.2"
                      }}>
                        {numStr}
                      </span>
                      <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "10px",
                        backgroundColor: themeBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: themeColor,
                        flexShrink: 0
                      }}>
                        {getIconSvg(card.icon || "book", themeColor, 22)}
                      </div>
                    </div>

                    {/* Course Title */}
                    <h3 style={{ fontSize: "14.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 8px 0", lineHeight: "1.3" }}>
                      {card.title}
                    </h3>

                    {/* Description */}
                    <div style={{ fontSize: "11px", color: "#5C4D3C", lineHeight: "1.45", margin: "0 0 16px 0", minHeight: "34px" }}>
                      {renderRichText(card.description)}
                    </div>

                    {/* Bullet Points */}
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(card.bulletPoints || []).map((pt, pIdx) => (
                        <li key={pIdx} style={{ fontSize: "10.5px", color: "#4A3B2C", display: "flex", alignItems: "flex-start", gap: "7px", lineHeight: "1.3" }}>
                          <span style={{ 
                            width: "14px", 
                            height: "14px", 
                            borderRadius: "50%", 
                            backgroundColor: themeColor, 
                            color: "#FFFFFF", 
                            display: "inline-flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            fontSize: "9px", 
                            fontWeight: "bold",
                            flexShrink: 0,
                            marginTop: "1px"
                          }}>
                            ✓
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For Box at Card Bottom */}
                  <div style={{
                    marginTop: "auto",
                    paddingTop: "14px",
                    borderTop: "1px dashed #F5EBDD",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px"
                  }}>
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: themeBg,
                      color: themeColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "1px"
                    }}>
                      {getIconSvg("user", themeColor, 13)}
                    </div>
                    <div>
                      <span style={{ fontSize: "10.5px", fontWeight: "700", color: "#2B1F14", display: "block", marginBottom: "1px" }}>
                        Ideal For:
                      </span>
                      <p style={{ fontSize: "10px", color: "#5C4D3C", margin: 0, lineHeight: "1.35" }}>
                        {card.idealFor}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Centered Bar */}
          <div 
            style={{
              maxWidth: "1120px",
              width: "100%",
              margin: "32px auto 0 auto",
              backgroundColor: "#FFFFFF",
              border: "1px solid #F5EBDD",
              borderRadius: "50px",
              padding: "9px 24px",
              boxShadow: "0 4px 18px rgba(43, 31, 20, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              boxSizing: "border-box"
            }}
            className="courses-bottom-bar scroll-reveal"
          >
            {/* Left: Icon, Vertical Divider, & Text */}
            <div style={{ display: "flex", alignItems: "center", flex: "1 1 auto", minWidth: "280px" }} className="courses-bar-left">
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 155, 77, 0.12)",
                color: "#C99B4D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {getIconSvg("book", "#C99B4D", 18)}
              </div>

              {/* Left Divider */}
              <div style={{ width: "1px", height: "30px", backgroundColor: "#F5EBDD", margin: "0 14px", flexShrink: 0 }} className="courses-bar-divider" />

              <div>
                <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0" }}>
                  {courses.bottomStrip?.title || "Start Your Quran Learning Journey Today"}
                </h4>
                <div style={{ fontSize: "11px", color: "#7C7267", margin: 0, lineHeight: "1.35" }}>
                  {renderRichText(courses.bottomStrip?.desc, "Take the first step towards a brighter future with quality, flexible, and personalized Quran education.")}
                </div>
              </div>
            </div>

            {/* Right Area: Action Button, Vertical Divider, & Script Tagline */}
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }} className="courses-bar-right">
              <Link
                href={courses.bottomStrip?.btnUrl || "/courses"}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#556B3B",
                  color: "#FFFFFF",
                  padding: "9px 24px",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 3px 10px rgba(85, 107, 59, 0.25)",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#43552E";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#556B3B";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {courses.bottomStrip?.btnText || "Explore All Courses"} <span>→</span>
              </Link>

              {/* Right Divider */}
              <div style={{ width: "1px", height: "30px", backgroundColor: "#F5EBDD", margin: "0 18px", flexShrink: 0 }} className="courses-bar-divider" />

              {/* Script Tagline */}
              <div style={{ display: "flex", alignItems: "center" }} className="courses-bar-script">
                <span style={{ 
                  fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive, Georgia, serif", 
                  fontStyle: "italic", 
                  fontSize: "22px", 
                  color: "#556B3B",
                  fontWeight: "600",
                  letterSpacing: "0.2px",
                  lineHeight: "1",
                  whiteSpace: "nowrap"
                }}>
                  {courses.bottomStrip?.tagline || "Your Journey Starts Here"}
                </span>
                <span style={{ width: "36px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block", marginLeft: "12px", flexShrink: 0 }}></span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 6: JOURNEY & PILLARS
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FAF7F2 0%, #FFFDF9 50%, #FAF5EE 100%)", padding: "46px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          {/* Eyebrow with decorative lines & Heading */}
          <div style={{ textAlign: "center", marginBottom: "36px" }} className="scroll-reveal">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{ width: "32px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block" }}></span>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", color: "#C99B4D", textTransform: "uppercase" }}>
                {journey.tag || "AT YAQEEN INSTITUTE"}
              </span>
              <span style={{ width: "32px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block" }}></span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: "700", color: "#2B1F14", lineHeight: "1.25", margin: 0 }}>
              {journey.headingPrefix || "Your Quran Journey, "}
              <span style={{ color: "#C99B4D" }}>{journey.headingHighlight || "Our Responsibility."}</span>
            </h2>
          </div>

          {/* 4 Columns Main Grid */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.35fr 1.05fr 0.65fr",
              gap: "24px",
              alignItems: "stretch",
              marginBottom: "36px"
            }}
            className="journey-4col-main-grid"
          >
            {/* Column 1: Left Text & Tagline */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="scroll-reveal-left">
              <div>
                {(journey.leftParagraphs || DEFAULT_LANDING_PAGE_CONTENT.journey.leftParagraphs || []).map((para, idx) => (
                  <p key={idx} style={{ 
                    fontSize: "12.5px", 
                    lineHeight: "1.65", 
                    color: "#5C4D3C", 
                    margin: idx === 0 ? "0 0 16px 0" : "0" 
                  }}>
                    {renderRichText(para)}
                  </p>
                ))}
              </div>
              <div style={{ marginTop: "24px" }}>
                <div style={{ width: "32px", height: "1.5px", backgroundColor: "#C99B4D", marginBottom: "10px" }} />
                <span style={{ fontSize: "9.5px", fontWeight: "700", letterSpacing: "1.5px", color: "#7C7267", textTransform: "uppercase" }}>
                  {journey.leftTagline || "KNOWLEDGE TODAY, A BRIGHTER TOMORROW."}
                </span>
              </div>
            </div>

            {/* Column 2: Center Light Cream Card */}
            <div 
              style={{
                backgroundColor: "#FAF8F5",
                border: "1px solid #F5EBDD",
                borderRadius: "16px",
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "14px"
              }}
              className="scroll-reveal delay-1"
            >
              {(journey.centerParagraphs || DEFAULT_LANDING_PAGE_CONTENT.journey.centerParagraphs || []).map((para, idx) => (
                <div key={idx} style={{ fontSize: "12px", lineHeight: "1.6", color: "#5C4D3C", margin: 0 }}>
                  {renderRichText(para)}
                </div>
              ))}
            </div>

            {/* Column 3: Dark Forest Card ("What You Will Gain") */}
            <div 
              style={{
                backgroundColor: "#3C4E28",
                borderRadius: "18px",
                padding: "24px 20px",
                color: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 6px 20px rgba(60, 78, 40, 0.2)"
              }}
              className="scroll-reveal delay-2"
            >
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 8px 0" }}>
                  {journey.gainCard?.title || "What You Will Gain"}
                </h3>
                <div style={{ width: "28px", height: "2px", backgroundColor: "#C99B4D", marginBottom: "18px" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(journey.gainCard?.items || DEFAULT_LANDING_PAGE_CONTENT.journey.gainCard.items || []).map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1px solid rgba(201, 155, 77, 0.4)",
                        backgroundColor: "rgba(201, 155, 77, 0.15)",
                        color: "#C99B4D",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {getIconSvg(item.icon || "book", "#C99B4D", 16)}
                      </div>
                      <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#FFFFFF" }}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Cursive Script */}
              <div style={{ marginTop: "22px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ 
                  fontFamily: "Georgia, 'Times New Roman', serif", 
                  fontStyle: "italic", 
                  fontSize: "15px", 
                  color: "#C99B4D", 
                  lineHeight: "1.25"
                }}>
                  {journey.gainCard?.tagline || "A Brighter You\nThrough Knowledge"}
                </span>
                <span style={{ width: "20px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block" }}></span>
              </div>
            </div>

            {/* Column 4: Right Quote */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "8px" }} className="scroll-reveal-right">
              <p style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                fontSize: "17px",
                lineHeight: "1.4",
                color: "#3C4E28",
                fontWeight: "600",
                margin: "0 0 10px 0"
              }}>
                {journey.quoteText || "“Knowledge today, a brighter tomorrow.”"}
              </p>
              <div style={{ width: "24px", height: "1.5px", backgroundColor: "#C99B4D" }} />
            </div>

          </div>

          {/* Bottom 5 Pillars Strip */}
          <div 
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #F5EBDD",
              borderRadius: "16px",
              padding: "14px 20px",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              alignItems: "center",
              boxShadow: "0 4px 18px rgba(43, 31, 20, 0.02)"
            }}
            className="journey-bottom-strip scroll-reveal-scale delay-2"
          >
            {(journey.pillars || DEFAULT_LANDING_PAGE_CONTENT.journey.pillars || []).map((pil, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  padding: "0 10px", 
                  borderLeft: idx === 0 ? "none" : "1px solid #F5EBDD" 
                }}
                className="journey-pillar-cell"
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(201, 155, 77, 0.12)",
                  color: "#C99B4D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {getIconSvg(pil.icon || "star", "#C99B4D", 18)}
                </div>
                <div>
                  <h4 style={{ fontSize: "11.5px", fontWeight: "700", color: "#2B1F14", margin: "0 0 2px 0", lineHeight: "1.25" }}>
                    {pil.title}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#7C7267", margin: 0, lineHeight: "1.3", whiteSpace: "pre-line" }}>
                    {pil.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 7: FAQS
         ========================================================================= */}
      <section style={{ background: "linear-gradient(180deg, #FAF5EE 0%, #FAF1E4 100%)", padding: "48px 0 64px 0", position: "relative" }}>
        <div style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="landing-container">
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }} className="scroll-reveal">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <span style={{ width: "32px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block" }}></span>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2.5px", color: "#C99B4D", textTransform: "uppercase" }}>
                {faqs.tag || "FAQs"}
              </span>
              <span style={{ width: "32px", height: "1.5px", backgroundColor: "#C99B4D", display: "inline-block" }}></span>
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: "700", color: "#2B1F14", lineHeight: "1.25", margin: "0 0 10px 0" }}>
              {faqs.headingPrefix || "Frequently Asked "}
              <span style={{ color: "#556B3B" }}>{faqs.headingHighlight || "Questions"}</span>
            </h2>
            <p style={{ fontSize: "13.5px", color: "#5C4D3C", margin: "0 auto", maxWidth: "600px", lineHeight: "1.5" }}>
              {faqs.subtitle || "Everything you need to know about our online Quran classes."}
            </p>
          </div>

          {/* FAQ Rows Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "1150px", margin: "0 auto" }}>
            {faqList.map((faq, idx) => (
              <div 
                key={faq.id || idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F5EBDD",
                  borderRadius: "12px",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 2px 8px rgba(43, 31, 20, 0.02)",
                  transition: "all 0.2s ease"
                }}
                className="faq-horizontal-card scroll-reveal"
              >
                {/* Left Circular Icon Badge */}
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(201, 155, 77, 0.12)",
                  color: "#C99B4D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {getIconSvg(faq.icon || (idx === 0 ? "book" : idx === 1 ? "user" : idx === 2 ? "screen" : idx === 3 ? "calendar" : idx === 4 ? "laptop" : "gift"), "#C99B4D", 20)}
                </div>

                {/* Question Block */}
                <div style={{ minWidth: "190px", maxWidth: "230px", flexShrink: 0 }} className="faq-question-col">
                  <h3 style={{ fontSize: "13.5px", fontWeight: "700", color: "#2B1F14", margin: 0, lineHeight: "1.35" }}>
                    {faq.question}
                  </h3>
                </div>

                {/* Vertical Hairline Divider */}
                <div style={{ width: "1px", height: "36px", backgroundColor: "#F5EBDD", flexShrink: 0 }} className="faq-card-divider" />

                {/* Answer Block */}
                <div style={{ flex: "1 1 auto" }} className="faq-answer-col">
                  <div style={{ fontSize: "12.5px", color: "#5C4D3C", margin: 0, lineHeight: "1.5" }}>
                    {renderRichText(faq.answer)}
                  </div>
                </div>

                {/* Right Down Chevron Arrow */}
                <div style={{ color: "#8C5D31", display: "flex", alignItems: "center", flexShrink: 0, paddingLeft: "6px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      <style jsx>{`
          .course-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(43, 31, 20, 0.08) !important;
          }
          @media (max-width: 1200px) {
            .courses-5card-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 1080px) {
            .landing-hero-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            .landing-bottom-strip {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            .strip-features-box {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 20px 14px !important;
            }
            .strip-feature-item {
              border-left: none !important;
              padding-left: 0 !important;
            }
            .strip-journey-card-box {
              grid-template-columns: auto 1fr !important;
              gap: 14px !important;
            }
            .strip-right-divider {
              display: none !important;
            }
            .why-choose-grid {
              grid-template-columns: 1fr !important;
              gap: 24px 0 !important;
            }
            .why-bottom-action-card {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            .why-action-right-box {
              border-left: none !important;
              padding-left: 0 !important;
            }
            .diff-main-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            .diff-pillars-row {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 16px 0 !important;
            }
            .diff-pillar-item {
              border-left: none !important;
              padding-left: 0 !important;
            }
            .uk-main-grid {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
            .uk-bottom-bar {
              grid-template-columns: 1fr 1fr !important;
              gap: 16px !important;
            }
            .uk-bar-divider {
              display: none !important;
            }
            .uk-bar-right-item {
              border-left: none !important;
              padding-left: 0 !important;
            }
            .courses-5card-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .courses-bottom-bar {
              border-radius: 20px !important;
              flex-wrap: wrap !important;
              padding: 16px 20px !important;
              gap: 16px !important;
            }
            .courses-bar-right {
              width: 100% !important;
              justifyContent: space-between !important;
              flex-wrap: wrap !important;
              gap: 12px !important;
            }
            .journey-4col-main-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .journey-bottom-strip {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 18px 0 !important;
            }
            .journey-bottom-strip > div {
              border-left: none !important;
            }
          }
          @media (max-width: 640px) {
            .strip-features-box {
              grid-template-columns: 1fr !important;
              gap: 16px 0 !important;
            }
            .strip-journey-card-box {
              grid-template-columns: 1fr !important;
            }
            .uk-families-wrapper {
              padding: 24px 18px !important;
            }
            .uk-highlights-grid {
              grid-template-columns: 1fr !important;
              gap: 14px 0 !important;
            }
            .uk-bottom-bar {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            .diff-pillars-row {
              grid-template-columns: 1fr !important;
            }
            .courses-5card-grid {
              grid-template-columns: 1fr !important;
            }
            .courses-bottom-bar {
              flex-direction: column !important;
              align-items: flex-start !important;
              border-radius: 16px !important;
            }
            .courses-bar-divider {
              display: none !important;
            }
            .courses-bar-left {
              min-width: 100% !important;
              gap: 12px !important;
            }
            .courses-bar-right {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
              width: 100% !important;
            }
            .journey-4col-main-grid {
              grid-template-columns: 1fr !important;
            }
            .journey-bottom-strip {
              grid-template-columns: 1fr !important;
            }
            .faq-horizontal-card {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            .faq-card-divider {
              display: none !important;
            }
            .faq-question-col {
              max-width: 100% !important;
            }
          }

          :global(.scroll-reveal) {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
          }
          :global(.scroll-reveal.visible) {
            opacity: 1;
            transform: translateY(0);
          }
          :global(.scroll-reveal-left) {
            opacity: 0;
            transform: translateX(-36px);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
          }
          :global(.scroll-reveal-left.visible) {
            opacity: 1;
            transform: translateX(0);
          }
          :global(.scroll-reveal-right) {
            opacity: 0;
            transform: translateX(36px);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
          }
          :global(.scroll-reveal-right.visible) {
            opacity: 1;
            transform: translateX(0);
          }
          :global(.scroll-reveal-scale) {
            opacity: 0;
            transform: scale(0.94) translateY(24px);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
          }
          :global(.scroll-reveal-scale.visible) {
            opacity: 1;
            transform: scale(1) translateY(0);
          }

          :global(.delay-1) { transition-delay: 0.08s !important; }
          :global(.delay-2) { transition-delay: 0.16s !important; }
        `}</style>
    </div>
  );
}
