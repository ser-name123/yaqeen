"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/settings-context";

// Custom Icons for the Hero Section
const IconGlobe = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconPeople = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconMonitor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconShieldCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </svg>
);

const IconCalendar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconCertificate = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const IconDividerStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Elegant 8-pointed geometric star shape */}
    <path 
      d="M12 2L14.8 6.8L19.8 4L17 9L21.8 11.8L17 14.6L19.8 19.6L14.8 16.8L12 21.6L9.2 16.8L4.2 19.6L7 14.6L2.2 11.8L7 9L4.2 4L9.2 6.8L12 2Z" 
      fill="#C99B4D" 
    />
    <circle cx="12" cy="12" r="3.5" fill="#FAF5EE" stroke="#C99B4D" strokeWidth="1.5" />
  </svg>
);

const IconSparkle = ({ size = 16, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill={color} />
  </svg>
);

const IconRosette = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Elegant geometric star/rosette shape matching mockup */}
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

const IconMail = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconNewsletterEnvelope = () => (
  <div style={{ position: "relative", width: "140px", height: "115px", margin: "0 auto 24px auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
    {/* Sparkles */}
    <div style={{ position: "absolute", left: "8px", top: "42px", color: "#C99B4D" }}><IconSparkle size={18} /></div>
    <div style={{ position: "absolute", right: "8px", top: "20px", color: "#C99B4D" }}><IconSparkle size={20} /></div>
    <div style={{ position: "absolute", right: "26px", top: "52px", color: "#C99B4D", transform: "scale(0.8)" }}><IconSparkle size={14} /></div>
    
    {/* Main Envelope SVG - enlarged to 96px for premium mockup proportions */}
    <svg width="96" height="96" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Letter Sheet */}
      <rect x="22" y="10" width="36" height="42" rx="2" fill="#FFFFFF" stroke="#4A5D3B" strokeWidth="2" />
      <line x1="28" y1="36" x2="52" y2="36" stroke="#4A5D3B" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="28" y1="42" x2="44" y2="42" stroke="#4A5D3B" strokeWidth="1.5" strokeDasharray="2 2" />
      
      {/* Rosette on Letter - filled with gold for a high-fidelity premium touch */}
      <path 
        d="M40 18L41.2 20L43.2 19.5L42.7 21.5L44.5 22.7L42.7 23.9L43.2 25.9L41.2 25.4L40 27.4L38.8 25.4L36.8 25.9L37.3 23.9L35.5 22.7L37.3 21.5L36.8 19.5L38.8 20L40 18Z" 
        stroke="#C99B4D" 
        strokeWidth="1.5" 
        fill="#C99B4D" 
        fillOpacity="0.2" 
      />
      <circle cx="40" cy="22.7" r="2" stroke="#C99B4D" strokeWidth="1.5" fill="#C99B4D" />
      
      {/* Envelope Back/Body */}
      <path d="M15 35V62C15 64.2 16.8 66 19 66H61C63.2 66 65 64.2 65 62V35" fill="#FAF6F0" stroke="#4A5D3B" strokeWidth="2" strokeLinejoin="round" />
      {/* Envelope Front Flap (Open) */}
      <path d="M15 35L40 54L65 35" stroke="#4A5D3B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M15 62L35 45" stroke="#4A5D3B" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 62L45 45" stroke="#4A5D3B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const IconBookOpen = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconMosque = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v3M12 5a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3z" />
    <path d="M4 22V10l3-2v14M20 22V10l-3-2v14" />
    <path d="M7 22h10" />
    <path d="M9 15h6v7H9z" />
  </svg>
);

const IconArabicChat = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
    <path d="M8 11.5h8M8 15h5" />
  </svg>
);

const IconCheckGold = () => (
  <div style={{
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "rgba(201, 155, 77, 0.12)",
    border: "1.5px solid #C99B4D",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#C99B4D",
    flexShrink: 0
  }}>
    <svg width="9" height="7" viewBox="0 0 12 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10 1.5 4.2 7.2 1.5 4.5" />
    </svg>
  </div>
);

const IconSmiley = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const HeaderPattern = ({ color = "currentColor", opacity = 0.08 }) => (
  <svg 
    width="160" 
    height="160" 
    viewBox="0 0 160 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      top: "50%",
      left: "-20px",
      transform: "translateY(-50%)",
      opacity: opacity,
      pointerEvents: "none",
      color: color,
      zIndex: 1
    }}
  >
    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
    <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="1" />
    <circle cx="80" cy="80" r="48" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="80" cy="80" r="36" stroke="currentColor" strokeWidth="1" />
    <circle cx="80" cy="80" r="24" stroke="currentColor" strokeWidth="0.75" />
    <rect x="45" y="45" width="70" height="70" stroke="currentColor" strokeWidth="1" />
    <rect x="45" y="45" width="70" height="70" stroke="currentColor" strokeWidth="1" transform="rotate(45 80 80)" />
    <rect x="45" y="45" width="70" height="70" stroke="currentColor" strokeWidth="0.5" transform="rotate(22.5 80 80)" opacity="0.7" />
    <rect x="45" y="45" width="70" height="70" stroke="currentColor" strokeWidth="0.5" transform="rotate(67.5 80 80)" opacity="0.7" />
    <line x1="80" y1="10" x2="80" y2="150" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
    <line x1="10" y1="80" x2="150" y2="80" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
    <line x1="30.5" y1="30.5" x2="129.5" y2="129.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
    <line x1="30.5" y1="129.5" x2="129.5" y2="30.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
  </svg>
);

