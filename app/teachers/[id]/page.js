"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./teacher-detail.css";
import { supabase } from "@/lib/supabase";

// Fallback content for the shared marketing blocks, used only when a teacher
// has not customised them. Each teacher can override these from Manage Teachers.
const DEFAULT_ABOUT = {
  title_line1: "A Friendly, Supportive and",
  title_highlight: "Professional Teacher",
  subtitle_rest: "is committed to creating a positive and encouraging learning environment for every student.",
  features: [
    { title: "Warm and Approachable", desc: "Creates a comfortable and encouraging learning environment." },
    { title: "Supportive Teaching Style", desc: "Patient and helpful, making students feel at ease." },
    { title: "Focused on Your Goals", desc: "Designs lessons to match each student's level and needs." },
    { title: "Dedicated Educator", desc: "Committed to helping students grow in their Quran and Arabic skills." },
  ],
};
const DEFAULT_VERIFIED = {
  badge: "OUR VERIFIED TEACHERS",
  title_line1: "Dedicated. Experienced.",
  title_highlight: "Committed to Your Child's Success.",
  subtitle: "Our teachers are carefully selected to provide high-quality Quran and Arabic education in a safe, respectful, and supportive environment.",
  cards: [
    { title: "Qualified & Certified", desc: "Our teachers are verified professionals with recognized qualifications in Quran and Arabic teaching." },
    { title: "Comprehensive Islamic Education", desc: "We teach Quran recitation, Tajweed, Arabic language, and Islamic studies, tailored to each student's level and goals." },
    { title: "Male & Female Teachers", desc: "We offer both male and female teachers, so you can choose the best fit for your child's needs and comfort." },
    { title: "Carefully Vetted Hiring Process", desc: "Every teacher goes through a thorough selection process, including interviews, qualification checks, and background verification, ensuring a safe and positive learning experience." },
  ],
};

// Infer a gendered pronoun base from the honorific when gender isn't set in DB.
const inferGender = (name = "") => (/ustadha|sister|ms\.|mrs\.|miss/i.test(name) ? "female" : "male");

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "");

/* ---------------- SVG Icons ---------------- */
const IconArrow = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconArrowLeft = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconGraduation = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconStar = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconMapPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconUsers = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSmiley = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconHeart = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconBook = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconBulb = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
  </svg>
);

const IconRibbonCheck = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const IconShieldCheck = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 12 14 16 9" />
  </svg>
);

