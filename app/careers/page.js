"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./careers.css";
import { supabase } from "@/lib/supabase";

/* ---------------- Icons ---------------- */
const IconArrow = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconChevron = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>
);
const IconCommunity = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconTeamwork = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /><circle cx="12" cy="12" r="3" /></svg>);
const IconDevelopment = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
const IconEmpowerment = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-6" /></svg>);
const IconExcellence = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconBalance = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 7h18M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z" /></svg>);

const VALUES = [
  { ar: "Amanah", en: "Trustworthiness", desc: "We approach teaching with responsibility, ensuring we provide accurate knowledge and guide students with integrity." },
  { ar: "Adab", en: "Proper Conduct", desc: "We respect and value each student, fostering an environment where they can develop both academically and ethically." },
  { ar: "Ihsan", en: "Excellence", desc: "We are dedicated to delivering the highest quality of education, striving to inspire students to achieve their full potential." },
  { ar: "Ikhlas", en: "Sincerity", desc: "Our efforts in teaching are driven by a sincere desire to seek the pleasure of Allah and make a positive impact on the lives of our students." }
];

const WHY = [
  { icon: <IconCommunity />, title: "Community", desc: "Build lasting bonds with a team of like-minded individuals, united in their commitment to a shared, greater purpose." },
  { icon: <IconTeamwork />, title: "Teamwork", desc: "Collaborate with diverse teams, global colleagues and academics to foster creativity, innovation and mutual learning." },
  { icon: <IconDevelopment />, title: "Development", desc: "Thrive in an environment that encourages continuous learning, both spiritually and professionally, supporting your growth." },
  { icon: <IconEmpowerment />, title: "Empowerment", desc: "Contribute to the positive transformation of lives by nurturing faith and leaving an enduring impact on communities." },
  { icon: <IconExcellence />, title: "Excellence", desc: "Experience a well-structured workplace with high standards of integrity, ensuring a professional atmosphere for all." },
  { icon: <IconBalance />, title: "Balance", desc: "Work in harmony where both your spiritual values and worldly aspirations align toward a common, purposeful goal." }
];

const DEFAULT_JOBS = [
  { id: "d1", title: "Quran Teacher — Female", job_title: "Quran Study with Tajweed & Makharij", meta: "Permanent | 2 Years Exp. | Bilingual (English/Arabic)", badge: "Online", description: "Quran Teacher with Ijazah and 2–3 years of online teaching experience for all ages." },
  { id: "d2", title: "Arabic Teacher — Female", job_title: "Arabic Language Study", meta: "Permanent | 2 Years Exp. | Bilingual (English/Arabic)", badge: "Online", description: "Arabic teacher with command of the Arabic language, able to design the course per age group and teach the school Arabic curriculum, with a minimum of 2–3 years of experience." },
  { id: "d3", title: "Admin Staff — Female", job_title: "Administrative Co-ordinator", meta: "Permanent | 2 Years Exp. | Bilingual (English/Arabic)", badge: "Online", description: "Manage letters, communicate with clients and the public with excellent written communication. Must be well organised to keep the schedule of teachers and kids; minimum 2 years of experience." },
  { id: "d4", title: "Digital Marketing Staff — Female", job_title: "Digital Marketing Executive", meta: "Permanent | 2 Years Exp. | Bilingual (English/Arabic)", badge: "Online", description: "Plans and implements display, email, social media and web advertising campaigns; evaluates and reports on digital marketing performance against objectives (ROI and KPIs)." }
];

const FAQS = [
  { q: "How do I apply to teach with Yaqeen Institute?", a: "You can apply through our Teacher Application page — complete the form and upload your details, and our team will review your application." },
  { q: "What are the teaching expectations?", a: "Teachers are expected to be punctual, well-prepared, patient and committed to each student's progress, following our curriculum and values." },
  { q: "What equipment do I need to teach?", a: "A laptop or computer with a stable internet connection, a headset, a webcam and a quiet space are recommended." },
  { q: "What conduct is expected during class?", a: "We expect professional, respectful and Islamic conduct at all times, creating a safe and positive learning environment." },
  { q: "Can I reschedule or cancel a class?", a: "Yes. Classes can be rescheduled or cancelled with reasonable notice through our team." },
  { q: "How is teaching quality monitored?", a: "We monitor quality through student feedback, progress reports and periodic reviews to maintain high teaching standards." }
];

