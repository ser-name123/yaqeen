"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Fallback testimonials shown until admin-managed ones load (or if none target this page)
const DEFAULT_TESTIMONIALS = [
  {
    id: "default-1",
    name: "Ayesha Khan",
    role: "Mother of 2",
    content: "Yaqeen has helped my child develop a strong understanding of Islam in a fun and meaningful way. Highly recommended!",
    avatar_url: "/images/testi_ayesha.png"
  },
  {
    id: "default-2",
    name: "Hassan Ali",
    role: "Adult Learner",
    content: "The lessons are clear, engaging and practical. I appreciate how easy it is to stay consistent with my learning.",
    avatar_url: "/images/testi_hassan.png"
  },
  {
    id: "default-3",
    name: "Maryam Zahra",
    role: "Parent",
    content: "We love how the whole family can learn together. Yaqeen has brought us closer to our faith and each other.",
    avatar_url: "/images/testi_maryam.png"
  }
];

/**
 * Shared testimonials carousel.
 * @param {string} page - the page key used to match a testimonial's `page_target`
 *                        (e.g. "home", "about", "courses", "pricing").
 */
export default function TestimonialsCarousel({ page }) {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [perView, setPerView] = useState(3);
  const [current, setCurrent] = useState(0);

  // Load admin-managed testimonials and filter by the current page target
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
        if (data && data.length > 0) {
          const filtered = data.filter((t) => {
            if (!t.page_target) return false;
            const targets = t.page_target.split(",").map((x) => x.trim().toLowerCase());
            return targets.includes("all") || targets.includes(page);
          });
          if (active && filtered.length > 0) setTestimonials(filtered);
        }
      } catch (err) {
        console.warn("Could not load testimonials from Supabase, using defaults:", err);
      }
    }
    fetchTestimonials();
    return () => {
      active = false;
    };
  }, [page]);

  // Responsive: 3 cards per view on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w <= 640 ? 1 : w <= 1024 ? 2 : 3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pageCount = Math.max(1, Math.ceil(testimonials.length / perView));
  // Clamp during render so an out-of-range index (after a resize/refetch) never shows a blank slide
  const safeCurrent = Math.min(current, pageCount - 1);

  // Auto-advance
  useEffect(() => {
    if (pageCount <= 1) return undefined;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % pageCount);
    }, 6000);
    return () => clearInterval(id);
  }, [pageCount, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <>
      <div className="testi-viewport">
        <div
          className="testi-track"
          style={{ transform: `translateX(-${safeCurrent * 100}%)` }}
        >
          {testimonials.map((t) => (
            <div className="testi-slide" key={t.id} style={{ flex: `0 0 ${100 / perView}%` }}>
              <div className="testi-card">
                <span className="testi-quote-mark">&ldquo;</span>
                <p className="testi-text">{t.content}</p>
                <div className="testi-card-divider" />
                <div className="testi-author-row">
                  <div className="testi-avatar-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar_url || "/images/testi_ayesha.png"}
                      alt={t.name}
                      className="testi-avatar"
                    />
                  </div>
                  <div className="testi-author-info">
                    <span className="testi-author-name">{t.name}</span>
                    <span className="testi-author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <div className="testi-dots" style={{ marginTop: "28px" }}>
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to testimonials slide ${idx + 1}`}
              className={`testi-dot ${idx === safeCurrent ? "active" : ""}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      )}
    </>
  );
}
