"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./blog-details.css";

// Rich fallback article to match mockup screenshots exactly
const fallbackArticle = {
  id: 1,
  title: "The Beauty of Tadabbur: Reflecting on the Quran",
  slug: "beauty-of-tadabbur-reflecting-on-the-quran",
  category: "Quran & Tafsir",
  read_time: "5 min read",
  author: "Yaqeen Institute Team",
  created_at: "2024-05-12T00:00:00.000Z",
  featured_image: "/images/blog_quran.png",
  quote: "Do they not then reflect on the Quran, or are there locks upon their hearts?",
  quote_source: "Quran (47:24)",
  body: "Tadabbur is more than just reading the Quran — it is reflecting, pondering, and connecting with its meanings. When we take time to understand the words of Allah, the Quran transforms from a book we recite into a light that guides our hearts and lives.",
  sections: [
    {
      title: "What is Tadabbur?",
      content: "Tadabbur means to deeply contemplate the verses of the Quran and think about their meanings, lessons, and how they apply to our daily lives. Allah invites us to reflect so that we may gain understanding and grow in faith."
    },
    {
      title: "Why is it Important?",
      content: "When we practice Tadabbur, our connection with Allah becomes stronger. It helps us make better decisions, find comfort in difficult times, and live with purpose and clarity."
    },
    {
      title: "How to Practice Tadabbur",
      content: "Start by reading a verse slowly, look up its meaning, reflect on the lesson, and ask yourself how you can apply it. Make dua for understanding and consistency."
    },
    {
      title: "Benefits of Tadabbur",
      content: "It softens the heart, increases mindfulness in prayer, and provides divine light to navigate contemporary intellectual challenges with sound logic."
    },
    {
      title: "Conclusion",
      content: "Reflecting on the Quran is a lifelong journey. Start with just a few minutes a day, and watch how it illuminates your pathway and brings you closer to your Creator."
    }
  ],
  second_quote: "And We have certainly made the Quran easy for remembrance, so is there any who will remember?",
  second_quote_source: "Quran (54:17)"
};

// Fallback related posts
const fallbackRelated = [
  {
    title: "Building a Strong Connection with Allah",
    slug: "building-a-strong-connection-with-allah",
    created_at: "2024-05-08T00:00:00.000Z",
    read_time: "6 min read",
    featured_image: "/images/blog_study.png"
  },
  {
    title: "Tips to Improve Your Arabic Every Day",
    slug: "tips-to-improve-your-arabic-every-day",
    created_at: "2024-05-02T00:00:00.000Z",
    read_time: "7 min read",
    featured_image: "/images/blog_values.png"
  },
  {
    title: "Lessons from Surah Al-Fatiha",
    slug: "lessons-from-surah-al-fatiha",
    created_at: "2024-04-28T00:00:00.000Z",
    read_time: "6 min read",
    featured_image: "/images/blog_quran.png"
  }
];

// Fallback next/prev posts
const fallbackPrev = {
  title: "The Importance of Tajweed in Recitation",
  slug: "tajweed-essentials-for-beginners",
  created_at: "2024-04-22T00:00:00.000Z",
  featured_image: "/images/blog_values.png"
};

