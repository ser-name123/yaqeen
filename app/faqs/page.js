"use client";

import { useState } from "react";
import "./faqs.css";

const TABS = [
  { key: "about", label: "About the Academy" },
  { key: "courses", label: "Courses & Teaching" },
  { key: "access", label: "Scheduling & Access" },
  { key: "enrollment", label: "Fees & Enrollment" },
  { key: "teachers", label: "Teachers" }
];

const FAQS = {
  about: [
    { q: "What is Yaqeen Institute?", a: "Yaqeen Institute is an online Islamic academy offering live one-to-one and small-group classes in Quran, Arabic and Islamic Studies for students of all ages, anywhere in the world." },
    { q: "What makes your academy unique?", a: "Certified teachers, personalised learning plans, flexible 24/7 scheduling and a supportive, faith-centred environment tailored to each student set us apart." },
    { q: "Who operates the Academy?", a: "Yaqeen Institute is run by a dedicated team of qualified teachers, Islamic scholars and education professionals." },
    { q: "Where are you located?", a: "We are an online academy with a global presence — our teachers and students are spread across the UK, USA, Europe, the Middle East and beyond." },
    { q: "Can I try an online Quran class before enrolling?", a: "Yes. We offer a free trial class so you can experience our teaching before you enrol." },
    { q: "What is the ideal age to start classes?", a: "There is no fixed age — we teach children from around 4–5 years old right through to adults, tailoring every class to the learner." },
    { q: "Are Yaqeen Institute classes secure?", a: "Yes. Classes are held on secure platforms (Zoom or our portal) and your personal information is always kept private and safe." },
    { q: "How can I contact Yaqeen Institute?", a: "You can reach us anytime through our contact page, email or WhatsApp — we are always happy to help." },
    { q: "How quickly do you respond?", a: "Our team typically responds within 24 hours, and often much sooner." },
    { q: "Can I talk to a tutor before enrolling?", a: "Yes. Your free trial class is a great chance to meet a teacher and ask any questions before enrolling." },
    { q: "Do you support international time zones?", a: "Yes. We have teachers available 24/7 across different time zones to fit your schedule." },
    { q: "Can I leave feedback or a complaint?", a: "Absolutely. We welcome all feedback and complaints so we can keep improving — just contact our team." },
    { q: "How do I get help in urgent cases?", a: "For urgent matters, contact us via WhatsApp or email and we will prioritise your request." },
    { q: "Are your testimonials genuine?", a: "Yes. All testimonials are from real students and parents who have studied with us." },
    { q: "Can I send in my review?", a: "Yes. We would love to hear about your experience — you can share your review through our contact page." },
    { q: "Do you publish video testimonials?", a: "Yes. We share both written and video testimonials from our community where available." },
    { q: "How do you collect feedback?", a: "We collect feedback through progress reviews, messages from students and parents, and follow-ups from our team." },
    { q: "Do testimonials reflect current staff?", a: "Yes. Our testimonials reflect the ongoing quality of our current teachers and team." },
    { q: "Are all reviews published?", a: "We aim to share genuine reviews; occasionally some are kept private at the reviewer's request." }
  ],
  courses: [
    { q: "Are your instructors qualified?", a: "Yes. All our instructors are certified, experienced teachers of Quran, Tajweed, Arabic and Islamic Studies, carefully selected for both their knowledge and teaching ability." },
    { q: "What subjects do you offer?", a: "We offer Quran reading & recitation, Tajweed, Quran memorisation (Hifz), the Arabic language and Islamic Studies." },
    { q: "Are these classes based on age or level?", a: "Classes are based on each student's level and goals rather than age alone, so learners are always taught at the right pace." },
    { q: "Can I take more than one course at a time?", a: "Yes. You can enrol in multiple courses at once and we will build a schedule that works for you." },
    { q: "How long are the courses?", a: "Course length is flexible and depends on your goals — we offer both short-term and long-term learning plans." },
    { q: "Can I start anytime?", a: "Yes. You can begin at any time of the year; there are no fixed intake dates." },
    { q: "Are different languages used?", a: "Our teachers can explain lessons in English and other languages to make learning clear and comfortable for every student." },
    { q: "What application do I need for classes?", a: "Classes are held live via Zoom or our learning portal — you only need a device with a stable internet connection." },
    { q: "What does the Quran course cover?", a: "Correct pronunciation, Tajweed rules, fluent recitation and, if desired, memorisation (Hifz) with proper guidance." },
    { q: "What skills are taught in Arabic classes?", a: "Reading, writing, listening, speaking and grammar — building the foundation to understand the Quran and communicate in Arabic." },
    { q: "What is taught in Islamic Studies?", a: "Core beliefs (Aqeedah), worship (Fiqh), the life of the Prophet ﷺ (Seerah), manners (Akhlaq) and everyday Islamic practice." },
    { q: "Is the curriculum authentic?", a: "Yes. Our curriculum is based on authentic sources and taught by qualified scholars and teachers." },
    { q: "Will I get reports on student progress?", a: "Yes. We provide regular progress reports and teacher feedback so you always know how you or your child are doing." },
    { q: "Are certificates given?", a: "Yes. Certificates are awarded on completing key milestones and courses." },
    { q: "How long and frequent are the classes?", a: "Classes are typically 30–60 minutes and you can choose how many sessions per week suit you." },
    { q: "What topics are covered in your blog?", a: "Our blog covers Quran, Tajweed, Arabic learning tips, Islamic knowledge, parenting and student guidance." },
    { q: "How often is new content posted?", a: "We publish new articles regularly, so there is always fresh, beneficial content to read." },
    { q: "Who writes your blog posts?", a: "Our posts are written by knowledgeable teachers and contributors within the Yaqeen team." },
    { q: "Can I share your blog articles?", a: "Yes. You are welcome to share our articles with family and friends." },
    { q: "Can I suggest a topic?", a: "Of course. We love hearing from our community and welcome topic suggestions through our contact page." },
    { q: "Is the blog suitable for families?", a: "Yes. Our blog is family-friendly and beneficial for learners of all ages." }
  ],
  access: [
    { q: "What happens after I book a trial?", a: "After you book, our academic advisor contacts you within 24 hours to confirm your preferred time and match you with a suitable teacher for your free trial class." },
    { q: "Is the trial really free?", a: "Yes. The trial class is completely free — no card details or payment are required." },
    { q: "Can I choose the trial timing?", a: "Yes. You pick the day and time that suits you and we arrange a teacher available then." },
    { q: "Do I need to prepare anything?", a: "No special preparation is needed — just a device with a stable internet connection and Zoom installed." },
    { q: "What if I want to continue after the trial?", a: "If you enjoyed your trial, our advisor will help you enrol and set up a regular schedule that works for you." },
    { q: "Can I give feedback after my trial?", a: "Absolutely. We welcome your feedback after the trial so we can match you with the best teacher and learning plan." },
    { q: "What equipment do I need to teach?", a: "You need a laptop, tablet or smartphone with a stable internet connection, a headset and a quiet space — Zoom or our portal handles the rest." },
    { q: "How do I access or manage online class tools?", a: "Once enrolled, we share simple instructions and links for Zoom or our learning portal, and our support team is always available to help." }
  ],
  enrollment: [
    { q: "What are the tuition fees?", a: "Tuition fees depend on the course and the number of classes per week. Please visit our pricing page or contact us for a plan tailored to you." },
    { q: "Are there any hidden charges?", a: "No. Our pricing is fully transparent — the fee you see is what you pay, with no hidden charges." },
    { q: "Do you offer any discounts?", a: "Yes. We offer family and sibling discounts, along with occasional seasonal offers." },
    { q: "Is monthly payment available?", a: "Yes. You can pay conveniently on a monthly basis." },
    { q: "Can I change my package later?", a: "Yes. You can upgrade, downgrade or adjust your package at any time — just let our team know." },
    { q: "Do you offer refunds?", a: "Yes. Please contact our team to learn about our refund terms and eligibility." },
    { q: "Is online payment safe?", a: "Yes. All payments are processed through secure, trusted payment gateways to keep your information safe." }
  ],
  teachers: [
    { q: "How are your teachers hired?", a: "Teachers go through a careful selection process, including verification of qualifications, a subject and Tajweed assessment, a teaching demo and a character review before joining." },
    { q: "Are teachers trained for child instruction?", a: "Yes. Many of our teachers are experienced in teaching children, using patient, engaging and age-appropriate methods." },
    { q: "Can I select a preferred tutor?", a: "Yes. Wherever possible, we match you with your preferred tutor." },
    { q: "Where are your teachers located?", a: "Our teachers are based across the UK, the Middle East, South Asia and other regions, teaching students online worldwide." },
    { q: "Can I choose a male or female tutor?", a: "Yes. We have both male and female teachers and you may choose your preference." },
    { q: "Do teachers speak multiple languages?", a: "Yes. Many teachers speak English along with Arabic, Urdu and other languages to support diverse students." },
    { q: "How good is the teacher's English?", a: "Our teachers communicate clearly in English so lessons are easy to follow for English-speaking students." },
    { q: "How do I apply to become an online Quran Teacher with Yaqeen Institute?", a: "You can apply through our Teacher Application page — complete the form and upload your details, and our team will review your application." },
    { q: "What are the teaching expectations?", a: "Teachers are expected to be punctual, well-prepared, patient and committed to each student's progress, following our curriculum and values." },
    { q: "What equipment do I need to teach?", a: "A laptop or computer with a stable internet connection, a headset, a webcam and a quiet space are recommended." },
    { q: "What conduct is expected during class?", a: "We expect professional, respectful and Islamic conduct at all times, creating a safe and positive learning environment." },
    { q: "Can I reschedule or cancel a class?", a: "Yes. Classes can be rescheduled or cancelled with reasonable notice through our team." },
    { q: "How is teaching quality monitored?", a: "We monitor quality through student feedback, progress reports and periodic reviews to maintain high teaching standards." },
    { q: "Can I request more students or adjust teaching load?", a: "Yes. Teachers can request more students or adjust their teaching hours by contacting our team." },
    { q: "What should I do in case of a salary issue or delay?", a: "Please contact our administration team directly and we will resolve any salary matter promptly." },
    { q: "Can I take a vacation or adjust my schedule?", a: "Yes. Just inform us in advance and we will help arrange your leave or schedule changes." }
  ]
};

