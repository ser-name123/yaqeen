"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./about.css";
import { useSettings } from "@/lib/settings-context";
import { supabase } from "@/lib/supabase";

// Seamless, intricate Islamic geometric lace star pattern URL (Girih tiling with overlapping circles)
const LACE_BACKGROUND_PATTERN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'%3E%3Cg fill=\'none\' stroke=\'%23C99B4D\' stroke-width=\'0.5\' stroke-opacity=\'0.08\'%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'80\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'80\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'40\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'40\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'20\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'20\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'160\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'160\' r=\'10\'/%3E%3Ccircle cx=\'80\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'160\' cy=\'80\' r=\'10\'/%3E%3Ccircle cx=\'80\' cy=\'160\' r=\'10\'/%3E%3Crect x=\'68\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 80 80)\'/%3E%3Crect x=\'68\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 80 80)\'/%3E%3Crect x=\'-12\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 0 0)\'/%3E%3Crect x=\'-12\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 0 0)\'/%3E%3Crect x=\'148\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 160 0)\'/%3E%3Crect x=\'148\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 160 0)\'/%3E%3Crect x=\'-12\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 0 160)\'/%3E%3Crect x=\'-12\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 0 160)\'/%3E%3Crect x=\'148\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 160 160)\'/%3E%3Crect x=\'148\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 160 160)\'/%3E%3Crect x=\'68\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(0 80 0)\'/%3E%3Crect x=\'68\' y=\'-12\' width=\'24\' height=\'24\' transform=\'rotate(45 80 0)\'/%3E%3Crect x=\'-12\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 0 80)\'/%3E%3Crect x=\'-12\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 0 80)\'/%3E%3Crect x=\'148\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(0 160 80)\'/%3E%3Crect x=\'148\' y=\'68\' width=\'24\' height=\'24\' transform=\'rotate(45 160 80)\'/%3E%3Crect x=\'68\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(0 80 160)\'/%3E%3Crect x=\'68\' y=\'148\' width=\'24\' height=\'24\' transform=\'rotate(45 80 160)\'/%3E%3Crect x=\'74\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 80 80)\'/%3E%3Crect x=\'74\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 80 80)\'/%3E%3Crect x=\'-6\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 0 0)\'/%3E%3Crect x=\'-6\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 0 0)\'/%3E%3Crect x=\'154\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 160 0)\'/%3E%3Crect x=\'154\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 160 0)\'/%3E%3Crect x=\'-6\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 0 160)\'/%3E%3Crect x=\'-6\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 0 160)\'/%3E%3Crect x=\'154\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 160 160)\'/%3E%3Crect x=\'154\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 160 160)\'/%3E%3Crect x=\'74\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(0 80 0)\'/%3E%3Crect x=\'74\' y=\'-6\' width=\'12\' height=\'12\' transform=\'rotate(45 80 0)\'/%3E%3Crect x=\'-6\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 0 80)\'/%3E%3Crect x=\'-6\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 0 80)\'/%3E%3Crect x=\'154\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(0 160 80)\'/%3E%3Crect x=\'154\' y=\'74\' width=\'12\' height=\'12\' transform=\'rotate(45 160 80)\'/%3E%3Crect x=\'74\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(0 80 160)\'/%3E%3Crect x=\'74\' y=\'154\' width=\'12\' height=\'12\' transform=\'rotate(45 80 160)\'/%3E%3C/g%3E%3C/svg%3E")';

// SVG Icons matching the brand guidelines and design mockup
const IconPeopleWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBookWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconStarWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconGlobeWhite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconTarget = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Target concentric circles */}
    <circle cx="10" cy="14" r="8.5" />
    <circle cx="10" cy="14" r="4.5" />
    <circle cx="10" cy="14" r="1" fill="#FFFFFF" />
    {/* Arrow shaft */}
    <line x1="21" y1="3" x2="11.5" y2="12.5" />
    {/* Arrowhead */}
    <path d="M11 10h3v3" />
    {/* Arrow fletching */}
    <path d="M17.5 3.5l3 3" />
    <path d="M19 2l3 3" />
  </svg>
);