const fallbackNext = {
  title: "How to Connect with the Quran Daily",
  slug: "beauty-of-tadabbur-reflecting-on-the-quran",
  created_at: "2024-05-15T00:00:00.000Z",
  featured_image: "/images/blog_quran.png"
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareFeedback, setShareFeedback] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Decorative Section Icons matching mockup index
  const sectionIcons = [
    // Book icon
    <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    // Rosette / Sun icon
    <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>,
    // Heart hands icon
    <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
    // Shield Check icon
    <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>,
    // Flag icon
    <svg key="5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>
  ];

  // Helper function to format ISO date to readable (e.g. May 12, 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    async function fetchBlogDetail() {
      try {
        setLoading(true);
        // 1. Fetch Main Blog Content
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;

        // Ensure sections array exists, otherwise load fallback
        const finalBlog = {
          ...data,
          sections: data.sections && data.sections.length > 0 ? data.sections : fallbackArticle.sections,
          second_quote: data.second_quote || fallbackArticle.second_quote,
          second_quote_source: data.second_quote_source || fallbackArticle.second_quote_source
        };
        setBlog(finalBlog);

        // 2. Fetch Related articles (latest 3 excluding current slug)
        const { data: relatedData } = await supabase
          .from("blogs")
          .select("title, slug, created_at, read_time, featured_image")
          .neq("slug", slug)
          .order("created_at", { ascending: false })
          .limit(3);

        setRelated(relatedData && relatedData.length > 0 ? relatedData : fallbackRelated);

        // 3. Fetch Prev article (older than current)
        const { data: prevData } = await supabase
          .from("blogs")
          .select("title, slug, created_at, featured_image")
          .lt("created_at", data.created_at)
          .order("created_at", { ascending: false })
          .limit(1);

        setPrevPost(prevData && prevData.length > 0 ? prevData[0] : fallbackPrev);

        // 4. Fetch Next article (newer than current)
        const { data: nextData } = await supabase
          .from("blogs")
          .select("title, slug, created_at, featured_image")
          .gt("created_at", data.created_at)
          .order("created_at", { ascending: true })
          .limit(1);

        setNextPost(nextData && nextData.length > 0 ? nextData[0] : fallbackNext);

      } catch (err) {
        console.warn("Blog post not found in Supabase. Using fallback seed article.");
        setBlog(fallbackArticle);
        setRelated(fallbackRelated);
        setPrevPost(fallbackPrev);
        setNextPost(fallbackNext);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  // Social Share event handlers
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback("Link copied to clipboard!");
      setTimeout(() => setShareFeedback(""), 3000);
    }
  };

  const handleShareFacebook = () => {
    if (typeof window !== "undefined") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
    }
  };

  const handleShareX = () => {
    if (typeof window !== "undefined") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog?.title || "")}`, "_blank");
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent((blog?.title || "") + " " + window.location.href)}`, "_blank");
    }
  };

  // Newsletter Submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fdfcf9", color: "#2c2c2c" }}>
        <p>Loading publication content...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fdfcf9", color: "#2c2c2c", gap: "16px" }}>
        <h2>Publication Not Found</h2>
        <Link href="/blog" className="btn-primary">Back to Publications</Link>
      </div>
    );
  }

  return (
    <article className="blog-details-page">
      {/* Background mosque watermark decorative graphic */}
      <svg className="blog-details-bg-mosque" viewBox="0 0 300 200">
        <path d="M 0 200 L 0 100 Q 15 80 30 100 L 30 200 Z" fill="currentColor" />
        <path d="M 30 200 L 30 120 L 45 90 L 60 120 L 60 200 Z" fill="currentColor" />
        <path d="M 60 200 L 60 50 Q 80 20 100 50 L 100 200 Z" fill="currentColor" />
        <path d="M 100 200 L 100 130 Q 115 100 130 130 L 130 200 Z" fill="currentColor" />
        <circle cx="80" cy="30" r="3" fill="currentColor" />
        <path d="M 200 200 L 200 140 Q 215 110 230 140 L 230 200 Z" fill="currentColor" />
        <path d="M 230 200 L 230 80 Q 250 50 270 80 L 270 200 Z" fill="currentColor" />
        <path d="M 270 200 L 270 110 L 285 80 L 300 110 L 300 200 Z" fill="currentColor" />
        <path d="M 160 50 A 15 15 0 1 0 175 75 A 12 12 0 1 1 160 50 Z" fill="currentColor" />
      </svg>

      <div className="blog-details-grid">
        {/* =====================================================================
           LEFT COLUMN - MAIN ARTICLE
           ===================================================================== */}
        <div className="blog-details-left-col">
          {/* Breadcrumbs */}
          <div className="blog-details-breadcrumbs">
            <Link href="/">Home</Link>
            <span className="separator">&gt;</span>
            <Link href="/blog">Blog</Link>
            <span className="separator">&gt;</span>
            <span className="current">{blog.title}</span>
          </div>

          {/* Category Pill */}
          <span className="blog-details-category">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="blog-details-title">{blog.title}</h1>

          {/* Metadata */}
          <div className="blog-details-meta">
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="meta-dot"></div>
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>{blog.read_time}</span>
            </div>
            <div className="meta-dot"></div>
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>{blog.author}</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="blog-details-image-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="blog-details-image"
                src={blog.featured_image}
                alt={blog.title}
              />
            </div>
          )}

          {/* Callout Quote 1 */}
          {blog.quote && (
            <div className="blog-details-quote-box">
              <span className="quote-icon">“</span>
              <div className="quote-content">
                <p className="quote-text">&ldquo;{blog.quote}&rdquo;</p>
                {blog.quote_source && <span className="quote-source">— {blog.quote_source}</span>}
              </div>
            </div>
          )}

          {/* Body Intro Text */}
          <div className="blog-details-body-intro" dangerouslySetInnerHTML={{ __html: blog.body }} />

          {/* Accordion Sections list */}
          {blog.sections && blog.sections.length > 0 && (
            <div className="blog-details-sections-list">
              {blog.sections.map((section, idx) => (
                <div key={idx} id={`section-${idx}`}>
                  <div className="blog-details-section-item">
                    <div className={`icon-circle ${idx % 2 === 0 ? 'color-green' : 'color-gold'}`}>
                      {sectionIcons[idx % sectionIcons.length]}
                    </div>
                    <div className="blog-details-section-content">
                      <h3 className="blog-details-section-title">{section.title}</h3>
                      <p className="blog-details-section-body">{section.content}</p>
                    </div>
                  </div>
                  {idx < blog.sections.length - 1 && (
                    <div className="blog-details-section-divider">
                      <div className="divider-line"></div>
                      <div className="divider-diamond"></div>
                      <div className="divider-line"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Second Quote Box */}
          {blog.second_quote && (
            <div className="blog-details-second-quote">
              <div className="quote-icon-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path></svg>
              </div>
              <div className="quote-content">
                <p className="quote-text">&ldquo;{blog.second_quote}&rdquo;</p>
                {blog.second_quote_source && <span className="quote-source">— {blog.second_quote_source}</span>}
              </div>
            </div>
          )}

          {/* Closing remark */}
          <p className="blog-details-closing">
            May Allah grant us hearts that reflect, understand, and act upon His words. Ameen.
          </p>

          {/* Tags */}
          <div className="blog-details-tags-row">
            <span className="label">Tags:</span>
            <div className="tags-list">
              {['Tadabbur', 'Quran', 'Reflection', 'Faith', 'Guidance'].map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>

          {/* Next / Previous post selection row */}
          <div className="blog-details-nav-box">
            {prevPost && (
              <Link href={`/blog/${prevPost.slug}`} className="blog-details-nav-card prev-card">
                <div className="nav-img-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={prevPost.featured_image || "/images/blog_bg.png"} alt={prevPost.title} className="nav-img" />
                </div>
                <div className="nav-info">
                  <span className="nav-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Previous Article
                  </span>
                  <h5 className="nav-title">{prevPost.title}</h5>
                  <span className="nav-date">{formatDate(prevPost.created_at)}</span>
                </div>
              </Link>
            )}

            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="blog-details-nav-card next-card">
                <div className="nav-info" style={{ alignItems: "flex-end", textAlign: "right" }}>
                  <span className="nav-label">
                    Next Article
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                  <h5 className="nav-title">{nextPost.title}</h5>
                  <span className="nav-date">{formatDate(nextPost.created_at)}</span>
                </div>
                <div className="nav-img-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={nextPost.featured_image || "/images/blog_bg.png"} alt={nextPost.title} className="nav-img" />
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* =====================================================================
           RIGHT COLUMN - SIDEBAR WIDGETS
           ===================================================================== */}
        <div className="blog-details-sidebar">
          {/* Card 1: Table of Contents */}
          {blog.sections && blog.sections.length > 0 && (
            <div className="sidebar-panel-card">
              <div className="sidebar-card-header">
                <div className="header-icon-title">
                  <div className="header-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </div>
                  <h4 className="header-title">Table of Contents</h4>
                </div>
                <div className="sidebar-header-divider">
                  <div className="divider-line"></div>
                  <div className="divider-diamond"></div>
                  <div className="divider-line"></div>
                </div>
              </div>
              <ul className="toc-list">
                {blog.sections.map((section, idx) => (
                  <li key={idx}>
                    <a href={`#section-${idx}`} className="toc-link">
                      <span className="number">0{idx + 1}</span>
                      <span className="text">{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Card 2: Share this article */}
          <div className="sidebar-panel-card">
            <div className="sidebar-card-header">
              <div className="header-icon-title">
                <div className="header-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </div>
                <h4 className="header-title">Share this article</h4>
              </div>
              <div className="sidebar-header-divider">
                <div className="divider-line"></div>
                <div className="divider-diamond"></div>
                <div className="divider-line"></div>
              </div>
            </div>
            <div className="share-buttons-row">
              <button className="share-circle-btn" onClick={handleShareFacebook} title="Share on Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-2.5 0-5 1.5-5 5v2z"></path></svg>
              </button>
              <button className="share-circle-btn" onClick={handleShareX} title="Share on X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.7l-5.2-6.8-6 6.8H1.6l7.6-8.7L1 2.4h6.9l4.7 6.2 5.6-6.2zm-1.2 17.6h1.8L7.1 4.7H5.2l11.8 15.3z"></path></svg>
              </button>
              <button className="share-circle-btn" onClick={handleShareWhatsApp} title="Share on WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.143 1.233 8.38 3.473 2.237 2.24 3.466 5.221 3.466 8.39 0 6.533-5.325 11.857-11.857 11.857-2.004-.002-3.973-.509-5.731-1.47L0 24zm6.59-4.846c1.6.95 2.519 1.334 4.546 1.335 5.539 0 10.05-4.512 10.05-10.05 0-2.694-1.047-5.224-2.952-7.127C16.335 1.41 13.81 .363 11.117.363c-5.541 0-10.056 4.515-10.056 10.057 0 2.184.569 3.258 1.566 4.976L1.58 21.06l4.067-1.906zm13.124-7.593c-.11-.18-.4-.29-.85-.515-.45-.225-2.66-1.312-3.072-1.462-.413-.15-.713-.225-.975.17-.262.395-1.012 1.275-1.237 1.537-.225.262-.45.29-.9.065-.45-.225-1.9-1-3.623-2.54-1.34-1.196-2.245-2.67-2.507-3.12-.262-.45-.028-.693.197-.917.202-.202.45-.525.675-.788.225-.262.3-.45.45-.75.15-.3.075-.562-.038-.788-.112-.225-.975-2.35-1.337-3.225-.353-.85-.712-.734-.975-.75-.25-.015-.537-.015-.825-.015-.287 0-.75.108-1.143.533-.393.425-1.5 1.462-1.5 3.562 0 2.1 1.525 4.125 1.737 4.412.213.288 3.003 4.585 7.275 6.425 1.015.438 1.808.699 2.425.895 1.02.324 1.95.278 2.68.169.814-.121 2.66-1.087 3.035-2.087.375-1 1-2.738.675-2.925z"></path></svg>
              </button>
              <button className="share-circle-btn" onClick={handleCopyLink} title="Copy Link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </button>
            </div>
            {shareFeedback && <div className="share-feedback-text">{shareFeedback}</div>}
          </div>

          {/* Card 3: Related Articles */}
          {related && related.length > 0 && (
            <div className="sidebar-panel-card">
              <div className="sidebar-card-header">
                <div className="header-icon-title">
                  <div className="header-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  </div>
                  <h4 className="header-title">Related Articles</h4>
                </div>
                <div className="sidebar-header-divider">
                  <div className="divider-line"></div>
                  <div className="divider-diamond"></div>
                  <div className="divider-line"></div>
                </div>
              </div>
              <div className="related-list">
                {related.map((item, idx) => (
                  <Link href={`/blog/${item.slug}`} key={idx} className="related-item-card">
                    <div className="img-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.featured_image || "/images/blog_bg.png"} alt={item.title} />
                    </div>
                    <div className="info-wrapper">
                      <h5 className="related-title">{item.title}</h5>
                      <span className="related-meta">{formatDate(item.created_at)} &bull; {item.read_time}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Card 4: Stay Inspired */}
          <div className="sidebar-panel-card">
            <div className="sidebar-card-header">
              <div className="header-icon-title">
                <div className="header-icon-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <h4 className="header-title">Stay Inspired</h4>
              </div>
              <div className="sidebar-header-divider">
                <div className="divider-line"></div>
                <div className="divider-diamond"></div>
                <div className="divider-line"></div>
              </div>
            </div>
            <p className="newsletter-desc">Get the latest articles and updates delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form-wrapper">
              <input
                type="email"
                required
                className="newsletter-input"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="newsletter-submit-btn">Subscribe</button>
            </form>
            {newsletterSuccess && (
              <div className="newsletter-success">
                JazakAllah! Thank you for subscribing.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
