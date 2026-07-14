"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./course-detail.css";
import { supabase } from "@/lib/supabase";

/* ---------------- Icons ---------------- */
const IconArrow = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconCheck = ({ size = 13 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const IconChevron = ({ size = 20, className }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>);
const IconLevel = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-6" /></svg>);
const IconClock = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const IconCalendar = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
const IconGlobe = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconUsers = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>);
const IconBook = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);

/* ---------------- Defaults (used when a field is left blank in admin) ---------------- */
const DEFAULT_META = { level: "All Levels", class_duration: "45–60 min", course_duration: "Flexible", mode: "Online", age_group: "All Ages" };
const DEFAULT_LEARN = [
  "Build a strong foundation through structured lessons.",
  "Develop fluency and confidence with regular guided practice.",
  "Understand key concepts clearly with step-by-step teaching.",
  "Apply your knowledge through interactive, real-life examples.",
  "Improve steadily with personalised feedback and progress tracking.",
  "Gain lasting knowledge you can use with confidence."
];
const DEFAULT_REQ = [
  "A laptop, tablet or smartphone with a stable internet connection.",
  "A quiet space suitable for online learning.",
  "A notebook and pen for practice (recommended).",
  "Commitment to regular practice and participation.",
  "Willingness to learn and engage with the lessons."
];
const DEFAULT_WHO = [
  "Beginners who want to start learning from the basics.",
  "Intermediate learners who want to advance their skills.",
  "Children, teenagers and adults of all ages.",
  "Anyone seeking flexible, personalised online classes.",
  "Learners who want to grow with confidence and consistency."
];
const DEFAULT_CONTENT = [
  { t: "Foundations & Introduction", a: "Get started with the fundamentals, understand the roadmap, and set clear learning goals with your teacher." },
  { t: "Core Concepts", a: "Build a strong base through structured, step-by-step lessons designed around your level and pace." },
  { t: "Practical Application", a: "Apply what you learn through interactive exercises, real examples, and guided practice." },
  { t: "Reading & Recitation", a: "Develop fluency and confidence with regular reading, recitation and correction from your teacher." },
  { t: "Assessment & Progress", a: "Track your growth with regular reviews, feedback and progress reports at every milestone." },
  { t: "Final Review & Certification", a: "Complete your learning journey with a final review and a certificate of achievement." }
];
const DEFAULT_FAQS = [
  { q: "What does this course cover?", a: "This course covers the full curriculum step by step — from the foundations to advanced concepts — through live, interactive one-to-one online classes tailored to your level." },
  { q: "Is this course suitable for beginners?", a: "Yes. We welcome complete beginners and adjust every lesson to your current level and goals, so you always learn at a comfortable pace." },
  { q: "Are the classes live or recorded?", a: "All classes are 100% live and interactive with a qualified teacher, giving you personalised attention and instant feedback." },
  { q: "Can children join this course?", a: "Absolutely. Our teachers are experienced in teaching children using patient, engaging and age-appropriate methods." },
  { q: "Will I get a certificate?", a: "Yes. Certificates are awarded on completing key milestones and the course." },
  { q: "How do I get started?", a: "Simply book a free trial class — our advisor will match you with a suitable teacher and set up a schedule that works for you." }
];

/* ---------------- Parsers ---------------- */
const lines = (s) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);
const paras = (s) => (s || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const pairs = (s) => lines(s).map((l) => {
  const i = l.indexOf("|");
  return i >= 0 ? { left: l.slice(0, i).trim(), right: l.slice(i + 1).trim() } : { left: l, right: "" };
});

function Avatar({ url }) {
  return (
    <div className="cd-best-thumb">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" />
      ) : <IconBook />}
    </div>
  );
}

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

