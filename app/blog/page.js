"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./blog.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    {
      name: "All Posts",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      name: "Quran & Tafsir",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },
    {
      name: "Islamic Studies",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M12 2v19M5 21V10l7-5 7 5v11M9 21v-4a3 3 0 0 1 6 0v4" />
        </svg>
      )
    },
    {
      name: "Arabic Language",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      name: "Personal Development",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      name: "Tips for Parents",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  // Helper function to format ISO date to readable (e.g. May 12, 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("id, title, slug, category, read_time, author, created_at, featured_image, body")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        console.warn("Blogs table not found or empty. Using default fallback blog list.");
        // Fallback blog data matching the mockup details (12 posts across pages)
        setBlogs([
          {
            id: 1,
            title: "The Beauty of Tadabbur: Reflecting on the Quran",
            slug: "beauty-of-tadabbur-reflecting-on-the-quran",
            category: "Quran & Tafsir",
            read_time: "5 min read",
            author: "Yaqeen Team",
            created_at: "2024-05-12T00:00:00.000Z",
            featured_image: "/images/blog_quran.png",
            body: "Discover how deep reflection on the Quran can transform your heart and daily life."
          },
          {
            id: 2,
            title: "Building a Strong Connection with Allah",
            slug: "building-a-strong-connection-with-allah",
            category: "Islamic Studies",
            read_time: "6 min read",
            author: "Yaqeen Team",
            created_at: "2024-05-08T00:00:00.000Z",
            featured_image: "/images/blog_study.png",
            body: "Practical steps to strengthen your iman and stay consistent in your worship."
          },
          {
            id: 3,
            title: "Tips to Improve Your Arabic Every Day",
            slug: "tips-to-improve-your-arabic-every-day",
            category: "Arabic Language",
            read_time: "7 min read",
            author: "Yaqeen Team",
            created_at: "2024-05-02T00:00:00.000Z",
            featured_image: "/images/blog_values.png",
            body: "Simple daily habits that help you progress in understanding and speaking Arabic."
          },
          {
            id: 4,
            title: "Lessons from Surah Al-Fatiha",
            slug: "lessons-from-surah-al-fatiha",
            category: "Quran & Tafsir",
            read_time: "6 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-28T00:00:00.000Z",
            featured_image: "/images/blog_quran.png",
            body: "Timeless guidance to help us navigate life with clarity and purpose."
          },
          {
            id: 5,
            title: "The True Meaning of Tawakkul",
            slug: "the-true-meaning-of-tawakkul",
            category: "Islamic Studies",
            read_time: "5 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-22T00:00:00.000Z",
            featured_image: "/images/blog_study.png",
            body: "Understanding complete reliance on Allah and how it brings peace."
          },
          {
            id: 6,
            title: "Common Arabic Words Every Muslim Should Know",
            slug: "common-arabic-words-every-muslim-should-know",
            category: "Arabic Language",
            read_time: "6 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-18T00:00:00.000Z",
            featured_image: "/images/blog_values.png",
            body: "Build your vocabulary with essential words and their meanings."
          },
          {
            id: 7,
            title: "The Wisdom Behind Fasting in Ramadan",
            slug: "the-wisdom-behind-fasting-in-ramadan",
            category: "Islamic Studies",
            read_time: "6 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-15T00:00:00.000Z",
            featured_image: "/images/blog_study.png",
            body: "Explore the spiritual and physical benefits of fasting during Ramadan."
          },
          {
            id: 8,
            title: "Raising Righteous Children in Today's World",
            slug: "raising-righteous-children-in-today-s-world",
            category: "Tips for Parents",
            read_time: "5 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-10T00:00:00.000Z",
            featured_image: "/images/blog_values.png",
            body: "Practical tips to nurture faith and good character in your children."
          },
          {
            id: 9,
            title: "The Power of Istighfar in Daily Life",
            slug: "the-power-of-istighfar-in-daily-life",
            category: "Personal Development",
            read_time: "4 min read",
            author: "Yaqeen Team",
            created_at: "2024-04-05T00:00:00.000Z",
            featured_image: "/images/blog_quran.png",
            body: "How seeking forgiveness can bring tranquility and open doors of mercy."
          },
          {
            id: 10,
            title: "Tajweed Essentials for Beginners",
            slug: "tajweed-essentials-for-beginners",
            category: "Quran & Tafsir",
            read_time: "8 min read",
            author: "Yaqeen Team",
            created_at: "2024-03-28T00:00:00.000Z",
            featured_image: "/images/blog_quran.png",
            body: "A step-by-step guide to mastering the rules of Tajweed and improving your recitation."
          },
          {
            id: 11,
            title: "Understanding the Concept of Sabr",
            slug: "understanding-the-concept-of-sabr",
            category: "Islamic Studies",
            read_time: "5 min read",
            author: "Yaqeen Team",
            created_at: "2024-03-20T00:00:00.000Z",
            featured_image: "/images/blog_study.png",
            body: "Exploring the spiritual virtues of patience and endurance during times of trial."
          },
          {
            id: 12,
            title: "Arabic Grammar Made Easy",
            slug: "arabic-grammar-made-easy",
            category: "Arabic Language",
            read_time: "7 min read",
            author: "Yaqeen Team",
            created_at: "2024-03-12T00:00:00.000Z",
            featured_image: "/images/blog_values.png",
            body: "Key rules of Arabic sentence structure explained simply for beginners."
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const animatedElements = document.querySelectorAll(".reveal-fade, .reveal-slide-up, .reveal-stagger");
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [blogs, activeCategory, searchQuery, currentPage, loading]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Filter logic based on active category & search query
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === "All Posts" || blog.category === activeCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const postsPerPage = 9;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  return (
    <main className="blog-page-wrapper">
      <div className="blog-main-container">
        {/* =========================================================================
           1. HERO BANNER SECTION
           ========================================================================= */}
        <section className="blog-hero-section">
          <div className="blog-hero-content">
            {/* Breadcrumbs */}
            <div className="blog-breadcrumbs reveal-slide-up">
              <Link href="/">Home</Link>
              <span>&gt;</span>
              <span>Blog</span>
            </div>

            {/* Title & Underline Ornament */}
            <div className="blog-title-container reveal-slide-up">
              <h1 className="blog-hero-title">Blog</h1>
              <div className="blog-title-ornament">
                <div className="blog-ornament-diamond"></div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="blog-hero-subtitle reveal-slide-up">
              Insights to strengthen your faith, expand your knowledge, and inspire your journey.
            </p>
          </div>
        </section>

        {/* =========================================================================
           2. FILTER & SEARCH CONTROLS SECTION
           ========================================================================= */}
        <section className="blog-controls-section reveal-slide-up">
          <div className="blog-controls-container">
            {/* Category Pills list */}
            <div className="blog-categories-list">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`blog-category-pill ${
                    activeCategory === cat.name ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="blog-search-wrapper">
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="blog-search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
           3. BLOG CARDS GRID SECTION
           ========================================================================= */}
        <section className="blog-grid-section">
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--fg-muted)" }}>
              Loading publications...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                border: "1px dashed var(--card-border)",
                borderRadius: "20px",
                backgroundColor: "#FFFFFF"
              }}
            >
              <p style={{ color: "var(--fg-muted)", fontSize: "16px", marginBottom: "16px" }}>
                No publications match your filter or search query.
              </p>
              <button
                className="blog-category-pill active"
                style={{ margin: "0 auto", display: "inline-flex" }}
                onClick={() => {
                  setActiveCategory("All Posts");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="blog-posts-grid stagger-group">
                {currentBlogs.map((blog) => (
                  <Link
                    href={`/blog/${blog.slug}`}
                    key={blog.id}
                    className="reveal-stagger"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <article className="blog-card">
                      {/* Image Side */}
                      <div className="blog-card-image-box">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.featured_image || "/images/blog_bg.png"}
                          alt={blog.title}
                          className="blog-card-img"
                        />
                        {/* Category tag overlaid on top of image */}
                        {blog.category && (
                          <span className="blog-card-tag-floating">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      {/* Content Side */}
                      <div className="blog-card-content">
                        <div>
                          {/* Meta Information */}
                          <div className="blog-card-meta">
                            <span>{formatDate(blog.created_at)}</span>
                            <span className="blog-card-meta-dot"></span>
                            <span>{blog.read_time || "5 min read"}</span>
                          </div>

                          {/* Post Title */}
                          <h3 className="blog-card-title">
                            {blog.title}
                          </h3>

                          {/* Description */}
                          <p className="blog-card-desc">
                            {blog.body.replace(/<[^>]*>/g, "")}
                          </p>
                        </div>

                        {/* Read More Link */}
                        <div className="blog-card-link-wrapper">
                          <span className="blog-card-readmore">
                            Read More
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="blog-pagination">
                  <button
                    className="blog-pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`blog-pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    className="blog-pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
