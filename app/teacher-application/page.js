"use client";

import { useState, useRef, Fragment, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./teacher-application.css";
import { supabase } from "@/lib/supabase";
import SearchSelect from "@/components/SearchSelect";
import { COUNTRIES, DIAL_CODES } from "../book-free-trial/countries";

/* ---------------- Icons ---------------- */
const IconSpark = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9L12 2Z" /></svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconGlobe = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
const IconHeart = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
);
const IconTeacher = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const IconArrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

/* ---------------- Options ---------------- */
const GENDERS = ["Male", "Female"];
const MARITAL = ["Single", "Married", "Divorced", "Widowed"];
const YESNO = ["Yes", "No"];
const INTERVIEW_TIMES = ["Morning", "Afternoon", "Evening"];
const EMPLOYMENT = ["Full-time", "Part-time"];
const APPLYING_FOR = ["Quran", "Arabic Study", "Islamic", "Admin"];
const CHILDREN_OPTIONS = ["No", "Younger than 3 year old", "Younger than 5 year old", "Other"];
const HOW_FOUND = ["Facebook", "Linkedin", "Google", "Bayyinah Website", "Advertisement", "Others"];
const LANGUAGES = ["English", "Arabic", "Urdu", "French", "Germany", "Russian"];

const PASSAGE =
  "The Birth of the Prophet Muhammad, son of Abdullah, son of Abdul Muttalib, and member of the Quraysh tribe, was born in Makkah 53 years before the Hijrah. His father died before he was born, and he was raised by his grandfather, Abdul Muttalib, and then by his uncle, Abu Talib, after his grandfather died. He traveled to Syria as a young boy with his uncle in a merchants' caravan, and later made the same journey in the service of a wealthy widow named Khadijah. He handled the widow's business so faithfully, and the report of his behavior from her old servant who had accompanied him was so good, that she married her young agent soon after; and the marriage proved to be a very happy one, despite the fact that she was fifteen years older than he was.";

const STEP_TITLES = ["Personal Information", "Academic & Professional", "Reading & Reciting", "Application Details"];

const INITIAL_FORM = {
  first_name: "", last_name: "", gender: "", email: "", dial_code: "+44", mobile: "", country: "",
  date_of_birth: "", nationality: "", occupation: "", marital_status: "", about_me: "", facebook: "", profile_image_url: "",
  education: "", years_experience: "", mother_language: "", other_language: "", cv_url: "",
  reading_audio_url: "", recitation_audio_url: "",
  applying_for: "", has_ijazah: "", teach_tajweed_english: "", has_children: "",
  preferred_interview_time: "", expected_salary: "", hours_per_week: "", employment_type: "",
  ideal_candidate: "", how_found: "", declaration: false
};

