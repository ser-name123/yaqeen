"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Reusable searchable dropdown with a height-capped, scrollable menu.
 * Native <select> popups can't be height-limited or searched, so this replaces them.
 *
 * @param {string} value
 * @param {(v:string)=>void} onChange
 * @param {Array<{value:string,label:string}>} options
 * @param {string} placeholder
 * @param {boolean} invalid
 * @param {string} searchPlaceholder
 * @param {string} rootClassName
 */
export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  invalid = false,
  searchPlaceholder = "Search…",
  rootClassName = ""
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => searchRef.current && searchRef.current.focus(), 40);
    return () => clearTimeout(t);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  return (
    <div className={`ss ${rootClassName}`} ref={ref}>
      <button
        type="button"
        className={`ss-trigger ${invalid ? "invalid" : ""} ${open ? "open" : ""}`}
        onClick={() => { setQuery(""); setOpen((o) => !o); }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "ss-ph"}>{selected ? selected.label : placeholder}</span>
        <svg className="ss-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="ss-menu">
          <div className="ss-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={query}
              placeholder={searchPlaceholder}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="ss-list" role="listbox">
            {filtered.length === 0 ? (
              <li className="ss-empty">No matches found</li>
            ) : (
              filtered.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  className={`ss-option ${o.value === value ? "sel" : ""}`}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                >
                  {o.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
