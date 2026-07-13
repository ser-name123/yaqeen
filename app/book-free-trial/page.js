"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./book-free-trial.css";
import { COUNTRIES, DIAL_CODES } from "./countries";

/* ---------------- Small inline icons ---------------- */
const IconSpark = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9L12 2Z" />
  </svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconClock = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconTeacher = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconArrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ---------------- Option data ---------------- */
const LEARN_OPTIONS = ["Quran", "Arabic Language", "Islamic Studies"];
const SESSION_FOR_OPTIONS = ["Myself", "A Family Member"];
const TEACHER_OPTIONS = ["Male", "Female", "Either"];
const SOURCE_OPTIONS = ["Friends", "Social Media", "Email", "Google", "Others"];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "30"];

const INITIAL_FORM = {
  firstName: "", lastName: "", email: "", dialCode: "", phone: "", country: "",
  learn: "", sessionFor: "", teacher: "", source: "",
  date: "", hh: "", mm: "", ap: ""
};

/* Reusable pill radio group */
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="bft-radio-grid">
      {options.map((opt) => (
        <label key={opt} className={`bft-radio ${value === opt ? "checked" : ""}`}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          <span className="dot" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* Custom dropdown with a capped, scrollable, searchable menu
   (native select popups can't be height-limited or searched) */
function CustomSelect({ value, onChange, options, placeholder, invalid, rootClassName = "", searchPlaceholder = "Search…" }) {
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

  // Focus the search box each time the menu opens (query is reset in the toggle handler)
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => searchRef.current && searchRef.current.focus(), 40);
    return () => clearTimeout(t);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  return (
    <div className={`bft-cs ${rootClassName}`} ref={ref}>
      <button
        type="button"
        className={`bft-select bft-cs-trigger ${invalid ? "invalid" : ""} ${open ? "open" : ""}`}
        onClick={() => { setQuery(""); setOpen((o) => !o); }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "bft-cs-ph"}>{selected ? selected.label : placeholder}</span>
        <svg className="bft-cs-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="bft-cs-menu">
          <div className="bft-cs-search">
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
          <ul className="bft-cs-list" role="listbox">
            {filtered.length === 0 ? (
              <li className="bft-cs-empty">No matches found</li>
            ) : (
              filtered.map((o) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  className={`bft-cs-option ${o.value === value ? "sel" : ""}`}
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

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function BookFreeTrialPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function detectCountry() {
      const res = await fetch("/api/detect-country").catch(() => null);
      if (res && res.ok) {
        try {
          const data = await res.json();
          if (data && data.success && data.country) {
            const matchedCountry = data.country;
            const match = COUNTRIES.find((c) => c.name.toLowerCase() === matchedCountry.toLowerCase());
            if (match) {
              setForm((f) => ({
                ...f,
                country: match.name,
                dialCode: match.dial
              }));
            }
          }
        } catch (e) {
          console.warn("Failed to parse detect-country API response on free-trial page", e);
        }
      }
    }
    detectCountry();
  }, []);

  useEffect(() => {
    if (mounted && formCardRef.current) {
      const timer = setTimeout(() => {
        const y = formCardRef.current.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: "auto" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const handleCountryChange = (cName) => {
    setForm((f) => {
      const match = COUNTRIES.find((c) => c.name === cName);
      return {
        ...f,
        country: cName,
        dialCode: match ? match.dial : f.dialCode
      };
    });
    if (errors.country) setErrors((e) => ({ ...e, country: "" }));
  };

  const handleDialCodeChange = (code) => {
    setForm((f) => {
      const match = COUNTRIES.find((c) => c.dial === code);
      return {
        ...f,
        dialCode: code,
        country: match ? match.name : f.country
      };
    });
    if (errors.country) setErrors((e) => ({ ...e, country: "" }));
  };
  const formCardRef = useRef(null);
  const router = useRouter();

  // Gently bring the form (just below the navbar) into view on step change — no jump to page top
  const scrollToForm = () => {
    if (!formCardRef.current) return;
    const y = formCardRef.current.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.country) e.country = "Please choose your country.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.learn) e.learn = "Please select what you'd like to learn.";
    if (!form.sessionFor) e.sessionFor = "Please select who this is for.";
    if (!form.teacher) e.teacher = "Please select a preferred teacher.";
    if (!form.date) {
      e.date = "Please choose a preferred date.";
    } else {
      const selected = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        e.date = "Preferred date cannot be in the past.";
      }
    }
    if (!form.hh || !form.mm || !form.ap) e.time = "Please choose a preferred time.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep1()) {
      setStep(2);
      scrollToForm();
    }
  };

  const goPrev = () => {
    setStep(1);
    scrollToForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          browser_info: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
          system_info: typeof navigator !== "undefined" ? navigator.platform : "Unknown"
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      scrollToForm();
      Swal.fire({
        title: "Free Trial Booked!",
        html: `JazakAllah Khair, <strong>${form.firstName}</strong>.<br/><br/>We've received your request and our academic advisor will contact you within 24 hours to confirm your class.`,
        icon: "success",
        confirmButtonColor: "#4A5D3B",
        confirmButtonText: "Ok"
      });
    } catch (err) {
      setSubmitError(err.message || "Could not submit your booking. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err.message || "Could not submit your booking. Please try again.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStep(1);
    setSubmitted(false);
    setSubmitError("");
  };

  if (!mounted) {
    return (
      <main className="bft-page">
        {/* ============ SECTION 1: HERO ============ */}
        <section className="bft-hero">
          <span className="bft-badge"><IconSpark /> Free Trial Class</span>
          <h1 className="bft-hero-title">
            Book Your <span>Free Trial</span> Class Today
          </h1>
          <div className="bft-hero-divider">
            <span className="line" /><span className="diamond" /><span className="line" />
          </div>
          <p className="bft-hero-sub" style={{ textAlign: "center", marginTop: "10px" }}>
            Loading booking form details, please wait...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bft-page">
      {/* ============ SECTION 1: HERO ============ */}
      <section className="bft-hero">
        <span className="bft-badge"><IconSpark /> Free Trial Class</span>
        <h1 className="bft-hero-title">
          Book Your <span>Free Trial</span> Class Today
        </h1>
        <div className="bft-hero-divider">
          <span className="line" /><span className="diamond" /><span className="line" />
        </div>
        <div className="bft-hero-stats">
          <span className="bft-stat"><IconCheck /> 100% Free, No Card Needed</span>
          <span className="bft-stat"><IconClock /> Flexible 24/7 Scheduling</span>
          <span className="bft-stat"><IconTeacher size={16} /> Certified Teachers</span>
        </div>
      </section>

      {/* ============ SECTION 2: THE FORM ============ */}
      <section className="bft-form-section">
        <div className="bft-form-card" ref={formCardRef}>
          {submitted ? (
            <div className="bft-success">
              <div className="bft-success-icon"><IconCheck size={40} /></div>
              <h3>Your Free Trial is Booked!</h3>
              <p>
                Thank you, {form.firstName}. We&apos;ve received your request and our academic advisor
                will contact you within 24 hours to confirm your class.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/" className="bft-btn bft-btn-secondary" style={{ textDecoration: "none" }}>Back to Home</Link>
                <button type="button" className="bft-btn bft-btn-primary" onClick={resetForm}>Book Another</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Progress */}
              <div className="bft-progress">
                <div className="bft-progress-labels">
                  <span className={`bft-progress-label ${step >= 1 ? "active" : ""}`}>Step 1 — Your Details</span>
                  <span className={`bft-progress-label ${step >= 2 ? "active" : ""}`}>Step 2 — Preferences</span>
                </div>
                <div className="bft-progress-track">
                  <span className={`bft-progress-node ${step >= 1 ? "active" : ""}`} />
                  <span className="bft-progress-line"><span className="fill" style={{ width: step >= 2 ? "100%" : "0%" }} /></span>
                  <span className={`bft-progress-node ${step >= 2 ? "active" : ""}`} />
                  <span className="bft-progress-line"><span className="fill" style={{ width: step >= 2 ? "100%" : "0%" }} /></span>
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="bft-form-title">Tell us about yourself</h2>

                  <div className="bft-row">
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">First Name<span className="req">*</span></label>
                      <input
                        className={`bft-input ${errors.firstName ? "invalid" : ""}`}
                        placeholder="First Name" value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                      />
                      {errors.firstName && <p className="bft-error">{errors.firstName}</p>}
                    </div>
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Last Name<span className="req">*</span></label>
                      <input
                        className={`bft-input ${errors.lastName ? "invalid" : ""}`}
                        placeholder="Last Name" value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                      />
                      {errors.lastName && <p className="bft-error">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="bft-field" style={{ marginTop: 20 }}>
                    <label className="bft-label">Email<span className="req">*</span></label>
                    <input
                      type="email"
                      className={`bft-input ${errors.email ? "invalid" : ""}`}
                      placeholder="Email address" value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && <p className="bft-error">{errors.email}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">Phone<span className="req">*</span></label>
                    <div className="bft-phone-group">
                      <CustomSelect
                        rootClassName="bft-cs-phone"
                        value={form.dialCode}
                        onChange={handleDialCodeChange}
                        options={DIAL_CODES.map((c) => ({ value: c, label: c }))}
                        placeholder="Code"
                        searchPlaceholder="Search code…"
                      />
                      <input
                        type="tel"
                        className={`bft-input ${errors.phone ? "invalid" : ""}`}
                        placeholder="Phone number" value={form.phone}
                        onChange={(e) => set("phone", e.target.value.replace(/[^\d\s-]/g, ""))}
                      />
                    </div>
                    {errors.phone && <p className="bft-error">{errors.phone}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">Country<span className="req">*</span></label>
                    <CustomSelect
                      value={form.country}
                      onChange={handleCountryChange}
                      options={[...COUNTRIES.map((c) => ({ value: c.name, label: c.name })), { value: "Other", label: "Other" }]}
                      placeholder="Choose your country"
                      invalid={!!errors.country}
                      searchPlaceholder="Search country…"
                    />
                    {errors.country && <p className="bft-error">{errors.country}</p>}
                  </div>

                  <div className="bft-actions end">
                    <button type="button" className="bft-btn bft-btn-primary" onClick={goNext}>
                      Next Step <IconArrow />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="bft-form-title">Your learning preferences</h2>

                  <div className="bft-field">
                    <label className="bft-label">What would you like to learn?<span className="req">*</span></label>
                    <RadioGroup name="learn" options={LEARN_OPTIONS} value={form.learn} onChange={(v) => set("learn", v)} />
                    {errors.learn && <p className="bft-error">{errors.learn}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">This trial session is for<span className="req">*</span></label>
                    <RadioGroup name="sessionFor" options={SESSION_FOR_OPTIONS} value={form.sessionFor} onChange={(v) => set("sessionFor", v)} />
                    {errors.sessionFor && <p className="bft-error">{errors.sessionFor}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">Your preferred teacher<span className="req">*</span></label>
                    <RadioGroup name="teacher" options={TEACHER_OPTIONS} value={form.teacher} onChange={(v) => set("teacher", v)} />
                    {errors.teacher && <p className="bft-error">{errors.teacher}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">How did you find us?</label>
                    <RadioGroup name="source" options={SOURCE_OPTIONS} value={form.source} onChange={(v) => set("source", v)} />
                  </div>

                  <div className="bft-row" style={{ alignItems: "flex-start" }}>
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Preferred Date<span className="req">*</span></label>
                      <input
                        type="date"
                        className={`bft-input ${errors.date ? "invalid" : ""}`}
                        value={form.date} onChange={(e) => set("date", e.target.value)}
                        min={getTodayString()}
                      />
                      {errors.date && <p className="bft-error">{errors.date}</p>}
                    </div>
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Preferred Time<span className="req">*</span></label>
                      <div className="bft-time-group">
                        <select className={`bft-select ${errors.time ? "invalid" : ""}`} value={form.hh} onChange={(e) => set("hh", e.target.value)}>
                          <option value="">HH</option>
                          {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <select className={`bft-select ${errors.time ? "invalid" : ""}`} value={form.mm} onChange={(e) => set("mm", e.target.value)}>
                          <option value="">MM</option>
                          {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select className={`bft-select ${errors.time ? "invalid" : ""}`} value={form.ap} onChange={(e) => set("ap", e.target.value)}>
                          <option value="">AM/PM</option>
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      {errors.time && <p className="bft-error">{errors.time}</p>}
                    </div>
                  </div>

                  {submitError && <p className="bft-error" style={{ marginTop: 18, fontSize: 13.5 }}>{submitError}</p>}

                  <div className="bft-actions">
                    <button type="button" className="bft-btn bft-btn-secondary" onClick={goPrev}>Previous</button>
                    <button type="submit" className="bft-btn bft-btn-primary" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit Booking"} {!submitting && <IconArrow />}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