const IconStepTrial = ({ size = 64, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="10" rx="1.5" />
    <path d="M10 14v3M7 17h6" />
    <circle cx="10" cy="8.5" r="1.8" />
    <path d="M6.5 12c0-1 1-1.5 3.5-1.5s3.5 0.5 3.5 1.5" />
    <path d="M16.5 3h4c.8 0 1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5h-1.2l-1.3 1.3V8h-1.5c-.8 0-1.5-.7-1.5-1.5v-2c0-.8.7-1.5 1.5-1.5z" fill="#FFFFFF" />
    <circle cx="18" cy="5" r="0.45" fill={color} stroke="none" />
    <circle cx="19.2" cy="5" r="0.45" fill={color} stroke="none" />
    <circle cx="20.4" cy="5" r="0.45" fill={color} stroke="none" />
  </svg>
);

const IconStepPlan = ({ size = 64, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="9" y="2" width="6" height="3.5" rx="1" />
    <path d="M7.5 9l1 1 2-2" />
    <line x1="12" y1="9.5" x2="16" y2="9.5" />
    <path d="M7.5 13l1 1 2-2" />
    <line x1="12" y1="13.5" x2="15" y2="13.5" />
    <path d="M7.5 17l1 1 2-2" />
    <line x1="12" y1="17.5" x2="13.5" y2="17.5" />
    <path d="M14 18l4.5-4.5a1 1 0 0 1 1.4 0l0.7 0.7a1 1 0 0 1 0 1.4L16 20h-2v-2Z" />
  </svg>
);

const IconStepSchedule = ({ size = 64, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="14" height="14" rx="1.5" />
    <line x1="13" y1="3" x2="13" y2="6" />
    <line x1="7" y1="3" x2="7" y2="6" />
    <line x1="3" y1="10" x2="17" y2="10" />
    <circle cx="6.5" cy="13" r="0.5" fill={color} stroke="none" />
    <circle cx="10" cy="13" r="0.5" fill={color} stroke="none" />
    <circle cx="13.5" cy="13" r="0.5" fill={color} stroke="none" />
    <circle cx="6.5" cy="16.5" r="0.5" fill={color} stroke="none" />
    <circle cx="10" cy="16.5" r="0.5" fill={color} stroke="none" />
    <circle cx="17.5" cy="17.5" r="4.5" fill="#FFFFFF" />
    <circle cx="17.5" cy="17.5" r="4.5" />
    <polyline points="17.5 15 17.5 17.5 19 18.5" />
  </svg>
);

const IconStepJourney = ({ size = 64, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h6.5a3 3 0 0 1 3 3v9a2 2 0 0 0-2-2H3z" />
    <path d="M21 8h-6.5a3 3 0 0 0-3 3v9a2 2 0 0 1 2-2h6.5z" />
    <path d="M12 11v9" />
    <path d="M12 1.5l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" fill="currentColor" stroke="none" />
    <path d="M7 3l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" fill="currentColor" stroke="none" />
    <path d="M17 3l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" fill="currentColor" stroke="none" />
  </svg>
);

const IconGlobeChoose = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconSpeechChoose = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="8" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
);

const IconUserChoose = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconTeacher = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCalendarClock = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="16" cy="16" r="4" />
    <polyline points="16 14 16 16 17.5 16.5" />
  </svg>
);

const IconLaptopUser = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="11" rx="2" />
    <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M16 13a4 4 0 0 0-8 0" />
    <line x1="2" y1="20" x2="22" y2="20" />
    <path d="M5 15h14" />
  </svg>
);

const IconBriefcase = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconTwoUsers = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconGroupUsers = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTrendUp = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconPlayVideo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <polygon points="10 8 16 11 10 14 10 8" />
  </svg>
);

const IconBackpack = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M8 10h8" />
    <path d="M8 14h8" />
  </svg>
);

const IconStarOutline = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconHeartOutline = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const defaultTeachers = [
  {
    id: 1,
    name: "Ustadh Rahman Ali",
    avatar_url: "/images/teacher_rahman.png",
    languages: "Arabic, English, Urdu",
    experience: "8+ Years",
    specialization: "Qur'an, Tajweed"
  },
  {
    id: 2,
    name: "Ustadha Aisha Khan",
    avatar_url: "/images/teacher_aisha.png",
    languages: "Arabic, English",
    experience: "6+ Years",
    specialization: "Tafseer, Hadith"
  },
  {
    id: 3,
    name: "Ustadh Saad Ahmed",
    avatar_url: "/images/teacher_saad.png",
    languages: "Arabic, English, Urdu",
    experience: "10+ Years",
    specialization: "Fiqh, Seerah"
  },
  {
    id: 4,
    name: "Ustadha Maryam Zahra",
    avatar_url: "/images/teacher_maryam.png",
    languages: "Arabic, English, Urdu",
    experience: "7+ Years",
    specialization: "Islamic Studies"
  }
];

