"use client";

import { useState, useEffect } from "react";

/**
 * Sticky table of contents with scroll-spy — highlights the section
 * currently in view as the user scrolls.
 */
export default function PrivacyToc({ items }) {
  const [active, setActive] = useState(items[0] ? items[0].id : null);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (els.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -68% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="pp-toc">
      <h4>On this page</h4>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={active === it.id ? "active" : ""}>{it.label}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