export default function CourseDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [openContent, setOpenContent] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data: many, error: manyErr } = await supabase
          .from("courses")
          .select("*")
          .order("order_index", { ascending: true });
        
        if (manyErr) throw manyErr;

        if (!active) return;

        let one = null;
        if (id) {
          if (/^\d+$/.test(id)) {
            one = many.find((item) => String(item.id) === id);
          } else {
            one = many.find((item) => slugify(item.title) === id);
          }
        }

        if (one) setCourse(one);
        if (many) setAllCourses(many.slice(0, 6));
      } catch (err) {
        console.warn("Could not load course:", err);
      }
    }
    if (id) load();
    return () => { active = false; };
  }, [id]);

  const c = course || {};
  const title = c.title || "Our Course";
  const heroSub = c.short_description
    || "This course is designed to help learners of all ages build real skills through live, one-to-one online classes. With expert teachers and a structured, personalised approach, you will progress steadily from the foundations to confident, practical mastery.";
  const meta = [
    { icon: <IconLevel />, lbl: "Level", val: c.level || DEFAULT_META.level },
    { icon: <IconClock />, lbl: "Class Duration", val: c.class_duration || DEFAULT_META.class_duration },
    { icon: <IconCalendar />, lbl: "Course Duration", val: c.course_duration || DEFAULT_META.course_duration },
    { icon: <IconGlobe />, lbl: "Mode", val: c.mode || DEFAULT_META.mode },
    { icon: <IconUsers />, lbl: "Age Group", val: c.age_group || DEFAULT_META.age_group }
  ];
  const descParas = c.description ? paras(c.description) : [
    `The ${title} course at Yaqeen Institute is tailored for learners who want to advance their skills to the next level. Through engaging, interactive lessons and expert guidance, students build a strong, lasting understanding while enjoying a supportive learning environment.`,
    "Our experienced instructors help children and adults learn online with confidence — combining structured teaching, practical activities and personalised feedback. Suitable for all ages and levels."
  ];
  const learnItems = c.learn_points ? lines(c.learn_points) : DEFAULT_LEARN;
  const reqItems = c.requirements ? lines(c.requirements) : DEFAULT_REQ;
  const whoItems = c.who_for ? lines(c.who_for) : DEFAULT_WHO;
  const contentParas = c.content_details ? paras(c.content_details) : null;
  const modules = c.course_modules ? pairs(c.course_modules).map((p) => ({ t: p.left, a: p.right })) : DEFAULT_CONTENT;
  const faqs = c.faqs ? pairs(c.faqs).map((p) => ({ q: p.left, a: p.right })) : DEFAULT_FAQS;
  const others = allCourses.filter((x) => String(x.id) !== String(id)).slice(0, 3);

  return (
    <main className="cd-page">
      {/* Hero */}
      <section className="cd-hero">
        <div className="cd-hero-inner">
          <div className="cd-hero-content">
            <span className="cd-badge">Online Course</span>
            <h1>{title}</h1>
            <p>{heroSub}</p>
            <Link href="/book-free-trial" className="cd-hero-btn">Get Started <IconArrow /></Link>
            
            <div className="cd-meta">
              {meta.map((m) => (
                <div className="cd-meta-pill" key={m.lbl}>
                  {m.icon}
                  <div>
                    <div className="lbl">{m.lbl}</div>
                    <div className="val">{m.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cd-hero-image-wrap">
            {c.image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={c.image_url} 
                alt={title} 
                className="cd-hero-img"
              />
            ) : (
              <div className="cd-hero-img-placeholder">
                <IconBook />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="cd-body">
        {/* Main */}
        <div className="cd-main">
          <div className="cd-card">
            <h2>Description</h2>
            {descParas.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="cd-card">
            <h2>What You&apos;ll Learn</h2>
            <ul className="cd-checklist">
              {learnItems.map((t, i) => <li key={i}><span className="cd-check"><IconCheck /></span>{t}</li>)}
            </ul>
          </div>

          <div className="cd-card">
            <h2>Requirements</h2>
            <ul className="cd-checklist">
              {reqItems.map((t, i) => <li key={i}><span className="cd-check"><IconCheck /></span>{t}</li>)}
            </ul>
          </div>

          <div className="cd-card">
            <h2>Who This Course Is For</h2>
            <ul className="cd-checklist">
              {whoItems.map((t, i) => <li key={i}><span className="cd-check"><IconCheck /></span>{t}</li>)}
            </ul>
          </div>

          <div className="cd-card cd-rich">
            <h2>{title} — Learn With Yaqeen Institute</h2>
            {contentParas ? (
              contentParas.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>If you want structured {title} lessons online, Yaqeen Institute offers a full program for learners of all ages. Our online classes help you learn with confidence, whether you are just starting out or deepening your existing knowledge.</p>
                <h3>Learn With Qualified, Caring Teachers</h3>
                <p>Our courses combine interactive lessons, practical exercises and clear, step-by-step explanations. Expert instructors guide you through each stage, helping you understand, practise and progress steadily from the fundamentals to real, practical skills.</p>
                <h3>Fun & Engaging Classes for Kids</h3>
                <p>We also offer online classes for kids with age-friendly lessons, visuals and simple explanations in an enjoyable way. Children begin to recognise and apply what they learn, building confidence as they grow.</p>
                <h3>Start Your Journey With Yaqeen Institute</h3>
                <p>Join Yaqeen Institute for engaging online classes with expert teachers and a clear curriculum, where students make steady, measurable progress.</p>
              </>
            )}
          </div>

          <div className="cd-card">
            <h2>Course Content</h2>
            <div className="cd-acc">
              {modules.map((m, i) => {
                const open = openContent === i;
                return (
                  <div className={`cd-acc-item ${open ? "open" : ""}`} key={i}>
                    <button type="button" className="cd-acc-q" onClick={() => setOpenContent(open ? null : i)} aria-expanded={open} suppressHydrationWarning>
                      <span>{m.t}</span>
                      <IconChevron className={`cd-acc-chevron ${open ? "open" : ""}`} />
                    </button>
                    {m.a && <div className={`cd-acc-a ${open ? "open" : ""}`}><div className="cd-acc-a-inner">{m.a}</div></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="cd-sidebar">
          <div className="cd-side-card cd-side-join">
            <h3>Ready to begin?</h3>
            <p>Book a free trial class and experience our teaching before you enrol.</p>
            <Link href="/book-free-trial" className="cd-side-btn">Join Us <IconArrow /></Link>
          </div>

          {others.length > 0 && (
            <div className="cd-side-card">
              <h4>Our Best Courses</h4>
              {others.map((o) => (
                <Link href={`/courses/${slugify(o.title)}`} className="cd-best-item" key={o.id}>
                  <Avatar url={o.image_url} />
                  <div className="cd-best-info">
                    <div className="t">{o.title}</div>
                    <div className="m">Learn More →</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* CTA */}
      <section className="cd-cta gold">
        <h2>With our help, you can become your own guiding star.</h2>
        <p>Let&apos;s get started — book your free trial class today.</p>
        <Link href="/book-free-trial" className="cd-cta-btn">Get Trial Class Now <IconArrow /></Link>
      </section>

      {/* FAQ */}
      <section className="cd-faq">
        <div className="cd-faq-head">
          <span className="cd-badge">Course FAQ</span>
          <h2>Your Course <span>Questions Answered</span></h2>
        </div>
        <div className="cd-faq-list">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div className={`cd-faq-item ${open ? "open" : ""}`} key={i}>
                <button type="button" className="cd-faq-q" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} suppressHydrationWarning>
                  <span>{f.q}</span>
                  <IconChevron className={`cd-acc-chevron ${open ? "open" : ""}`} />
                </button>
                {f.a && <div className={`cd-faq-a ${open ? "open" : ""}`}><div className="cd-faq-a-inner">{f.a}</div></div>}
              </div>
            );
          })}
        </div>
        <div className="cd-faq-btn-wrap">
          <Link href="/courses" className="cd-hero-btn">Browse Courses <IconArrow /></Link>
        </div>
      </section>
    </main>
  );
}
