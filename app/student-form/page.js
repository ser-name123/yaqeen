"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import "./student-form.css";
import { COUNTRIES, DIAL_CODES } from "../book-free-trial/countries";

/* ---------------- Reusable Icons matching book-free-trial ---------------- */
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

const AGE_GROUPS = [
  "5-10 years",
  "11-15 years",
  "16-20 years",
  "21+ years"
];

const COURSES = [
  "Quran",
  "Arabic Language",
  "Islamic Studies"
];

const DEFAULT_PLANS = [
  { name: "Basic", price: "8" },
  { name: "Essential", price: "9" },
  { name: "Premium", price: "11" },
  { name: "Platinum", price: "14" }
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* Custom dropdown with scrollable searchable menu (consistent with book-free-trial) */
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

export default function StudentFormPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState([]);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [mobile, setMobile] = useState("");
  
  const [course, setCourse] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(null); // No default selected hour
  const [pricingPlan, setPricingPlan] = useState("");
  const [preferredDays, setPreferredDays] = useState([]);
  const [preferredDate, setPreferredDate] = useState("");
  const [timeHH, setTimeHH] = useState("");
  const [timeMM, setTimeMM] = useState("");
  const [timeAP, setTimeAP] = useState("AM");

  const [errors, setErrors] = useState({});
  const formCardRef = useRef(null);
  const router = useRouter();

  // Smooth scroll
  const scrollToForm = () => {
    if (!formCardRef.current) return;
    const y = formCardRef.current.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Auto-detect country based on IP and load database pricing plans on page load
  useEffect(() => {
    setMounted(true);

    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from("pricing_plans")
          .select("*")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      } catch (err) {
        console.warn("Could not load pricing plans from Supabase, using defaults:", err);
        setPlans(DEFAULT_PLANS);
      }
    }

    async function detectCountry() {
      const res = await fetch("/api/detect-country").catch((err) => {
        console.warn("Local detect-country API fetch failed", err);
        return null;
      });

      if (res && res.ok) {
        try {
          const data = await res.json();
          if (data && data.success && data.country) {
            const matchedCountry = data.country;
            const match = COUNTRIES.find((c) => c.name.toLowerCase() === matchedCountry.toLowerCase());
            if (match) {
              setCountry(match.name);
              setDialCode(match.dial);
            }
          }
        } catch (e) {
          console.warn("Failed to parse detect-country JSON response", e);
        }
      }
    }

    fetchPlans();
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

  // Synchronized Selection: Country -> Dial Code
  const handleCountryChange = (cName) => {
    setCountry(cName);
    if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
    
    const match = COUNTRIES.find((c) => c.name === cName);
    if (match) {
      setDialCode(match.dial);
    }
  };

  // Synchronized Selection: Dial Code -> Country
  const handleDialCodeChange = (code) => {
    setDialCode(code);
    
    // Find the first country matching this dial code
    const match = COUNTRIES.find((c) => c.dial === code);
    if (match) {
      setCountry(match.name);
      if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  // Toggle Preferred Day
  const handleDayToggle = (day) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else {
      if (!hoursPerWeek) {
        Swal.fire({
          title: "Select Hours First",
          text: "Please select how many hours per week you want first.",
          icon: "warning",
          confirmButtonColor: "#4A5D3B"
        });
        return;
      }
      if (preferredDays.length >= hoursPerWeek) {
        Swal.fire({
          title: "Limit Reached",
          text: `You can only select up to ${hoursPerWeek} day(s) based on your ${hoursPerWeek} hour(s) per week plan.`,
          icon: "info",
          confirmButtonColor: "#4A5D3B"
        });
        return;
      }
      setPreferredDays([...preferredDays, day]);
    }
  };

  // Calculate price per month for a plan
  const calculateMonthlyPrice = (rate) => {
    return hoursPerWeek ? hoursPerWeek * rate * 4 : 0;
  };

  // Selected plan's final price
  const getSelectedPlanPrice = () => {
    const selected = plans.find((p) => p.name === pricingPlan);
    return selected ? calculateMonthlyPrice(Number(selected.price)) : 0;
  };

  // Validate Step 1
  const validateStep1 = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!ageGroup) e.ageGroup = "Age group is required.";
    if (!gender) e.gender = "Gender is required.";
    if (!mobile.trim()) e.mobile = "Mobile number is required.";
    if (!country) e.country = "Country is required.";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const e = {};
    if (!course) e.course = "Please select a course.";
    if (!hoursPerWeek) e.hoursPerWeek = "Please select how many hours per week.";
    if (!pricingPlan) e.pricingPlan = "Please select a pricing plan.";
    if (preferredDays.length === 0) e.preferredDays = "Please select at least one day.";
    if (!preferredDate) e.preferredDate = "Please choose a start date.";
    if (!timeHH || !timeMM || !timeAP) e.time = "Please choose a preferred time.";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      scrollToForm();
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    scrollToForm();
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    const formattedTime = `${timeHH}:${timeMM} ${timeAP}`;
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      age_group: ageGroup,
      gender: gender,
      dial_code: dialCode,
      mobile: mobile,
      country: country,
      course: course,
      hours_per_week: hoursPerWeek,
      pricing_plan: pricingPlan,
      monthly_price: getSelectedPlanPrice(),
      preferred_days: preferredDays,
      preferred_date: preferredDate,
      preferred_time: formattedTime
    };

    try {
      const res = await fetch("/api/student-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        router.push("/book-free-trial/thank-you");
      } else {
        throw new Error(result.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Student form submit error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err.message || "An error occurred while submitting your registration.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="bft-page student-form-page">
        {/* ============ SECTION 1: HERO ============ */}
        <section className="bft-hero">
          <span className="bft-badge"><IconSpark /> Student Admission</span>
          <h1 className="bft-hero-title">
            Register as a <span>Student</span> Today
          </h1>
          <div className="bft-hero-divider">
            <span className="line" /><span className="diamond" /><span className="line" />
          </div>
          <p className="bft-hero-sub">
            Loading admission form details, please wait...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bft-page student-form-page">
      {/* ============ SECTION 1: HERO ============ */}
      <section className="bft-hero">
        <span className="bft-badge"><IconSpark /> Student Admission</span>
        <h1 className="bft-hero-title">
          Register as a <span>Student</span> Today
        </h1>
        <div className="bft-hero-divider">
          <span className="line" /><span className="diamond" /><span className="line" />
        </div>
        <p className="bft-hero-sub">
          Register below in a few simple steps. Select your preferred course, weekly schedule, and package to begin your online live classes.
        </p>
      </section>

      {/* ============ SECTION 2: THE FORM ============ */}
      <section className="bft-form-section" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="bft-form-card" ref={formCardRef} style={{ width: "100%", maxWidth: "680px" }}>
          {submitted ? (
            <div className="bft-success">
              <div className="bft-success-icon"><IconCheck size={40} /></div>
              <h3>Registration Success!</h3>
              <p>
                JazakAllah Khair, {firstName}. We&apos;ve received your registration and our team
                will contact you within 24 hours to confirm your daily class schedule.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
                <Link href="/" className="bft-btn bft-btn-secondary" style={{ textDecoration: "none" }}>Back to Home</Link>
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
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                        }}
                      />
                      {errors.firstName && <p className="bft-error">{errors.firstName}</p>}
                    </div>

                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Last Name<span className="req">*</span></label>
                      <input
                        className={`bft-input ${errors.lastName ? "invalid" : ""}`}
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                        }}
                      />
                      {errors.lastName && <p className="bft-error">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="bft-field" style={{ marginTop: 20 }}>
                    <label className="bft-label">Email<span className="req">*</span></label>
                    <input
                      type="email"
                      className={`bft-input ${errors.email ? "invalid" : ""}`}
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                    />
                    {errors.email && <p className="bft-error">{errors.email}</p>}
                  </div>

                  <div className="bft-row" style={{ marginTop: 20 }}>
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Select Age Group<span className="req">*</span></label>
                      <CustomSelect
                        value={ageGroup}
                        onChange={(v) => {
                          setAgeGroup(v);
                          if (errors.ageGroup) setErrors((prev) => ({ ...prev, ageGroup: "" }));
                        }}
                        options={AGE_GROUPS.map((g) => ({ value: g, label: g }))}
                        placeholder="Age Group"
                        invalid={!!errors.ageGroup}
                      />
                      {errors.ageGroup && <p className="bft-error">{errors.ageGroup}</p>}
                    </div>

                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Gender<span className="req">*</span></label>
                      <div className="radio-group" style={{ height: "46px", display: "flex", alignItems: "center" }}>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            className="radio-input"
                            checked={gender === "Male"}
                            onChange={() => {
                              setGender("Male");
                              if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
                            }}
                          />
                          Male
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            className="radio-input"
                            checked={gender === "Female"}
                            onChange={() => {
                              setGender("Female");
                              if (errors.gender) setErrors((prev) => ({ ...prev, gender: "" }));
                            }}
                          />
                          Female
                        </label>
                      </div>
                      {errors.gender && <p className="bft-error">{errors.gender}</p>}
                    </div>
                  </div>

                  <div className="bft-field" style={{ marginTop: 20 }}>
                    <label className="bft-label">Phone / Mobile<span className="req">*</span></label>
                    <div className="bft-phone-group">
                      <CustomSelect
                        rootClassName="bft-cs-phone"
                        value={dialCode}
                        onChange={handleDialCodeChange}
                        options={DIAL_CODES.map((c) => ({ value: c, label: c }))}
                        placeholder="Code"
                        searchPlaceholder="Search code…"
                      />
                      <input
                        type="tel"
                        className={`bft-input ${errors.mobile ? "invalid" : ""}`}
                        placeholder="Phone number"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/[^\d\s-]/g, ""));
                          if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
                        }}
                      />
                    </div>
                    {errors.mobile && <p className="bft-error">{errors.mobile}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">Country<span className="req">*</span></label>
                    <CustomSelect
                      value={country}
                      onChange={handleCountryChange}
                      options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
                      placeholder="Choose Country"
                      searchPlaceholder="Search country…"
                      invalid={!!errors.country}
                    />
                    {errors.country && <p className="bft-error">{errors.country}</p>}
                  </div>

                  <div className="bft-actions" style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button type="button" className="bft-btn bft-btn-primary" onClick={handleNextStep}>
                      Next Step <IconArrow />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="bft-form-title">Your Class Preferences</h2>

                  <div className="bft-field">
                    <label className="bft-label">Select the course<span className="req">*</span></label>
                    <div className="bft-radio-grid">
                      {COURSES.map((c) => (
                        <label key={c} className={`bft-radio ${course === c ? "checked" : ""}`}>
                          <input
                            type="radio"
                            name="course"
                            value={c}
                            checked={course === c}
                            onChange={() => {
                              setCourse(c);
                              if (errors.course) setErrors((prev) => ({ ...prev, course: "" }));
                            }}
                          />
                          <span className="dot" />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                    {errors.course && <p className="bft-error">{errors.course}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">How Many Hours per Week?</label>
                    <div className="hours-selector">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`hour-btn ${hoursPerWeek === num ? "active" : ""}`}
                          onClick={() => {
                            setHoursPerWeek(num);
                            if (errors.hoursPerWeek) setErrors((prev) => ({ ...prev, hoursPerWeek: "" }));
                            if (preferredDays.length > num) {
                              setPreferredDays(preferredDays.slice(0, num));
                            }
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {errors.hoursPerWeek && <p className="bft-error">{errors.hoursPerWeek}</p>}
                  </div>

                  <div className="bft-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className="bft-label">Choose Your Pricing Plan<span className="req">*</span></label>
                      <label className="bft-label" style={{ width: "100px", textAlign: "center" }}>Pricing / Month</label>
                    </div>
                    <div className="pricing-grid">
                      {plans.map((plan) => (
                        <div className="pricing-row" key={plan.name}>
                          <label className={`bft-radio pricing-option-label ${pricingPlan === plan.name ? "checked" : ""}`} style={{ margin: 0 }}>
                            <input
                              type="radio"
                              name="pricingPlan"
                              value={plan.name}
                              checked={pricingPlan === plan.name}
                              onChange={() => {
                                setPricingPlan(plan.name);
                                if (errors.pricingPlan) setErrors((prev) => ({ ...prev, pricingPlan: "" }));
                              }}
                            />
                            <span className="dot" />
                            <span>{plan.name}</span>
                            <span style={{ color: "#6B5B47", fontSize: "13px", marginLeft: "8px" }}>- ${Number(plan.price)}/Hour</span>
                          </label>
                          <div className="pricing-calc-box">
                            {hoursPerWeek ? `$${calculateMonthlyPrice(Number(plan.price))}` : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.pricingPlan && <p className="bft-error">{errors.pricingPlan}</p>}
                  </div>

                  <div className="bft-field">
                    <label className="bft-label">Which Days Work Best for You?<span className="req">*</span></label>
                    <div className="days-selector">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`day-btn ${preferredDays.includes(day) ? "active" : ""}`}
                          onClick={() => {
                            handleDayToggle(day);
                            if (errors.preferredDays) setErrors((prev) => ({ ...prev, preferredDays: "" }));
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {errors.preferredDays && <p className="bft-error">{errors.preferredDays}</p>}
                  </div>

                  <div className="bft-row" style={{ marginTop: 20 }}>
                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Preferred Date<span className="req">*</span></label>
                      <input
                        type="date"
                        className={`bft-input ${errors.preferredDate ? "invalid" : ""}`}
                        value={preferredDate}
                        onChange={(e) => {
                          setPreferredDate(e.target.value);
                          if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: "" }));
                        }}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors.preferredDate && <p className="bft-error">{errors.preferredDate}</p>}
                    </div>

                    <div className="bft-field" style={{ marginBottom: 0 }}>
                      <label className="bft-label">Preferred Time<span className="req">*</span></label>
                      <div className="time-picker-wrapper">
                        <select
                          className="bft-input time-select"
                          value={timeHH}
                          onChange={(e) => {
                            setTimeHH(e.target.value);
                            if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                          }}
                        >
                          <option value="">HH</option>
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((hr) => (
                            <option key={hr} value={hr}>{hr}</option>
                          ))}
                        </select>
                        <span>:</span>
                        <select
                          className="bft-input time-select"
                          value={timeMM}
                          onChange={(e) => {
                            setTimeMM(e.target.value);
                            if (errors.time) setErrors((prev) => ({ ...prev, time: "" }));
                          }}
                        >
                          <option value="">MM</option>
                          {["00", "30"].map((min) => (
                            <option key={min} value={min}>{min}</option>
                          ))}
                        </select>
                        <select
                          className="bft-input time-select"
                          value={timeAP}
                          onChange={(e) => setTimeAP(e.target.value)}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      {errors.time && <p className="bft-error">{errors.time}</p>}
                    </div>
                  </div>

                  <div className="bft-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button type="button" className="bft-btn bft-btn-secondary" onClick={handlePrevStep}>
                      Previous
                    </button>
                    <button type="submit" className="bft-btn bft-btn-primary" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Registration"}
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