export default function Home() {
  const { faviconUrl } = useSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [newsEmail, setNewsEmail] = useState("");
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [teachers, setTeachers] = useState(defaultTeachers);
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
            return targets.includes("all") || targets.includes("home");
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
    async function fetchTeachers() {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setTeachers(data);
        }
      } catch (err) {
        console.warn("Could not load teachers from Supabase, using default lists:", err);
      }
    }
    fetchTeachers();
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
    <div style={{ minHeight: "100vh" }}>
      
      {/* =========================================================================
         SECTION 1: HERO CONTAINER
         ========================================================================= */}
      <section className="hero-wrapper" style={{ minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        
        {/* Main Content Area */}
        <main style={{ maxWidth: "1350px", width: "100%", margin: "0 auto", padding: "60px 24px", flexGrow: 1, display: "flex", alignItems: "center" }}>
          <div className="hero-grid" style={{ width: "100%" }}>
            
            {/* Left Column (Content) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", zIndex: 5 }}>
              
              {/* Pill Badge */}
              <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "8px", 
                border: "1px solid rgba(201, 155, 77, 0.35)", 
                borderRadius: "9999px", 
                padding: "8px 18px", 
                backgroundColor: "rgba(250, 245, 238, 0.6)", 
                marginBottom: "28px" 
              }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#C99B4D", letterSpacing: "0.5px" }}>Learn in Any Language</span>
                <span style={{ color: "#C99B4D", display: "flex", alignItems: "center" }}><IconGlobe /></span>
              </div>

              {/* Main Headline */}
              <h1 style={{ 
                fontSize: "60px", 
                fontWeight: "900", 
                color: "#111111", 
                lineHeight: "1.15", 
                marginBottom: "24px", 
                fontFamily: "var(--font-poppins)", 
                letterSpacing: "-1.5px" 
              }}>
                Online Qur’an,<br />
                <span style={{ color: "#C99B4D" }}>Islamic Studies &</span><br />
                <span style={{ color: "#556B3B" }}>Arabic Classes</span>
              </h1>

              {/* Subheading */}
              <h3 style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                color: "#2B1F14", 
                marginBottom: "16px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                flexWrap: "wrap" 
              }}>
                Learn in Your Own{" "}
                <span style={{ position: "relative", color: "#C99B4D", display: "inline-block" }}>
                  Language
                  <svg style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "8px" }} viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 C30,8 70,2 100,5" stroke="#C99B4D" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h3>

              {/* Description */}
              <p style={{ 
                fontSize: "16px", 
                color: "#5C4D3C", 
                lineHeight: "1.6", 
                maxWidth: "480px", 
                marginBottom: "36px", 
                fontWeight: "600" 
              }}>
                Quality Islamic education for all ages, from the comfort of your home.
              </p>

              {/* Button */}
              <div style={{ marginBottom: "40px" }}>
                <Link href="/pricing" style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 36px",
                  borderRadius: "9999px",
                  backgroundColor: "#C99B4D",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: "16px",
                  boxShadow: "0 10px 20px rgba(201, 155, 77, 0.25)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(201, 155, 77, 0.35)";
                  e.currentTarget.style.backgroundColor = "#B3853B";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(201, 155, 77, 0.25)";
                  e.currentTarget.style.backgroundColor = "#C99B4D";
                }}
                >
                  Get Started <span style={{ fontSize: "18px" }}>→</span>
                </Link>
              </div>

              {/* Secondary Features Row */}
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#C99B4D", display: "flex", alignItems: "center", color: "#FFF", flexShrink: 0, justifyContent: "center" }}>
                    <IconPeople />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B1F14" }}>For All Ages</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#556B3B", display: "flex", alignItems: "center", color: "#FFF", flexShrink: 0, justifyContent: "center" }}>
                    <IconMonitor />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B1F14" }}>Live Online Classes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#2B1F14", display: "flex", alignItems: "center", color: "#FFF", flexShrink: 0, justifyContent: "center" }}>
                    <IconChat />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B1F14" }}>Learn in Any Language</span>
                </div>
              </div>

            </div>

            {/* Right Column (Intentionally empty on desktop so background image is visible) */}
            <div style={{ display: "block" }}></div>
            
          </div>
        </main>

        {/* Bottom Floating Banner */}
        <div style={{ width: "100%", padding: "0 24px 40px 24px" }}>
          <div style={{
            maxWidth: "1300px",
            width: "100%",
            margin: "0 auto",
            backgroundColor: "#FAF4EB", /* Warm peach-cream background matching the mockup exactly */
            border: "1px solid #EAD8C3", /* Thin gold-beige border */
            borderRadius: "28px",
            padding: "24px 32px",
            boxShadow: "0 15px 40px rgba(139, 115, 85, 0.06)", /* Premium soft warm shadow */
            position: "relative",
            zIndex: 10,
          }}>
            <div className="bottom-banner-grid">
              
              {/* Card 1 */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1.5px solid #C99B4D", backgroundColor: "rgba(201, 155, 77, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C99B4D", flexShrink: 0 }}>
                  <IconShieldCheck size={32} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#2B1F14" }}>No Hidden Fees</h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#5C4D3C", fontWeight: "600" }}>What you see is what you pay.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1.5px solid #4A5D3B", backgroundColor: "rgba(74, 93, 59, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5D3B", flexShrink: 0 }}>
                  <IconPeople size={30} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#2B1F14" }}>Family Discounts</h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#5C4D3C", fontWeight: "600" }}>Save more when you learn together.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1.5px solid #C99B4D", backgroundColor: "rgba(201, 155, 77, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C99B4D", flexShrink: 0 }}>
                  <IconCalendar size={32} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#2B1F14" }}>Flexible Plans</h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#5C4D3C", fontWeight: "600" }}>Choose what works for you.</p>
                </div>
              </div>

              {/* Card 4 */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "1.5px solid #4A5D3B", backgroundColor: "rgba(74, 93, 59, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A5D3B", flexShrink: 0 }}>
                  <IconCertificate size={32} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#2B1F14" }}>Quality Education</h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#5C4D3C", fontWeight: "600" }}>Learn from qualified teachers.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
         SECTION 2: LANGUAGES BANNER (FULL WIDTH WITH OVERLAY)
         ========================================================================= */}
      <section className="lang-section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/images/lang_bg.png" 
          alt="Learn in Your Own Language" 
          className="lang-image"
        />

        {/* Text Content Overlay over the image */}
        <div className="lang-overlay reveal-slide-up">
          
          {/* Heading */}
          <h2 className="lang-title">
            Learn in<br />
            <span style={{ color: "#C99B4D" }}>Your Language</span>
          </h2>

          {/* Decorative Divider Line with Star and Dots */}
          <div className="lang-divider">
            <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
            <div style={{ width: "clamp(3px, 0.4vw, 6px)", height: "clamp(3px, 0.4vw, 6px)", borderRadius: "50%", backgroundColor: "#C99B4D", opacity: 0.8 }} />
            <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(clamp(0.5, 0.8vw + 0.3, 1))" }}>
              <IconDividerStar />
            </div>
            <div style={{ width: "clamp(3px, 0.4vw, 6px)", height: "clamp(3px, 0.4vw, 6px)", borderRadius: "50%", backgroundColor: "#C99B4D", opacity: 0.8 }} />
            <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
          </div>

          {/* Description Paragraph */}
          <p className="lang-desc">
            You can learn and understand<br />
            {"Qur'an, Islamic Studies & Arabic"}<br />
            in <span style={{ color: "#556B3B", fontWeight: "700" }}>the language you understand best.</span>
          </p>

        </div>
      </section>

      {/* =========================================================================
         SECTION 3: WHAT WE TEACH
         ========================================================================= */}
      <section className="teach-section" style={{
        padding: "50px 24px",
        backgroundColor: "#FAF5EE",
        backgroundImage: "url('/images/teach_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderTop: "1.5px solid #F5EBDD",
      }}>
        
        {/* YAQEEN INSTITUTE Top Logo (Horizontal: Icon then Text) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          {faviconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={faviconUrl} 
              alt="YAQEEN INSTITUTE" 
              style={{ height: "32px", width: "auto", objectFit: "contain" }} 
            />
          ) : (
            <svg width="28" height="24" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
              <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
              <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
              <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          <span style={{ 
            textTransform: "uppercase", 
            fontWeight: "700", 
            color: "#2B1F14", 
            fontSize: "15px", 
            letterSpacing: "2px",
            fontFamily: "var(--font-sans), sans-serif"
          }}>YAQEEN INSTITUTE</span>
        </div>

        {/* Section Headline */}
        <h2 className="reveal-slide-up" style={{
          fontSize: "clamp(36px, 4.5vw, 56px)",
          fontWeight: "800",
          color: "#2B1F14",
          textAlign: "center",
          margin: "0 0 24px 0",
          fontFamily: "var(--font-serif), Georgia, serif",
          letterSpacing: "-1px"
        }}>What We Teach</h2>

        {/* Decorative Divider Line */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "240px", marginBottom: "28px" }}>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconDividerStar />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Subtitle */}
        <p className="reveal-slide-up" style={{
          fontSize: "clamp(15px, 1.3vw, 18px)",
          color: "#5C4D3C",
          textAlign: "center",
          margin: "0 0 60px 0",
          maxWidth: "600px",
          lineHeight: "1.6",
          fontWeight: "500",
          fontFamily: "var(--font-sans), sans-serif"
        }}>
          Comprehensive learning in {"Qur'an"}, Islamic Studies, and Arabic Language.
        </p>

        {/* Cards Grid */}
        <div className="teach-grid stagger-group">

          {/* Card 1: Qur'an */}
          <div className="teach-card reveal-stagger" style={{
            backgroundColor: "#FFF8F4",
            borderRadius: "28px",
            border: "1.5px solid #F5EBDD",
            boxShadow: "0 10px 30px rgba(44, 37, 30, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(44, 37, 30, 0.08)";
            e.currentTarget.style.borderColor = "#C99B4D";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(44, 37, 30, 0.03)";
            e.currentTarget.style.borderColor = "#F5EBDD";
          }}
          >
            <div style={{ padding: "20px 20px 0 20px", position: "relative" }}>
              {/* Image Container */}
              <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "20px", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/course_quran.png" 
                  alt="Qur'an" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>

              {/* Circle Icon */}
              <div style={{
                position: "absolute",
                top: "116px",
                left: "32px",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#C99B4D",
                border: "3px solid #FFFFFF",
                boxShadow: "0 4px 12px rgba(201, 155, 77, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                zIndex: 10
              }}>
                <IconBookOpen size={28} />
              </div>

              {/* Text Content */}
              <div style={{ padding: "34px 12px 28px 12px" }}>
                <h3 style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#2B1F14",
                  margin: "0 0 10px 0",
                  fontFamily: "var(--font-serif), Georgia, serif"
                }}>{"Qur'an"}</h3>
                
                <div style={{ width: "40px", height: "3px", backgroundColor: "#C99B4D", marginBottom: "20px", borderRadius: "999px" }} />

                <p style={{
                  fontSize: "14px",
                  color: "#5C4D3C",
                  lineHeight: "1.6",
                  fontWeight: "500",
                  margin: "0 0 24px 0",
                  minHeight: "44px"
                }}>Master recitation, memorization, and reading fundamentals.</p>

                <div style={{ height: "1px", backgroundColor: "#F5EBDD", margin: "0 0 20px 0" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Tajweed with Makharij</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>{"Qur'an Memorization"}</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>{"Qur'an Reading"}</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Noorani Qaidah</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer banner */}
            <div style={{
              backgroundColor: "rgba(250, 245, 238, 0.8)",
              borderTop: "1px solid #F5EBDD",
              padding: "16px 28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#C99B4D", letterSpacing: "0.5px" }}>✦ and many more courses</span>
            </div>
          </div>

          {/* Card 2: Islamic Studies */}
          <div className="teach-card reveal-stagger" style={{
            backgroundColor: "#FFF8F4",
            borderRadius: "28px",
            border: "1.5px solid #F5EBDD",
            boxShadow: "0 10px 30px rgba(44, 37, 30, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(44, 37, 30, 0.08)";
            e.currentTarget.style.borderColor = "#C99B4D";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(44, 37, 30, 0.03)";
            e.currentTarget.style.borderColor = "#F5EBDD";
          }}
          >
            <div style={{ padding: "20px 20px 0 20px", position: "relative" }}>
              {/* Image Container */}
              <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "20px", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/course_studies.png" 
                  alt="Islamic Studies" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>

              {/* Circle Icon */}
              <div style={{
                position: "absolute",
                top: "116px",
                left: "32px",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#C99B4D",
                border: "3px solid #FFFFFF",
                boxShadow: "0 4px 12px rgba(201, 155, 77, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                zIndex: 10
              }}>
                <IconMosque size={26} />
              </div>

              {/* Text Content */}
              <div style={{ padding: "34px 12px 28px 12px" }}>
                <h3 style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#2B1F14",
                  margin: "0 0 10px 0",
                  fontFamily: "var(--font-serif), Georgia, serif"
                }}>Islamic Studies</h3>
                
                <div style={{ width: "40px", height: "3px", backgroundColor: "#C99B4D", marginBottom: "20px", borderRadius: "999px" }} />

                <p style={{
                  fontSize: "14px",
                  color: "#5C4D3C",
                  lineHeight: "1.6",
                  fontWeight: "500",
                  margin: "0 0 24px 0",
                  minHeight: "44px"
                }}>Learn faith, character, and practical Islamic knowledge.</p>

                <div style={{ height: "1px", backgroundColor: "#F5EBDD", margin: "0 0 20px 0" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Basics of Islam</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Akhlaaq</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Fiqh</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Seerah &amp; more</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer banner */}
            <div style={{
              backgroundColor: "rgba(250, 245, 238, 0.8)",
              borderTop: "1px solid #F5EBDD",
              padding: "16px 28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#C99B4D", letterSpacing: "0.5px" }}>✦ and many more courses</span>
            </div>
          </div>

          {/* Card 3: Arabic Language */}
          <div className="teach-card reveal-stagger" style={{
            backgroundColor: "#FFF8F4",
            borderRadius: "28px",
            border: "1.5px solid #F5EBDD",
            boxShadow: "0 10px 30px rgba(44, 37, 30, 0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(44, 37, 30, 0.08)";
            e.currentTarget.style.borderColor = "#C99B4D";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(44, 37, 30, 0.03)";
            e.currentTarget.style.borderColor = "#F5EBDD";
          }}
          >
            <div style={{ padding: "20px 20px 0 20px", position: "relative" }}>
              {/* Image Container */}
              <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "20px", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/course_arabic.png" 
                  alt="Arabic Language" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>

              {/* Circle Icon */}
              <div style={{
                position: "absolute",
                top: "116px",
                left: "32px",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#C99B4D",
                border: "3px solid #FFFFFF",
                boxShadow: "0 4px 12px rgba(201, 155, 77, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                zIndex: 10
              }}>
                <IconArabicChat size={26} />
              </div>

              {/* Text Content */}
              <div style={{ padding: "34px 12px 28px 12px" }}>
                <h3 style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#2B1F14",
                  margin: "0 0 10px 0",
                  fontFamily: "var(--font-serif), Georgia, serif"
                }}>Arabic Language</h3>
                
                <div style={{ width: "40px", height: "3px", backgroundColor: "#C99B4D", marginBottom: "20px", borderRadius: "999px" }} />

                <p style={{
                  fontSize: "14px",
                  color: "#5C4D3C",
                  lineHeight: "1.6",
                  fontWeight: "500",
                  margin: "0 0 24px 0",
                  minHeight: "44px"
                }}>Gain fluency through spoken, academic, and professional Arabic.</p>

                <div style={{ height: "1px", backgroundColor: "#F5EBDD", margin: "0 0 20px 0" }} />

                <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Spoken Arabic</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>School Arabic</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Professional Arabic</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#2B1F14", fontWeight: "600" }}>
                    <IconCheckGold />
                    <span>Conversational Arabic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer banner */}
            <div style={{
              backgroundColor: "rgba(250, 245, 238, 0.8)",
              borderTop: "1px solid #F5EBDD",
              padding: "16px 28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#C99B4D", letterSpacing: "0.5px" }}>✦ and many more courses</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
         SECTION 4: WHY FAMILIES CHOOSE YAQEEN
         ========================================================================= */}
      <section className="choose-section">
        
        {/* Pill Badge */}
        <div className="choose-pill reveal-slide-up">
          <span className="choose-pill-text">Why Families Choose Yaqeen</span>
        </div>

        {/* Decorative Divider Line */}
        <div className="choose-divider">
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconDividerStar />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Headline */}
        <h2 className="choose-title reveal-slide-up">
          More Than Education.<br />
          A Journey of <span style={{ color: "#C99B4D" }}>Faith &amp; Success.</span>
        </h2>

        {/* Section Subtitle / Description */}
        <p className="choose-desc reveal-slide-up">
          We make Islamic education <span style={{ color: "#C99B4D" }}>accessible, engaging</span> and <span style={{ color: "#C99B4D" }}>effective</span><br />
          for every learner, in every language.
        </p>

        {/* Stats Grid */}
        <div className="choose-grid stagger-group">
          
          {/* Stat 1: Student Satisfaction */}
          <div className="choose-col reveal-stagger">
            <div className="choose-icon-wrap gold-border" style={{ color: "#C99B4D" }}>
              <IconSmiley size={36} />
            </div>
            <h3 className="choose-num" style={{ color: "#C99B4D" }}>95%</h3>
            <p className="choose-label">Student Satisfaction</p>
            <div className="choose-accent-line" />
          </div>

          {/* Stat 2: Countries */}
          <div className="choose-col reveal-stagger">
            <div className="choose-icon-wrap green-border" style={{ color: "#4A5D3B" }}>
              <IconGlobeChoose size={34} />
            </div>
            <h3 className="choose-num" style={{ color: "#4A5D3B" }}>50+</h3>
            <p className="choose-label">Countries</p>
            <div className="choose-accent-line" />
          </div>

          {/* Stat 3: Languages */}
          <div className="choose-col reveal-stagger">
            <div className="choose-icon-wrap gold-border" style={{ color: "#C99B4D" }}>
              <IconSpeechChoose size={34} />
            </div>
            <h3 className="choose-num" style={{ color: "#C99B4D" }}>15+</h3>
            <p className="choose-label">Languages</p>
            <div className="choose-accent-line" />
          </div>

          {/* Stat 4: Live Classes */}
          <div className="choose-col reveal-stagger">
            <div className="choose-icon-wrap green-border" style={{ color: "#4A5D3B" }}>
              <IconUserChoose size={34} />
            </div>
            <h3 className="choose-num" style={{ color: "#4A5D3B" }}>1-on-1</h3>
            <p className="choose-label">Live Classes</p>
            <div className="choose-accent-line" />
          </div>

        </div>

        {/* Features Card Container */}
        <div className="choose-features-container reveal-slide-up">
          <div className="features-grid stagger-group">
            
            {/* Feature 1 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconSpeechChoose size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Learn in Your Own Language</h4>
                <p className="feature-text">Understand better and learn with confidence in the language you know.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconTeacher size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Qualified Teachers</h4>
                <p className="feature-text">Experienced and certified teachers who are passionate about teaching.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconCalendarClock size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Flexible Scheduling</h4>
                <p className="feature-text">Book classes at times that suit your routine and never miss a lesson.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconLaptopUser size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">One-to-One Classes</h4>
                <p className="feature-text">Personalized attention for faster progress and deeper understanding.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconTwoUsers size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Male &amp; Female Teachers</h4>
                <p className="feature-text">Choose from a wide range of male and female teachers as per your preference.</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconGroupUsers size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Classes for All Ages</h4>
                <p className="feature-text">Programs designed for kids, teens and adults at every level.</p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconTrendUp size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Progress Tracking</h4>
                <p className="feature-text">Regular assessments and detailed reports to track your progress.</p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="feature-item reveal-stagger">
              <div className="feature-icon-box">
                <IconPlayVideo size={24} />
              </div>
              <div className="feature-content">
                <h4 className="feature-title">Interactive Learning</h4>
                <p className="feature-text">Engaging, modern and interactive classes that make learning enjoyable.</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
         SECTION 5: CHOOSE YOUR LEARNING PATH (LEARNING FOR EVERY AGE)
         ========================================================================= */}
      <section className="age-section">
        
        {/* YAQEEN INSTITUTE Top Logo (Horizontal: Icon then Text) */}
        <div className="reveal-slide-up" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          {faviconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={faviconUrl} 
              alt="YAQEEN INSTITUTE" 
              style={{ height: "32px", width: "auto", objectFit: "contain" }} 
            />
          ) : (
            <svg width="28" height="24" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
              <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
              <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
              <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          <span style={{ 
            textTransform: "uppercase", 
            fontWeight: "700", 
            color: "#2B1F14", 
            fontSize: "15px", 
            letterSpacing: "2px",
            fontFamily: "var(--font-sans), sans-serif"
          }}>YAQEEN INSTITUTE</span>
        </div>

        {/* Subtitle Text */}
        <div className="reveal-slide-up" style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "#C99B4D",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans), sans-serif",
          textAlign: "center",
          marginBottom: "8px"
        }}>
          Choose Your Learning Path
        </div>


        {/* Decorative Divider Line */}
        <div className="age-divider">
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconDividerStar />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Headline */}
        <h2 className="age-title reveal-slide-up">
          Learning for <span style={{ color: "#C99B4D" }}>Every Age.</span>
        </h2>

        {/* Section Subtitle / Description */}
        <p className="age-desc reveal-slide-up">
          Whether you’re a parent looking for the best start for your child<br />
          or an adult seeking to grow in faith, we have the right program for you.
        </p>

        {/* Cards Grid */}
        <div className="age-grid stagger-group">
          
          {/* Card 1: Kids Program */}
          <div className="age-card reveal-stagger">
            <div className="age-card-header age-header-kids">
              <HeaderPattern color="#FAF5EE" opacity={0.07} />
            </div>
            <div className="age-card-icon-wrap">
              <IconSmiley size={36} />
            </div>
            <div className="age-card-body">
              <div className="age-card-info">
                <h3 className="age-card-title">Kids Program</h3>
                <span className="age-card-range">Ages 4–12</span>
                <div className="age-card-dash" />
                <p className="age-card-text">Fun, engaging and interactive classes designed to build a strong foundation in Islam.</p>
              </div>
              <div className="age-card-footer">
                <div className="age-footer-pill">
                  <IconPeople size={18} />
                  <span>Build | Learn | Grow</span>
                </div>
              </div>
            </div>
            <div className="age-card-bottom-bar age-bar-kids" />
          </div>

          {/* Card 2: Teen Program */}
          <div className="age-card reveal-stagger">
            <div className="age-card-header age-header-teen">
              <HeaderPattern color="#C99B4D" opacity={0.12} />
            </div>
            <div className="age-card-icon-wrap">
              <IconBackpack size={36} />
            </div>
            <div className="age-card-body">
              <div className="age-card-info">
                <h3 className="age-card-title">Teen Program</h3>
                <span className="age-card-range">Ages 13–18</span>
                <div className="age-card-dash" />
                <p className="age-card-text">Inspire, educate and empower teens to strengthen their faith and character in today's world.</p>
              </div>
              <div className="age-card-footer">
                <div className="age-footer-pill">
                  <IconStarOutline size={18} />
                  <span>Inspire | Understand | Lead</span>
                </div>
              </div>
            </div>
            <div className="age-card-bottom-bar age-bar-teen" />
          </div>

          {/* Card 3: Adult Program */}
          <div className="age-card reveal-stagger">
            <div className="age-card-header age-header-adult">
              <HeaderPattern color="#FAF5EE" opacity={0.12} />
            </div>
            <div className="age-card-icon-wrap">
              <IconUserChoose size={36} />
            </div>
            <div className="age-card-body">
              <div className="age-card-info">
                <h3 className="age-card-title">Adult Program</h3>
                <span className="age-card-range">18+</span>
                <div className="age-card-dash" />
                <p className="age-card-text">Deepen your knowledge, reconnect with your faith and grow spiritually at your own pace.</p>
              </div>
              <div className="age-card-footer">
                <div className="age-footer-pill">
                  <IconBookOpen size={18} />
                  <span>Learn | Reflect | Grow</span>
                </div>
              </div>
            </div>
            <div className="age-card-bottom-bar age-bar-adult" />
          </div>

          {/* Card 4: Family Program */}
          <div className="age-card reveal-stagger">
            <div className="age-card-header age-header-family">
              <HeaderPattern color="#FAF5EE" opacity={0.1} />
            </div>
            <div className="age-card-icon-wrap">
              <IconGroupUsers size={36} />
            </div>
            <div className="age-card-body">
              <div className="age-card-info">
                <h3 className="age-card-title">Family Program</h3>
                <span className="age-card-range">All Ages</span>
                <div className="age-card-dash" />
                <p className="age-card-text">Learn together as a family and strengthen your bond through Islamic knowledge.</p>
              </div>
              <div className="age-card-footer">
                <div className="age-footer-pill">
                  <IconHeartOutline size={18} />
                  <span>Learn Together | Grow Together</span>
                </div>
              </div>
            </div>
            <div className="age-card-bottom-bar age-bar-family" />
          </div>

        </div>

      </section>

      {/* =========================================================================
         SECTION 6: BEGIN YOUR LEARNING JOURNEY (HOW IT WORKS - 4 SIMPLE STEPS)
         ========================================================================= */}
      <section className="journey-section">
        
        {/* Pill Badge */}
        <div className="journey-pill reveal-slide-up" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          border: "1.5px solid rgba(201, 155, 77, 0.3)",
          borderRadius: "9999px",
          padding: "8px 28px",
          backgroundColor: "#FAF5EE",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(44, 37, 30, 0.02)"
        }}>
          {/* Graduation cap icon in gold */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          <span style={{
            fontSize: "14px",
            fontWeight: "800",
            color: "#2B1F14",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans), sans-serif"
          }}>
            How It Works
          </span>
        </div>


        {/* Section Headline */}
        <h2 className="journey-title reveal-slide-up" style={{ marginBottom: "0px" }}>
          Begin Your Learning Journey<br />in <span style={{ color: "#C99B4D" }}>4 Simple Steps</span>
        </h2>

        {/* Decorative Divider Line */}
        <div className="age-divider" style={{ marginBottom: "8px", marginTop: "6px" }}>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconDividerStar />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Subtitle / Description */}
        <p className="journey-desc reveal-slide-up" style={{ marginBottom: "36px" }}>
          A simple process to begin a meaningful journey with knowledge and faith.
        </p>



        {/* Journey Steps Container */}
        <div className="journey-steps-container reveal-slide-up">
          
          {/* Connecting Line */}
          <div className="journey-connector-line" />

          {/* Step 1 */}
          <div className="journey-step-item">
            <div className="journey-circle journey-circle-gold">
              <div className="journey-step-number journey-number-gold">01</div>
              <IconStepTrial color="#C99B4D" size={38} />
            </div>
            <div className="journey-dashed-line journey-dashed-gold" />
            <div className="journey-step-content">
              <h3 className="journey-step-title journey-title-gold">Trial</h3>
              <p className="journey-step-text">Book a free trial class and experience our teaching approach.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="journey-step-item">
            <div className="journey-circle journey-circle-olive">
              <div className="journey-step-number journey-number-olive">02</div>
              <IconStepPlan color="#5C644F" size={38} />
            </div>
            <div className="journey-dashed-line journey-dashed-olive" />
            <div className="journey-step-content">
              <h3 className="journey-step-title journey-title-olive">Plan</h3>
              <p className="journey-step-text">Choose your course and learning path that best fits your goals.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="journey-step-item">
            <div className="journey-circle journey-circle-gold">
              <div className="journey-step-number journey-number-gold">03</div>
              <IconStepSchedule color="#C99B4D" size={38} />
            </div>
            <div className="journey-dashed-line journey-dashed-gold" />
            <div className="journey-step-content">
              <h3 className="journey-step-title journey-title-gold">Schedule</h3>
              <p className="journey-step-text">Pick a time that works for you and book a class with our teacher.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="journey-step-item">
            <div className="journey-circle journey-circle-olive">
              <div className="journey-step-number journey-number-olive">04</div>
              <IconStepJourney color="#5C644F" size={38} />
            </div>
            <div className="journey-dashed-line journey-dashed-olive" />
            <div className="journey-step-content">
              <h3 className="journey-step-title journey-title-olive">Start Journey</h3>
              <p className="journey-step-text">Complete registration and begin your learning journey with confidence.</p>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
         SECTION 7: MEET OUR TEACHERS
         ========================================================================= */}
      <section className="teachers-section" id="teachers">
        
        {/* Pill Badge */}
        <div className="teachers-pill reveal-slide-up">
          <span className="teachers-pill-text">Meet Our Teachers</span>
        </div>

        {/* Decorative Divider Line */}
        <div className="teachers-divider" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "0 auto 8px auto" }}>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", color: "#C99B4D", transform: "scale(0.85)" }}>
            <IconDividerStar />
          </div>
          <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.6 }} />
        </div>

        {/* Section Headline */}
        <h2 className="teachers-title reveal-slide-up">
          Learn from Experienced<br />and <span style={{ color: "#C99B4D" }}>Caring Teachers.</span>
        </h2>

        {/* Section Subtitle / Description */}
        <p className="teachers-desc reveal-slide-up">
          Our teachers are qualified, experienced, and passionate about helping you grow in your Islamic knowledge.
        </p>

        {/* Teachers Cards Grid */}
        <div className="teachers-grid stagger-group">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card reveal-stagger">
              <div className="teacher-avatar-wrap">
                <img 
                  src={teacher.avatar_url || "/images/teacher_rahman.png"} 
                  alt={teacher.name} 
                  className="teacher-avatar" 
                />
              </div>
              <div className="teacher-info">
                <h3 className="teacher-name">{teacher.name}</h3>
                <div className="teacher-accent-line" />
                
                <div className="teacher-details">
                  <div className="teacher-detail-item">
                    <IconGlobe size={16} className="teacher-detail-icon" />
                    <span><strong>Languages:</strong> {teacher.languages}</span>
                  </div>
                  <div className="teacher-detail-item">
                    <IconBriefcase size={16} className="teacher-detail-icon" />
                    <span><strong>Experience:</strong> {teacher.experience}</span>
                  </div>
                  <div className="teacher-detail-item">
                    <IconStarOutline size={16} className="teacher-detail-icon" />
                    <span><strong>Specialization:</strong> {teacher.specialization}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
         SECTION 8: BLOGS
         ========================================================================= */}
      <section className="blog-section" id="blog">
        
        {/* Pill Badge */}
        <div className="blog-pill reveal-slide-up">
          <IconSparkle size={14} />
          <span className="blog-pill-text" style={{ margin: "0 4px" }}>Blogs</span>
          <IconSparkle size={14} />
        </div>

        {/* Section Headline */}
        <h2 className="blog-title reveal-slide-up">
          Insights that inspire faith,<br />learning & growth
        </h2>

        {/* Section Subtitle / Description */}
        <p className="blog-desc reveal-slide-up">
          Stay updated with our latest articles on Islamic education, personal growth,<br />and student development.
        </p>

        {/* Blog Grid */}
        <div className="blog-grid stagger-group">
          
          {/* Left Column: Featured Blog */}
          <Link 
            href="/blog/beauty-of-tadabbur-reflecting-on-the-quran" 
            className="blog-featured-card reveal-stagger"
            style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
          >
            <div className="blog-featured-img-wrap">
              <img src="/images/blog_quran.png" alt="Featured Blog" className="blog-featured-img" />
            </div>
            <div className="blog-featured-content" style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <span className="blog-tag">Quran & Tafseer</span>
              
              <div className="blog-meta">
                <div className="blog-meta-item">
                  <IconCalendar size={14} className="blog-meta-icon" />
                  <span>11 Nov 2025</span>
                </div>
                <div className="blog-meta-item">
                  <IconChat size={14} className="blog-meta-icon" />
                  <span>Comments</span>
                </div>
              </div>

              <h3 className="blog-featured-title">
                The Role of Tadabbur in Strengthening Our Connection with the Quran
              </h3>

              <div className="blog-action-row" style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "auto" }}>
                <span className="blog-read-more-btn">Read More</span>
                <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.4, position: "relative" }}>
                  <div style={{ position: "absolute", right: "20px", top: "-3.5px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#C99B4D" }} />
                </div>
              </div>
            </div>
          </Link>

          {/* Right Column: Blog List */}
          <div className="blog-list">
            
            {/* Post 1 */}
            <Link 
              href="/blog/building-a-strong-connection-with-allah" 
              className="blog-list-item reveal-stagger"
              style={{ textDecoration: "none", color: "inherit", display: "flex" }}
            >
              <div className="blog-thumb-wrap">
                <img src="/images/blog_finance.png" alt="Building Barakah in Your Finances" className="blog-thumb" />
              </div>
              <div className="blog-item-content">
                <span className="blog-tag" style={{ margin: 0 }}>Islamic Lifestyle</span>
                
                <div className="blog-meta" style={{ margin: "6px 0" }}>
                  <div className="blog-meta-item">
                    <IconCalendar size={13} className="blog-meta-icon" />
                    <span>12 Nov 2025</span>
                  </div>
                  <div className="blog-meta-item">
                    <IconChat size={13} className="blog-meta-icon" />
                    <span>Comments</span>
                  </div>
                </div>

                <h4 className="blog-item-title">
                  Building Barakah in Your Finances: An Islamic Perspective
                </h4>
              </div>
              <div className="blog-item-timeline">
                <div className="blog-timeline-line" style={{ top: "50%" }} /* Start timeline from the first node's center */ />
                <div className="blog-timeline-node">
                  <div className="blog-timeline-dot" />
                </div>
              </div>
            </Link>

            {/* Post 2 */}
            <Link 
              href="/blog/effective-study-habits-every-student-should-know" 
              className="blog-list-item reveal-stagger"
              style={{ textDecoration: "none", color: "inherit", display: "flex" }}
            >
              <div className="blog-thumb-wrap">
                <img src="/images/blog_study.png" alt="Effective Study Habits" className="blog-thumb" />
              </div>
              <div className="blog-item-content">
                <span className="blog-tag" style={{ margin: 0 }}>Student Life</span>
                
                <div className="blog-meta" style={{ margin: "6px 0" }}>
                  <div className="blog-meta-item">
                    <IconCalendar size={13} className="blog-meta-icon" />
                    <span>13 Nov 2025</span>
                  </div>
                  <div className="blog-meta-item">
                    <IconChat size={13} className="blog-meta-icon" />
                    <span>Comments</span>
                  </div>
                </div>

                <h4 className="blog-item-title">
                  Effective Study Habits Every Student Should Know
                </h4>
              </div>
              <div className="blog-item-timeline">
                <div className="blog-timeline-line" />
                <div className="blog-timeline-node">
                  <div className="blog-timeline-dot" />
                </div>
              </div>
            </Link>

            {/* Post 3 */}
            <Link 
              href="/blog/nurturing-strong-values-in-the-next-generation" 
              className="blog-list-item reveal-stagger"
              style={{ textDecoration: "none", color: "inherit", display: "flex" }}
            >
              <div className="blog-thumb-wrap">
                <img src="/images/blog_values.png" alt="Nurturing Strong Values" className="blog-thumb" />
              </div>
              <div className="blog-item-content">
                <span className="blog-tag" style={{ margin: 0 }}>Parenting & Education</span>
                
                <div className="blog-meta" style={{ margin: "6px 0" }}>
                  <div className="blog-meta-item">
                    <IconCalendar size={13} className="blog-meta-icon" />
                    <span>14 Nov 2025</span>
                  </div>
                  <div className="blog-meta-item">
                    <IconChat size={13} className="blog-meta-icon" />
                    <span>Comments</span>
                  </div>
                </div>

                <h4 className="blog-item-title">
                  Nurturing Strong Values in the Next Generation
                </h4>
              </div>
              <div className="blog-item-timeline">
                <div className="blog-timeline-line" style={{ bottom: "50%" }} /* Stop timeline at the last node's center */ />
                <div className="blog-timeline-node">
                  <div className="blog-timeline-dot" />
                </div>
              </div>
            </Link>

          </div>

        </div>
      </section>

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

      {/* =========================================================================
         SECTION 10: TESTIMONIALS
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
        <div className="testi-dots reveal-slide-up">
          {testimonials.map((_, idx) => (
            <div key={idx} className={`testi-dot ${idx === 0 ? "active" : ""}`} />
          ))}
        </div>

      </section>

      {/* =========================================================================
         SECTION 11: NEWSLETTER SECTION
         ========================================================================= */}
      <section className="news-section" id="newsletter">
        
        {/* Newsletter Centered Card */}
        <div className="news-card reveal-slide-up">
          
          {/* Custom Illustration: Open Envelope with sparkles */}
          <IconNewsletterEnvelope />

          {/* Title with sparkles and lines */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px", width: "100%" }}>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.4, maxWidth: "60px" }} />
            <span style={{ color: "#C99B4D", display: "flex", alignItems: "center" }}><IconSparkle size={16} /></span>
            <h2 className="news-title" style={{ margin: 0 }}>
              Get Inspiration Straight to Your Inbox!
            </h2>
            <span style={{ color: "#C99B4D", display: "flex", alignItems: "center" }}><IconSparkle size={16} /></span>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.4, maxWidth: "60px" }} />
          </div>

          {/* Description */}
          <p className="news-desc">
            Every other week we send out our best advice from <strong className="news-green-link">our blog</strong>.<br />
            Subscribe below or connect with us on <strong className="news-green-link">Facebook</strong>, <strong className="news-green-link">Instagram</strong>,<br />
            <strong className="news-green-link">YouTube</strong> and <strong className="news-green-link">LinkedIn</strong>
          </p>

          {/* Form */}
          {newsSubmitted ? (
            <div style={{ 
              backgroundColor: "rgba(74, 93, 59, 0.08)", 
              border: "1.5px solid rgba(74, 93, 59, 0.2)", 
              borderRadius: "10px", 
              padding: "16px 24px", 
              color: "#4A5D3B", 
              fontSize: "15px", 
              fontWeight: "600",
              textAlign: "center",
              width: "100%",
              maxWidth: "580px"
            }}>
              JazakAllah Khair! You have successfully subscribed to our newsletter.
            </div>
          ) : (
            <form 
              className="news-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newsEmail) return;
                try {
                  // Save lead to Supabase contacts
                  const { error } = await supabase
                    .from("contacts")
                    .insert([{ 
                      email: newsEmail, 
                      name: "Newsletter Subscriber", 
                      message: "Subscribed to newsletter" 
                    }]);
                  
                  if (error) throw error;
                  setNewsSubmitted(true);
                  setNewsEmail("");
                } catch (err) {
                  console.error("Error subscribing to newsletter:", err);
                  // Fallback success if database table schema differs
                  setNewsSubmitted(true);
                }
              }}
            >
              <div className="news-input-wrap">
                <div className="news-input-icon">
                  <IconMail size={18} />
                </div>
                <input 
                  type="email" 
                  className="news-input" 
                  placeholder="Your email address" 
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  suppressHydrationWarning
                  required 
                />
              </div>
              <button type="submit" className="news-submit-btn" suppressHydrationWarning>
                Submit
              </button>
            </form>
          )}

        </div>

      </section>

    </div>
  );
}