const GALLERY = [
  { src: "/images/about_who_we_are.png", tall: false },
  { src: "/images/about_what_we_do.png", tall: false },
  { src: "/images/about_student_hero.png", tall: true },
  { src: "/images/cta_student_boy.png", tall: false }
];

export default function CareersPage() {
  const [openId, setOpenId] = useState(null);
  const [jobs, setJobs] = useState(DEFAULT_JOBS);

  useEffect(() => {
    let active = true;
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from("career_jobs")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (active && data && data.length > 0) setJobs(data);
      } catch (err) {
        console.warn("Could not load career jobs, using defaults:", err);
      }
    }
    fetchJobs();
    return () => { active = false; };
  }, []);

  return (
    <main className="cr-page">
      {/* Hero */}
      <section className="cr-hero">
        <span className="cr-badge">Careers</span>
        <h1>Build Your <span>Career</span> With Us</h1>
        <div className="cr-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>More than a job — serve Allah and earn blessings in every step.</p>
      </section>

      {/* Intro */}
      <div className="cr-intro">
        <p>This is not just a job; it&apos;s an opportunity to serve Allah through your work, earning <b>His blessings and rewards</b> with every task you complete.</p>
      </div>

      {/* Gallery */}
      <div className="cr-gallery">
        {GALLERY.map((g, i) => (
          <div key={i} className={`cr-gallery-img ${g.tall ? "tall" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt="Yaqeen workplace" />
          </div>
        ))}
      </div>

      {/* Foundation Commitment */}
      <section className="cr-foundation">
        <div className="cr-head">
          <h2>Our Foundation <span>Commitment</span></h2>
          <p>We approach teaching with responsibility, ensuring we provide accurate knowledge and guide students with integrity.</p>
        </div>
        <div className="cr-values">
          {VALUES.map((v) => (
            <div className="cr-value" key={v.ar}>
              <div className="cr-value-label">
                <span className="ar">{v.ar}</span>
                <span className="en">{v.en}</span>
              </div>
              <div className="cr-value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join Us */}
      <section className="cr-why">
        <div className="cr-head">
          <h2>Why Join Us?</h2>
          <p>What we offer is not just employment, but a chance to earn rewards from Allah by fulfilling your duties with sincerity and purpose.</p>
        </div>
        <div className="cr-why-grid">
          {WHY.map((w) => (
            <div className="cr-why-card" key={w.title}>
              <div className="cr-why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Our Team */}
      <section className="cr-jobs">
        <div className="cr-head">
          <h2>Join Our <span>Team</span></h2>
          <p>We are seeking the perfect candidates for the positions listed below.</p>
        </div>
        <div className="cr-jobs-grid">
          {jobs.map((j) => (
            <div className="cr-job" key={j.id}>
              <h3>{j.title}</h3>
              {j.job_title && <p className="cr-job-title"><b>Job Title:</b> {j.job_title}</p>}
              {j.meta && <p className="cr-job-meta">{j.meta}</p>}
              {j.badge && <span className="cr-job-badge">{j.badge}</span>}
              {j.description && <p className="cr-job-desc">{j.description}</p>}
              <Link href="/teacher-application" className="cr-apply">Apply Now <IconArrow /></Link>
            </div>
          ))}
        </div>
        <div className="cr-center-btn">
          <Link href="/teacher-application" className="cr-btn-outline">Become a Tutor <IconArrow /></Link>
        </div>
      </section>

      {/* Teachers FAQ */}
      <section className="cr-faq">
        <div className="cr-head">
          <span className="cr-faq-badge">Teachers FAQ</span>
          <h2 style={{ marginTop: "16px" }}>Questions About Our <span>Teachers</span></h2>
        </div>
        <div className="cr-acc">
          {FAQS.map((f, i) => {
            const open = openId === i;
            return (
              <div key={i} className={`cr-item ${open ? "open" : ""}`}>
                <button type="button" className="cr-q" aria-expanded={open} onClick={() => setOpenId(open ? null : i)}>
                  <span>{f.q}</span>
                  <IconChevron className={`cr-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`cr-a ${open ? "open" : ""}`}>
                  <div className="cr-a-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cr-center-btn" style={{ marginTop: 0 }}>
          <Link href="/teacher-application" className="cr-btn-outline">Apply to Teach <IconArrow /></Link>
        </div>
      </section>
    </main>
  );
}