/* Pill radio group */
function RadioGroup({ options, value, onChange }) {
  return (
    <div className="ta-radio-grid">
      {options.map((opt) => (
        <label key={opt} className={`ta-radio ${value === opt ? "checked" : ""}`}>
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} />
          <span className="dot" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function TeacherApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [fileNames, setFileNames] = useState({});
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formCardRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
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
                dial_code: match.dial
              }));
            }
          }
        } catch (e) {
          console.warn("Failed to parse detect-country API response on teacher-application page", e);
        }
      }
    }
    detectCountry();
  }, []);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleCountryChange = (cName) => {
    const match = COUNTRIES.find((c) => c.name === cName);
    setForm((f) => ({
      ...f,
      country: cName,
      dial_code: match ? match.dial : f.dial_code
    }));
    if (errors.country) setErrors((e) => ({ ...e, country: "" }));
  };

  const handleDialCodeChange = (code) => {
    const match = COUNTRIES.find((c) => c.dial === code);
    setForm((f) => ({
      ...f,
      dial_code: code,
      country: match ? match.name : f.country
    }));
    if (errors.country) setErrors((e) => ({ ...e, country: "" }));
  };

  const scrollTop = () => {
    if (!formCardRef.current) return;
    const y = formCardRef.current.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  async function uploadFile(file, field, maxMB) {
    if (!file) return;
    if (maxMB && file.size > maxMB * 1024 * 1024) {
      setFileNames((n) => ({ ...n, [field]: `File too large (max ${maxMB}MB)` }));
      return;
    }
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const ext = file.name.split(".").pop();
      const path = `teacher-applications/${field}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      set(field, data.publicUrl);
      setFileNames((n) => ({ ...n, [field]: file.name }));
    } catch (err) {
      setFileNames((n) => ({ ...n, [field]: `Upload failed: ${err.message || "try again"}` }));
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  }

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.first_name.trim()) e.first_name = "First name is required.";
      if (!form.last_name.trim()) e.last_name = "Last name is required.";
      if (!form.gender) e.gender = "Please select your gender.";
      if (!form.email.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
      if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
      if (!form.country) e.country = "Please choose your country.";
      if (!form.date_of_birth) e.date_of_birth = "Date of birth is required.";
      if (!form.marital_status) e.marital_status = "Please select your marital status.";
      if (!form.nationality.trim()) e.nationality = "Nationality is required.";
      if (!form.occupation.trim()) e.occupation = "Occupation is required.";
      if (!form.about_me.trim()) e.about_me = "Please tell us about yourself.";
      if (!form.facebook.trim()) e.facebook = "Facebook ID / profile link is required.";
      if (!form.profile_image_url) e.profile_image_url = "Please upload your profile image.";
    } else if (s === 2) {
      if (!form.education.trim()) e.education = "Education is required.";
      if (!form.years_experience.trim()) e.years_experience = "Years of experience is required.";
      if (!form.mother_language) e.mother_language = "Please select your mother language.";
      if (!form.other_language) e.other_language = "Please select another language.";
      if (!form.cv_url) e.cv_url = "Please upload your CV.";
    } else if (s === 3) {
      if (!form.reading_audio_url) e.reading_audio_url = "Please upload your reading audio.";
      if (!form.recitation_audio_url) e.recitation_audio_url = "Please upload your recitation audio.";
    } else if (s === 4) {
      if (!form.applying_for) e.applying_for = "Please select what you are applying for.";
      if (!form.has_ijazah) e.has_ijazah = "Please select an option.";
      if (!form.teach_tajweed_english) e.teach_tajweed_english = "Please select an option.";
      if (!form.has_children) e.has_children = "Please select an option.";
      if (!form.preferred_interview_time) e.preferred_interview_time = "Please select your preferred interview time.";
      if (!form.expected_salary.trim()) e.expected_salary = "Expected salary is required.";
      if (!form.hours_per_week.trim()) e.hours_per_week = "Hours per week is required.";
      if (!form.employment_type) e.employment_type = "Please select an employment type.";
      if (!form.ideal_candidate.trim()) e.ideal_candidate = "Please tell us what makes you an ideal candidate.";
      if (!form.how_found) e.how_found = "Please tell us how you found out about us.";
      if (!form.declaration) e.declaration = "Please confirm the declaration to submit.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => { if (validateStep(step)) { setStep((s) => s + 1); scrollTop(); } };
  const goPrev = () => { setStep((s) => s - 1); scrollTop(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/teacher-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Something went wrong.");
      setSubmitted(true);
      if (formCardRef.current) {
        const y = formCardRef.current.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      Swal.fire({
        title: "Application Submitted!",
        html: `JazakAllah Khair, <strong>${form.first_name}</strong>.<br/><br/>We've received your teacher application and our team will review it carefully and contact you soon regarding the next steps.`,
        icon: "success",
        confirmButtonColor: "#4A5D3B",
        confirmButtonText: "Ok"
      });
    } catch (err) {
      setSubmitError(err.message || "Could not submit your application. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err.message || "Could not submit your application. Please try again.",
        confirmButtonColor: "#d33"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => { setForm(INITIAL_FORM); setFileNames({}); setErrors({}); setStep(1); setSubmitted(false); setSubmitError(""); };

  const UploadBtn = ({ field, accept, maxMB, label }) => (
    <div>
      <label className={`ta-upload ${form[field] ? "done" : ""}`}>
        {form[field] ? <IconCheck size={16} /> : <IconPlus />}
        <span>{uploading[field] ? "Uploading…" : form[field] ? (fileNames[field] || "Uploaded") : label}</span>
        <input type="file" accept={accept} onChange={(ev) => uploadFile(ev.target.files[0], field, maxMB)} />
      </label>
      {fileNames[field] && fileNames[field].startsWith("Upload failed") && <p className="ta-error">{fileNames[field]}</p>}
      {fileNames[field] && fileNames[field].startsWith("File too large") && <p className="ta-error">{fileNames[field]}</p>}
    </div>
  );

  return (
    <main className="ta-page">
      {/* ===== SECTION 1: HERO ===== */}
      <section className="ta-hero">
        <span className="ta-badge"><IconSpark /> Join Our Team</span>
        <h1 className="ta-hero-title">Become a <span>Yaqeen</span> Teacher</h1>
        <div className="ta-hero-divider"><span className="line" /><span className="diamond" /><span className="line" /></div>
        <div className="ta-hero-stats">
          <span className="ta-stat"><IconGlobe /> Teach Students Worldwide</span>
          <span className="ta-stat"><IconTeacher size={16} /> Flexible Online Schedule</span>
          <span className="ta-stat"><IconHeart /> Rewarding Mission</span>
        </div>
      </section>

      {/* ===== SECTION 2: FORM ===== */}
      <section className="ta-form-section">
        <div className="ta-form-card" ref={formCardRef}>
          {submitted ? (
            <div className="ta-success">
              <div className="ta-success-icon"><IconCheck size={40} /></div>
              <h3>Application Submitted!</h3>
              <p>
                Thank you, {form.first_name}. We&apos;ve received your teacher application and our
                team will review it carefully and contact you soon regarding the next steps.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/" className="ta-btn ta-btn-secondary" style={{ textDecoration: "none" }}>Back to Home</Link>
                <button type="button" className="ta-btn ta-btn-primary" onClick={resetForm}>Submit Another</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Progress */}
              <div className="ta-progress">
                <div className="ta-progress-labels">
                  {STEP_TITLES.map((_, i) => (
                    <span key={i} className={`ta-progress-label ${step >= i + 1 ? "active" : ""}`}>Step {i + 1}</span>
                  ))}
                </div>
                <div className="ta-progress-track">
                  {[1, 2, 3, 4].map((n) => (
                    <Fragment key={n}>
                      <span className={`ta-progress-node ${step >= n ? "active" : ""}`}>{n}</span>
                      {n < 4 && (
                        <span className="ta-progress-seg"><span className="fill" style={{ width: step > n ? "100%" : "0%" }} /></span>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>

              {/* Step heading */}
              <h2 className="ta-step-title">{STEP_TITLES[step - 1]}</h2>
              <p className="ta-step-desc">
                {step === 1 && "Fill your application — tell us a little about yourself."}
                {step === 2 && "Please tell us about your education, occupation and experience."}
                {step === 3 && "Please read & recite the passage below and upload the audio files."}
                {step === 4 && "A few final questions about the role you are applying for."}
              </p>
              <div className="ta-step-rule" />

              {/* ---------- STEP 1 ---------- */}
              {step === 1 && (
                <div>
                  <div className="ta-row">
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">First Name<span className="req">*</span></label>
                      <input className={`ta-input ${errors.first_name ? "invalid" : ""}`} placeholder="First name" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
                      {errors.first_name && <p className="ta-error">{errors.first_name}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Last Name<span className="req">*</span></label>
                      <input className={`ta-input ${errors.last_name ? "invalid" : ""}`} placeholder="Last name" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
                      {errors.last_name && <p className="ta-error">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="ta-field" style={{ marginTop: 20 }}>
                    <label className="ta-label">Gender<span className="req">*</span></label>
                    <select className={`ta-select ${errors.gender ? "invalid" : ""}`} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                      <option value="">Select</option>
                      {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.gender && <p className="ta-error">{errors.gender}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Email<span className="req">*</span></label>
                    <input type="email" className={`ta-input ${errors.email ? "invalid" : ""}`} placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    {errors.email && <p className="ta-error">{errors.email}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Mobile<span className="req">*</span></label>
                    <div className="ta-phone-group">
                      <SearchSelect rootClassName="ss-phone" value={form.dial_code} onChange={handleDialCodeChange} options={DIAL_CODES.map((c) => ({ value: c, label: c }))} placeholder="Code" searchPlaceholder="Search code…" />
                      <input type="tel" className={`ta-input ${errors.mobile ? "invalid" : ""}`} placeholder="Mobile number" value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/[^\d\s-]/g, ""))} />
                    </div>
                    {errors.mobile && <p className="ta-error">{errors.mobile}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Country<span className="req">*</span></label>
                    <SearchSelect value={form.country} onChange={handleCountryChange} options={[...COUNTRIES.map((c) => ({ value: c.name, label: c.name })), { value: "Other", label: "Other" }]} placeholder="Choose your country" invalid={!!errors.country} searchPlaceholder="Search country…" />
                    {errors.country && <p className="ta-error">{errors.country}</p>}
                  </div>

                  <div className="ta-row">
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Date of Birth<span className="req">*</span></label>
                      <input type="date" className={`ta-input ${errors.date_of_birth ? "invalid" : ""}`} value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
                      {errors.date_of_birth && <p className="ta-error">{errors.date_of_birth}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Marital Status<span className="req">*</span></label>
                      <select className={`ta-select ${errors.marital_status ? "invalid" : ""}`} value={form.marital_status} onChange={(e) => set("marital_status", e.target.value)}>
                        <option value="">Select</option>
                        {MARITAL.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {errors.marital_status && <p className="ta-error">{errors.marital_status}</p>}
                    </div>
                  </div>

                  <div className="ta-row" style={{ marginTop: 20 }}>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Nationality<span className="req">*</span></label>
                      <input className={`ta-input ${errors.nationality ? "invalid" : ""}`} placeholder="Nationality" value={form.nationality} onChange={(e) => set("nationality", e.target.value)} />
                      {errors.nationality && <p className="ta-error">{errors.nationality}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Occupation<span className="req">*</span></label>
                      <input className={`ta-input ${errors.occupation ? "invalid" : ""}`} placeholder="Occupation" value={form.occupation} onChange={(e) => set("occupation", e.target.value)} />
                      {errors.occupation && <p className="ta-error">{errors.occupation}</p>}
                    </div>
                  </div>

                  <div className="ta-field" style={{ marginTop: 20 }}>
                    <label className="ta-label">About Me<span className="req">*</span></label>
                    <textarea className={`ta-textarea ${errors.about_me ? "invalid" : ""}`} placeholder="Write yourself…" value={form.about_me} onChange={(e) => set("about_me", e.target.value)} />
                    {errors.about_me && <p className="ta-error">{errors.about_me}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Facebook<span className="req">*</span></label>
                    <input className={`ta-input ${errors.facebook ? "invalid" : ""}`} placeholder="Facebook ID / profile link" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
                    {errors.facebook && <p className="ta-error">{errors.facebook}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Profile Image<span className="req">*</span></label>
                    <UploadBtn field="profile_image_url" accept="image/png,image/jpeg" maxMB={2} label="Upload Image" />
                    <p className="ta-file-hint">Accepted formats: JPG, PNG. Max size: 2MB.</p>
                    {errors.profile_image_url && <p className="ta-error">{errors.profile_image_url}</p>}
                  </div>

                  <div className="ta-actions end">
                    <button type="button" className="ta-btn ta-btn-primary" onClick={goNext}>Next Step <IconArrow /></button>
                  </div>
                </div>
              )}

              {/* ---------- STEP 2 ---------- */}
              {step === 2 && (
                <div>
                  <div className="ta-field">
                    <label className="ta-label">Education<span className="req">*</span></label>
                    <input className={`ta-input ${errors.education ? "invalid" : ""}`} placeholder="e.g. Masters in Commerce / Islamic Studies" value={form.education} onChange={(e) => set("education", e.target.value)} />
                    {errors.education && <p className="ta-error">{errors.education}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Years of Experience<span className="req">*</span></label>
                    <input className={`ta-input ${errors.years_experience ? "invalid" : ""}`} placeholder="e.g. 5 Years" value={form.years_experience} onChange={(e) => set("years_experience", e.target.value)} />
                    {errors.years_experience && <p className="ta-error">{errors.years_experience}</p>}
                  </div>

                  <div className="ta-row">
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Mother Language<span className="req">*</span></label>
                      <select className={`ta-select ${errors.mother_language ? "invalid" : ""}`} value={form.mother_language} onChange={(e) => set("mother_language", e.target.value)}>
                        <option value="">Select</option>
                        {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {errors.mother_language && <p className="ta-error">{errors.mother_language}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Other Language<span className="req">*</span></label>
                      <select className={`ta-select ${errors.other_language ? "invalid" : ""}`} value={form.other_language} onChange={(e) => set("other_language", e.target.value)}>
                        <option value="">Select</option>
                        {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {errors.other_language && <p className="ta-error">{errors.other_language}</p>}
                    </div>
                  </div>

                  <div className="ta-field" style={{ marginTop: 20 }}>
                    <label className="ta-label">Upload CV<span className="req">*</span></label>
                    <UploadBtn field="cv_url" accept=".pdf,.doc,.docx" maxMB={5} label="Upload your CV" />
                    <p className="ta-file-hint">Accepted formats: PDF, DOC, DOCX. Max size: 5MB.</p>
                    {errors.cv_url && <p className="ta-error">{errors.cv_url}</p>}
                  </div>

                  <div className="ta-actions">
                    <button type="button" className="ta-btn ta-btn-secondary" onClick={goPrev}>Previous</button>
                    <button type="button" className="ta-btn ta-btn-primary" onClick={goNext}>Next Step <IconArrow /></button>
                  </div>
                </div>
              )}

              {/* ---------- STEP 3 ---------- */}
              {step === 3 && (
                <div>
                  <div className="ta-passage">{PASSAGE}</div>

                  <div className="ta-field">
                    <label className="ta-label">Read the above paragraph and upload audio file.<span className="req">*</span></label>
                    <UploadBtn field="reading_audio_url" accept="audio/mpeg,audio/wav,.mp3,.wav" maxMB={10} label="Upload your Audio" />
                    <p className="ta-file-hint">Accepted formats: MP3, WAV. Max size: 10MB.</p>
                    {errors.reading_audio_url && <p className="ta-error">{errors.reading_audio_url}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">Please recite the first 10 Ayah of Surah An-Naba and upload audio file.<span className="req">*</span></label>
                    <UploadBtn field="recitation_audio_url" accept="audio/mpeg,audio/wav,.mp3,.wav" maxMB={10} label="Upload your Audio" />
                    <p className="ta-file-hint">Accepted formats: MP3, WAV. Max size: 10MB.</p>
                    {errors.recitation_audio_url && <p className="ta-error">{errors.recitation_audio_url}</p>}
                  </div>

                  <div className="ta-actions">
                    <button type="button" className="ta-btn ta-btn-secondary" onClick={goPrev}>Previous</button>
                    <button type="button" className="ta-btn ta-btn-primary" onClick={goNext}>Next Step <IconArrow /></button>
                  </div>
                </div>
              )}

              {/* ---------- STEP 4 ---------- */}
              {step === 4 && (
                <div>
                  <div className="ta-row">
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Applying for<span className="req">*</span></label>
                      <select className={`ta-select ${errors.applying_for ? "invalid" : ""}`} value={form.applying_for} onChange={(e) => set("applying_for", e.target.value)}>
                        <option value="">Select</option>
                        {APPLYING_FOR.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {errors.applying_for && <p className="ta-error">{errors.applying_for}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Do you have Ijazah<span className="req">*</span></label>
                      <select className={`ta-select ${errors.has_ijazah ? "invalid" : ""}`} value={form.has_ijazah} onChange={(e) => set("has_ijazah", e.target.value)}>
                        <option value="">Select</option>
                        {YESNO.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {errors.has_ijazah && <p className="ta-error">{errors.has_ijazah}</p>}
                    </div>
                  </div>

                  <div className="ta-row" style={{ marginTop: 20 }}>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Can you teach Tajweed in English<span className="req">*</span></label>
                      <select className={`ta-select ${errors.teach_tajweed_english ? "invalid" : ""}`} value={form.teach_tajweed_english} onChange={(e) => set("teach_tajweed_english", e.target.value)}>
                        <option value="">Select</option>
                        {YESNO.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {errors.teach_tajweed_english && <p className="ta-error">{errors.teach_tajweed_english}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Do you have Children<span className="req">*</span></label>
                      <select className={`ta-select ${errors.has_children ? "invalid" : ""}`} value={form.has_children} onChange={(e) => set("has_children", e.target.value)}>
                        <option value="">Select</option>
                        {CHILDREN_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.has_children && <p className="ta-error">{errors.has_children}</p>}
                    </div>
                  </div>

                  <div className="ta-row" style={{ marginTop: 20 }}>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Preferred Interview Time<span className="req">*</span></label>
                      <select className={`ta-select ${errors.preferred_interview_time ? "invalid" : ""}`} value={form.preferred_interview_time} onChange={(e) => set("preferred_interview_time", e.target.value)}>
                        <option value="">Select</option>
                        {INTERVIEW_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.preferred_interview_time && <p className="ta-error">{errors.preferred_interview_time}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Expected Salary (USD Per Hour)<span className="req">*</span></label>
                      <input className={`ta-input ${errors.expected_salary ? "invalid" : ""}`} placeholder="$ per hour" value={form.expected_salary} onChange={(e) => set("expected_salary", e.target.value)} />
                      {errors.expected_salary && <p className="ta-error">{errors.expected_salary}</p>}
                    </div>
                  </div>

                  <div className="ta-row" style={{ marginTop: 20 }}>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">How many hours per week can you work<span className="req">*</span></label>
                      <input className={`ta-input ${errors.hours_per_week ? "invalid" : ""}`} placeholder="e.g. 10" value={form.hours_per_week} onChange={(e) => set("hours_per_week", e.target.value)} />
                      {errors.hours_per_week && <p className="ta-error">{errors.hours_per_week}</p>}
                    </div>
                    <div className="ta-field" style={{ marginBottom: 0 }}>
                      <label className="ta-label">Employment Type<span className="req">*</span></label>
                      <select className={`ta-select ${errors.employment_type ? "invalid" : ""}`} value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)}>
                        <option value="">Select</option>
                        {EMPLOYMENT.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.employment_type && <p className="ta-error">{errors.employment_type}</p>}
                    </div>
                  </div>

                  <div className="ta-field" style={{ marginTop: 20 }}>
                    <label className="ta-label">What makes you an Ideal Candidate<span className="req">*</span></label>
                    <textarea className={`ta-textarea ${errors.ideal_candidate ? "invalid" : ""}`} placeholder="Write what makes you an ideal candidate…" value={form.ideal_candidate} onChange={(e) => set("ideal_candidate", e.target.value)} />
                    {errors.ideal_candidate && <p className="ta-error">{errors.ideal_candidate}</p>}
                  </div>

                  <div className="ta-field">
                    <label className="ta-label">How did you find out about us<span className="req">*</span></label>
                    <RadioGroup options={HOW_FOUND} value={form.how_found} onChange={(v) => set("how_found", v)} />
                    {errors.how_found && <p className="ta-error">{errors.how_found}</p>}
                  </div>

                  <label className="ta-declare">
                    <input type="checkbox" checked={form.declaration} onChange={(e) => set("declaration", e.target.checked)} />
                    <span>I declare that the information I have provided in this registration form is true and accurate to the best of my knowledge.</span>
                  </label>
                  {errors.declaration && <p className="ta-error">{errors.declaration}</p>}

                  {submitError && <p className="ta-error" style={{ marginTop: 16, fontSize: 13.5 }}>{submitError}</p>}

                  <div className="ta-actions">
                    <button type="button" className="ta-btn ta-btn-secondary" onClick={goPrev}>Previous</button>
                    <button type="submit" className="ta-btn ta-btn-primary" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit Application"} {!submitting && <IconArrow />}
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
