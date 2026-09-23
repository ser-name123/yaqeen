"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./testimonials.css";
import { supabase } from "@/lib/supabase";
import { usePageContent } from "@/lib/use-page-content";

const DEFAULT_TESTIMONIALS = [
  {
    id: "d1",
    name: "Ayesha Khan",
    role: "Mother of 2, London UK",
    content: "Yaqeen has helped my children develop a strong understanding of Islam and fluent Quran recitation in a fun, meaningful way. The teachers are incredibly patient. Highly recommended!",
    avatar_url: "/images/testi_ayesha.png",
    rating: 5
  },
  {
    id: "d2",
    name: "Hassan Ali",
    role: "Adult Learner, Birmingham UK",
    content: "The one-on-one Tajweed lessons are crystal clear, engaging, and practical. I appreciate how easy it is to schedule around my busy working hours and stay consistent with my recitation.",
    avatar_url: "/images/testi_hassan.png",
    rating: 5
  },
  {
    id: "d3",
    name: "Maryam Zahra",
    role: "Parent of 3, Manchester UK",
    content: "We love how the whole family can learn together under one roof. Our teacher makes every lesson engaging and spiritually uplifting. Yaqeen has brought our home closer to our faith.",
    avatar_url: "/images/testi_maryam.png",
    rating: 5
  },
  {
    id: "d4",
    name: "Dr. Tariq Mahmood",
    role: "Parent, Leeds UK",
    content: "Finding a native Arabic teacher who connects so well with British-born kids was a blessing. My son improved his Makharij and Quran memorization within just 3 months. Outstanding academy!",
    avatar_url: "/images/teacher_sabry.jpg",
    rating: 5
  },
  {
    id: "d5",
    name: "Fatima Al-Sayed",
    role: "Adult Quran Student, Dubai UAE",
    content: "I started as a complete beginner with Noorani Qaida. The teacher's gentle encouragement and structured pace gave me the confidence to recite the Holy Quran smoothly with proper rules.",
    avatar_url: "/images/teacher_naira.jpg",
    rating: 5
  },
  {
    id: "d6",
    name: "Zaid Siddiqui",
    role: "Hifz Student Parent, Glasgow UK",
    content: "My daughter is memorizing Surahs with great joy and accuracy. The quarterly progress reports and flexible rescheduling policy make managing lessons completely stress-free.",
    avatar_url: "/images/teacher_rahman.png",
    rating: 5
  },
  {
    id: "d7",
    name: "Samira Patel",
    role: "Mother of 2, Bradford UK",
    content: "The female Quran teacher assigned to my daughters is exceptional. She explains the meanings of the verses alongside recitation, instilling true love for Islamic values.",
    avatar_url: "/images/teacher_amira.jpg",
    rating: 5
  },
  {
    id: "d8",
    name: "Omar Farooq",
    role: "University Student, London UK",
    content: "Flexible timings 24/7 allowed me to balance my university studies with Quranic Arabic. The interactive virtual whiteboard and recordings make revision so convenient.",
    avatar_url: "/images/teacher_mazin.jpg",
    rating: 5
  },
  {
    id: "d9",
    name: "Khadija Bennett",
    role: "Revert / Adult Student, Toronto Canada",
    content: "As a new Muslim, I was nervous about learning Arabic pronunciation. My teacher was compassionate and guided me step by step. I am forever grateful for Yaqeen Institute.",
    avatar_url: "/images/teacher_aisha.png",
    rating: 5
  },
  {
    id: "d10",
    name: "Bilal Qasim",
    role: "Father of 2, Sheffield UK",
    content: "The best online Quran platform we have used. Reliable teachers, zero missed classes, and transparent pricing. My kids look forward to their lessons every single week.",
    avatar_url: "/images/teacher_imran.jpg",
    rating: 5
  },
  {
    id: "d11",
    name: "Zainab Hussain",
    role: "Parent, Leicester UK",
    content: "Both of my sons have achieved beautiful Tajweed recitation. The teachers focus on every letter and rule with dedication. Customer support is always prompt and helpful.",
    avatar_url: "/images/testi_ayesha.png",
    rating: 5
  },
  {
    id: "d12",
    name: "Yusuf Al-Hadi",
    role: "Professional Learner, London UK",
    content: "Comprehensive curriculum combining Tajweed, Tafseer, and daily Islamic Duas. Highly recommend Yaqeen to anyone seeking authentic Islamic knowledge from qualified instructors.",
    avatar_url: "/images/teacher_saad.png",
    rating: 5
  }
];

