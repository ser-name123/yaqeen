"use client";

import { useState } from "react";
import Link from "next/link";
import "./thank-you.css";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const IconCheck = ({ size = 40 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const IconChevron = ({ size = 20, className }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>);
const IconArrow = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconPhone = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.91.72A2 2 0 0 1 22 16.92z" /></svg>);
const IconVideo = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="14" height="16" rx="2" /><polygon points="22 8 16 12 22 16 22 8" /></svg>);
const IconCalendar = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);

const NEXT = [
  { icon: <IconPhone />, color: "gold", title: "We will contact you!", desc: "Our academic advisor will reach out within 24 hours to confirm your details." },
  { icon: <IconVideo />, color: "green", title: "Join Your Trial Session", desc: "Meet your teacher live online and experience our teaching first-hand." },
  { icon: <IconCalendar />, color: "gold", title: "Get Your Class Schedule", desc: "We'll set up a schedule that fits you perfectly, so you can start learning." }
];

const FAQS = [
  { q: "What happens after I book a trial?", a: "After you book, our academic advisor contacts you within 24 hours to confirm your preferred time and match you with a suitable teacher for your free trial class." },
  { q: "Is the trial really free?", a: "Yes. The trial class is completely free — no card details or payment are required." },
  { q: "Can I choose the trial timing?", a: "Yes. You pick the day and time that suits you and we arrange a teacher available then." },
  { q: "Do I need to prepare anything?", a: "No special preparation is needed — just a device with a stable internet connection and Zoom installed." },
  { q: "What if I want to continue after the trial?", a: "If you enjoyed your trial, our advisor will help you enrol and set up a regular schedule that works for you." },
  { q: "Can I give feedback after my trial?", a: "Absolutely. We welcome your feedback after the trial so we can match you with the best teacher and learning plan." }
];

export default function ThankYouPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <main className="ty-page">
      {/* Hero */}
      <section className="ty-hero">
        <div className="check"><IconCheck /></div>
        <h1>START EXPLORING NOW!</h1>
        <p>May Allah bring lots of Barakah in your learning journey. Ameen!</p>
        <div className="ty-hero-actions">
          <Link href="/courses" className="ty-btn">Explore Courses <IconArrow /></Link>
          <Link href="/" className="ty-btn gold">Back to Home <IconArrow /></Link>
        </div>
      </section>

      {/* What Next */}
      <section className="ty-next">
        <h2>What <span>Next...</span></h2>
        <div className="ty-next-grid">
          {NEXT.map((n) => (
            <div className="ty-next-card" key={n.title}>
              <div className={`ty-next-icon ${n.color}`}>{n.icon}</div>
              <h3>{n.title}</h3>
              <p>{n.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="ty-testi">
        <span className="ty-badge">Our Students Say</span>
        <h2>What Students Talk <span>About Us</span></h2>
        <p>See feedback from our students around the world.</p>
        <TestimonialsCarousel page="home" />
      </section>

      {/* Trial FAQ */}
      <section className="ty-faq">
        <div className="ty-faq-head">
          <span className="ty-badge">Trial FAQ</span>
          <h2>Everything About Your <span>Free Trial</span></h2>
        </div>
        <div className="ty-faq-list">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div className={`ty-faq-item ${open ? "open" : ""}`} key={i}>
                <button type="button" className="ty-faq-q" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)} suppressHydrationWarning>
                  <span>{f.q}</span>
                  <IconChevron className={`ty-chevron ${open ? "open" : ""}`} />
                </button>
                <div className={`ty-faq-a ${open ? "open" : ""}`}><div className="ty-faq-a-inner">{f.a}</div></div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
