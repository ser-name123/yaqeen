"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./teachers.css";
import { supabase } from "@/lib/supabase";

/* Fallback teachers if the Manage Teachers list is empty */
const DEFAULT_TEACHERS = [
  { id: "d1", name: "Rahman Ali", specialization: "Qur'an, Tajweed", languages: "Arabic, English", experience: "8+ Years" },
  { id: "d2", name: "Aisha Khan", specialization: "Tafseer, Hadith", languages: "Arabic, English", experience: "6+ Years" },
  { id: "d3", name: "Saad Ahmed", specialization: "Fiqh, Seerah", languages: "Arabic, English", experience: "10+ Years" },
  { id: "d4", name: "Maryam Zahra", specialization: "Islamic Studies", languages: "Arabic, English", experience: "7+ Years" },
  { id: "d5", name: "Imran Qureshi", specialization: "Qur'an, Tajweed", languages: "Arabic, English", experience: "9+ Years" },
  { id: "d6", name: "Hafsa Noor", specialization: "Arabic Grammar, Tajweed", languages: "Arabic, English", experience: "5+ Years" },
  { id: "d7", name: "Bilal Faisal", specialization: "Islamic Studies, Akhlaaq", languages: "Arabic, English", experience: "6+ Years" },
  { id: "d8", name: "Sumayya Fatima", specialization: "Hadith, Qur'an Recitation", languages: "Arabic, English", experience: "4+ Years" }
];