const IconSearch = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconChevron = ({ size = 22, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FaqsPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const changeTab = (key) => { setActiveTab(key); setOpenId(null); };

  const q = query.trim().toLowerCase();
  const items = FAQS[activeTab].filter(
    (f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  );

  return (
    <main className="faqp-page">
      {/* ===== SECTION 1: HERO ===== */}
      <section className="faqp-hero">
        <span className="faqp-badge">FAQs</span>
        <h1>Frequently Asked <span>Questions</span></h1>
        <div className="faqp-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>Everything you need to know about Yaqeen Institute — our courses, teachers, scheduling and enrolment. Can&apos;t find your answer? Reach out and we&apos;ll be happy to help.</p>
      </section>

      {/* ===== SECTION 2: FAQ ===== */}
      <section className="faqp-section">
        {/* Search */}
        <div className="faqp-search">
          <IconSearch />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
            placeholder="Search questions in this category…"
          />
        </div>

        {/* Tabs */}
        <div className="faqp-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              className={`faqp-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => changeTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="faqp-list">
          {items.length === 0 ? (
            <p className="faqp-empty">No questions match &ldquo;{query}&rdquo; in this category.</p>
          ) : (
            items.map((f, i) => {
              const id = `${activeTab}-${i}`;
              const open = openId === id;
              return (
                <div key={id} className={`faqp-item ${open ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faqp-q"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : id)}
                  >
                    <span>{f.q}</span>
                    <IconChevron className={`faqp-chevron ${open ? "open" : ""}`} />
                  </button>
                  <div className={`faqp-a ${open ? "open" : ""}`}>
                    <div className="faqp-a-inner">{f.a}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
