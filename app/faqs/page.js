"use client";

import { useState } from "react";
import "./faqs.css";
import { usePageContent } from "@/lib/use-page-content";

const IconStar = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconChat = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const IconUsers = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconHeart = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
const IconUser = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconBook = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);

const getFaqIcon = (index) => {
  const icons = [
    <IconStar key="star" />,
    <IconChat key="chat" />,
    <IconUsers key="users" />,
    <IconHeart key="heart" />,
    <IconUser key="user" />,
    <IconBook key="book" />
  ];
  return icons[index % icons.length];
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
  const content = usePageContent("faqs");
  const tabs = content.tabs || [];
  const [activeTab, setActiveTab] = useState(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const changeTab = (key) => { setActiveTab(key); setOpenId(null); };

  const currentKey = activeTab || tabs[0]?.key;
  const activeItems = (tabs.find((t) => t.key === currentKey)?.items) || [];

  const q = query.trim().toLowerCase();
  const items = activeItems.filter(
    (f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  );

  return (
    <main className="faqp-page">
      {/* ===== SECTION 1: HERO ===== */}
      <section className="faqp-hero">
        <span className="faqp-badge">{content.hero?.badge}</span>
        <h1>{content.hero?.title} <span>{content.hero?.title_highlight}</span></h1>
        <div className="faqp-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <p>{content.hero?.description}</p>
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
            placeholder={content.search_placeholder || "Search questions in this category…"}
          />
        </div>

        {/* Tabs */}
        <div className="faqp-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={currentKey === t.key}
              className={`faqp-tab ${currentKey === t.key ? "active" : ""}`}
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
              const id = `${currentKey}-${i}`;
              const open = openId === id;
              return (
                <div key={id} className={`faqp-item ${open ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faqp-q"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : id)}
                    suppressHydrationWarning
                  >
                    <span className="faqp-faq-icon">{getFaqIcon(i)}</span>
                    <span className="faqp-qtext">{f.q}</span>
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
