"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/settings-context";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

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

// Custom Book Outline Icon
const IconBookOutline = ({ size = 22, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5V19.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Custom Solid Book Icon for Section Header
const IconBookSolid = ({ size = 24, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5Z" />
    <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5Z" />
    <path d="M12 6.5V19.5" stroke="#fefefe" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);


// Arabic letter Dad Icon
const IconArabicDad = ({ size = 26, color = "#C99B4D" }) => (
  <span style={{ 
    fontSize: `${size - 2}px`, 
    color: color, 
    fontWeight: "800", 
    fontFamily: "var(--font-noto-naskh), Arial, sans-serif", 
    display: "inline-flex", 
    alignItems: "center", 
    justifyContent: "center",
    lineHeight: 1 
  }}>ض</span>
);

// Custom Mosque Outline Icon
const IconMosqueOutline = ({ size = 22, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v3M12 5a3 3 0 0 0-3 3v2h6V8a3 3 0 0 0-3-3z" />
    <path d="M4 22V10l3-2v14M20 22V10l-3-2v14" />
    <path d="M7 22h10" />
    <path d="M9 15h6v7H9z" />
  </svg>
);

// Custom Badge Star Icon
const IconBadgeStar = ({ size = 22, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Custom Pencil Outline Icon
const IconPencilOutline = ({ size = 20, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

// Custom Sparkle Icon
const IconSparkle = ({ size = 12, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
  </svg>
);

const defaultCoursesList = [
  {
    num: "01",
    title: "Quran Learning with Tajweed",
    image: "/images/course_quran.png",
    icon: "book"
  },
  {
    num: "02",
    title: "Arabic Language Mastery",
    image: "/images/course_arabic.png",
    icon: "dad"
  },
  {
    num: "03",
    title: "Islamic Studies & Character Building",
    image: "/images/course_studies.png",
    icon: "mosque"
  },
  {
    num: "04",
    title: "Quran Hifz Memorization",
    image: "/images/course_quran.png",
    icon: "badge"
  },
  {
    num: "05",
    title: "Noorani Qaida for Beginners",
    image: "/images/course_arabic.png",
    icon: "pencil"
  },
  {
    num: "06",
    title: "Tafseer & Quran Understanding",
    image: "/images/course_quran.png",
    icon: "book"
  }
];

// Custom Quran Rays Icon for Skills Section
const IconQuranRays = ({ size = 36, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5" />
    <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5" />
    <path d="M12 6.5V19.5" />
    <path d="M12 2v2M8.5 3l1 1.5M15.5 3l-1 1.5" />
  </svg>
);

// Custom Makharij Speech Profile Icon for Skills Section (Detailed throat articulation matching mockup)
const IconMakharij = ({ size = 34, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Face profile facing right: forehead, nose, lips, chin, neck */}
    <path d="M16 4h-.5A2.5 2.5 0 0 0 13 6.5v1.8a2 2 0 0 1-1 1.7L9 11.5c-.7.5-1 1.2-1 2v2.5A3 3 0 0 0 11 19h4v2" />
    {/* Mouth speech waves */}
    <path d="M18 10a3.5 3.5 0 0 1 0 5" />
    <path d="M21 8a6.5 6.5 0 0 1 0 9" />
    {/* Throat articulation dot */}
    <circle cx="11.5" cy="15.5" r="2" fill={color} stroke="none" />
  </svg>
);

// Custom Fluency Chart Icon for Skills Section (Proportionate rounded bars with upward arrow)
const IconFluency = ({ size = 32, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="13" width="3.5" height="7" rx="0.8" />
    <rect x="10.5" y="8" width="3.5" height="12" rx="0.8" />
    <rect x="17" y="3" width="3.5" height="17" rx="0.8" />
    <path d="M3 16l6.5-5.5L16 5" />
    <path d="M12 5h4v4" />
  </svg>
);

// Custom Confidence Shield Icon for Skills Section
const IconConfidence = ({ size = 32, color = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polygon points="12 8 13.5 11 16.5 11.5 14 13.7 14.8 17 12 15.2 9.2 17 10 13.7 7.5 11.5 10.5 11" fill={color} stroke="none" />
  </svg>
);

const learnSkillsList = [
  {
    title: ["Correct", "Quran Reading"],
    desc: "Learn to read the Qur'an accurately with proper pronunciation and beautiful recitation.",
    icon: "quran",
    color: "green"
  },
  {
    title: ["Tajweed", "Rules"],
    desc: "Understand and apply Tajweed rules to recite the Qur'an the way it was revealed.",
    icon: "tajweed",
    color: "gold"
  },
  {
    title: ["Makharij"],
    desc: "Master the correct points of articulation (Makharij) for clear and accurate pronunciation.",
    icon: "makharij",
    color: "green"
  },
  {
    title: ["Fluency", "Development"],
    desc: "Improve your reading speed and fluency with consistent practice and expert guidance.",
    icon: "fluency",
    color: "gold"
  },
  {
    title: ["Confidence in", "Recitation"],
    desc: "Gain confidence to recite beautifully in daily life and in front of others.",
    icon: "confidence",
    color: "green"
  }
];

// Icons for Learning Outcomes Section
const IconHeaderBadge = ({ size = 32 }) => (
  <div style={{
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: "#4A5D3B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  }}>
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Medal Outer Circle */}
      <circle cx="12" cy="9" r="6" />
      {/* Medal Inner Star Emblem (Solid White matching mockup) */}
      <polygon points="12 6.5 13.2 8.5 15.5 8.7 13.8 10.2 14.3 12.5 12 11.3 9.7 12.5 10.2 10.2 8.5 8.7 10.8 8.5" fill="#FFFFFF" stroke="none" />
      {/* Ribbon Tails */}
      <path d="M9 14.5L7 21l5-2.5 5 2.5-2-6.5" />
    </svg>
  </div>
);

const IconWhiteBook = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.5V19.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTargetArrow = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2.2" />
    <circle cx="12" cy="12" r="7" stroke="#FFFFFF" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M19 5l-7 7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M14 5h5v5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPersonCircle = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2.2" />
    <circle cx="12" cy="10" r="3" stroke="#FFFFFF" strokeWidth="2.2" />
    <path d="M6 19c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconPersonalGrowth = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="3" height="6" rx="0.5" fill="#FFFFFF" />
    <rect x="10" y="10" width="3" height="10" rx="0.5" fill="#FFFFFF" />
    <rect x="16" y="6" width="3" height="14" rx="0.5" fill="#FFFFFF" />
    <path d="M3 16l6-5 6-5 5 4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 6h4v4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPeopleGroup = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="2.5" stroke="#FFFFFF" strokeWidth="2.2" />
    <path d="M7.5 17c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="7" cy="10" r="2" stroke="#FFFFFF" strokeWidth="1.8" />
    <path d="M3.5 18c0-1.5 1.5-2.5 3.5-2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="17" cy="10" r="2" stroke="#FFFFFF" strokeWidth="1.8" />
    <path d="M17 15.5c2 0 3.5 1 3.5 2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconGlobeOutline = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2.2" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#FFFFFF" strokeWidth="1.8" />
    <path d="M2 12h20" stroke="#FFFFFF" strokeWidth="1.8" />
  </svg>
);

const IconYaqeenEmblem = ({ size = 64, url = "", pad = "10%" }) => (
  <div style={{
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    border: "1.5px solid #EADDC8",
    boxShadow: "0 4px 10px rgba(44, 37, 30, 0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden"
  }}>
    {url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={url} 
        alt="Yaqeen Logo" 
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: pad,
          boxSizing: "border-box"
        }}
      />
    ) : (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22V9" stroke="#C99B4D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="6" r="2.5" fill="#C99B4D" />
        <path d="M12 18C7 18 5 13 12 9" fill="#4A5D3B" />
        <path d="M12 18C17 18 19 13 12 9" fill="#4A5D3B" />
      </svg>
    )}
  </div>
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

const IconHeartOutline = ({ size = 20, color = "#4A5D3B" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const achieveList = [
  {
    title: "Comprehensive Learning",
    desc: "Gain in-depth knowledge across a wide range of subjects.",
    icon: "book",
    color: "green"
  },
  {
    title: "Strong Values & Character",
    desc: "Build strong values and character that guide your decisions.",
    icon: "target",
    color: "gold"
  },
  {
    title: "Practical Skills",
    desc: "Develop practical skills you can apply in your daily life.",
    icon: "person",
    color: "green"
  },
  {
    title: "Personal Growth",
    desc: "Improve your mindset, confidence, and self-discipline.",
    icon: "growth",
    color: "gold"
  },
  {
    title: "Positive Mindset",
    desc: "Cultivate positivity, resilience, and a growth-oriented mindset.",
    icon: "people",
    color: "green"
  },
  {
    title: "Lifelong Impact",
    desc: "Create a lasting impact in your life, family, and community.",
    icon: "globe",
    color: "gold"
  }
];

// Icons for Teachers Section
const IconGlobe = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconBriefcase = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconStarOutline = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconDividerStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L14.8 6.8L19.8 4L17 9L21.8 11.8L17 14.6L19.8 19.6L14.8 16.8L12 21.6L9.2 16.8L4.2 19.6L7 14.6L2.2 11.8L7 9L4.2 4L9.2 6.8L12 2Z" 
      fill="#C99B4D" 
    />
    <circle cx="12" cy="12" r="3.5" fill="#fefefe" stroke="#C99B4D" strokeWidth="1.5" />
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

// FAQ and Testimonials Icons copied from Home Page
const IconRosette = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 5.5L18.5 4.5L17.5 8.5L21 11L17.5 13.5L18.5 17.5L14.5 16.5L12 20L9.5 16.5L5.5 17.5L6.5 13.5L3 11L6.5 8.5L5.5 4.5L9.5 5.5L12 2Z" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="11.5" r="3.5" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
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

export default function CoursesPage() {
  const { faviconUrl } = useSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [teachers, setTeachers] = useState(defaultTeachers);
  const [coursesList, setCoursesList] = useState(defaultCoursesList);
  const router = useRouter();

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
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const formatted = data.map((c, idx) => ({
            id: c.id,
            num: String(idx + 1).padStart(2, '0'),
            title: c.title,
            image: c.image_url || "/images/course_quran.png",
            icon: c.icon
          }));
          setCoursesList(formatted);
        }
      } catch (err) {
        console.warn("Could not load courses from Supabase, using default lists:", err);
      }
    }
    fetchCourses();
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
    // Re-run after async data loads so newly-rendered cards (teachers/courses from
    // Supabase) also get observed and revealed — otherwise they stay at opacity:0.
  }, [teachers, coursesList]);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fefefe", display: "flex", flexDirection: "column" }}>
      
      {/* =========================================================================
         1. HERO SECTION
         ========================================================================= */}
      <section style={{
        position: "relative",
        padding: "50px 24px 35px 24px",
        /* backgroundImage: "url('/images/courses_hero_bg.png')", */
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        
        {/* Centered Online Courses Badge */}
        <div className="reveal-slide-up" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(201, 155, 77, 0.06)",
          border: "1px solid rgba(201, 155, 77, 0.18)",
          borderRadius: "9999px",
          padding: "6px 18px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(201, 155, 77, 0.02)"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#C99B4D", display: "inline-flex", alignItems: "center", marginRight: "2px" }}>
            <path d="M12 6.5C10.5 5.5 8.5 5 6.5 5H3V18H6.5C8.5 18 10.5 18.5 12 19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6.5C13.5 5.5 15.5 5 17.5 5H21V18H17.5C15.5 18 13.5 18.5 12 19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6.5V19.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ 
            textTransform: "uppercase", 
            fontWeight: "500", 
            color: "#55683B", 
            fontSize: "12px", 
            letterSpacing: "1.5px",
            fontFamily: "var(--font-sans), sans-serif"
          }}>Online Courses</span>
        </div>

        {/* Headline */}
        <h1 className="reveal-slide-up" style={{
          fontSize: "clamp(36px, 5vw, 60px)",
          fontWeight: "800",
          fontFamily: "var(--font-serif), Georgia, serif",
          lineHeight: "1.15",
          letterSpacing: "-1px",
          margin: "0 0 16px 0",
          maxWidth: "850px"
        }}>
          <span style={{ color: "#2B1F14", display: "block", marginBottom: "2px" }}>Your Learning</span>
          <span style={{ color: "#C99B4D" }}>Journey Starts Here!</span>
        </h1>

        {/* Description */}
        <p className="reveal-slide-up" style={{
          fontSize: "clamp(14px, 1.2vw, 16px)",
          color: "#5C4D3C",
          lineHeight: "1.6",
          fontWeight: "500",
          maxWidth: "640px",
          margin: "0 auto 30px auto",
          fontFamily: "var(--font-sans), sans-serif"
        }}>
          Explore online Quran classes, Quran courses online, Arabic Language, and Islamic Studies
          designed to help kids and adults learn Quran online, master Tajweed, memorize the Quran,
          and build strong Islamic knowledge through personalized learning.
        </p>

      </section>

      {/* =========================================================================
         2. COURSES CATALOG SECTION
         ========================================================================= */}
      <section style={{
        padding: "35px 24px 50px 24px",
        backgroundColor: "#fefefe",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid #F5EBDD"
      }}>
        
        {/* Section Header Badge with diamonds & line accents, matching mockup */}
        <div className="reveal-slide-up" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "16px",
          width: "100%",
          maxWidth: "450px"
        }}>
          {/* Left line with diamond at the end */}
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
            <span style={{ color: "#C99B4D", fontSize: "12px", marginLeft: "8px", lineHeight: 1 }}>♦</span>
          </div>

          {/* Center: Solid Book Icon and Bold text */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconBookSolid size={24} color="#C99B4D" />
            <span style={{
              textTransform: "uppercase",
              fontWeight: "800",
              color: "#4A5D3B",
              fontSize: "15px",
              letterSpacing: "1.5px",
              fontFamily: "var(--font-sans), sans-serif",
              lineHeight: 1
            }}>Our Courses</span>
          </div>

          {/* Right: Diamond and line */}
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <span style={{ color: "#C99B4D", fontSize: "12px", marginRight: "8px", lineHeight: 1 }}>♦</span>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
          </div>
        </div>

        {/* Section Headline */}
        <h2 className="reveal-slide-up" style={{
          fontSize: "clamp(32px, 3.8vw, 48px)",
          fontWeight: "800",
          color: "#2B1F14",
          textAlign: "center",
          margin: "0 0 12px 0",
          fontFamily: "var(--font-serif), Georgia, serif",
          letterSpacing: "-1px"
        }}>Explore Our Courses</h2>

        {/* Decorative Divider Diamond - Clean thin line with diamond */}
        <div className="reveal-slide-up" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "100px", marginBottom: "36px" }}>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.4 }} />
          <span style={{ color: "#C99B4D", fontSize: "10px", display: "inline-block" }}>◆</span>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.4 }} />
        </div>

        {/* Cards Grid */}
        <div className="stagger-group" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto 36px auto"
        }}>
          {coursesList.map((course, idx) => (
            <div
              key={idx}
              className="reveal-stagger"
              onClick={() => router.push(`/courses/${slugify(course.title)}`)}
              style={{
                backgroundColor: "#faf4eb",
                borderRadius: "24px",
                border: "1px solid #EADDC8",
                boxShadow: "0 6px 18px rgba(44, 37, 30, 0.01)",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(44, 37, 30, 0.04)";
                e.currentTarget.style.borderColor = "#C99B4D";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(44, 37, 30, 0.01)";
                e.currentTarget.style.borderColor = "#EADDC8";
              }}
            >
              {/* Card Image Wrapper with Overlapping Circular Icon */}
              <div style={{ position: "relative", width: "100%", height: "155px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.image}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {/* Overlapping Circle Icon Container - Increased diameter & gold border */}
                <div style={{
                  position: "absolute",
                  bottom: "-32px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#4A5D3B",
                  border: "2.5px solid #C99B4D",
                  boxShadow: "0 4px 12px rgba(74, 93, 59, 0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C99B4D",
                  zIndex: 10
                }}>
                  {course.icon === "book" && <IconBookOutline size={26} />}
                  {course.icon === "dad" && <IconArabicDad size={26} />}
                  {course.icon === "mosque" && <IconMosqueOutline size={26} />}
                  {course.icon === "badge" && <IconBadgeStar size={26} />}
                  {course.icon === "pencil" && <IconPencilOutline size={24} />}
                </div>
              </div>

              {/* Card Text & Arrow Details (Horizontal layout exactly matching mockup) */}
              <div style={{
                padding: "38px 24px 24px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexGrow: 1,
                gap: "16px"
              }}>
                {/* Left: Serial Number & Gold Line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", flexShrink: 0 }}>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#C99B4D", fontFamily: "var(--font-sans), sans-serif", lineHeight: "1" }}>
                    {course.num}
                  </span>
                  <div style={{ width: "16px", height: "1.5px", backgroundColor: "#C99B4D" }} />
                </div>

                {/* Middle: Course Title */}
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#2B1F14",
                  margin: 0,
                  fontFamily: "var(--font-serif), Georgia, serif",
                  lineHeight: "1.3",
                  flexGrow: 1,
                  textAlign: "left"
                }}>
                  {course.title}
                </h3>

                {/* Right: Simple Gold Arrow */}
                <div style={{
                  color: "#C99B4D",
                  fontSize: "20px",
                  fontWeight: "light",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center"
                }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>


      </section>

      {/* =========================================================================
         3. WHAT YOU WILL LEARN SECTION
         ========================================================================= */}
      <section style={{
        padding: "50px 24px 60px 24px",
        /* backgroundImage: "url('/images/learn_bg.png')", */
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid #F5EBDD"
      }}>
        
        {/* Section Header Badge with diamonds & line accents, matching mockup */}
        <div className="reveal-slide-up" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "16px",
          width: "100%",
          maxWidth: "450px"
        }}>
          {/* Left line with diamond at the end */}
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
            <span style={{ color: "#C99B4D", fontSize: "12px", marginLeft: "8px", lineHeight: 1 }}>♦</span>
          </div>

          {/* Center Text */}
          <span style={{
            textTransform: "uppercase",
            fontWeight: "900",
            color: "#C99B4D",
            fontSize: "15px",
            letterSpacing: "2px",
            fontFamily: "var(--font-sans), sans-serif",
            lineHeight: 1,
            whiteSpace: "nowrap"
          }}>What You Will Learn</span>

          {/* Right: Diamond and line */}
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <span style={{ color: "#C99B4D", fontSize: "12px", marginRight: "8px", lineHeight: 1 }}>♦</span>
            <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#C99B4D", opacity: 0.8 }} />
          </div>
        </div>

        {/* Section Headline */}
        <h2 className="reveal-slide-up" style={{
          fontSize: "clamp(32px, 3.8vw, 48px)",
          fontWeight: "800",
          color: "#2B1F14",
          textAlign: "center",
          margin: "0 0 16px 0",
          fontFamily: "var(--font-serif), Georgia, serif",
          lineHeight: "1.25",
          letterSpacing: "-1px"
        }}>
          <span style={{ display: "block" }}>Skills for a Lifetime,</span>
          <span style={{ color: "#C99B4D" }}>Knowledge for the Hereafter.</span>
        </h2>

        {/* Decorative Divider Diamond */}
        <div className="reveal-slide-up" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "100px", marginBottom: "24px" }}>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.4 }} />
          <span style={{ color: "#C99B4D", fontSize: "10px", display: "inline-block" }}>◆</span>
          <div style={{ flexGrow: 1, height: "1px", backgroundColor: "#C99B4D", opacity: 0.4 }} />
        </div>

        {/* Section Subtitle */}
        <p className="reveal-slide-up" style={{
          fontSize: "15px",
          color: "#5C4D3C",
          lineHeight: "1.6",
          fontWeight: "500",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto 48px auto",
          fontFamily: "var(--font-sans), sans-serif"
        }}>
          Our structured curriculum helps you build a strong foundation<br />
          and grow step by step with confidence.
        </p>

        {/* Skills Cards Grid */}
        <div className="stagger-group" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {learnSkillsList.map((skill, idx) => {
            const isGreen = skill.color === "green";
            const accentColor = isGreen ? "#4A5D3B" : "#C99B4D";
            
            return (
              <div
                key={idx}
                className="reveal-stagger"
                style={{
                  backgroundColor: "#faf4eb",
                  borderRadius: "20px",
                  border: "1px solid rgba(201, 155, 77, 0.25)",
                  borderBottom: `5px solid ${accentColor}`,
                  padding: "40px 24px 36px 24px",
                  boxShadow: "0 6px 20px rgba(44, 37, 30, 0.02)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "default"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 14px 28px rgba(44, 37, 30, 0.05)";
                  // Avoid overriding the bottom accent border color by setting only top, left, and right borders
                  e.currentTarget.style.borderTopColor = accentColor;
                  e.currentTarget.style.borderLeftColor = accentColor;
                  e.currentTarget.style.borderRightColor = accentColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(44, 37, 30, 0.02)";
                  // Reset top, left, and right borders to the soft gold/cream border color
                  e.currentTarget.style.borderTopColor = "rgba(201, 155, 77, 0.25)";
                  e.currentTarget.style.borderLeftColor = "rgba(201, 155, 77, 0.25)";
                  e.currentTarget.style.borderRightColor = "rgba(201, 155, 77, 0.25)";
                }}
              >
                {/* Circular Icon Container */}
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  boxShadow: `0 4px 10px ${isGreen ? "rgba(74, 93, 59, 0.12)" : "rgba(201, 155, 77, 0.12)"}`
                }}>
                  {skill.icon === "quran" && <IconQuranRays size={36} color="#FFFFFF" />}
                  {skill.icon === "tajweed" && (
                    <span style={{ fontSize: "36px", color: "#FFFFFF", fontWeight: "800", fontFamily: "var(--font-noto-naskh), Arial, sans-serif", lineHeight: "1", display: "inline-flex", alignItems: "center", justifyContent: "center", transform: "translateY(-2px)" }}>نّ</span>
                  )}
                  {skill.icon === "makharij" && <IconMakharij size={34} color="#FFFFFF" />}
                  {skill.icon === "fluency" && <IconFluency size={32} color="#FFFFFF" />}
                  {skill.icon === "confidence" && <IconConfidence size={32} color="#FFFFFF" />}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "21px",
                  fontWeight: "800",
                  color: "#2B1F14",
                  margin: "0 0 16px 0",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  lineHeight: "1.3",
                  minHeight: "56px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}>
                  {skill.title.map((line, lIdx) => (
                    <span key={lIdx} style={{ display: "block" }}>{line}</span>
                  ))}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: "14px",
                  color: "#5C4D3C",
                  lineHeight: "1.6",
                  margin: 0,
                  fontFamily: "var(--font-sans), sans-serif",
                  fontWeight: "500"
                }}>
                  {skill.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* =========================================================================
         4. LEARNING OUTCOMES SECTION (WHAT YOU WILL ACHIEVE WITH US)
         ========================================================================= */}
      <section style={{
        position: "relative",
        padding: "35px 24px 35px 24px",
        /* backgroundImage: "url('/images/achieve_bg.png')", */
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#fefefe", // Fallback color
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid #F5EBDD",
        overflow: "hidden"
      }}>
        
        {/* Responsive style injection for the mission banner separator */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 1024px) {
            .mission-sep {
              display: none !important;
            }
          }
        `}} />

        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "1200px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "32px"
        }}>
          
          {/* Header Content (Left Aligned) */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            maxWidth: "700px"
          }}>
            
            {/* Left Aligned Header Badge */}
            <div className="reveal-slide-up" style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "12px"
            }}>
              <IconHeaderBadge size={38} />
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "6px"
              }}>
                <span style={{
                  textTransform: "uppercase",
                  fontWeight: "800",
                  color: "#4A5D3B",
                  fontSize: "15px",
                  letterSpacing: "2px",
                  fontFamily: "var(--font-sans), sans-serif",
                  lineHeight: 1
                }}>Learning Outcomes</span>
                {/* Short Gold Line Under Text */}
                <div style={{ width: "38px", height: "2.5px", backgroundColor: "#C99B4D" }} />
              </div>
            </div>

            {/* Headline */}
            <h2 className="reveal-slide-up" style={{
              fontSize: "clamp(34px, 4.2vw, 52px)",
              fontWeight: "800",
              color: "#2B1F14",
              margin: "0 0 12px 0",
              fontFamily: "var(--font-serif), Georgia, serif",
              lineHeight: "1.15",
              letterSpacing: "-1px"
            }}>
              What You Will <br />
              <span style={{ color: "#C99B4D" }}>Achieve With Us</span>
            </h2>

            {/* Subtitle */}
            <p className="reveal-slide-up" style={{
              fontSize: "clamp(14px, 1.2vw, 16px)",
              color: "#6B5B47",
              lineHeight: "1.65",
              fontWeight: "500",
              margin: 0,
              fontFamily: "var(--font-sans), sans-serif"
            }}>
              Our programs are thoughtfully designed to help you grow in knowledge,
              skills, and character—empowering you to succeed in every area of life.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="stagger-group" style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: "24px",
            width: "100%"
          }}>
            {achieveList.map((card, idx) => {
              const isGreen = card.color === "green";
              const accentColor = isGreen ? "#4A5D3B" : "#C99B4D";
              
              return (
                <div
                  key={idx}
                  className="reveal-stagger"
                  style={{
                    backgroundColor: "#faf4eb",
                    borderRadius: "20px",
                    border: "1px solid rgba(201, 155, 77, 0.25)",
                    padding: "36px 28px 32px 28px",
                    boxShadow: "0 6px 20px rgba(44, 37, 30, 0.015)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "default"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 14px 28px rgba(44, 37, 30, 0.04)";
                    e.currentTarget.style.borderColor = accentColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(44, 37, 30, 0.015)";
                    e.currentTarget.style.borderColor = "rgba(201, 155, 77, 0.25)";
                  }}
                >
                  {/* Circular Icon Container */}
                  <div style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    backgroundColor: accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    boxShadow: `0 4px 10px ${isGreen ? "rgba(74, 93, 59, 0.1)" : "rgba(201, 155, 77, 0.1)"}`
                  }}>
                    {card.icon === "book" && <IconWhiteBook size={32} />}
                    {card.icon === "target" && <IconTargetArrow size={32} />}
                    {card.icon === "person" && <IconPersonCircle size={32} />}
                    {card.icon === "growth" && <IconPersonalGrowth size={32} />}
                    {card.icon === "people" && <IconPeopleGroup size={32} />}
                    {card.icon === "globe" && <IconGlobeOutline size={32} />}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: "21px",
                    fontWeight: "800",
                    color: "#2B1F14",
                    margin: "0 0 16px 0",
                    fontFamily: "var(--font-serif), Georgia, serif",
                    lineHeight: "1.3"
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: "14.5px",
                    color: "#6B5B47",
                    lineHeight: "1.6",
                    margin: 0,
                    fontFamily: "var(--font-sans), sans-serif",
                    fontWeight: "500"
                  }}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Mission Banner */}
          <div style={{
            backgroundColor: "#fefefe", // Cream-colored banner
            borderRadius: "24px",
            border: "1px solid rgba(201, 155, 77, 0.2)",
            padding: "24px 32px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            marginTop: "20px",
            flexWrap: "wrap"
          }}>
            
            {/* Left Portion (Emblem + Highlighted Mission Text) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flex: "1 1 550px"
            }}>
              <IconYaqeenEmblem size={64} url={faviconUrl} />
              <p style={{
                fontSize: "15px",
                color: "#4A3B2C",
                lineHeight: "1.6",
                fontWeight: "600",
                margin: 0,
                fontFamily: "var(--font-sans), sans-serif",
                textAlign: "left"
              }}>
                Our mission is to <span style={{ color: "#C99B4D", fontWeight: "500" }}>empower</span> learners with knowledge and skills that inspire <span style={{ color: "#C99B4D", fontWeight: "500" }}>purpose</span>, bring <span style={{ color: "#C99B4D", fontWeight: "500" }}>positive change</span>, and build a <span style={{ color: "#C99B4D", fontWeight: "500" }}>better future</span>.
              </p>
            </div>

            {/* Center Vertical Separator (Only visible on wide screens) */}
            <div className="mission-sep" style={{
              width: "1px",
              height: "48px",
              backgroundColor: "#E5D5C0",
              alignSelf: "center"
            }} />

            {/* Right Portion (3 Badges) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap",
              justifyContent: "flex-start"
            }}>
              
              {/* Badge 1: Trusted Institute */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5D5C0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4A5D3B"
                }}>
                  <IconShieldCheck size={18} color="#4A5D3B" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Trusted</span>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Institute</span>
                </div>
              </div>

              {/* Badge 2: Qualified Teachers */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5D5C0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C99B4D"
                }}>
                  <IconUserOutline size={18} color="#C99B4D" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Qualified</span>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Teachers</span>
                </div>
              </div>

              {/* Badge 3: Learners Worldwide */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5D5C0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4A5D3B"
                }}>
                  <IconHeartOutline size={17} color="#4A5D3B" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#4A3B2C", fontFamily: "var(--font-sans), sans-serif" }}>Learners</span>
                  <span style={{ fontSize: "12px", fontWeight: "500", color: "#6B5B47", fontFamily: "var(--font-sans), sans-serif" }}>Worldwide</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         5. MEET OUR TEACHERS SECTION
         ========================================================================= */}
      <section className="teachers-section" id="teachers" style={{ borderTop: "1px solid #F5EBDD", padding: "35px 24px 60px 24px" }}>
        
        {/* Pill Badge */}
        <div className="teachers-pill reveal-slide-up">
          <span className="teachers-pill-text">Meet Our Teachers</span>
        </div>

        {/* Decorative Divider Line */}
        <div className="teachers-divider reveal-slide-up" style={{ width: "100%", maxWidth: "200px", display: "flex", alignItems: "center", gap: "12px", margin: "0 auto 8px auto" }}>
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
         NEW SECTION: TESTIMONIALS
         ========================================================================= */}
      <section className="testi-section" id="testimonials">
        
        {/* Pill Badge */}
        <div className="testi-pill">
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
        <h2 className="testi-title">
          Stronger Faith.<br />Stronger <span style={{ color: "#C99B4D" }}>Together.</span>
        </h2>

        {/* Section Subtitle / Description */}
        <p className="testi-desc">
          Hear from our learners and parents<br />building a stronger connection with Allah, together.
        </p>

        {/* Testimonials Carousel */}
        <TestimonialsCarousel page="courses" />

      </section>

      {/* =========================================================================
         NEW SECTION: FAQ SECTION
         ========================================================================= */}
      <section className="faq-section" id="faq">
        
        {/* Section Headline */}
        <h2 className="faq-title">
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
        <p className="faq-desc">
          Following are answers to some queries that are posed regularly
        </p>

        {/* Accordions Container */}
        <div className="faq-container">
          
          {/* FAQ 1 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconBookOutline size={20} />
              </div>
              <span className="faq-question-text">What will I learn in these courses?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 0 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 0 ? "open" : ""}`}>
              <p className="faq-answer-text">
                You will learn Quran with Tajweed, Online Quran Reading, Quran Memorization (Hifz), Islamic Studies, and Arabic Language through live online classes. Our courses are suitable for beginners, intermediate, and advanced learners of all ages.
              </p>
            </div>
          </div>

          {/* FAQ 2 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconUser size={20} />
              </div>
              <span className="faq-question-text">Who can join these courses?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 1 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 1 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Our online Quran classes are open to children, teenagers, and adults worldwide. Whether you&apos;re looking for Quran classes for kids, Arabic language lessons, or Islamic education online, we have the right course for you.
              </p>
            </div>
          </div>

          {/* FAQ 3 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconVideoPlay size={20} />
              </div>
              <span className="faq-question-text">How are the classes conducted?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 2 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 2 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Yaqeen Institute offers live one-to-one and small group online classes with qualified Quran and Arabic teachers. Learn from the comfort of your home with flexible scheduling and personalized guidance.
              </p>
            </div>
          </div>

          {/* FAQ 4 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconCalendar size={20} />
              </div>
              <span className="faq-question-text">What are the course durations?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 3 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 3 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Our online Quran, Tajweed, Hifz, Islamic Studies, and Arabic courses offer flexible learning plans, including short-term and long-term programs to suit your goals and availability.
              </p>
            </div>
          </div>

          {/* FAQ 5 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconPencilOutline size={20} />
              </div>
              <span className="faq-question-text">What do I need to start learning?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 4 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 4 ? "open" : ""}`}>
              <p className="faq-answer-text">
                You only need a laptop, tablet, or smartphone with a stable internet connection. Yaqeen Institute provides a simple and engaging online Islamic learning experience from anywhere in the world.
              </p>
            </div>
          </div>

          {/* FAQ 6 */}
          <div
            className="faq-item"
            onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
          >
            <div className="faq-question-row">
              <div className="faq-icon-badge">
                <IconBadgeStar size={20} />
              </div>
              <span className="faq-question-text">Will I receive progress reports?</span>
              <IconChevron size={18} className={`faq-chevron ${openFaqIndex === 5 ? "open" : ""}`} />
            </div>
            <div className={`faq-answer-wrapper ${openFaqIndex === 5 ? "open" : ""}`}>
              <p className="faq-answer-text">
                Yes. We provide regular progress reports, teacher feedback, and personalized learning guidance to help students achieve success in their online Quran and Arabic learning journey.
              </p>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "56px" }}>
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

    </main>
  );
}
