"use client";

import React from "react";
import Link from "next/link";

/* ---------------- Icons ---------------- */
const IconBookOutline = ({ size = 22, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5V19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconShieldCheck = ({ size = 20, color = "#4A5D3B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const IconUserOutline = ({ size = 20, color = "#4A5D3B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCalendarOutline = ({ size = 16, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function CTABanner() {
  return (
    <div style={{
      backgroundColor: "#fefefe",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      boxSizing: "border-box",
      padding: "0 24px 15px 24px", // Reduced top and bottom padding to bring banner closer to page content and footer
      marginTop: "-45px" // Pulls the global banner up to cancel out the bottom padding of the section above it
    }}>
      {/* Responsive styling for the CTA Banner */}
      <style dangerouslySetInnerHTML={{__html: `
        .cta-banner-wrapper {
          border: none !important;
        }
        @media (max-width: 1024px) {
          .cta-banner-wrapper {
            flex-direction: column !important;
            padding: 30px 20px !important;
            gap: 32px !important;
          }
          .cta-boy-container {
            display: none !important;
          }
          .cta-middle-sep {
            display: none !important;
          }
          .cta-left-portion {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding-left: 0 !important;
          }
          .cta-text-content {
            align-items: center !important;
            text-align: center !important;
          }
          .cta-badges-row {
            justify-content: center !important;
            flex-wrap: wrap !important;
            width: 100% !important;
          }
        }
      `}} />

      {/* The Banner Container */}
      <div className="cta-banner-wrapper" style={{
        width: "100%",
        maxWidth: "1200px",
        backgroundColor: "#FCFAF6",
        borderRadius: "24px",
        border: "none", // Removed border as requested
        boxShadow: "0 10px 30px rgba(44, 37, 30, 0.02)",
        padding: "25px 40px 25px 270px", // Standard balanced padding-left
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Background Decorative Circle 1: Soft Gold/Beige behind boy */}
        <div style={{
          position: "absolute",
          bottom: "-60px",
          left: "-40px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          backgroundColor: "#EFE5D5",
          zIndex: 0
        }} />

        {/* Background Decorative Circle 2: Top-center green */}
        <div style={{
          position: "absolute",
          top: "-70px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          backgroundColor: "rgba(85, 107, 59, 0.15)",
          zIndex: 0
        }} />

        {/* Background Decorative Circle 3: Bottom-right green */}
        <div style={{
          position: "absolute",
          bottom: "-100px",
          right: "-40px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          backgroundColor: "rgba(85, 107, 59, 0.18)",
          zIndex: 0
        }} />

        {/* Absolute Positioned Boy Container */}
        <div className="cta-boy-container" style={{
          position: "absolute",
          bottom: "0",
          left: "-45px", // Shifted negative to crop out transparent pixels inside PNG
          width: "280px", // Increased width to 280px
          height: "100%",
          maxHeight: "340px", // Increased maxHeight to 340px
          zIndex: 1,
          display: "flex",
          alignItems: "flex-end"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/boy_quran.png" 
            alt="Student holding Quran" 
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom left"
            }}
          />
        </div>
        
        {/* Left Portion (Text Content & Badges) */}
        <div className="cta-left-portion" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          flex: "1 1 700px",
          zIndex: 1
        }}>
          
          {/* Headline */}
          <h2 style={{
            fontSize: "clamp(28px, 3.5vw, 38px)",
            fontWeight: "800",
            fontFamily: "var(--font-serif), Georgia, serif",
            lineHeight: "1.2",
            margin: 0
          }}>
            <span style={{ color: "#2B1F14", display: "block" }}>Learn with Purpose.</span>
            <span style={{ color: "#C99B4D", display: "block", marginTop: "2px" }}>Grow with Yaqeen.</span>
          </h2>

          {/* Subtitle / Description */}
          <p style={{
            fontSize: "16px",
            color: "#6B5B47",
            lineHeight: "1.5",
            fontWeight: "500",
            margin: "12px 0 28px 0",
            fontFamily: "var(--font-sans), sans-serif",
            maxWidth: "540px"
          }}>
            Quality Islamic education for all ages, from the comfort of your home.
          </p>

          {/* Three Trust Badges */}
          <div className="cta-badges-row" style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
            width: "100%"
          }}>
            
            {/* Badge 1: Qualified Teachers */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 155, 77, 0.08)",
                border: "1px solid rgba(201, 155, 77, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C99B4D",
                flexShrink: 0
              }}>
                <IconUserOutline size={18} color="#C99B4D" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Qualified</span>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Teachers</span>
              </div>
            </div>

            {/* Badge 2: Safe & Supportive Environment */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(74, 93, 59, 0.06)",
                border: "1px solid rgba(74, 93, 59, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4A5D3B",
                flexShrink: 0
              }}>
                <IconShieldCheck size={18} color="#4A5D3B" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Safe & Supportive</span>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Environment</span>
              </div>
            </div>

            {/* Badge 3: Learn Anytime, Anywhere */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 155, 77, 0.08)",
                border: "1px solid rgba(201, 155, 77, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C99B4D",
                flexShrink: 0
              }}>
                <IconBookOutline size={18} color="#C99B4D" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Learn Anytime,</span>
                <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Anywhere</span>
              </div>
            </div>

          </div>

        </div>

        {/* Center Vertical Separator (Only visible on desktop) */}
        <div className="cta-middle-sep" style={{
          width: "1px",
          height: "140px",
          backgroundColor: "#E5D5C0",
          alignSelf: "center",
          position: "relative",
          zIndex: 1
        }}>
          {/* Center Diamond Accent */}
          <div style={{
            width: "8px",
            height: "8px",
            backgroundColor: "#C99B4D",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(45deg)",
            border: "1px solid #FCFAF6"
          }} />
        </div>

        {/* Right Portion (Gold Button + Calendar Link) */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          flexShrink: 0,
          zIndex: 1
        }}>
          
          {/* Gold Action Button */}
          <Link
            href="/book-free-trial"
            style={{
              backgroundColor: "#C99B4D",
              borderRadius: "16px",
              padding: "18px 32px",
              color: "#FFFFFF",
              fontWeight: "500",
              fontSize: "16px",
              fontFamily: "var(--font-sans), sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(201, 155, 77, 0.25)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              width: "100%",
              justifyContent: "center",
              whiteSpace: "nowrap",
              textDecoration: "none"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#B3853B";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(201, 155, 77, 0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#C99B4D";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(201, 155, 77, 0.25)";
            }}
          >
            Start Your Journey Today
            <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
          </Link>

          {/* Calendar Free Trial Link */}
          <Link 
            href="/book-free-trial"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "9999px",
              transition: "background-color 0.2s ease",
              textDecoration: "none"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(201, 155, 77, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "rgba(201, 155, 77, 0.08)",
              border: "1px solid rgba(201, 155, 77, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C99B4D"
            }}>
              <IconCalendarOutline size={14} color="#C99B4D" />
            </div>
            <span style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#4A5D3B",
              fontFamily: "var(--font-sans), sans-serif"
            }}>
              Book Your Free Trial Class
            </span>
          </Link>

        </div>

      </div>
    </div>
  );
}
