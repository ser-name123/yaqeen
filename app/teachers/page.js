"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./teachers.css";
import { supabase } from "@/lib/supabase";

/* Fallback teachers if the Manage Teachers list is empty */
const DEFAULT_TEACHERS = [
  { id: "d1", name: "Omnia Gomaa", specialization: "Quran and Tajweed Teacher", languages: "Arabic, English", experience: "5 Years" },
  { id: "d2", name: "Mahmoud Saied", specialization: "Quran, Noor Bayan, Islamic Studies & Tajweed Teacher", languages: "Arabic, English", experience: "6 Years" },
  { id: "d3", name: "Mohamed Taha", specialization: "Arabic and Islamic Studies Teacher", languages: "Arabic, English", experience: "4 Years" },
  { id: "d4", name: "Mariam Hossam", specialization: "Quran & Islamic Studies Teacher", languages: "Arabic, English", experience: "5 Years" },
  { id: "d5", name: "Entesar Khalid", specialization: "Quran, Tajweed, Arabic & Islamic Studies Teacher", languages: "Arabic, English", experience: "7 Years" },
  { id: "d6", name: "Sahar Ahmed", specialization: "Quran, Tajweed & Noor Al-Bayan Teacher", languages: "Arabic, English", experience: "5 Years" }
];

const LEARN = [
  { q: "Flexibility, comfort & personalized attention", a: "Learn from the comfort of home at times that suit you, with lessons tailored to your individual needs and pace." },
  { q: "Step-by-step structured learning approach", a: "Our teachers follow a clear, structured curriculum so you progress steadily from the basics to advanced levels." },
  { q: "Guidance tailored to your learning pace", a: "Whether you are a beginner or advanced, your teacher adapts each lesson to your level and goals." }
];

const FAQS = [
  { q: "How can I find a Quran teacher online?", a: "Simply browse our teacher profiles or book a free trial, and we will match you with a qualified Quran teacher suited to your goals." },
  { q: "Are online Quran classes effective?", a: "Yes. Our live, one-to-one online classes are highly effective, offering personalised attention and interactive learning from home." },
  { q: "Can kids learn Quran online?", a: "Absolutely. Our teachers are experienced in teaching children with patient, engaging and age-appropriate methods." },
  { q: "Do you provide one-on-one classes?", a: "Yes. We offer live one-to-one classes so each student receives focused, personalised guidance." },
  { q: "What qualifications do your Quran teachers have?", a: "Our teachers are certified and experienced — many holding Ijazah and degrees in Islamic Studies — and are carefully selected for knowledge and teaching skill." },
  { q: "Can I choose my preferred Quran teacher online?", a: "Yes. Wherever possible, we match you with your preferred teacher — male or female — based on your needs." }
];

const VALUES = [
  { ar: "Amanah", en: "Trustworthiness" },
  { ar: "Adab", en: "Proper Conduct" },
  { ar: "Ihsan", en: "Excellence" },
  { ar: "Ikhlas", en: "Sincerity" }
];