const IconGeometricFlower = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer star shape */}
    <path d="M12 2L15 6L19 5L18 9L22 10L19 13L21 17L17 18L16 22L12 20L8 22L7 18L3 17L5 13L2 10L6 9L5 5L9 6Z" />
    {/* Inner flower pattern */}
    <circle cx="12" cy="12" r="6.5" />
    <circle cx="12" cy="12" r="4" />
    {/* Petal lines */}
    <path d="M12 2v20M2 12h20M5 5l14 14M5 19l14-14" strokeOpacity="0.4" />
    <circle cx="12" cy="12" r="1.5" fill="#C99B4D" />
  </svg>
);

const IconEye = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconRubElHizb = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(0 12 12)" />
    <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="12" cy="12" r="1.5" fill="#C99B4D" />
  </svg>
);

const IconSparkle = ({ size = 16, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill={color} />
  </svg>
);

const IconGraduationCap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const IconShieldCheckGold = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const IconTeacherGold = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M9 4.5L12 3l3 1.5M12 3v3" strokeWidth="1.5" />
  </svg>
);

const IconAwardGold = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const IconRosette = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 5.5L18.5 4.5L17.5 8.5L21 11L17.5 13.5L18.5 17.5L14.5 16.5L12 20L9.5 16.5L5.5 17.5L6.5 13.5L3 11L6.5 8.5L5.5 4.5L9.5 5.5L12 2Z" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="11.5" r="3.5" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconCalendar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
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

const IconBookGreen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#556B3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconShieldGreen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#556B3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 11l2 2 4-4" />
  </svg>
);

const IconHeartGreen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#556B3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconExcellenceGreen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#556B3B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </svg>
);

const ArchedCardBackground = () => (
  <svg 
    className="arched-card-bg" 
    width="390" 
    height="500" 
    viewBox="0 0 390 500" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1,
      pointerEvents: "none"
    }}
  >
    {/* Outer border shape with cream background fill (shifted down 30px to prevent dome top clipping) */}
    <path 
      d="M 20 500 L 370 500 A 20 20 0 0 0 390 480 L 390 170 C 390 145 350 120 305 120 A 110 110 0 0 0 85 120 C 60 120 0 145 0 170 L 0 480 A 20 20 0 0 0 20 500 Z" 
      fill="#fcf3ed" /* Soft warm cream background */
      stroke="#C99B4D" 
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner delicate border path for a premium double-line outline effect */}
    <path 
      d="M 20 500 L 370 500 A 20 20 0 0 0 390 480 L 390 170 C 390 145 350 120 305 120 A 110 110 0 0 0 85 120 C 60 120 0 145 0 170 L 0 480 A 20 20 0 0 0 20 500 Z" 
      fill="none"
      stroke="rgba(201, 155, 77, 0.4)" 
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.9, 5.0) scale(0.98)"
    />
  </svg>
);

