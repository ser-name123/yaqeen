"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./testimonials.css";
import { supabase } from "@/lib/supabase";

const DEFAULT_TESTIMONIALS = [
  { id: "d1", name: "Ayesha Khan", role: "Mother of 2", content: "Yaqeen has helped my child develop a strong understanding of Islam in a fun and meaningful way. Highly recommended!", avatar_url: "/images/testi_ayesha.png" },
  { id: "d2", name: "Hassan Ali", role: "Adult Learner", content: "The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning.", avatar_url: "/images/testi_hassan.png" },
  { id: "d3", name: "Maryam Zahra", role: "Parent", content: "We love how the whole family can learn together. Yaqeen has brought us closer to our faith and each other.", avatar_url: "/images/testi_maryam.png" }
];

const FAQS = [
  { q: "Are your testimonials genuine?", a: "Yes. All testimonials are from real students and parents who have studied with us." },
  { q: "Can I send in my review?", a: "Yes. We would love to hear about your experience — you can share your review through our contact page." },
  { q: "Do you publish video testimonials?", a: "Yes. We share both written and video testimonials from our community where available." },
  { q: "How do you collect feedback?", a: "We collect feedback through progress reviews, messages from students and parents, and follow-ups from our team." },
  { q: "Do testimonials reflect current staff?", a: "Yes. Our testimonials reflect the ongoing quality of our current teachers and team." },
  { q: "Are all reviews published?", a: "We aim to share genuine reviews; occasionally some are kept private at the reviewer's request." }
];

const IconChevron = ({ size = 22, className }) => (
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
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [openId, setOpenId] = useState(null);

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
        if (active && data && data.length > 0) setTestimonials(data);
      } catch (err) {
        console.warn("Could not load testimonials, using defaults:", err);
      }
    }
    fetchTestimonials();
    return () => { active = false; };
  }, []);

  return (
    <main className="tpg-page">
      {/* Hero */}
      <section className="tpg-hero">
        <span className="tpg-badge">Testimonials</span>
        <h1>Feedback From Our <span>Students</span></h1>
        <div className="tpg-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>Hear from our learners and parents building a stronger connection with the Quran, Arabic and Islamic knowledge — together.</p>
      </section>

      {/* Testimonials grid */}
      <section className="tpg-grid-section">
        <div className="tpg-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testi-card">
              <span className="testi-quote-mark">&ldquo;</span>
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
      </section>

      {/* CTA banner */}
      <section className="tpg-cta">
        <h2>Ready to start your journey?</h2>
        <p>Book a free trial class and experience the difference.</p>
        <Link href="/book-free-trial" className="tpg-cta-btn">Book a Free Trial <IconArrow /></Link>
      </section>

      {/* Testimonials FAQ */}
      <section className="tpg-faq">
        <div className="tpg-faq-head">
          <span className="tpg-faq-badge">Testimonials FAQ</span>
          <h2>Everything About Reviews &amp; <span>Feedback</span></h2>
        </div>
        <div className="tpg-acc">
          {FAQS.map((f, i) => {
            const open = openId === i;
            return (
              <div key={i} className={`tpg-item ${open ? "open" : ""}`}>
                <button type="button" className="tpg-q" aria-expanded={open} onClick={() => setOpenId(open ? null : i)}>
                  <span>{f.q}</span>
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
