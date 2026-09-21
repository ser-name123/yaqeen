"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./teachers.css";
import { supabase } from "@/lib/supabase";
import { usePageContent } from "@/lib/use-page-content";

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

/* ---------------- Presentational icon/style pools (text comes from CMS) ---------------- */
const HERO_BADGE_ICONS = [<IconBook size={15} />, <IconBadge size={15} />, <IconStar size={15} />, <IconMosque size={15} />, <IconChat size={15} />];
const HERO_FEATURE_ICONS = [<IconBadge />, <IconBook />, <IconMonitor />, <IconUser />];
const VALUE_STYLES = [
  { icon: <IconShield />, color: "green" },
  { icon: <IconHandshake />, color: "gold" },
  { icon: <IconStar size={20} />, color: "gold" },
  { icon: <IconHeart />, color: "green" },
];
const LEARN_ICONS = [<IconUserStar />, <IconBook size={22} />, <IconGrowth />];
const CHOOSE_ICONS = [<IconBook size={24} />, <IconUsers size={24} />];
const FAQ_STYLES = [
  { icon: <IconUser />, color: "green" },
  { icon: <IconUsers />, color: "gold" },
  { icon: <IconChat />, color: "green" },
  { icon: <IconRefresh />, color: "gold" },
  { icon: <IconBadge />, color: "green" },
  { icon: <IconHeadset />, color: "gold" },
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
  const c = usePageContent("teachers");
  const [teachers, setTeachers] = useState(DEFAULT_TEACHERS);
  const [openLearn, setOpenLearn] = useState(null);

  const [openFaq, setOpenFaq] = useState(null);
  const heroBadges = c.hero?.badges || [];
  const heroFeatures = c.hero?.features || [];
  const values = c.commit?.values || [];
  const learnItems = c.learn?.items || [];
  const chooseCards = c.choose?.cards || [];
  const faqItems = c.faq?.items || [];

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
            <span className="tp-hero-label">{c.hero?.label}</span>
            <h1 className="tp-hero-title">{c.hero?.title}</h1>
            <div className="tp-hero-rule"><span className="line" /><span className="dia" /></div>
            <p className="tp-hero-sub">
              {c.hero?.subtitle}
            </p>
            <div className="tp-hero-badges">
              {heroBadges.map((label, i) => <span className="b" key={i}>{HERO_BADGE_ICONS[i % HERO_BADGE_ICONS.length]}<span className="lbl">{label}</span></span>)}
            </div>
            <div className="tp-hero-features">
              {heroFeatures.map((label, i) => (
                <div className="tp-hf-card" key={i}>
                  <div className="tp-hf-icon">{HERO_FEATURE_ICONS[i % HERO_FEATURE_ICONS.length]}</div>
                  <span>{label}</span>
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
          <span className="tp-badge">{c.grid?.badge}</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>{c.grid?.title_line1}<br />{c.grid?.title_line2_prefix}<span>{c.grid?.title_highlight}</span></h2>
          <p>{c.grid?.subtitle}</p>
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
            <p className="lead">{c.commit?.lead}</p>
            <div className="tp-commit-rule"><span className="line" /><IconGear /><span className="line" /></div>
            <h3>{c.commit?.heading} <span>{c.commit?.heading_highlight}</span></h3>
            <Link href={c.commit?.button_url || "/careers"} className="tp-join-btn">{c.commit?.button_label} <IconArrow /></Link>
          </div>
          <div className="tp-commit-right">
            <div className="tp-commit-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/commit_difference.png" alt="Make a difference" />
            </div>
            <div className="tp-values">
              {values.map((v, i) => {
                const style = VALUE_STYLES[i % VALUE_STYLES.length];
                return (
                  <div className="tp-value" key={i}>
                    <div className={`tp-value-icon ${style.color}`}>{style.icon}</div>
                    <div>
                      <div className="ar">{v.ar}</div>
                      <div className="en">{v.en}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEARN ONLINE ===== */}
      <section className="tp-learn">
        <div className="tp-head">
          <span className="tp-badge">{c.learn?.badge}</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>{c.learn?.title_line1}<br /><span>{c.learn?.title_highlight}</span></h2>
        </div>
        <div className="tp-acc">
          {learnItems.map((f, i) => {
            const open = openLearn === i;
            return (
              <div key={i} className={`tp-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-q" aria-expanded={open} onClick={() => setOpenLearn(open ? null : i)} suppressHydrationWarning>
                  <div className="tp-q-icon-wrap">
                    <span className="tp-q-icon">{LEARN_ICONS[i % LEARN_ICONS.length]}</span>
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
          <span className="tp-badge">{c.choose?.badge}</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>{c.choose?.title} <span>{c.choose?.title_highlight}</span></h2>
          <p>{c.choose?.subtitle}</p>
        </div>
        <div className="tp-choose-grid">
          {chooseCards.map((card, i) => (
            <div className="tp-choose-card" key={i}>
              <div className="tp-choose-icon">{CHOOSE_ICONS[i % CHOOSE_ICONS.length]}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <Link href={card.href || "#"} className="tp-choose-btn">{card.btn} <IconArrow /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="tp-faq">
        <div className="tp-head">
          <span className="tp-badge solid">{c.faq?.badge}</span>
          <div className="tp-diamond-div"><span className="line" /><span className="dia" /><span className="line" /></div>
          <h2>{c.faq?.title} <span>{c.faq?.title_highlight}</span></h2>
        </div>
        <div className="tp-faq-list">
          {faqItems.map((f, i) => {
            const style = FAQ_STYLES[i % FAQ_STYLES.length];
            const open = openFaq === i;
            return (
              <div key={i} className={`tp-faq-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-faq-q" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)} suppressHydrationWarning>
                  <span className={`tp-faq-icon ${style.color}`}>{style.icon}</span>
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