export default function TeacherDetailPage() {
  const params = useParams();
  const rawId = params?.id;

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTeacher() {
      try {
        if (!rawId) return;
        const isNumeric = !isNaN(Number(rawId));

        // Everything comes from the database; match by numeric id, slug, or name.
        let found = null;
        if (isNumeric) {
          const { data } = await supabase.from("teachers").select("*").eq("id", Number(rawId)).maybeSingle();
          found = data || null;
        } else {
          const { data } = await supabase.from("teachers").select("*");
          const list = data || [];
          found = list.find((t) => (t.slug && t.slug === rawId))
            || list.find((t) => slugify(t.name) === rawId)
            || list.find((t) => (t.name || "").toLowerCase().includes(rawId.replace(/-/g, " ").toLowerCase()))
            || null;
        }

        if (isMounted) setTeacher(found);
      } catch (err) {
        console.warn("Could not fetch teacher from Supabase:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTeacher();
    return () => { isMounted = false; };
  }, [rawId]);

  // Loading state
  if (loading && !teacher) {
    return (
      <main className="td-page">
        <div className="td-container" style={{ padding: "80px 0", textAlign: "center", color: "var(--fg-muted, #7a6a55)" }}>
          Loading teacher profile…
        </div>
      </main>
    );
  }

  // Not found state (no static fallback — purely database-driven)
  if (!teacher) {
    return (
      <main className="td-page">
        <div className="td-container" style={{ padding: "80px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Teacher not found</h1>
          <p style={{ color: "#7a6a55", marginBottom: "24px" }}>This teacher profile is not available.</p>
          <Link href="/teachers" className="td-back-btn"><IconArrowLeft size={14} /><span>All Teachers</span></Link>
        </div>
      </main>
    );
  }

  const gender = teacher.gender || inferGender(teacher.name);
  const pronounSubject = gender === "female" ? "She" : "He";
  const pronounObject = gender === "female" ? "Her" : "Him";
  const pronounPossessive = gender === "female" ? "Her" : "His";
  void pronounPossessive;

  // Per-teacher blocks (edited in Manage Teachers), merged over sensible defaults.
  const cAbout = { ...DEFAULT_ABOUT, ...(teacher.about_block || {}) };
  const cVerified = { ...DEFAULT_VERIFIED, ...(teacher.verified_block || {}) };
  const features = Array.isArray(cAbout.features) && cAbout.features.length ? cAbout.features : DEFAULT_ABOUT.features;
  const verifiedCards = Array.isArray(cVerified.cards) && cVerified.cards.length ? cVerified.cards : DEFAULT_VERIFIED.cards;
  const featureIcons = [IconSmiley, IconHeart, IconBook, IconUsers];
  const verifiedIcons = [IconRibbonCheck, IconBook, IconUsers, IconShieldCheck];

  return (
    <main className="td-page">
      <div className="td-container">

        {/* Top Breadcrumb Bar */}
        <nav className="td-breadcrumb" aria-label="Breadcrumb">
          <div className="td-breadcrumb-links">
            <Link href="/">Home</Link>
            <span className="td-breadcrumb-sep">/</span>
            <Link href="/teachers">Teachers</Link>
            <span className="td-breadcrumb-sep">/</span>
            <span className="td-breadcrumb-current">{teacher.name}</span>
          </div>

          <Link href="/teachers" className="td-back-btn">
            <IconArrowLeft size={14} />
            <span>All Teachers</span>
          </Link>
        </nav>

        {/* =========================================================================
           SECTION 1: HERO PRESENTATION CARD (Image 1 Reference)
           ========================================================================= */}
        <section className="td-main-card">
          <div className="td-hero-grid">

            {/* Left Column: Title & Metadata Stack */}
            <div className="td-col-left">
              <div className="td-badge-wrap">
                <span className="td-badge">OUR TEACHERS</span>
                <span className="td-badge-line" />
              </div>

              <h1 className="td-main-title">
                Meet Your <span className="td-name-accent">{teacher.name}</span>
              </h1>

              <p className="td-hero-role">{teacher.headline || "Online Quran & Arabic Teacher"}</p>

              <div className="td-gold-divider" />

              <p className="td-hero-bio">
                {teacher.short_bio || `${teacher.name} is a dedicated and experienced teacher who is passionate about helping students learn the Quran and Arabic confidently. ${pronounSubject} creates engaging and supportive lessons that make learning enjoyable and effective.`}
              </p>

              {/* 4 Info Pills Stack */}
              <div className="td-pill-stack">
                <div className="td-pill-card">
                  <div className="td-pill-icon"><IconGraduation /></div>
                  <div className="td-pill-content">
                    <span className="td-pill-label">Education</span>
                    <span className="td-pill-value">
                      {teacher.education_title ? (
                        <>
                          {teacher.education_title}<br />
                          {teacher.education_sub}
                        </>
                      ) : (
                        teacher.education || "Bachelor's Degree in Islamic Studies\nAl-Azhar University — Graduation"
                      )}
                    </span>
                  </div>
                </div>

                <div className="td-pill-card">
                  <div className="td-pill-icon"><IconStar /></div>
                  <div className="td-pill-content">
                    <span className="td-pill-label">Experience</span>
                    <span className="td-pill-value">{teacher.experience || "5+ Years"}</span>
                  </div>
                </div>

                <div className="td-pill-card">
                  <div className="td-pill-icon"><IconMapPin /></div>
                  <div className="td-pill-content">
                    <span className="td-pill-label">Country</span>
                    <span className="td-pill-value">{teacher.country || "Egypt"}</span>
                  </div>
                </div>

                <div className="td-pill-card">
                  <div className="td-pill-icon"><IconUsers /></div>
                  <div className="td-pill-content">
                    <span className="td-pill-label">Teaches</span>
                    <span className="td-pill-value">{teacher.specialization || "Quran, Arabic Language, Islamic Studies"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: Portrait Arch & Quote Box */}
            <div className="td-col-center">
              <div className="td-portrait-wrapper">
                {/* Curved Olive-Green Decorative Backdrop Accent */}
                <div className="td-portrait-accent" />

                {/* Arch-Framed Portrait */}
                <div className="td-portrait-arch">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={teacher.avatar_url || "/images/teacher_sabry.jpg"} 
                    alt={teacher.name} 
                    className="td-portrait-img"
                  />
                </div>
              </div>

              {/* Gold Quote Block */}
              <div className="td-quote-card">
                <span className="td-quote-icon">“</span>
                <p className="td-quote-text">
                  {teacher.quote || "I enjoy helping my students build a strong connection with the Quran and Arabic and gain confidence in their learning journey."}
                </p>
                <div className="td-quote-rule" />
              </div>
            </div>

            {/* Right Column: About Teacher & Feature Cards (admin-editable) */}
            <div className="td-col-right">
              <div className="td-badge-wrap">
                <span className="td-badge">ABOUT {pronounObject.toUpperCase()}</span>
                <span className="td-badge-line" />
              </div>

              <h2 className="td-about-title">
                {cAbout.title_line1 || "A Friendly, Supportive and"} <span className="td-name-accent">{cAbout.title_highlight || "Professional Teacher"}</span>
              </h2>

              <p className="td-about-sub">
                {pronounSubject} {cAbout.subtitle_rest || "is committed to creating a positive and encouraging learning environment for every student."}
              </p>

              {/* Feature Stack */}
              <div className="td-feature-stack">
                {features.map((f, i) => {
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <div className="td-feature-card" key={i}>
                      <div className="td-feature-icon"><Icon /></div>
                      <div className="td-feature-text">
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
           SECTION 2: DEEP DIVE & VERIFIED STANDARDS (Image 2 Reference)
           ========================================================================= */}
        <section className="td-deepdive-card">
          <div className="td-deepdive-grid">

            {/* Left Column: ABOUT ME (Methodology & Background) */}
            <div className="td-dd-col">
              <div className="td-badge-wrap">
                <span className="td-badge">ABOUT ME</span>
                <span className="td-badge-line" />
              </div>

              <h2 className="td-deepdive-title">
                Meet <span className="td-name-accent">{teacher.name}</span>
              </h2>

              <p className="td-hero-role">{teacher.headline || "Online Quran & Arabic Teacher"}</p>

              <div className="td-gold-divider" />

              <p className="td-deepdive-bio">
                {teacher.long_bio || `${teacher.name} is a native Arabic speaker with several years of experience in online Quran and Arabic teaching. ${pronounSubject} is passionate about helping students of all ages develop strong recitation, Arabic language skills, and a deeper connection with Islamic knowledge through engaging and structured lessons.`}
              </p>

              {/* 2 Numbered Highlight Cards */}
              <div className="td-method-stack">
                <div className="td-method-card">
                  <div className="td-method-num-wrap">
                    <span className="td-method-num">01</span>
                    <div className="td-method-icon"><IconBulb /></div>
                  </div>
                  <div className="td-method-info">
                    <h4>{teacher.approach_title || "Student-Centered Learning Approach"}</h4>
                    <p>
                      {teacher.approach_desc || `${pronounSubject} designs interactive and personalized lessons based on each student's level and learning goals, making Quran and Arabic learning simple, enjoyable, and effective.`}
                    </p>
                  </div>
                </div>

                <div className="td-method-card">
                  <div className="td-method-num-wrap">
                    <span className="td-method-num">02</span>
                    <div className="td-method-icon"><IconGraduation /></div>
                  </div>
                  <div className="td-method-info">
                    <h4>{teacher.academic_title || "Strong Academic Background"}</h4>
                    <p>
                      {teacher.academic_desc || `With a Bachelor's Degree in Islamic Da'wah Studies from Al-Azhar University, ${teacher.name} brings a solid foundation in Islamic knowledge, supporting students with authentic and reliable guidance.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: OUR VERIFIED TEACHERS (admin-editable) */}
            <div className="td-dd-col">
              <div className="td-badge-wrap">
                <span className="td-badge">{cVerified.badge || "OUR VERIFIED TEACHERS"}</span>
                <span className="td-badge-line" />
              </div>

              <h2 className="td-deepdive-title">
                {cVerified.title_line1 || "Dedicated. Experienced."}<br />
                <span className="td-name-accent">{cVerified.title_highlight || "Committed to Your Child's Success."}</span>
              </h2>

              <p className="td-verified-sub">
                {cVerified.subtitle || "Our teachers are carefully selected to provide high-quality Quran and Arabic education in a safe, respectful, and supportive environment."}
              </p>

              {/* Verification Cards */}
              <div className="td-verified-stack">
                {verifiedCards.map((v, i) => {
                  const Icon = verifiedIcons[i % verifiedIcons.length];
                  return (
                    <div className="td-verified-card" key={i}>
                      <div className="td-verified-icon"><Icon /></div>
                      <div className="td-verified-info">
                        <h4>{v.title}</h4>
                        <p>{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