/* ---------------- Icons ---------------- */
const IconArrow = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconChevron = ({ size = 20, className }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>);
const IconGlobe = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconBriefcase = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const IconStar = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconBook = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
const IconBadge = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>);
const IconMonitor = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);
const IconUser = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconUsers = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconMosque = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V11l8-6 8 6v10" /><path d="M4 21h16M9 21v-4a3 3 0 0 1 6 0v4M12 5V2" /></svg>);
const IconChat = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const IconShield = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>);
const IconHandshake = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l2 2a1 1 0 0 0 1.4 0l3.6-3.6a2 2 0 0 0 0-2.8L14 9M6 15l-2-2a2 2 0 0 1 0-2.8L8 6.5a2 2 0 0 1 2.8 0L13 9" /></svg>);
const IconHeart = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
const IconGear = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
const IconRefresh = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>);
const IconHeadset = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>);
const IconGrowth = ({ size = 22 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="4" width="3" height="14" /></svg>);
const IconUserStar = ({ size = 22 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="8" r="4" /><path d="M2 21v-1a6 6 0 0 1 10-4.47" /><path d="m18 12 1.2 2.4 2.8.4-2 2 .5 2.8L18 20l-2.5 1.6.5-2.8-2-2 2.8-.4z" /></svg>);

/* ---------------- Static data ---------------- */
const HERO_BADGES = [
  { icon: <IconBook size={15} />, label: "Online Quran Classes" },
  { icon: <IconBadge size={15} />, label: "Tajweed Classes" },
  { icon: <IconStar size={15} />, label: "Hifz Quran" },
  { icon: <IconMosque size={15} />, label: "Islamic Studies" },
  { icon: <IconChat size={15} />, label: "Arabic Language" }
];
const HERO_FEATURES = [
  { icon: <IconBadge />, label: "Qualified & Certified" },
  { icon: <IconBook />, label: "Expert in Qur'an & Tajweed" },
  { icon: <IconMonitor />, label: "1-to-1 Online Classes" },
  { icon: <IconUser />, label: "Student Focused" }
];
const VALUES = [
  { icon: <IconShield />, ar: "Amanah", en: "Trustworthiness", color: "green" },
  { icon: <IconHandshake />, ar: "Adab", en: "Proper Conduct", color: "gold" },
  { icon: <IconStar size={20} />, ar: "Ihsan", en: "Excellence", color: "gold" },
  { icon: <IconHeart />, ar: "Ikhlas", en: "Sincerity", color: "green" }
];
const LEARN = [
  { icon: <IconUserStar />, q: "Flexibility, Comfort & Personalized Attention", d: "Learn from the comfort of your home with one-to-one classes designed around your schedule and goals.", a: "Your teacher adapts every lesson to your availability, comfort and personal learning goals — so you always progress at your own pace." },
  { icon: <IconBook size={22} />, q: "Step-by-step Structured Learning Approach", d: "Our well-organized lessons help you build a strong foundation and progress with clarity and confidence.", a: "We follow a clear, structured curriculum that takes you step by step from the fundamentals to advanced levels." },
  { icon: <IconGrowth />, q: "Guidance Tailored to Your Learning Pace", d: "Receive patient guidance and constant support from expert teachers who understand your unique learning needs.", a: "Whether you are a beginner or advanced learner, your teacher tailors the guidance and pace to suit you." }
];
const CHOOSE = [
  { icon: <IconBook size={24} />, title: "I want to learn the Quran", desc: "Join interactive Quran classes online with expert teachers and a proven curriculum designed for all age groups and levels.", btn: "Register as Student", href: "/book-free-trial" },
  { icon: <IconUsers size={24} />, title: "I want to teach the Quran", desc: "Inspire students worldwide by teaching the Quran online and earn rewards while working from the comfort of your home.", btn: "Register as Teacher", href: "/teacher-application" }
];
const FAQS = [
  { icon: <IconUser />, color: "green", q: "What makes your Quran teachers qualified?", a: "Our teachers are certified and experienced, many holding Ijazah and degrees in Islamic Studies, and are carefully selected for both knowledge and teaching skill." },
  { icon: <IconUsers />, color: "gold", q: "How are your teachers selected?", a: "Teachers go through a careful selection process including verification of qualifications, a subject and Tajweed assessment, a teaching demo and a character review." },
  { icon: <IconChat />, color: "green", q: "Do your teachers speak different languages?", a: "Yes. Many teachers speak English along with Arabic, Urdu and other languages to support diverse students." },
  { icon: <IconRefresh />, color: "gold", q: "Can I change my teacher if needed?", a: "Yes. Wherever possible we accommodate teacher change requests — just contact our support team." },
  { icon: <IconBadge />, color: "green", q: "Do your teachers have teaching experience?", a: "Yes. Our teachers are experienced in teaching students of all ages using patient, engaging and effective methods." },
  { icon: <IconHeadset />, color: "gold", q: "How can I connect with my teacher?", a: "Classes are held live via Zoom or our portal, and you can reach your teacher and our support team anytime." }
];

function Avatar({ url, name, className }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className={`tp-avatar ${className || ""}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name} />
      ) : initial}
    </div>
  );
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(DEFAULT_TEACHERS);
  const [openLearn, setOpenLearn] = useState(null);

  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchTeachers() {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (active && data && data.length > 0) setTeachers(data);
      } catch (err) {
        console.warn("Could not load teachers, using defaults:", err);
      }
    }
    fetchTeachers();
    return () => { active = false; };
  }, []);

  // Fixed, curated hero photos for a clean reference-style collage
  const collageLeft = ["/images/teacher_rahman.png", "/images/teacher_maryam.png"];
  const collageRight = ["/images/teacher_aisha.png", "/images/teacher_saad.png"];

  return (
    <main className="tp-page">
      {/* ===== HERO ===== */}
      <section className="tp-hero">
        <div className="tp-hero-inner">
          <div className="tp-hero-dots">{Array.from({ length: 9 }).map((_, i) => <span key={i} />)}</div>
          <div>
            <span className="tp-hero-label">Meet Our</span>
            <h1 className="tp-hero-title">Teachers</h1>
            <div className="tp-hero-rule"><span className="line" /><span className="dia" /></div>
            <p className="tp-hero-sub">
              Learn Qur&apos;an online with qualified and experienced teachers. Expert in Tajweed, Hifz,
              Arabic &amp; Islamic Studies. 1-to-1 classes for kids &amp; adults — flexible, trusted &amp; effective.
            </p>
            <div className="tp-hero-badges">
              {HERO_BADGES.map((b) => <span className="b" key={b.label}>{b.icon}<span className="lbl">{b.label}</span></span>)}
            </div>
            <div className="tp-hero-features">
              {HERO_FEATURES.map((f) => (
                <div className="tp-hf-card" key={f.label}>
                  <div className="tp-hf-icon">{f.icon}</div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tp-collage">
            <div className="tp-collage-col">
              {collageLeft.map((src) => (
                <div className="tp-collage-img" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Yaqeen teacher" />
                </div>
              ))}
            </div>
            <div className="tp-collage-col">
              {collageRight.map((src) => (
                <div className="tp-collage-img" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Yaqeen teacher" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEACHERS GRID ===== */}
      <section className="tp-teachers">
        <div className="tp-head">
          <span className="tp-badge">Meet Our Teachers</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>Learn from Experienced<br />and <span>Caring Teachers.</span></h2>
          <p>Our teachers are qualified, experienced, and passionate about helping you grow in your Islamic knowledge.</p>
        </div>
        <div className="tp-grid">
          {teachers.map((t) => (
            <div className="tp-card" key={t.id}>
              <Avatar url={t.avatar_url} name={t.name} />
              <h4>{t.name}</h4>
              <div className="tp-card-rule" />
              <div className="tp-card-details">
                {t.languages && <div className="tp-card-detail"><IconGlobe /><span><strong>Languages:</strong> {t.languages}</span></div>}
                {t.experience && <div className="tp-card-detail"><IconBriefcase /><span><strong>Experience:</strong> {t.experience}</span></div>}
                {t.specialization && <div className="tp-card-detail"><IconStar /><span><strong>Specialization:</strong> {t.specialization}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CORE COMMITMENT ===== */}
      <section className="tp-commit">
        <div className="tp-commit-inner">
          <div>
            <p className="lead">Here, your skills become a means of compassion, your dedication becomes a source of reward, and your efforts create <b>lasting impact</b>.</p>
            <div className="tp-commit-rule"><span className="line" /><IconGear /><span className="line" /></div>
            <h3>Our Core <span>Commitment</span></h3>
            <Link href="/careers" className="tp-join-btn">Join Our Team <IconArrow /></Link>
          </div>
          <div className="tp-commit-right">
            <div className="tp-commit-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/commit_difference.png" alt="Make a difference" />
            </div>
            <div className="tp-values">
              {VALUES.map((v) => (
                <div className="tp-value" key={v.ar}>
                  <div className={`tp-value-icon ${v.color}`}>{v.icon}</div>
                  <div>
                    <div className="ar">{v.ar}</div>
                    <div className="en">{v.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEARN ONLINE ===== */}
      <section className="tp-learn">
        <div className="tp-head">
          <span className="tp-badge">Learn Online</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>Learn with a Professional<br /><span>Quran Teacher Online</span></h2>
        </div>
        <div className="tp-acc">
          {LEARN.map((f, i) => {
            const open = openLearn === i;
            return (
              <div key={i} className={`tp-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-q" aria-expanded={open} onClick={() => setOpenLearn(open ? null : i)} suppressHydrationWarning>
                  <div className="tp-q-icon-wrap">
                    <span className="tp-q-icon">{f.icon}</span>
                  </div>
                  <div className="tp-q-separator" />
                  <div className="tp-q-text">
                    <h3 className="t">{f.q}</h3>
                    <p className="d">{f.d}</p>
                  </div>
                  <div className={`tp-q-toggle ${open ? "open" : ""}`}>
                    <IconChevron className="tp-chevron" />
                  </div>
                </button>
                <div className={`tp-a ${open ? "open" : ""}`}><div className="tp-a-inner">{f.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHAT WOULD YOU LIKE TO DO ===== */}
      <section className="tp-choose">
        <div className="tp-head">
          <span className="tp-badge">Teacher &amp; Students</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>What Would You <span>Like to Do?</span></h2>
          <p>Whether you want to learn the Quran online or become a Quran teacher, we&apos;re here to support and guide you every step of the way.</p>
        </div>
        <div className="tp-choose-grid">
          {CHOOSE.map((c) => (
            <div className="tp-choose-card" key={c.title}>
              <div className="tp-choose-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <Link href={c.href} className="tp-choose-btn">{c.btn} <IconArrow /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="tp-faq">
        <div className="tp-head">
          <span className="tp-badge solid">Teachers FAQ</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>Questions About Our <span>Teachers</span></h2>
        </div>
        <div className="tp-faq-list">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`tp-faq-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-faq-q" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)} suppressHydrationWarning>
                  <span className={`tp-faq-icon ${f.color}`}>{f.icon}</span>
                  <span className="tp-faq-qtext">{f.q}</span>
                  <IconChevron className={`tp-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`tp-faq-a ${open ? "open" : ""}`}><div className="tp-faq-a-inner">{f.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