export default function AboutPage() {
  const { faviconUrl } = useSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [expandInstructors, setExpandInstructors] = useState(false);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Ayesha Khan",
      role: "Mother of 2",
      content: "Yaqeen has helped my child develop a strong understanding of Islam in a fun and meaningful way. Highly recommended!",
      avatar_url: "/images/testi_ayesha.png"
    },
    {
      id: 2,
      name: "Hassan Ali",
      role: "Adult Learner",
      content: "The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning.",
      avatar_url: "/images/testi_hassan.png"
    },
    {
      id: 3,
      name: "Maryam Zahra",
      role: "Parent",
      content: "We love how the whole family can learn together. Yaqeen has brought us closer to our faith and each other.",
      avatar_url: "/images/testi_maryam.png"
    }
  ]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const filtered = data.filter(t => {
            if (!t.page_target) return false;
            const targets = t.page_target.split(",").map(x => x.trim().toLowerCase());
            return targets.includes("all") || targets.includes("about");
          });
          setTestimonials(filtered);
        }
      } catch (err) {
        console.warn("Could not load testimonials from Supabase, using default lists:", err);
      }
    }
    fetchTestimonials();
  }, []);

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
    <>
      {/* First Section */}
      <div className="about-page-container" style={{ minHeight: "calc(100vh - 70px)", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* The main content white card */}
          <div className="about-card">
  
            {/* Main section splitting image and content */}
            <div className="about-main-layout">
              
              {/* Left Column: Image with unique curved accents and patterns */}
              <div className="about-image-column">
                <div className="about-image-wrapper">
                  <div className="about-image-arc arc-green"></div>
                  <div className="about-image-arc arc-gold"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/images/about_student_hero.png" 
                    alt="Student studying on laptop" 
                  />
                </div>
              </div>
  
              {/* Right Column: Narrative content and key highlights */}
              <div className="about-content-column">
                <div className="about-badge">About Us</div>
                
                <h1 className="about-heading">
                  Empowering Minds.<br />
                  <span>Inspiring Futures.</span>
                </h1>
  
                {/* Custom line and diamond divider: — ⬥ — */}
                <div className="about-heading-divider">
                  <div className="divider-line"></div>
                  <div className="divider-diamond"></div>
                  <div className="divider-line"></div>
                </div>
  
                <p className="about-description">
                  We make Online Quran Classes, Arabic Language, and Islamic Studies simple, engaging, and accessible for everyone. Our Online Quran Academy helps students Learn Quran Online, strengthen faith, and grow in knowledge, confidence, and character.
                </p>
  
                {/* Feature Highlights Grid */}
                <div className="about-features-grid">
                  
                  <div className="about-feature-item">
                    <div className="feature-icon-circle green">
                      <IconPeopleWhite />
                    </div>
                    <div className="feature-info" style={{ gap: "4px" }}>
                       <span className="feature-title">Expert & Caring Instructors</span>
                       <div style={{ position: "relative" }}>
                         {/* Animated text container using max-height */}
                         <div
                           style={{
                             maxHeight: expandInstructors ? "200px" : "2.8em",
                             overflow: "hidden",
                             transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                             lineHeight: "1.4",
                           }}
                         >
                           <span className="feature-subtext" style={{ lineHeight: "1.4" }}>
                             Learn from certified Quran, Arabic, and Islamic Studies teachers delivering Online Quran Classes, Quran Lessons Online, and personalized guidance. Our experienced instructors help children and adults Learn Quran Online with confidence, Tajweed, and lasting Islamic knowledge.
                           </span>
                         </div>
                         {/* Inline "Read more" at end of last visible text line */}
                         {!expandInstructors && (
                           <div
                             onClick={() => setExpandInstructors(true)}
                             style={{
                               position: "absolute",
                               bottom: 0,
                               right: 0,
                               height: "1.4em",
                               background: "linear-gradient(to right, transparent, #fff 38%)",
                               display: "flex",
                               alignItems: "center",
                               paddingLeft: "32px",
                               cursor: "pointer",
                             }}
                           >
                             <span style={{
                               fontSize: "10.5px",
                               fontWeight: "700",
                               color: "var(--primary-color)",
                               letterSpacing: "0.1px",
                             }}>
                               Read more ›
                             </span>
                           </div>
                         )}
                         {/* "Show less" link after full text */}
                         {expandInstructors && (
                           <span
                             onClick={() => setExpandInstructors(false)}
                             style={{
                               display: "inline-flex",
                               alignItems: "center",
                               gap: "3px",
                               marginTop: "3px",
                               fontSize: "10.5px",
                               fontWeight: "700",
                               color: "var(--primary-color)",
                               cursor: "pointer",
                               letterSpacing: "0.1px",
                             }}
                           >
                             <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 7L5 4L8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             Show less
                           </span>
                         )}
                       </div>
                     </div>
                  </div>
  
                  <div className="about-feature-item">
                    <div className="feature-icon-circle gold">
                      <IconBookWhite />
                    </div>
                    <div className="feature-info">
                      <span className="feature-title">Personalized Learning</span>
                      <span className="feature-subtext">Lessons tailored to each student's goals and pace.</span>
                    </div>
                  </div>
  
                  <div className="about-feature-item">
                    <div className="feature-icon-circle gold">
                      <IconStarWhite />
                    </div>
                    <div className="feature-info">
                      <span className="feature-title">Engaging & Effective</span>
                      <span className="feature-subtext">Interactive classes that make learning enjoyable and impactful.</span>
                    </div>
                  </div>
  
                  <div className="about-feature-item">
                    <div className="feature-icon-circle green">
                      <IconGlobeWhite />
                    </div>
                    <div className="feature-info">
                      <span className="feature-title">Global Community of Learners</span>
                      <span className="feature-subtext">Connecting students worldwide through faith and knowledge.</span>
                    </div>
                  </div>
  
                </div>
              </div>
            </div>
          </div>
  
          {/* Bottom Banner Area with Brand Statement - NOW OUTSIDE the white card! */}
          <div className="about-bottom-banner">
            <div className="banner-deco">
              <div className="deco-line"></div>
              <div className="deco-diamond"></div>
            </div>
  
            <div className="banner-logo-section">
              {faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={faviconUrl} 
                  alt="YAQEEN INSTITUTE" 
                  style={{ height: "30px", width: "auto", objectFit: "contain" }} 
                />
              ) : (
                <svg width="34" height="30" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
                  <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
                  <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
                  <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.1" }}>
                <span className="banner-logo-text" style={{ fontSize: "14px", fontWeight: "800", color: "#2B1F14" }}>YAQEEN</span>
                <span className="banner-logo-text" style={{ fontSize: "10px", fontWeight: "700", color: "#C99B4D" }}>INSTITUTE</span>
              </div>
            </div>
  
            <div className="banner-divider"></div>
  
            <p className="banner-quote-text">
              We believe in building strong foundations, nurturing character, and empowering every learner to lead with faith and purpose.
            </p>
  
            <div className="banner-deco">
              <div className="deco-diamond"></div>
              <div className="deco-line"></div>
            </div>
          </div>
  
        </div>
      </div>
 
      {/* Second Section - Who We Are & What We Do */}
      <div className="about-page-container" style={{ paddingTop: "0", marginTop: "-10px", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* Who We Are Card */}
          <div className="about-row-card">
            
            <div className="about-row-content">
              <div className="about-section-header-row">
                <div className="about-header-icon-outer">
                  <div className="about-header-icon-inner green">
                    <IconPeopleWhite />
                  </div>
                </div>
                <h2 className="about-row-heading">
                  Who <span>We Are</span>
                </h2>
              </div>
              
              <div className="about-heading-divider">
                <div className="divider-line"></div>
                <div className="divider-diamond"></div>
                <div className="divider-line"></div>
              </div>
              
              <p className="about-row-description">
                We are a global online academy founded by passionate educators and Islamic scholars, dedicated to making Quranic education accessible and impactful for students worldwide.
              </p>
            </div>
            
            <div className="about-row-image-column">
              <div className="about-row-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/about_who_we_are.png" 
                  alt="Who We Are - Students studying together" 
                />
              </div>
            </div>
          </div>
  
          {/* What We Do Card */}
          <div className="about-row-card img-left">
            
            <div className="about-row-image-column">
              <div className="about-row-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/about_what_we_do.png" 
                  alt="What We Do - Student studying with headphones" 
                />
              </div>
            </div>

            <div className="about-row-content">
              <div className="about-section-header-row">
                <div className="about-header-icon-outer">
                  <div className="about-header-icon-inner gold">
                    <IconBookWhite />
                  </div>
                </div>
                <h2 className="about-row-heading">
                  What <span>We Do</span>
                </h2>
              </div>
              
              <div className="about-heading-divider">
                <div className="divider-line"></div>
                <div className="divider-diamond"></div>
                <div className="divider-line"></div>
              </div>
              
              <p className="about-row-description">
                We offer expertly structured online courses in Quran Recitation, Tajweed, Hifz, Arabic Language, and Islamic Studies, helping learners of all ages and levels achieve their goals through flexible and personalized learning.
              </p>
            </div>
          </div>
  
        </div>
      </div>

      {/* Third Section - Mission & Vision */}
      <div className="about-page-container" style={{ paddingTop: "0", marginTop: "-10px", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* The main content card wrapping the grid */}
          <div className="about-card" style={{ padding: "40px 12px", overflow: "hidden" }}>
            
            <div className="mission-vision-grid">
              
              {/* Left Card: OUR MISSION */}
              <div className="arched-card mission">
                <ArchedCardBackground />
                <div className="arched-card-icon-outer" style={{ top: "40px", border: "none", backgroundColor: "transparent", padding: 0, width: "100px", height: "100px", boxShadow: "none" }}>
                  <div className="arched-card-icon-inner green">
                    <IconTarget />
                  </div>
                </div>
                
                <div className="about-heading-divider" style={{ marginTop: "12px", position: "relative", zIndex: 2 }}>
                  <div className="divider-line" style={{ width: "24px" }}></div>
                  <div className="divider-diamond"></div>
                  <div className="divider-line" style={{ width: "24px" }}></div>
                </div>
                
                <h3 className="arched-card-heading green">
                  OUR <span>MISSION</span>
                </h3>
                
                <p className="arched-card-description" style={{ marginBottom: "8px" }}>
                  To provide authentic Islamic education that nurtures faith, knowledge, and character, empowering learners to lead purposeful lives and contribute positively to society.
                </p>
                
                <div className="arched-card-footer-divider" style={{ marginTop: "8px" }}>
                  <div className="deco-line-half"></div>
                  <IconGeometricFlower />
                  <div className="deco-line-half"></div>
                </div>
              </div>
              
              {/* Center Content: Header, Intro, and Guides */}
              <div className="mv-center-content">
                
                {/* Header & Intro */}
                <div className="mv-header">
                  <span className="mv-badge">Our Mission & Vision</span>
                  
                  <h2 className="mv-heading">
                    Guided by <span>Faith.</span><br />
                    Driven by <span>Purpose.</span>
                  </h2>
                  
                  <div className="about-heading-divider">
                    <div className="divider-line"></div>
                    <div className="divider-diamond"></div>
                    <div className="divider-line"></div>
                  </div>
                  
                  <p className="mv-intro-text">
                    Our mission and vision reflect our commitment to nurturing minds, strengthening hearts, and building a brighter, faith-centered future for all.
                  </p>
                </div>
                
                {/* Guides / Values List */}
                <div className="mv-guides">
                  <div className="guides-header-row">
                    <div className="divider-line"></div>
                    <div className="divider-diamond"></div>
                    <span className="guides-header-title">What Guides Us</span>
                    <div className="divider-diamond"></div>
                    <div className="divider-line"></div>
                  </div>
                  
                  <div className="guides-grid">
                    
                    <div className="guides-item">
                      <div className="guides-icon-circle">
                        <IconBookGreen />
                      </div>
                      <span className="guides-title">Knowledge</span>
                      <p className="guides-desc">
                        We believe in seeking and spreading beneficial knowledge.
                      </p>
                    </div>
                    
                    <div className="guides-item">
                      <div className="guides-icon-circle">
                        <IconShieldGreen />
                      </div>
                      <span className="guides-title">Integrity</span>
                      <p className="guides-desc">
                        We uphold honesty, trust, and strong Islamic values in everything we do.
                      </p>
                    </div>
                    
                    <div className="guides-item">
                      <div className="guides-icon-circle">
                        <IconHeartGreen />
                      </div>
                      <span className="guides-title">Compassion</span>
                      <p className="guides-desc">
                        We nurture kindness, empathy, and respect in every learner.
                      </p>
                    </div>
                    
                    <div className="guides-item">
                      <div className="guides-icon-circle">
                        <IconExcellenceGreen />
                      </div>
                      <span className="guides-title">Excellence</span>
                      <p className="guides-desc">
                        We strive for the highest standards in teaching, learning, and service.
                      </p>
                    </div>
                    
                  </div>
                </div>
                
              </div>
              
              {/* Right Card: OUR VISION */}
              <div className="arched-card vision">
                <ArchedCardBackground />
                <div className="arched-card-icon-outer" style={{ top: "40px", border: "none", backgroundColor: "transparent", padding: 0, width: "100px", height: "100px", boxShadow: "none" }}>
                  <div className="arched-card-icon-inner gold">
                    <IconEye />
                  </div>
                </div>
                
                <div className="about-heading-divider" style={{ marginTop: "12px", position: "relative", zIndex: 2 }}>
                  <div className="divider-line" style={{ width: "24px" }}></div>
                  <div className="divider-diamond"></div>
                  <div className="divider-line" style={{ width: "24px" }}></div>
                </div>
                
                <h3 className="arched-card-heading gold">
                  OUR <span>VISION</span>
                </h3>
                
                <p className="arched-card-description" style={{ marginBottom: "8px" }}>
                  To be a trusted global institution recognized for excellence in Islamic education, inspiring generations to embody knowledge, faith, and compassion.
                </p>
                
                <div className="arched-card-footer-divider" style={{ marginTop: "8px" }}>
                  <div className="deco-line-half"></div>
                  <IconGeometricFlower />
                  <div className="deco-line-half"></div>
                </div>
              </div>
              
            </div>
          </div>
  
        </div>
      </div>

      {/* Fourth Section - Testimonials */}
      <div className="about-page-container" style={{ paddingTop: "0", marginTop: "-10px", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* The main content card wrapping the testimonials */}
          <div className="about-card" style={{ padding: "60px 24px" }}>
            
            {/* Pill Badge */}
            <div className="testi-pill reveal-slide-up" style={{ margin: "0 auto" }}>
              <span className="testi-pill-text">Testimonials</span>
            </div>

            {/* Decorative Divider Line */}
            <div className="testi-divider" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "16px auto 16px auto" }}>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
              <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
                <IconSparkle />
              </div>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
            </div>

            {/* Section Headline */}
            <h2 className="testi-title reveal-slide-up" style={{ textAlign: "center", color: "#2B1F14" }}>
              Stronger Faith.<br />Stronger <span style={{ color: "#C99B4D" }}>Together.</span>
            </h2>

            {/* Section Subtitle / Description */}
            <p className="testi-desc reveal-slide-up" style={{ textAlign: "center", margin: "0 auto 40px auto" }}>
              Hear from our learners and parents<br />building a stronger connection with Allah, together.
            </p>

            {/* Testimonials Grid */}
            <div className="testi-grid stagger-group" style={{ width: "100%" }}>
              {testimonials.map((t) => (
                <div key={t.id} className="testi-card reveal-stagger">
                  <span className="testi-quote-mark">“</span>
                  <p className="testi-text">{t.content}</p>
                  <div className="testi-card-divider" />
                  <div className="testi-author-row">
                    <div className="testi-avatar-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.avatar_url || "/images/testi_ayesha.png"} alt={t.name} className="testi-avatar" />
                    </div>
                    <div className="testi-author-info">
                      <span className="testi-author-name">{t.name}</span>
                      <span className="testi-author-role">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="testi-dots reveal-slide-up" style={{ marginTop: "32px" }}>
              {testimonials.map((_, idx) => (
                <div key={idx} className={`testi-dot ${idx === 0 ? "active" : ""}`} />
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Fifth Section - Course Finder CTA Banner */}
      <div className="about-page-container" style={{ paddingTop: "0", marginTop: "-10px", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* The main content card wrapping the CTA */}
          <div className="about-cta-card">
            
            {/* Left Column: Curved image */}
            <div className="cta-image-column">
              <div className="cta-cap-floating">
                <IconGraduationCap />
              </div>
              <div className="cta-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/cta_student_boy.png" 
                  alt="Young student raising hand in class" 
                />
              </div>
            </div>

            {/* Middle Column: Text content & Button */}
            <div className="cta-content-column">
              <h2 className="cta-heading">Not sure where to start?</h2>
              
              {/* Divider */}
              <div className="about-heading-divider" style={{ margin: "10px 0 0 0", alignSelf: "flex-start" }}>
                <div className="divider-line" style={{ width: "32px" }}></div>
                <div className="divider-diamond"></div>
                <div className="divider-line" style={{ width: "32px" }}></div>
              </div>

              <p className="cta-description">
                Let us guide you to the right path with the right course.
              </p>

              <Link 
                href="/courses" 
                className="cta-button"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 28px",
                  borderRadius: "9999px",
                  backgroundColor: "#C99B4D",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: "14px",
                  boxShadow: "0 6px 16px rgba(201, 155, 77, 0.2)",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor = "#B3853B";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(201, 155, 77, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "#C99B4D";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(201, 155, 77, 0.2)";
                }}
              >
                Find My Course <span style={{ fontSize: "16px" }}>→</span>
              </Link>
            </div>

            {/* Right Column: Three Features */}
            <div className="cta-features-column">
              
              <div className="cta-feature-item">
                <div className="cta-feature-icon-circle">
                  <IconShieldCheckGold />
                </div>
                <span className="cta-feature-text">Personalized Recommendation</span>
              </div>

              <div className="cta-feature-item">
                <div className="cta-feature-icon-circle">
                  <IconTeacherGold />
                </div>
                <span className="cta-feature-text">Learn from Qualified Teachers</span>
              </div>

              <div className="cta-feature-item">
                <div className="cta-feature-icon-circle">
                  <IconAwardGold />
                </div>
                <span className="cta-feature-text">Quality Islamic Education</span>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Sixth Section - FAQ */}
      <div className="about-page-container" style={{ minHeight: "auto", paddingTop: "0", marginTop: "-10px", backgroundImage: LACE_BACKGROUND_PATTERN, backgroundRepeat: 'repeat' }}>
        {/* Outer elegant border frame around the page */}
        <div className="about-page-border-frame animate-slide-up" style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}>
          
          {/* The main content card wrapping the FAQ */}
          <div className="about-card" style={{ padding: "60px 24px" }}>
            
            {/* Section Headline */}
            <h2 className="faq-title reveal-slide-up" style={{ textAlign: "center", color: "#2B1F14" }}>
              Many People <span style={{ color: "#C99B4D" }}>Ask About this</span>
            </h2>

            {/* Decorative Divider Line */}
            <div className="faq-divider" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "16px auto 16px auto" }}>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
              <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
                <IconRosette />
              </div>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
            </div>

            {/* Section Subtitle / Description */}
            <p className="faq-desc reveal-slide-up" style={{ textAlign: "center", margin: "0 auto 40px auto" }}>
              Following are answers to some queries that are posed regularly
            </p>

            {/* Accordions Container */}
            <div className="faq-container stagger-group" style={{ width: "100%", maxWidth: "850px", margin: "0 auto" }}>
              
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
            <div className="reveal-slide-up" style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "36px" }}>
              <Link 
                href="/contact" 
                className="faq-cta-btn"
                style={{ textDecoration: "none" }}
              >
                <span>BOOK YOUR FREE SESSION NOW!</span>
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>→</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
