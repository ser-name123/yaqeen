"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./pricing.css";

// Seamless, intricate Islamic geometric lace star pattern URL (Girih tiling with overlapping circles)
const LACE_BACKGROUND_PATTERN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'%3E%3Cg fill=\'none\' stroke=\'%23C99B4D\' stroke-width=\'0.5\' stroke-opacity=\'0.08\'%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'10\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'10\'/%3E%3Crect x=\'68\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 80 80)\'/%3E%3Crect x=\'68\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 80 80)\'/%3E%3Crect x=\'-12\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 0 0)\'/%3E%3Crect x=\'-12\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 0 0)\'/%3E%3Crect x=\'148\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 160 0)\'/%3E%3Crect x=\'148\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 160 0)\'/%3E%3Crect x=\'-12\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 0 160)\'/%3E%3Crect x=\'-12\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 0 160)\'/%3E%3Crect x=\'148\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 160 160)\'/%3E%3Crect x=\'148\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 160 160)\'/%3E%3Crect x=\'68\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 80 0)\'/%3E%3Crect x=\'68\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 80 0)\'/%3E%3Crect x=\'-12\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 0 80)\'/%3E%3Crect x=\'-12\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 0 80)\'/%3E%3Crect x=\'148\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 160 80)\'/%3E%3Crect x=\'148\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 160 80)\'/%3E%3Crect x=\'68\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 80 160)\'/%3E%3Crect x=\'68\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 80 160)\'/%3E%3Crect x=\'74\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 80 80)\'/%3E%3Crect x=\'74\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 80 80)\'/%3E%3Crect x=\'-6\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 0 0)\'/%3E%3Crect x=\'-6\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 0 0)\'/%3E%3Crect x=\'154\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 160 0)\'/%3E%3Crect x=\'154\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 160 0)\'/%3E%3Crect x=\'-6\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 0 160)\'/%3E%3Crect x=\'-6\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 0 160)\'/%3E%3Crect x=\'154\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 160 160)\'/%3E%3Crect x=\'154\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 160 160)\'/%3E%3Crect x=\'74\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 80 0)\'/%3E%3Crect x=\'74\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 80 0)\'/%3E%3Crect x=\'-6\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 0 80)\'/%3E%3Crect x=\'-6\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 0 80)\'/%3E%3Crect x=\'154\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 160 80)\'/%3E%3Crect x=\'154\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 160 80)\'/%3E%3Crect x=\'74\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 80 160)\'/%3E%3Crect x=\'74\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 80 160)\'/%3E%3C/g%3E%3C/svg%3E")';

// SVG Icons matching brand aesthetics
const IconDividerStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#C99B4D" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
  </svg>
);

const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
  </svg>
);

const IconPaperPlane = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" fillOpacity="0.05" />
    <path d="M11 13l3.5 3.5L22 2" />
  </svg>
);

const IconStarAward = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.2 13.8L5.5 22.5L12 19L18.5 22.5L15.8 13.8" />
    <circle cx="12" cy="8.5" r="6.5" fill="currentColor" fillOpacity="0.08" />
    <polygon points="12,5.2 13.3,8 16.3,8 13.9,9.8 14.8,12.6 12,10.8 9.2,12.6 10.1,9.8 7.7,8 10.7,8" fill="currentColor" />
  </svg>
);

const IconDiamond = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3H18L22 8.5L12 21.5L2 8.5L6 3Z" fill="currentColor" fillOpacity="0.05" />
    <path d="M2 8.5H22" />
    <path d="M6 3L10 8.5M18 3L14 8.5M12 3L10 8.5M12 3L14 8.5" />
    <path d="M10 8.5L12 21.5M14 8.5L12 21.5" />
  </svg>
);

const IconCrown = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 5L5 16H19L22 5L17 11.5L12 3.5L7 11.5L2 5Z" fill="currentColor" fillOpacity="0.05" />
    <path d="M5 16C5 16 8 18 12 18C16 18 19 16 19 16" />
    <path d="M5 19C5 19 8 21 12 21C16 21 19 19 19 19" />
    <circle cx="2" cy="5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="3.5" r="1.2" fill="currentColor" />
    <circle cx="22" cy="5" r="1.2" fill="currentColor" />
  </svg>
);

const IconCheck = () => (
  <div className="feature-icon-check">
    <svg width="9" height="7" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10 1.5 4.2 7.2 1.5 4.5" />
    </svg>
  </div>
);