const IconUser = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconUsers = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconChat = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const IconStar = ({ size = 16, color = "#C99B4D" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconHeart = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
const IconBook = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
const IconCheckBadge = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#556B3B" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 5.5L19.5 6.5L20.5 11L23 14.5L20.5 18L19.5 22.5L15 23.5L12 27L9 23.5L4.5 22.5L3.5 18L1 14.5L3.5 11L4.5 6.5L9 5.5L12 2Z" fillOpacity="0.15" />
    <path d="M9 12L11 14L15 9" stroke="#556B3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const FAQ_STYLES = [
  { icon: <IconStar />, color: "green" },
  { icon: <IconChat />, color: "gold" },
  { icon: <IconUsers />, color: "green" },
  { icon: <IconHeart />, color: "gold" },
  { icon: <IconUser />, color: "green" },
  { icon: <IconBook />, color: "gold" },
];

const IconChevron = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function TestimonialsPage() {
  const content = usePageContent("testimonials");
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openId, setOpenId] = useState(null);
  const faqItems = content.faq?.items || [];

  useEffect(() => {
    let active = true;
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (active && data && data.length > 0) {
          // If database has testimonials, merge or use them (with fallbacks if fewer than 9)
          if (data.length >= 9) {
            setTestimonials(data);
          } else {
            const combined = [...data, ...DEFAULT_TESTIMONIALS.slice(data.length)];
            setTestimonials(combined);
          }
        }
      } catch (err) {
        console.warn("Could not load testimonials from Supabase, using defaults:", err);
      }
    }
    fetchTestimonials();
    return () => { active = false; };
  }, []);

  // Show 3x3 (9 testimonials) initially, and all when expanded
  const displayedTestimonials = isExpanded ? testimonials : testimonials.slice(0, 9);

  return (
    <main className="tpg-page">
      {/* Hero */}
      <section className="tpg-hero">
        <span className="tpg-badge">{content.hero?.badge || "STUDENT & PARENT REVIEWS"}</span>
        <h1>{content.hero?.title || "Stories of Faith,"} <span>{content.hero?.title_highlight || "Growth & Learning"}</span></h1>
        <div className="tpg-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>{content.hero?.description || "Read how Yaqeen Institute has helped hundreds of children and adults achieve mastery in Quran recitation, Tajweed, and Islamic studies."}</p>
      </section>

      {/* Testimonials 3x3 Grid Section */}
      <section className="tpg-grid-section" id="testimonials-grid">
        <div className="tpg-grid">
          {displayedTestimonials.map((t) => (
            <div key={t.id} className="tpg-card">
              {/* Star rating */}
              <div className="tpg-stars">
                {Array.from({ length: t.rating || 5 }).map((_, sIdx) => (
                  <IconStar key={sIdx} size={15} />
                ))}
              </div>

              {/* Quote mark & content */}
              <span className="tpg-quote-mark">&ldquo;</span>
              <div className="tpg-text" dangerouslySetInnerHTML={{ __html: t.content || "" }} />
              
              <div className="tpg-card-divider" />
              
              {/* Author Info */}
              <div className="tpg-author-row">
                <div className="tpg-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={t.avatar_url || "/images/testi_ayesha.png"} 
                    alt={t.name} 
                    className="tpg-avatar" 
                  />
                </div>
                <div className="tpg-author-info">
                  <div className="tpg-name-wrap">
                    <span className="tpg-author-name">{t.name}</span>
                    <IconCheckBadge />
                  </div>
                  <span className="tpg-author-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Testimonials Button (3x3 Toggle) */}
        {testimonials.length > 9 && (
          <div className="tpg-view-more-wrap">
            <button
              type="button"
              className="tpg-view-more-btn"
              onClick={() => {
                setIsExpanded(!isExpanded);
                if (isExpanded) {
                  const el = document.getElementById("testimonials-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span>{isExpanded ? "Show Fewer Reviews" : `View More Reviews (${testimonials.length} Total)`}</span>
              <IconChevron className={`tpg-vm-icon ${isExpanded ? "rotated" : ""}`} size={18} />
            </button>
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="tpg-cta">
        <h2>{content.cta?.title || "Ready to Start Your Quran Journey?"}</h2>
        <p>{content.cta?.subtitle || "Join hundreds of happy families learning with experienced, certified teachers."}</p>
        <Link href={content.cta?.button_url || "/book-free-trial"} className="tpg-cta-btn">
          {content.cta?.button_label || "Book a Free Trial"} <IconArrow />
        </Link>
      </section>

      {/* Testimonials FAQ */}
      <section className="tpg-faq">
        <div className="tpg-faq-head">
          <span className="tpg-faq-badge">{content.faq?.badge || "FAQ"}</span>
          <h2>{content.faq?.title || "Frequently Asked"} <span>{content.faq?.title_highlight || "Questions"}</span></h2>
        </div>
        <div className="tpg-acc">
          {faqItems.map((f, i) => {
            const style = FAQ_STYLES[i % FAQ_STYLES.length];
            const open = openId === i;
            return (
              <div key={i} className={`tpg-item ${open ? "open" : ""}`}>
                <button type="button" className="tpg-q" aria-expanded={open} onClick={() => setOpenId(open ? null : i)} suppressHydrationWarning>
                  <span className={`tpg-faq-icon ${style.color}`}>{style.icon}</span>
                  <span className="tpg-qtext">{f.q}</span>
                  <IconChevron className={`tpg-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`tpg-a ${open ? "open" : ""}`}>
                  <div className="tpg-a-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