const IconChevron = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>
);
const IconArrow = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconStudent = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>);
const IconTeach = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconSun = ({ size = 18 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);

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
  const [openLearn, setOpenLearn] = useState(0);
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

  const featured = teachers[0];
  const gridTeachers = teachers.length > 1 ? teachers.slice(1) : teachers;

  return (
    <main className="tp-page">
      {/* Hero */}
      <section className="tp-hero">
        <span className="tp-badge">Our Teachers</span>
        <h1>Meet Our <span>Teachers</span></h1>
        <div className="tp-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>Dedicated to nurturing hearts with the light of Islam and character — our online Quran teachers guide each student with sincerity, patience and the prophetic example.</p>
      </section>

      {/* Featured teacher */}
      {featured && (
        <section className="tp-featured-section">
          <div className="tp-head" style={{ marginBottom: "24px" }}><h2>Featured <span>Teacher</span></h2></div>
          <div className="tp-featured">
            <Avatar url={featured.avatar_url} name={featured.name} />
            <div>
              <h3>{featured.name}</h3>
              <p className="qual">{featured.specialization}</p>
              <p className="bio">
                {featured.bio
                  ? featured.bio
                  : `Passionate and dedicated educator with a love for helping students grow and succeed.${featured.experience ? ` ${featured.experience} of teaching experience.` : ""}${featured.languages ? ` Languages: ${featured.languages}.` : ""}`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Teachers grid */}
      <section className="tp-grid-section">
        <div className="tp-head">
          <span className="tp-badge">Teachers</span>
          <h2>Meet the Best Quran <span>Teachers Online</span></h2>
          <p>Explore profiles of our expert instructors. Each teacher brings years of experience and a passion for helping students connect deeply with the Quran.</p>
        </div>
        <div className="tp-grid">
          {gridTeachers.map((t) => (
            <div className="tp-card" key={t.id}>
              <Avatar url={t.avatar_url} name={t.name} />
              <h4>{t.name}</h4>
              <p>{t.specialization}</p>
            </div>
          ))}
        </div>
        <div className="tp-center-btn">
          <Link href="/book-free-trial" className="tp-btn">Book a Class With a Teacher <IconArrow /></Link>
        </div>
      </section>

      {/* Learn Online */}
      <section className="tp-learn">
        <div className="tp-head">
          <span className="tp-badge">Learn Online</span>
          <h2>Learn With a Professional <span>Quran Teacher</span> Online</h2>
        </div>
        <div className="tp-acc">
          {LEARN.map((f, i) => {
            const open = openLearn === i;
            return (
              <div key={i} className={`tp-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-q" aria-expanded={open} onClick={() => setOpenLearn(open ? null : i)}>
                  <span>{f.q}</span>
                  <IconChevron className={`tp-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`tp-a ${open ? "open" : ""}`}><div className="tp-a-inner">{f.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* What are you looking for */}
      <section className="tp-looking">
        <div className="tp-head">
          <span className="tp-badge">Teacher &amp; Students</span>
          <h2>What Are You <span>Looking For?</span></h2>
        </div>
        <div className="tp-looking-grid">
          <div className="tp-look-card">
            <div className="tp-look-icon"><IconStudent /></div>
            <h4>Do you want to learn here?</h4>
            <p>Encourage the thirst for knowledge, watch minds bloom. Seeking knowledge refines character, and brings the seeker closer to Allah.</p>
            <Link href="/book-free-trial" className="tp-look-btn">Register as Student <IconArrow /></Link>
          </div>
          <div className="tp-look-card">
            <div className="tp-look-icon"><IconTeach /></div>
            <h4>Do you want to teach here?</h4>
            <p>What we offer is not just employment, but a chance to earn rewards from Allah by fulfilling your duties as an online Quran teacher with sincerity and purpose.</p>
            <Link href="/teacher-application" className="tp-look-btn">Register as Teacher <IconArrow /></Link>
          </div>
        </div>
      </section>

      {/* Foundation (green) */}
      <section className="tp-foundation">
        <div className="tp-foundation-inner">
          <div>
            <p className="lead">This is not just a job; it&apos;s an opportunity to serve Allah through your work, earning <b>His blessings and rewards</b> with every task you complete.</p>
            <h3>Our Foundation Commitment</h3>
            <Link href="/careers" className="tp-join-btn">Join Our Team <IconArrow /></Link>
          </div>
          <div className="tp-values">
            {VALUES.map((v) => (
              <div className="tp-value" key={v.ar}>
                <span className="tp-value-sun"><IconSun /></span>
                <div>
                  <div className="ar">{v.ar}</div>
                  <div className="en">{v.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers FAQ */}
      <section className="tp-faq">
        <div className="tp-head">
          <span className="tp-badge">Teachers FAQ</span>
          <h2>Questions About Our <span>Teachers</span></h2>
        </div>
        <div className="tp-acc">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={`tp-item ${open ? "open" : ""}`}>
                <button type="button" className="tp-q" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                  <span>{f.q}</span>
                  <IconChevron className={`tp-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`tp-a ${open ? "open" : ""}`}><div className="tp-a-inner">{f.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
