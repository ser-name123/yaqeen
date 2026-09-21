"use client";

import { useState, useEffect } from "react";
import { PAGE_DEFAULTS, mergePageContent } from "@/lib/pages";

// Client hook: fetch a page's editable content from the public API, falling
// back to the in-code defaults so the page always renders (even offline / pre-DB).
export function usePageContent(slug) {
  const [content, setContent] = useState(() => PAGE_DEFAULTS[slug] || {});

  useEffect(() => {
    let alive = true;
    fetch(`/api/pages?page=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.success && d.content) setContent(d.content);
      })
      .catch(() => {
        // keep defaults on any error
        if (alive) setContent(mergePageContent(slug, null));
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  return content;
}