const IconCross = () => (
  <svg className="feature-icon-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconShieldCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.05" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const IconPeople = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor" fillOpacity="0.05" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCalendar = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="currentColor" fillOpacity="0.05" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    {/* Calendar grid cells / days inside */}
    <path d="M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01M17 18h.01" strokeWidth="2.2" />
  </svg>
);

const IconAward = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8.5" r="6.5" fill="currentColor" fillOpacity="0.05" />
    <polyline points="8.2 14.5 7 23 12 20 17 23 15.8 14.5" />
    {/* Inner star in the circle */}
    <polygon points="12,5.5 12.8,7.5 15,7.5 13.2,8.8 13.9,11 12,9.8 10.1,11 10.8,8.8 9,7.5 11.2,7.5" fill="currentColor" />
  </svg>
);

const IconSparkle = ({ size = 16, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill={color} />
  </svg>
);

const IconRosette = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 5.5L18.5 4.5L17.5 8.5L21 11L17.5 13.5L18.5 17.5L14.5 16.5L12 20L9.5 16.5L5.5 17.5L6.5 13.5L3 11L6.5 8.5L5.5 4.5L9.5 5.5L12 2Z" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="11.5" r="3.5" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconUser = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconVideoPlay = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const IconMapPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconChevron = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const animatedElements = document.querySelectorAll(".reveal-fade, .reveal-slide-up, .reveal-stagger");
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pricing-page-container" style={{ backgroundImage: LACE_BACKGROUND_PATTERN }}>
      
      {/* The main content card */}
      <div className="pricing-card">
          
          {/* Pill Badge */}
          <div className="pricing-pill reveal-slide-up">
            <IconTag />
            <span className="pricing-pill-text">Pricing</span>
          </div>

          {/* Headline */}
          <h1 className="pricing-title reveal-slide-up">
            Plans That Fit Your Family
          </h1>

          {/* Divider (moved right under title matching mockup) */}
          <div className="pricing-section-divider">
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
            <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", margin: "0 10px" }}>
              <IconDividerStar />
            </div>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          </div>

          {/* Subtitles */}
          <p className="pricing-subtitle reveal-slide-up">
            Flexible, affordable plans with family discounts.
          </p>
          <p className="pricing-subtitle reveal-slide-up" style={{ fontSize: "14px", marginTop: "-6px", opacity: 0.85 }}>
            Quality Quranic education that fits your budget and supports your spiritual journey.
          </p>

          {/* Discover Label (with dividers) */}
          <span className="pricing-discover-label reveal-slide-up">
            Discover the Perfect Plan for You
          </span>
          <span className="pricing-transparency-label reveal-slide-up">
            Transparency You Can Trust • <span className="highlight-gold">No Hidden Fees</span>
          </span>

          {/* Pricing Grid */}
          <div className="pricing-grid stagger-group">
            
            {/* Plan 1: BASIC */}
            <div className="plan-card plan-basic reveal-stagger">
              <div className="plan-icon-wrap">
                <IconPaperPlane />
              </div>
              <h3 className="plan-title">Basic</h3>
              <span className="plan-subtitle">Entry Level Package</span>
              <div className="plan-divider" />
              <div className="plan-price-row">
                <span className="plan-price">
                  <span className="price-currency">$</span>8.00
                </span>
                <span className="plan-price-period">/hour</span>
              </div>
              
              {/* Features */}
              <div className="plan-features">
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Proficient Arabic (Native) Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Certificate</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Syllabus Access</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Direct Chat with Teacher and Coach</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Lesson Reschedules</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Coaching and Planning Sessions</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Progress Report</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Lesson Cancellation</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Family Discount</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Top 5 Star Rated Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Video Recordings</span>
                </div>
              </div>

              <Link href="/#contact" style={{ width: "100%", textDecoration: "none" }}>
                <button className="plan-btn btn-basic">Choose Basic</button>
              </Link>
            </div>

            {/* Plan 2: ESSENTIALS */}
            <div className="plan-card plan-essentials reveal-stagger">
              <div className="plan-icon-wrap">
                <IconStarAward />
              </div>
              <h3 className="plan-title">Essentials</h3>
              <span className="plan-subtitle">Core Feature Set</span>
              <div className="plan-divider" />
              <div className="plan-price-row">
                <span className="plan-price">
                  <span className="price-currency">$</span>9.00
                </span>
                <span className="plan-price-period">/hour</span>
              </div>
              
              {/* Features */}
              <div className="plan-features">
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Proficient Arabic (Native) Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Certificate</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Syllabus Access</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Direct Chat with Teacher and Coach</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Up to 2 Lesson Reschedules per Month*</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Coaching and Planning Sessions</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Progress Report</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Lesson Cancellation</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Family Discounts</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Top 5 Star Rated Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Video Recordings</span>
                </div>
              </div>

              <Link href="/#contact" style={{ width: "100%", textDecoration: "none" }}>
                <button className="plan-btn btn-essentials">Choose Essentials</button>
              </Link>
            </div>

            {/* Plan 3: PREMIUM */}
            <div className="plan-card plan-premium highlighted-card reveal-stagger">
              <div className="best-value-badge">Best Value</div>
              <div className="plan-icon-wrap">
                <IconDiamond />
              </div>
              <h3 className="plan-title">Premium</h3>
              <span className="plan-subtitle">Advanced Benefits</span>
              <div className="plan-divider" />
              <div className="plan-price-row">
                <span className="plan-price">
                  <span className="price-currency">$</span>11.00
                </span>
                <span className="plan-price-period">/hour</span>
              </div>
              
              {/* Features */}
              <div className="plan-features">
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Proficient Arabic (Native) Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Certificate</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Syllabus Access</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Direct Chat with Teacher and Coach</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Up to 4 Lesson Reschedules per Month*</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Coaching and Planning Sessions Twice a Year</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Progress Report Twice a Year</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Up to 1 Lesson Cancellation per Month**</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">5% Family Discounts***</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Top 5 Star Rated Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCross />
                  <span className="feature-text excluded">Video Recordings</span>
                </div>
              </div>

              <Link href="/#contact" style={{ width: "100%", textDecoration: "none" }}>
                <button className="plan-btn btn-premium">Choose Premium</button>
              </Link>
            </div>

            {/* Plan 4: PLATINUM */}
            <div className="plan-card plan-platinum reveal-stagger">
              <div className="plan-icon-wrap">
                <IconCrown />
              </div>
              <h3 className="plan-title">Platinum</h3>
              <span className="plan-subtitle">Top-tier Access</span>
              <div className="plan-divider" />
              <div className="plan-price-row">
                <span className="plan-price">
                  <span className="price-currency">$</span>14.00
                </span>
                <span className="plan-price-period">/hour</span>
              </div>
              
              {/* Features */}
              <div className="plan-features">
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Proficient Arabic (Native) Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Certificate</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">E-Syllabus Access</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Direct Chat with Teacher and Coach</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Unlimited Reschedules per Month*</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Coaching and Planning Sessions Every Quarter</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Progress Report Every Quarter</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Up to 3 Lesson Cancellation per Month**</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">10% Family Discounts***</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Top 5 Star Rated Teacher</span>
                </div>
                <div className="feature-row">
                  <IconCheck />
                  <span className="feature-text included">Video Recordings</span>
                </div>
              </div>

              <Link href="/#contact" style={{ width: "100%", textDecoration: "none" }}>
                <button className="plan-btn btn-platinum">Choose Platinum</button>
              </Link>
            </div>

          </div>

          {/* Bottom Trust Banner */}
          <div className="pricing-banner-card reveal-slide-up">
            <div className="pricing-banner-grid">
              
              {/* Item 1 */}
              <div className="banner-item">
                <div className="banner-icon-circle gold-circle">
                  <IconShieldCheck />
                </div>
                <div>
                  <h4 className="banner-item-title">No Hidden Fees</h4>
                  <p className="banner-item-desc">What you see is what you pay.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="banner-item">
                <div className="banner-icon-circle green-circle">
                  <IconPeople />
                </div>
                <div>
                  <h4 className="banner-item-title">Family Discounts</h4>
                  <p className="banner-item-desc">Save more when you learn together.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="banner-item">
                <div className="banner-icon-circle gold-circle">
                  <IconCalendar />
                </div>
                <div>
                  <h4 className="banner-item-title">Flexible Plans</h4>
                  <p className="banner-item-desc">Choose what works for you.</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="banner-item">
                <div className="banner-icon-circle green-circle">
                  <IconAward />
                </div>
                <div>
                  <h4 className="banner-item-title">Quality Education</h4>
                  <p className="banner-item-desc">Learn from qualified & certified teachers.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Footnotes & Disclaimers */}
          <div className="pricing-footnotes reveal-slide-up">
            <p className="footnote-line-primary">
              * Reschedules must be used within the same month. &nbsp;** Cancellations must be requested 12 hours in advance.
            </p>
            
            <div className="footnote-details">
              <p className="footnote-detail-item">* US only</p>
              <p className="footnote-detail-item">** Students must reschedule within 30 days with the original or a substitute teacher.</p>
              <p className="footnote-detail-item">*** All cancellations must be submitted via the student app or dashboard at least 4 hours before the lesson start time.</p>
              <p className="footnote-detail-item">‡ Discounts apply when two or more students are enrolled under the same plan or higher. Group lessons are not eligible for discounts. In cases where multiple discount levels apply, the lesser discount will be applied.</p>
            </div>
          </div>

        </div>

      {/* =========================================================================
         TESTIMONIALS SECTION (Copied exactly from homepage)
         ========================================================================= */}
      <section className="testi-section" id="testimonials">
        
        {/* Pill Badge */}
        <div className="testi-pill reveal-slide-up">
          <span className="testi-pill-text">Testimonials</span>
        </div>

        {/* Decorative Divider Line */}
        <div className="testi-divider" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "0 auto 16px auto" }}>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconSparkle />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Headline */}
        <h2 className="testi-title reveal-slide-up">
          Stronger Faith.<br />Stronger <span style={{ color: "#C99B4D" }}>Together.</span>
        </h2>

        {/* Section Subtitle / Description */}
        <p className="testi-desc reveal-slide-up">
          Hear from our learners and parents<br />building a stronger connection with Allah, together.
        </p>

        {/* Testimonials Grid */}
        <div className="testi-grid stagger-group">
          
          {/* Card 1: Ayesha Khan */}
          <div className="testi-card reveal-stagger">
            <span className="testi-quote-mark">“</span>
            <p className="testi-text">
              Yaqeen has helped my child develop a strong understanding of Islam in a fun and meaningful way. Highly recommended!
            </p>
            <div className="testi-card-divider" />
            <div className="testi-author-row">
              <div className="testi-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/testi_ayesha.png" alt="Ayesha Khan" className="testi-avatar" />
              </div>
              <div className="testi-author-info">
                <span className="testi-author-name">Ayesha Khan</span>
                <span className="testi-author-role">Mother of 2</span>
              </div>
            </div>
          </div>

          {/* Card 2: Hassan Ali */}
          <div className="testi-card reveal-stagger">
            <span className="testi-quote-mark">“</span>
            <p className="testi-text">
              The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning.
            </p>
            <div className="testi-card-divider" />
            <div className="testi-author-row">
              <div className="testi-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/testi_hassan.png" alt="Hassan Ali" className="testi-avatar" />
              </div>
              <div className="testi-author-info">
                <span className="testi-author-name">Hassan Ali</span>
                <span className="testi-author-role">Adult Learner</span>
              </div>
            </div>
          </div>

          {/* Card 3: Maryam Zahra */}
          <div className="testi-card reveal-stagger">
            <span className="testi-quote-mark">“</span>
            <p className="testi-text">
              We love how the whole family can learn together. Yaqeen has brought us closer to our faith and each other.
            </p>
            <div className="testi-card-divider" />
            <div className="testi-author-row">
              <div className="testi-avatar-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/testi_maryam.png" alt="Maryam Zahra" className="testi-avatar" />
              </div>
              <div className="testi-author-info">
                <span className="testi-author-name">Maryam Zahra</span>
                <span className="testi-author-role">Parent</span>
              </div>
            </div>
          </div>

        </div>

        {/* Pagination Dots */}
        <div className="testi-dots reveal-slide-up">
          <div className="testi-dot active" />
          <div className="testi-dot" />
          <div className="testi-dot" />
        </div>

      </section>

      {/* Family Discount Banner */}
      <div className="family-discount-banner reveal-slide-up">
        
        {/* Left: Badge */}
        <div className="fdb-badge-wrap">
          <div className="fdb-badge-circle-outer">
            <div className="fdb-badge-circle-inner">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18H8a3 3 0 0 0-3 3v0" />
                <circle cx="10" cy="8" r="3" />
                <path d="M12 18h4a3 3 0 0 1 3 3v0" />
                <circle cx="14" cy="8" r="3" />
                <path d="M10 21v-1a2 2 0 0 1 4 0v1" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
          </div>
          <div className="fdb-badge-ribbon">
            <span className="fdb-badge-ribbon-text">5% OFF</span>
          </div>
        </div>

        {/* Middle-Left: Content */}
        <div className="fdb-content-wrap">
          <h2 className="fdb-title">
            Family Learning,<br />
            <span className="highlight-green">Greater Rewards!</span>
          </h2>
          <div className="fdb-divider">
            <div className="fdb-divider-line" />
            <IconSparkle size={12} />
            <div className="fdb-divider-line" />
          </div>
          <p className="fdb-desc">
            Enjoy a 5% discount when family members enroll together.
          </p>
        </div>

        <div className="fdb-vertical-divider d-none-mobile" />

        {/* Middle-Right: Benefits List */}
        <div className="fdb-benefits-wrap">
          <div className="fdb-benefit-item">
            <div className="fdb-benefit-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18H8a3 3 0 0 0-3 3v0" />
                <circle cx="10" cy="8" r="3" />
                <path d="M12 18h4a3 3 0 0 1 3 3v0" />
                <circle cx="14" cy="8" r="3" />
                <path d="M10 21v-1a2 2 0 0 1 4 0v1" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
            <span className="fdb-benefit-label">Learn<br />Together</span>
          </div>
          <div className="fdb-benefit-item">
            <div className="fdb-benefit-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <circle cx="7" cy="7" r="1" fill="currentColor" />
                <path d="M19 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z" fill="#C99B4D" stroke="none" />
              </svg>
            </div>
            <span className="fdb-benefit-label">Save<br />More</span>
          </div>
          <div className="fdb-benefit-item">
            <div className="fdb-benefit-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="fdb-benefit-label">Grow<br />Together</span>
          </div>
          <div className="fdb-benefit-item">
            <div className="fdb-benefit-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="fdb-benefit-label">Stronger<br />Connection</span>
          </div>
        </div>

        <div className="fdb-vertical-divider d-none-mobile" />

        {/* Right: CTA Button */}
        <div className="fdb-cta-wrap">
          <Link href="/#contact" className="fdb-cta-btn">
            <span className="fdb-cta-text">Claim Your 5%<br />Family Discount</span>
            <svg className="fdb-cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

      </div>

      {/* =========================================================================
         SECTION 9: FAQ SECTION
         ========================================================================= */}
      <section className="faq-section" id="faq">
        
        {/* Section Headline */}
        <h2 className="faq-title reveal-slide-up">
          Many People <span style={{ color: "#C99B4D" }}>Ask About this</span>
        </h2>

        {/* Decorative Divider Line */}
        <div className="faq-divider" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "0 auto 16px auto" }}>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconRosette />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Subtitle / Description */}
        <p className="faq-desc reveal-slide-up">
          Following are answers to some queries that are posed regularly
        </p>

        {/* Accordions Container */}
        <div className="faq-container stagger-group">
          
          {/* FAQ 1 */}
          <div 
            className="faq-item reveal-stagger" 
            onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconCalendar size={20} />
              </div>
              <span className="faq-question-text">Is the class schedule suitable for me?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 0 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 0 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Yes. We offer highly flexible class schedules. You can choose your preferred days and times, and we have teachers available 24/7 across different time zones to fit your busy routine.
              </p>
            </div>
          </div>

          {/* FAQ 2 */}
          <div 
            className="faq-item reveal-stagger" 
            onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconUser size={20} />
              </div>
              <span className="faq-question-text">How do I begin?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 1 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 1 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Getting started is very simple. Just click the 'Book Your Free Session Now' button below, fill out a short form with your contact details and preferences, and our academic advisor will contact you within 24 hours to schedule your free trial class.
              </p>
            </div>
          </div>

          {/* FAQ 3 */}
          <div 
            className="faq-item reveal-stagger" 
            onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconVideoPlay size={20} />
              </div>
              <span className="faq-question-text">Are these classes pre-recorded?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 2 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 2 ? "open" : ""}`}>
              <p className="faq-answer-text">
                No, all our classes are 100% live and interactive, conducted one-on-one via Zoom or our portal. This ensures personalized attention and allows you to ask questions and receive instant feedback from your teacher.
              </p>
            </div>
          </div>

          {/* FAQ 4 */}
          <div 
            className="faq-item reveal-stagger" 
            onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconMapPin size={20} />
              </div>
              <span className="faq-question-text">Where is the headquarter of your business?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 3 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 3 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Our digital headquarters and academic operations are based in London, UK, but our teachers and students are spread globally across the UK, USA, Canada, Middle East, and South Asia, providing a truly international learning experience.
              </p>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="reveal-slide-up" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Link 
            href="/contact"
            className="faq-cta-btn"
            style={{ textDecoration: "none" }}
          >
            <span>BOOK YOUR FREE SESSION NOW!</span>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>→</span>
          </Link>
        </div>

      </section>
    </div>
  );
}
