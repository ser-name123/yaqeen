"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import "quill/dist/quill.snow.css";

// Admin SweetAlert theme wrapper to override defaults to match cream theme
const originalSwalFire = Swal["fire"];
const adminSwal = {
  fire: (options) => {
    const isString = typeof options === "string";
    const themedOptions = isString ? { title: options } : { ...options };
    
    const finalBackground = (themedOptions.background === "#111827" || !themedOptions.background) ? "#fdfcf9" : themedOptions.background;
    const finalColor = (themedOptions.color === "#fff" || themedOptions.color === "#ffffff" || !themedOptions.color) ? "#2c251e" : themedOptions.color;
    
    const finalConfirmButtonColor = (themedOptions.confirmButtonColor === "var(--primary-color)" || !themedOptions.confirmButtonColor)
      ? "#8c5d31" 
      : themedOptions.confirmButtonColor;
      
    const finalCancelButtonColor = (themedOptions.cancelButtonColor === "var(--card-border)" || !themedOptions.cancelButtonColor)
      ? "#7c7267" 
      : themedOptions.cancelButtonColor;

    return originalSwalFire.call(Swal, {
      ...themedOptions,
      background: finalBackground,
      color: finalColor,
      confirmButtonColor: finalConfirmButtonColor,
      cancelButtonColor: finalCancelButtonColor
    });
  }
};

// Blank course form — used for create/reset. Detail-page content fields are optional.
const EMPTY_COURSE_FORM = {
  title: "", image_url: "", icon: "book", order_index: 0,
  short_description: "", description: "",
  level: "", class_duration: "", course_duration: "", mode: "", age_group: "",
  learn_points: "", requirements: "", who_for: "",
  content_details: "", course_modules: "", faqs: ""
};

export default function AdminDashboard() {
  // Authentication states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Admin account management states
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  // Profile management states
  const [profileForm, setProfileForm] = useState({
    email: "",
    password: "",
    logo_text: "",
    logo_url: "",
    contact_email: "",
    contact_phone: "",
    contact_hours: "",
    contact_support: "",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    social_whatsapp: ""
  });
  const [logoText, setLogoText] = useState("yaqeen");
  const [logoUrl, setLogoUrl] = useState("");

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [seoSettings, setSeoSettings] = useState({ title: "", description: "", keywords: "", favicon_url: "" });
  const [activeTab, setActiveTab] = useState("overview"); // overview, blogs, contacts, seo, profile
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // hamburger drawer on mobile

  // Teachers management states
  const [teachers, setTeachers] = useState([]);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    avatar_url: "",
    languages: "",
    experience: "",
    specialization: "",
    bio: "",
    order_index: 0
  });

  // Testimonials management states
  const [testimonials, setTestimonials] = useState([]);
  const [teacherApps, setTeacherApps] = useState([]);
  const [studentApps, setStudentApps] = useState([]);
  const [careerJobs, setCareerJobs] = useState([]);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({ title: "", job_title: "", meta: "", badge: "Online", description: "", order_index: 0 });
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    content: "",
    avatar_url: "",
    page_targets: {
      all: true,
      home: false,
      about: false,
      courses: false,
      pricing: false
    },
    order_index: 0
  });

  // Courses management states
  const [courses, setCourses] = useState([]);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM);

  // Pricing plans states
  const [plans, setPlans] = useState([]);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    period: "/hour",
    icon: "plane",
    badge: "",
    features: [],
    order_index: 0
  });
  const [newFeatureText, setNewFeatureText] = useState("");
  const [newFeatureIncluded, setNewFeatureIncluded] = useState(true);

  // Selected contact details popup state
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedTeacherApp, setSelectedTeacherApp] = useState(null);
  const [selectedStudentApp, setSelectedStudentApp] = useState(null);

  // Blog editor form states
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    category: "General",
    read_time: "5 min read",
    author: "Admin Team",
    featured_image: "",
    quote: "",
    quote_source: "",
    body: "",
    second_quote: "",
    second_quote_source: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: ""
  });
  // Dynamic list sections for blog post
  const [blogSections, setBlogSections] = useState([{ title: "", content: "" }]);

  // Refs for Quill Editor
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  // Initialize Quill Editor dynamically on Client Side
  useEffect(() => {
    let active = true;

    if (isEditingBlog && quillRef.current && !quillInstanceRef.current) {
      import("quill").then(({ default: Quill }) => {
        if (!active || !quillRef.current || quillInstanceRef.current) return;

        const quill = new Quill(quillRef.current, {
          theme: "snow",
          placeholder: "Write your article body content here...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "blockquote", "code-block"],
              ["clean"]
            ]
          }
        });

        quillInstanceRef.current = quill;

        // Load initial content
        if (blogForm.body) {
          quill.root.innerHTML = blogForm.body;
        }

        // Listen for changes
        quill.on("text-change", () => {
          const html = quill.root.innerHTML;
          setBlogForm((prev) => {
            if (prev.body === html) return prev;
            return { ...prev, body: html };
          });
        });
      });
    }

    return () => {
      active = false;
    };
  }, [isEditingBlog]);

  // Clean editor ref on closing edit view
  useEffect(() => {
    if (!isEditingBlog) {
      quillInstanceRef.current = null;
    }
  }, [isEditingBlog]);

  // Synchronize external edits (like resetting or loading edit states) with the Quill Editor
  useEffect(() => {
    if (quillInstanceRef.current) {
      const editorHtml = quillInstanceRef.current.root.innerHTML;
      if (blogForm.body !== editorHtml && (blogForm.body !== "" || editorHtml !== "<p><br></p>")) {
        quillInstanceRef.current.root.innerHTML = blogForm.body || "";
      }
    }
  }, [blogForm.body]);


  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch blogs
      const { data: blogData, error: blogErr } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!blogErr) setBlogs(blogData || []);

      // 2. Fetch contacts
      const { data: contactData, error: contactErr } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!contactErr) setContacts(contactData || []);

      // 3. Fetch leads count
      const { count: lCount, error: leadErr } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });
      if (!leadErr) setLeadsCount(lCount || 0);

      // 4. Fetch global SEO settings
      const { data: seoData, error: seoErr } = await supabase
        .from("seo_settings")
        .select("title, description, keywords, favicon_url")
        .eq("id", "global")
        .single();
      if (!seoErr && seoData) {
        setSeoSettings({
          title: seoData.title || "",
          description: seoData.description || "",
          keywords: seoData.keywords || "",
          favicon_url: seoData.favicon_url || ""
        });
      }

      // 5. Fetch teachers
      const { data: teacherData, error: teacherErr } = await supabase
        .from("teachers")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (!teacherErr) setTeachers(teacherData || []);

      // 6. Fetch testimonials
      const { data: testimonialData, error: testimonialErr } = await supabase
        .from("testimonials")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (!testimonialErr) setTestimonials(testimonialData || []);

      // 6b. Fetch teacher applications (table may not exist yet — fail silently)
      const { data: teacherAppData, error: teacherAppErr } = await supabase
        .from("teacher_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!teacherAppErr) setTeacherApps(teacherAppData || []);

      // 6d. Fetch student applications (table may not exist yet — fail silently)
      const { data: studentAppData, error: studentAppErr } = await supabase
        .from("student_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!studentAppErr) setStudentApps(studentAppData || []);

      // 6c. Fetch career job openings (table may not exist yet — fail silently)
      const { data: jobData, error: jobErr } = await supabase
        .from("career_jobs")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (!jobErr) setCareerJobs(jobData || []);

      // 7. Fetch courses
      const { data: courseData, error: courseErr } = await supabase
        .from("courses")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (!courseErr) setCourses(courseData || []);

      // 8. Fetch pricing plans
      const { data: planData, error: planErr } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
      if (!planErr) setPlans(planData || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    const token = localStorage.getItem("aero_admin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProfileForm({
          email: data.email,
          password: data.password,
          logo_text: data.logo_text || "",
          logo_url: data.logo_url || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          contact_hours: data.contact_hours || "",
          contact_support: data.contact_support || "",
          social_facebook: data.social_facebook || "",
          social_instagram: data.social_instagram || "",
          social_youtube: data.social_youtube || "",
          social_whatsapp: data.social_whatsapp || ""
        });
        setLogoText(data.logo_text || "yaqeen");
        setLogoUrl(data.logo_url || "");
      }
    } catch (err) {
      console.error("Error loading profile settings:", err);
    }
  };

  // Load dynamic logo on mount
  useEffect(() => {
    async function loadLogo() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("logo_text, logo_url")
          .eq("id", "global")
          .single();
        if (data) {
          setLogoText(data.logo_text || "yaqeen");
          setLogoUrl(data.logo_url || "");
        }
      } catch (err) {
        console.warn("Could not load logo from site_settings:", err);
      }
    }
    loadLogo();
  }, []);

  // Load passcode and tab state from local storage on mount
  useEffect(() => {
    const token = localStorage.getItem("aero_admin_token");
    if (token) {
      // Optimistically assume authenticated to prevent reload/compilation logout flashes
      setIsAuthenticated(true);
      setIsVerifyingSession(false);

      const validateSession = async () => {
        try {
          const res = await fetch("/api/admin/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setProfileForm({
              email: data.email,
              password: data.password,
              logo_text: data.logo_text || "",
              logo_url: data.logo_url || "",
              contact_email: data.contact_email || "",
              contact_phone: data.contact_phone || "",
              contact_hours: data.contact_hours || "",
              contact_support: data.contact_support || "",
              social_facebook: data.social_facebook || "",
              social_instagram: data.social_instagram || "",
              social_youtube: data.social_youtube || "",
              social_whatsapp: data.social_whatsapp || ""
            });
            setLogoText(data.logo_text || "yaqeen");
            setLogoUrl(data.logo_url || "");
          } else {
            // Server explicitly rejects token (e.g. expired session)
            localStorage.removeItem("aero_admin_token");
            setIsAuthenticated(false);
            adminSwal.fire({
              icon: "warning",
              title: "Session Expired",
              text: "Your admin session has expired. Please log in again.",
              confirmButtonColor: "var(--primary-color)",
              background: "#111827",
              color: "#fff"
            });
          }
        } catch (err) {
          console.warn("Silent session verification network check skipped:", err);
          // Do not delete token or logout on network/server-compiling errors
        }
      };
      validateSession();
    } else {
      setIsVerifyingSession(false);
    }

    const savedTab = localStorage.getItem("aero_admin_tab");
    if (savedTab) {
      setTimeout(() => {
        setActiveTab(savedTab);
      }, 0);
    }
  }, []);

  // Fetch admin dashboard metrics and records
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        fetchDashboardData();
        fetchProfileData();
      }, 0);
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        adminSwal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: data.message || ("Verification code sent to " + emailInput),
          confirmButtonColor: "var(--primary-color)",
          background: "#111827",
          color: "#fff"
        });
      } else {
        adminSwal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
          confirmButtonColor: "var(--primary-color)",
          background: "#111827",
          color: "#fff"
        });
      }
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not connect to authentication server.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, otp: otpInput })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("aero_admin_token", data.sessionToken);
        setIsAuthenticated(true);
        adminSwal.fire({
          icon: "success",
          title: "Access Granted",
          text: "Authenticated successfully!",
          timer: 1500,
          showConfirmButton: false,
          background: "#111827",
          color: "#fff"
        });
      } else {
        adminSwal.fire({
          icon: "error",
          title: "Verification Failed",
          text: data.message || "Invalid OTP code",
          confirmButtonColor: "var(--primary-color)",
          background: "#111827",
          color: "#fff"
        });
      }
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not connect to authentication server.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCancelOtp = () => {
    setOtpSent(false);
    setOtpInput("");
  };

  const handleLogout = async () => {
    const result = await adminSwal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout from the admin console?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--primary-color)",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, logout",
      background: "#111827",
      color: "#fff"
    });

    if (result.isConfirmed) {
      setIsAuthenticated(false);
      setOtpSent(false);
      setEmailInput("");
      setPasswordInput("");
      setOtpInput("");
      localStorage.removeItem("aero_admin_token");
      adminSwal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#111827",
        color: "#fff"
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("aero_admin_tab", tab);
    setMobileNavOpen(false);
    if (tab === "profile") fetchAdminAccounts();
    setIsEditingBlog(false);
    setIsEditingTeacher(false);
    setIsEditingTestimonial(false);
    setIsEditingCourse(false);
    setIsEditingPlan(false);
    setIsEditingJob(false);
  };

  // Free-trial bookings arrive through the contact form pipeline with a "Free Trial Booking" subject.
  // Split them out so they get their own admin menu, keeping the Contact Inbox for real inquiries only.
  const FREE_TRIAL_PREFIX = "Free Trial Booking";
  const freeTrials = contacts.filter((c) => (c.subject || "").startsWith(FREE_TRIAL_PREFIX));
  const inquiries = contacts.filter((c) => !(c.subject || "").startsWith(FREE_TRIAL_PREFIX));

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setProfileForm((prev) => ({
        ...prev,
        logo_url: data.publicUrl
      }));
      setLogoUrl(data.publicUrl);
      
      adminSwal.fire({
        icon: "success",
        title: "Logo Uploaded!",
        text: "Make sure to click 'Save Credentials' below to save changes.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      console.error("Logo upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload logo image.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("aero_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: profileForm.email,
          password: profileForm.password,
          logo_text: profileForm.logo_text,
          logo_url: profileForm.logo_url,
          contact_email: profileForm.contact_email,
          contact_phone: profileForm.contact_phone,
          contact_hours: profileForm.contact_hours,
          contact_support: profileForm.contact_support,
          social_facebook: profileForm.social_facebook,
          social_instagram: profileForm.social_instagram,
          social_youtube: profileForm.social_youtube,
          social_whatsapp: profileForm.social_whatsapp
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogoText(profileForm.logo_text);
        setLogoUrl(profileForm.logo_url);
        adminSwal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Admin credentials successfully updated.",
          confirmButtonColor: "var(--primary-color)",
          background: "#111827",
          color: "#fff"
        });
      } else {
        adminSwal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Could not update credentials",
          confirmButtonColor: "var(--primary-color)",
          background: "#111827",
          color: "#fff"
        });
      }
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Connection Error",
        text: "Could not save profile settings.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- ADMIN ACCOUNTS ACTIONS ---
  const fetchAdminAccounts = async () => {
    const token = localStorage.getItem("aero_admin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/accounts", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAdminAccounts(data.accounts || []);
    } catch (err) {
      console.warn("Could not load admin accounts:", err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
      adminSwal.fire({ icon: "warning", title: "Missing details", text: "Please enter both email and password.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("aero_admin_token");
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail.trim(), password: newAdminPassword.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create account.");
      setNewAdminEmail("");
      setNewAdminPassword("");
      fetchAdminAccounts();
      adminSwal.fire({ icon: "success", title: "Admin Added", text: "The new admin can now log in with their email & password (an OTP will be emailed to them).", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      adminSwal.fire({ icon: "error", title: "Failed", text: err.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    const result = await adminSwal.fire({ title: "Remove admin?", text: "This admin will no longer be able to log in.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "var(--card-border)", confirmButtonText: "Yes, remove", background: "#111827", color: "#fff" });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("aero_admin_token");
      const res = await fetch(`/api/admin/accounts?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete account.");
      fetchAdminAccounts();
      adminSwal.fire({ icon: "success", title: "Removed", text: data.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      adminSwal.fire({ icon: "error", title: "Failed", text: err.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  // Blog Editor section list actions
  const handleAddSection = () => {
    setBlogSections((prev) => [...prev, { title: "", content: "" }]);
  };

  const handleRemoveSection = (index) => {
    setBlogSections((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSectionChange = (index, field, value) => {
    setBlogSections((prev) =>
      prev.map((sec, idx) => (idx === index ? { ...sec, [field]: value } : sec))
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setBlogForm((prev) => ({
        ...prev,
        featured_image: data.publicUrl
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message?.includes("bucket") 
          ? "Please make sure you have created a public bucket named 'blog-images' in your Supabase Storage dashboard."
          : err.message || "Failed to upload image.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle blog form changes
  const handleBlogFormChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: value,
      // Auto generate slug if slug was empty and we are typing title
      slug: name === "title" && !editingBlogId ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : prev.slug
    }));
  };

  // Create or Update Blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const isBodyEmpty = !blogForm.body || blogForm.body.trim() === "" || blogForm.body === "<p><br></p>";
    if (!blogForm.title || !blogForm.slug || isBodyEmpty) {
      adminSwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Title, Slug, and Body text are required!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    const cleanedSections = blogSections.filter((sec) => sec.title.trim() !== "");

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug,
      category: blogForm.category,
      read_time: blogForm.read_time,
      author: blogForm.author,
      featured_image: blogForm.featured_image || null,
      quote: blogForm.quote || null,
      quote_source: blogForm.quote_source || null,
      body: blogForm.body,
      sections: cleanedSections,
      second_quote: blogForm.second_quote || null,
      second_quote_source: blogForm.second_quote_source || null,
      seo_title: blogForm.seo_title || blogForm.title,
      seo_description: blogForm.seo_description || blogForm.body.slice(0, 150),
      seo_keywords: blogForm.seo_keywords || ""
    };

    try {
      if (editingBlogId) {
        // Edit mode
        const { error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", editingBlogId);
        if (error) throw error;
      } else {
        // Create mode
        const { error } = await supabase
          .from("blogs")
          .insert([payload]);
        if (error) throw error;
      }

      // Reset Form
      setIsEditingBlog(false);
      setEditingBlogId(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setBlogForm({
        title: "",
        slug: "",
        category: "General",
        read_time: "5 min read",
        author: "Admin Team",
        featured_image: "",
        quote: "",
        quote_source: "",
        body: "",
        second_quote: "",
        second_quote_source: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: ""
      });
      setBlogSections([{ title: "", content: "" }]);
      fetchDashboardData();
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger Blog Create Form
  const triggerCreateBlog = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: "",
      slug: "",
      category: "General",
      read_time: "5 min read",
      author: "Admin Team",
      featured_image: "",
      quote: "",
      quote_source: "",
      body: "",
      second_quote: "",
      second_quote_source: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: ""
    });
    setBlogSections([{ title: "", content: "" }]);
    setIsEditingBlog(true);
  };

  // Trigger Blog Edit Form
  const triggerEditBlog = (blogItem) => {
    setEditingBlogId(blogItem.id);
    setBlogForm({
      title: blogItem.title || "",
      slug: blogItem.slug || "",
      category: blogItem.category || "General",
      read_time: blogItem.read_time || "5 min read",
      author: blogItem.author || "Admin Team",
      featured_image: blogItem.featured_image || "",
      quote: blogItem.quote || "",
      quote_source: blogItem.quote_source || "",
      body: blogItem.body || "",
      second_quote: blogItem.second_quote || "",
      second_quote_source: blogItem.second_quote_source || "",
      seo_title: blogItem.seo_title || "",
      seo_description: blogItem.seo_description || "",
      seo_keywords: blogItem.seo_keywords || ""
    });
    setBlogSections(blogItem.sections && blogItem.sections.length > 0 ? blogItem.sections : [{ title: "", content: "" }]);
    setIsEditingBlog(true);
  };

  // Delete Blog Post
  const handleDeleteBlog = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Publication has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Contact message
  const handleDeleteContact = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this contact submission record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Contact submission has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a teacher application record
  const handleDeleteTeacherApp = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this teacher application record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("teacher_applications").delete().eq("id", id);
      if (error) throw error;
      setSelectedTeacherApp(null);
      fetchDashboardData();
      adminSwal.fire({ icon: "success", title: "Deleted!", text: "Teacher application has been deleted.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      adminSwal.fire({ icon: "error", title: "Delete Failed", text: err.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  // Delete a student application record
  const handleDeleteStudentApp = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this student registration record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("student_applications").delete().eq("id", id);
      if (error) throw error;
      setSelectedStudentApp(null);
      fetchDashboardData();
      adminSwal.fire({ icon: "success", title: "Deleted!", text: "Student registration has been deleted.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      adminSwal.fire({ icon: "error", title: "Delete Failed", text: err.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  // --- CAREER JOBS ACTIONS ---
  const triggerCreateJob = () => {
    setJobForm({ title: "", job_title: "", meta: "", badge: "Online", description: "", order_index: careerJobs.length + 1 });
    setEditingJobId(null);
    setIsEditingJob(true);
  };

  const triggerEditJob = (job) => {
    setJobForm({
      title: job.title || "", job_title: job.job_title || "", meta: job.meta || "",
      badge: job.badge || "Online", description: job.description || "", order_index: job.order_index || 0
    });
    setEditingJobId(job.id);
    setIsEditingJob(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) {
      adminSwal.fire({ icon: "warning", title: "Missing title", text: "Please enter the job title.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: jobForm.title.trim(),
        job_title: jobForm.job_title.trim(),
        meta: jobForm.meta.trim(),
        badge: jobForm.badge.trim() || "Online",
        description: jobForm.description.trim(),
        order_index: Number(jobForm.order_index) || 0
      };
      const { error } = editingJobId
        ? await supabase.from("career_jobs").update(payload).eq("id", editingJobId)
        : await supabase.from("career_jobs").insert([payload]);
      if (error) throw error;
      setIsEditingJob(false);
      fetchDashboardData();
      adminSwal.fire({ icon: "success", title: editingJobId ? "Job Updated" : "Job Added", text: "The Careers page has been updated.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      const msg = err.message && err.message.toLowerCase().includes("career_jobs")
        ? "The career_jobs table is not set up yet. Please run the provided SQL in Supabase."
        : err.message;
      adminSwal.fire({ icon: "error", title: "Save Failed", text: msg, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    const result = await adminSwal.fire({ title: "Delete this job?", text: "It will be removed from the Careers page.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", cancelButtonColor: "var(--card-border)", confirmButtonText: "Yes, delete", background: "#111827", color: "#fff" });
    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("career_jobs").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({ icon: "success", title: "Deleted!", text: "Job opening has been removed.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } catch (err) {
      adminSwal.fire({ icon: "error", title: "Delete Failed", text: err.message, confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
    } finally {
      setLoading(false);
    }
  };

  // --- TEACHERS ACTIONS ---
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `teacher_${Date.now()}.${fileExt}`;
      const filePath = `teachers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setTeacherForm((prev) => ({
        ...prev,
        avatar_url: data.publicUrl
      }));
    } catch (err) {
      console.error("Avatar upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload avatar.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.languages || !teacherForm.experience || !teacherForm.specialization) {
      adminSwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Name, Languages, Experience, and Specialization are required!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    const payload = {
      name: teacherForm.name,
      avatar_url: teacherForm.avatar_url || null,
      languages: teacherForm.languages,
      experience: teacherForm.experience,
      specialization: teacherForm.specialization,
      bio: teacherForm.bio || null,
      order_index: parseInt(teacherForm.order_index) || 0
    };

    // Save helper — retries without `bio` if that column hasn't been added yet
    const saveTeacher = async (data) => {
      if (editingTeacherId) {
        return supabase.from("teachers").update(data).eq("id", editingTeacherId);
      }
      return supabase.from("teachers").insert([data]);
    };

    try {
      let { error } = await saveTeacher(payload);
      if (error && String(error.message || "").toLowerCase().includes("bio")) {
        // The bio column isn't set up yet — save the rest so teacher management still works
        const { bio, ...withoutBio } = payload;
        void bio;
        ({ error } = await saveTeacher(withoutBio));
      }
      if (error) throw error;

      // Reset Form
      setIsEditingTeacher(false);
      setEditingTeacherId(null);
      setTeacherForm({
        name: "",
        avatar_url: "",
        languages: "",
        experience: "",
        specialization: "",
        bio: "",
        order_index: 0
      });
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Saved!",
        text: "Teacher profile saved successfully.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerCreateTeacher = () => {
    setEditingTeacherId(null);
    setTeacherForm({
      name: "",
      avatar_url: "",
      languages: "",
      experience: "",
      specialization: "",
      order_index: 0
    });
    setIsEditingTeacher(true);
  };

  const triggerEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id);
    setTeacherForm({
      name: teacher.name || "",
      avatar_url: teacher.avatar_url || "",
      languages: teacher.languages || "",
      experience: teacher.experience || "",
      specialization: teacher.specialization || "",
      bio: teacher.bio || "",
      order_index: teacher.order_index || 0
    });
    setIsEditingTeacher(true);
  };

  const handleDeleteTeacher = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this teacher profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Teacher profile has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- TESTIMONIALS ACTIONS ---
  const handleTestimonialAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `testi_${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setTestimonialForm((prev) => ({
        ...prev,
        avatar_url: data.publicUrl
      }));
    } catch (err) {
      console.error("Testimonial avatar upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload avatar.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.role || !testimonialForm.content) {
      adminSwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Name, Role, and Content are required!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    // Check if at least one page is targeted
    const targets = testimonialForm.page_targets;
    const hasTargets = targets.all || targets.home || targets.about || targets.courses || targets.pricing;
    if (!hasTargets) {
      adminSwal.fire({
        icon: "warning",
        title: "Target Pages Required",
        text: "Please select at least one page or choose 'Show on All Pages'!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    
    // Serialize page targets
    let pageTargetStr = "all";
    if (!targets.all) {
      const activeTargets = [];
      if (targets.home) activeTargets.push("home");
      if (targets.about) activeTargets.push("about");
      if (targets.courses) activeTargets.push("courses");
      if (targets.pricing) activeTargets.push("pricing");
      pageTargetStr = activeTargets.join(",");
    }

    const payload = {
      name: testimonialForm.name,
      role: testimonialForm.role,
      content: testimonialForm.content,
      avatar_url: testimonialForm.avatar_url || null,
      page_target: pageTargetStr,
      order_index: parseInt(testimonialForm.order_index) || 0
    };

    try {
      if (editingTestimonialId) {
        // Edit mode
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingTestimonialId);
        if (error) throw error;
      } else {
        // Create mode
        const { error } = await supabase
          .from("testimonials")
          .insert([payload]);
        if (error) throw error;
      }

      setIsEditingTestimonial(false);
      setEditingTestimonialId(null);
      setTestimonialForm({
        name: "",
        role: "",
        content: "",
        avatar_url: "",
        page_targets: {
          all: true,
          home: false,
          about: false,
          courses: false,
          pricing: false
        },
        order_index: 0
      });
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Saved!",
        text: "Testimonial saved successfully.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerCreateTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      name: "",
      role: "",
      content: "",
      avatar_url: "",
      page_targets: {
        all: true,
        home: false,
        about: false,
        courses: false,
        pricing: false
      },
      order_index: 0
    });
    setIsEditingTestimonial(true);
  };

  const triggerEditTestimonial = (testi) => {
    setEditingTestimonialId(testi.id);
    
    // Parse page targets string
    const targets = {
      all: false,
      home: false,
      about: false,
      courses: false,
      pricing: false
    };
    
    if (testi.page_target === "all") {
      targets.all = true;
    } else if (testi.page_target) {
      const parts = testi.page_target.split(",").map(p => p.trim().toLowerCase());
      parts.forEach(p => {
        if (p in targets) targets[p] = true;
      });
    } else {
      targets.all = true; // Fallback
    }

    setTestimonialForm({
      name: testi.name || "",
      role: testi.role || "",
      content: testi.content || "",
      avatar_url: testi.avatar_url || "",
      page_targets: targets,
      order_index: testi.order_index || 0
    });
    setIsEditingTestimonial(true);
  };

  const handleDeleteTestimonial = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this testimonial?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Testimonial has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- COURSES ACTIONS ---
  const handleCourseImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `course_${Date.now()}.${fileExt}`;
      const filePath = `courses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setCourseForm((prev) => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (err) {
      console.error("Course image upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload course image.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title) {
      adminSwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Course Title is required!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    const base = {
      title: courseForm.title,
      image_url: courseForm.image_url || null,
      icon: courseForm.icon || "book",
      order_index: parseInt(courseForm.order_index) || 0
    };
    const payload = {
      ...base,
      short_description: courseForm.short_description || null,
      description: courseForm.description || null,
      level: courseForm.level || null,
      class_duration: courseForm.class_duration || null,
      course_duration: courseForm.course_duration || null,
      mode: courseForm.mode || null,
      age_group: courseForm.age_group || null,
      learn_points: courseForm.learn_points || null,
      requirements: courseForm.requirements || null,
      who_for: courseForm.who_for || null,
      content_details: courseForm.content_details || null,
      course_modules: courseForm.course_modules || null,
      faqs: courseForm.faqs || null
    };

    // Save helper — retries with only the base columns if the detail columns
    // haven't been added to the DB yet, so course management never breaks.
    const saveCourse = async (data) => {
      if (editingCourseId) {
        return supabase.from("courses").update(data).eq("id", editingCourseId);
      }
      return supabase.from("courses").insert([data]);
    };

    try {
      let { error } = await saveCourse(payload);
      if (error && /column|schema cache|could not find/i.test(String(error.message || ""))) {
        ({ error } = await saveCourse(base));
        if (!error) {
          adminSwal.fire({ icon: "info", title: "Saved (basic fields)", text: "Course saved. To store the detailed content & FAQ, please run the courses table SQL migration in Supabase.", confirmButtonColor: "var(--primary-color)", background: "#111827", color: "#fff" });
        }
      }
      if (error) throw error;

      setIsEditingCourse(false);
      setEditingCourseId(null);
      setCourseForm(EMPTY_COURSE_FORM);
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Saved!",
        text: "Course saved successfully.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerCreateCourse = () => {
    setEditingCourseId(null);
    setCourseForm(EMPTY_COURSE_FORM);
    setIsEditingCourse(true);
  };

  const triggerEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title || "",
      image_url: course.image_url || "",
      icon: course.icon || "book",
      order_index: course.order_index || 0,
      short_description: course.short_description || "",
      description: course.description || "",
      level: course.level || "",
      class_duration: course.class_duration || "",
      course_duration: course.course_duration || "",
      mode: course.mode || "",
      age_group: course.age_group || "",
      learn_points: course.learn_points || "",
      requirements: course.requirements || "",
      who_for: course.who_for || "",
      content_details: course.content_details || "",
      course_modules: course.course_modules || "",
      faqs: course.faqs || ""
    });
    setIsEditingCourse(true);
  };

  const handleDeleteCourse = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Course has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- PRICING PLANS ACTIONS ---
  const handleAddPlanFeature = () => {
    if (!newFeatureText.trim()) return;
    setPlanForm((prev) => ({
      ...prev,
      features: [...prev.features, { text: newFeatureText.trim(), included: newFeatureIncluded }]
    }));
    setNewFeatureText("");
  };

  const handleRemovePlanFeature = (indexToRemove) => {
    setPlanForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleTogglePlanFeatureIncluded = (idxToToggle) => {
    setPlanForm((prev) => ({
      ...prev,
      features: prev.features.map((f, idx) => 
        idx === idxToToggle ? { ...f, included: !f.included } : f
      )
    }));
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name || !planForm.price) {
      adminSwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Plan Name and Price are required!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
      return;
    }

    setLoading(true);
    const payload = {
      name: planForm.name,
      subtitle: planForm.subtitle || null,
      price: planForm.price,
      period: planForm.period || "/hour",
      icon: planForm.icon || "plane",
      badge: planForm.badge || null,
      features: planForm.features,
      order_index: parseInt(planForm.order_index) || 0
    };

    try {
      if (editingPlanId) {
        // Edit mode
        const { error } = await supabase
          .from("pricing_plans")
          .update(payload)
          .eq("id", editingPlanId);
        if (error) throw error;
      } else {
        // Create mode
        const { error } = await supabase
          .from("pricing_plans")
          .insert([payload]);
        if (error) throw error;
      }

      setIsEditingPlan(false);
      setEditingPlanId(null);
      setPlanForm({
        name: "",
        subtitle: "",
        price: "",
        period: "/hour",
        icon: "plane",
        badge: "",
        features: [],
        order_index: 0
      });
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Saved!",
        text: "Pricing plan saved successfully.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      name: "",
      subtitle: "",
      price: "",
      period: "/hour",
      icon: "plane",
      badge: "",
      features: [],
      order_index: 0
    });
    setNewFeatureText("");
    setIsEditingPlan(true);
  };

  const triggerEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name || "",
      subtitle: plan.subtitle || "",
      price: plan.price || "",
      period: plan.period || "/hour",
      icon: plan.icon || "plane",
      badge: plan.badge || "",
      features: plan.features || [],
      order_index: plan.order_index || 0
    });
    setNewFeatureText("");
    setIsEditingPlan(true);
  };

  const handleDeletePlan = async (id) => {
    const result = await adminSwal.fire({
      title: "Are you sure?",
      text: "Delete this pricing plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--card-border)",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff"
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("pricing_plans").delete().eq("id", id);
      if (error) throw error;
      fetchDashboardData();
      adminSwal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Pricing plan has been deleted.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `favicon_${Date.now()}.${fileExt}`;
      const filePath = `favicons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setSeoSettings((prev) => ({
        ...prev,
        favicon_url: data.publicUrl
      }));
      
      adminSwal.fire({
        icon: "success",
        title: "Favicon Uploaded!",
        text: "Make sure to click 'Save Global Configuration' below to save changes.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      console.error("Favicon upload failed:", err);
      adminSwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload favicon icon.",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save SEO Settings
  const handleSaveSEO = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("seo_settings")
        .upsert({
          id: "global",
          title: seoSettings.title,
          description: seoSettings.description,
          keywords: seoSettings.keywords,
          favicon_url: seoSettings.favicon_url || null,
          updated_at: new Date()
        });
      if (error) throw error;
      adminSwal.fire({
        icon: "success",
        title: "Updated!",
        text: "Global SEO settings updated successfully!",
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } catch (err) {
      adminSwal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message,
        confirmButtonColor: "var(--primary-color)",
        background: "#111827",
        color: "#fff"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERS ---

  const adminThemeStyle = {
    minHeight: "100vh",
    backgroundColor: "#fdfcf9",
    color: "#2c251e",
    fontFamily: "'Lora', Georgia, serif",
    /* Custom Admin Theme variables override */
    "--bg-color": "#fdfcf9",
    "--fg-color": "#2c251e",
    "--fg-muted": "#7c7267",
    "--primary-color": "#8c5d31",
    "--primary-glow": "rgba(140, 93, 49, 0.15)",
    "--secondary-color": "#3c3022",
    "--secondary-glow": "rgba(60, 48, 34, 0.15)",
    "--card-bg": "rgba(253, 250, 243, 0.9)",
    "--card-border": "#e3dbc9",
    "--card-hover-border": "#8c5d31",
    transition: "all 0.3s ease"
  };

  // Loading Screen (while checking local session token)
  if (isVerifyingSession) {
    return (
      <div style={{ ...adminThemeStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(140, 93, 49, 0.1)",
            borderTopColor: "var(--primary-color)",
            borderRadius: "50%"
          }} className="spinner"></div>
          <span style={{ fontSize: "14px", color: "var(--fg-muted)", fontWeight: "500" }}>Securing admin console connection...</span>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            animation: spin 1s linear infinite !important;
          }
        `}} />
      </div>
    );
  }

  // Auth Screen
  if (!isAuthenticated) {
    const loginInputStyle = {
      padding: "12px 18px",
      borderRadius: "9999px",
      border: "1px solid var(--card-border)",
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      color: "var(--fg-color)",
      outline: "none",
      fontSize: "15px",
      textAlign: "center",
      width: "100%"
    };

    return (
      <div style={{ ...adminThemeStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div className="glass-panel" style={{ padding: "40px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "16px", minHeight: "44px" }}>
              {logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={logoUrl} 
                  alt={logoText || "Yaqeen"} 
                  style={{ 
                    height: "40px", 
                    maxHeight: "44px", 
                    width: "auto", 
                    objectFit: "contain", 
                    borderRadius: "4px" 
                  }} 
                />
              ) : (
                <span style={{ 
                  textTransform: "capitalize", 
                  color: "#2c251e", 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: "500", 
                  fontSize: "24px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px" 
                }}>
                  <span className="logo-dot"></span>
                  {logoText || "yaqeen"} Admin
                </span>
              )}
            </div>
            <p style={{ color: "var(--fg-muted)", fontSize: "14px" }}>
              {!otpSent ? "Sign in to manage your website panel" : "Enter the verification code sent to email"}
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="email" style={{ fontSize: "12px", fontWeight: "600", color: "var(--fg-muted)" }}>Admin Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="admin@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  disabled={authLoading}
                  style={loginInputStyle}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="password" style={{ fontSize: "12px", fontWeight: "600", color: "var(--fg-muted)" }}>Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  disabled={authLoading}
                  style={loginInputStyle}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={authLoading} style={{ justifyContent: "center", marginTop: "8px" }}>
                {authLoading ? "Authenticating..." : "Send Verification OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label htmlFor="otp" style={{ fontSize: "12px", fontWeight: "600", color: "var(--fg-muted)", textAlign: "center" }}>One-Time Password (OTP)</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                  disabled={authLoading}
                  style={{
                    ...loginInputStyle,
                    fontSize: "24px",
                    letterSpacing: "8px",
                    fontWeight: "500"
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={authLoading} style={{ justifyContent: "center", marginTop: "8px" }}>
                {authLoading ? "Verifying..." : "Verify & Unlock"}
              </button>

              <button 
                type="button" 
                onClick={handleCancelOtp} 
                className="btn-secondary" 
                style={{ 
                  justifyContent: "center",
                  color: "#2C251E",
                  borderColor: "#EADDC8",
                  background: "rgba(0, 0, 0, 0.03)"
                }}
              >
                Go Back
              </button>
            </form>
          )}

          <div style={{ textAlign: "center", fontSize: "11px", color: "var(--fg-muted)" }}>
            Default credentials: <code style={{ color: "var(--secondary-color)" }}>objectsquarerajan@gmail.com</code> / <code style={{ color: "var(--secondary-color)" }}>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Group contacts by country
  const getCountryStats = () => {
    const stats = {};
    contacts.forEach(c => {
      const country = c.country || "Unknown";
      stats[country] = (stats[country] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Group contacts by ISP provider
  const getProviderStats = () => {
    const stats = {};
    contacts.forEach(c => {
      const provider = c.provider || "Unknown";
      stats[provider] = (stats[provider] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getCountryFlag = (country) => {
    if (!country) return "🌐";
    const codeMap = {
      "india": "🇮🇳",
      "united states": "🇺🇸",
      "united kingdom": "🇬🇧",
      "united arab emirates": "🇦🇪",
      "saudi arabia": "🇸🇦",
      "pakistan": "🇵🇰",
      "canada": "🇨🇦",
      "australia": "🇦🇺",
      "bangladesh": "🇧🇩",
      "germany": "🇩🇪",
      "france": "🇫🇷"
    };
    return codeMap[country.toLowerCase()] || "🌐";
  };

  return (
    <div className="admin-shell" style={{ ...adminThemeStyle, display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Fix secondary buttons styling in admin panel to be legible against cream background */
        .btn-secondary {
          color: var(--fg-color) !important;
          border-color: var(--card-border) !important;
          background: rgba(0, 0, 0, 0.02) !important;
        }
        .btn-secondary:hover {
          background: rgba(0, 0, 0, 0.05) !important;
          color: var(--primary-color) !important;
          border-color: var(--primary-color) !important;
        }

        /* ---------- Responsive: tablet & mobile ---------- */
        @media (max-width: 1024px) {
          .admin-overview-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 900px) {
          /* Sidebar becomes a top app-bar; content takes full width */
          .admin-shell { grid-template-columns: 1fr !important; }
          .admin-sidebar {
            position: sticky !important;
            top: 0 !important;
            z-index: 200 !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--card-border) !important;
            padding: 12px 14px !important;
            gap: 10px !important;
          }
          /* Show the hamburger toggle */
          .admin-hamburger { display: flex !important; align-items: center; justify-content: center; }
          /* Collapsible drawer: hidden until the hamburger opens it */
          .admin-nav {
            display: none !important;
            gap: 4px !important;
            max-height: 65vh;
            overflow-y: auto;
            padding-top: 6px !important;
            border-top: 1px solid var(--card-border);
          }
          .admin-nav.open { display: flex !important; }
          .admin-nav button {
            width: 100% !important;
            border-left: none !important;
            border-radius: 8px !important;
          }
          /* Logout lives inside the drawer */
          .admin-logout-btn { display: none !important; margin-top: 6px !important; }
          .admin-nav.open ~ .admin-logout-btn { display: flex !important; }
          .admin-main { padding: 22px 16px !important; max-height: none !important; }
          .admin-header { flex-wrap: wrap !important; gap: 10px !important; }
          .admin-header h2 { font-size: 22px !important; }
          .admin-overview-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .admin-main { padding: 16px 12px !important; }
          .admin-overview-grid { grid-template-columns: repeat(2, 1fr) !important; }
          /* Collapse common multi-column form rows to a single column */
          .admin-main div[style*="1fr 1fr"],
          .admin-main div[style*="repeat(2, 1fr)"],
          .admin-main div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          .admin-header h2 { font-size: 20px !important; }
        }
      `}} />
      {/* Sidebar navigation */}
      <aside className="admin-sidebar" style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid var(--card-border)", 
        padding: "32px 16px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "32px", 
        backgroundColor: "#f6ede0", // Warm light beige sidebar background
        flexShrink: 0
      }}>
        <div className="admin-logo-row" style={{ paddingLeft: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "40px" }}>
          {profileForm.logo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={profileForm.logo_url}
              alt={profileForm.logo_text || "Yaqeen"}
              style={{
                height: "36px",
                maxHeight: "36px",
                width: "auto",
                objectFit: "contain",
                borderRadius: "4px"
              }}
            />
          ) : (
            <span style={{
              textTransform: "capitalize",
              color: "#2c251e",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "500",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span className="logo-dot"></span>
              {profileForm.logo_text || "yaqeen"}
            </span>
          )}

          {/* Hamburger — visible only on mobile via CSS */}
          <button
            className="admin-hamburger"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
            style={{
              display: "none",
              background: "none",
              border: "1px solid var(--card-border)",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              color: "#2c251e",
              lineHeight: 0
            }}
          >
            {mobileNavOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>

        <nav className={`admin-nav ${mobileNavOpen ? "open" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
          <button
            onClick={() => handleTabChange("overview")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "overview" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "overview" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            📊 Overview
          </button>
          <button
            onClick={() => handleTabChange("blogs")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "blogs" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "blogs" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            📝 Manage Blogs
          </button>
          <button
            onClick={() => handleTabChange("contacts")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "contacts" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "contacts" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            📬 Contact Inbox
          </button>
          <button
            onClick={() => handleTabChange("freeTrials")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "freeTrials" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "freeTrials" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🎯 Free Trial Bookings
          </button>
          <button
            onClick={() => handleTabChange("teacherApps")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "teacherApps" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "teacherApps" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🧑‍🏫 Teacher Applications
          </button>
          <button
            onClick={() => handleTabChange("studentApps")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "studentApps" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "studentApps" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🧒 Student Registrations
          </button>
          <button
            onClick={() => handleTabChange("jobs")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "jobs" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "jobs" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            💼 Career Jobs
          </button>
          <button
            onClick={() => handleTabChange("seo")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "seo" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "seo" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🌐 SEO Manager
          </button>
          <button
            onClick={() => handleTabChange("teachers")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "teachers" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "teachers" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🎓 Manage Teachers
          </button>
          <button
            onClick={() => handleTabChange("courses")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "courses" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "courses" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            📚 Manage Courses
          </button>
          <button
            onClick={() => handleTabChange("testimonials")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "testimonials" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "testimonials" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            💬 Manage Testimonials
          </button>
          <button
            onClick={() => handleTabChange("plans")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "plans" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "plans" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            💵 Manage Plans
          </button>
          <button
            onClick={() => handleTabChange("profile")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "profile" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "profile" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            👤 Profile Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout} 
          className="admin-logout-btn" 
          style={{ 
            marginTop: "auto", 
            width: "100%", 
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "9999px",
            border: "1px solid #e3dbc9",
            backgroundColor: "#f0ebd8",
            color: "#4a3e30",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 2px 6px rgba(140, 93, 49, 0.05)",
            transition: "all 0.2s ease"
          }}
        >
          <span>🚪</span> Logout Console
        </button>
      </aside>

      {/* Main panel content */}
      <main className="admin-main" style={{ padding: "40px", overflowY: "auto", maxHeight: "100vh" }}>
        {/* Header toolbar */}
        <div className="admin-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--card-border)", paddingBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "500" }}>
              {activeTab === "overview" && "System Overview"}
              {activeTab === "blogs" && (isEditingBlog ? (editingBlogId ? "Edit Blog Post" : "Write New Publication") : "Blog Publications")}
              {activeTab === "contacts" && "Contact Query Logs"}
              {activeTab === "freeTrials" && "Free Trial Bookings"}
              {activeTab === "teacherApps" && "Teacher Applications"}
              {activeTab === "studentApps" && "Student Registrations"}
              {activeTab === "jobs" && (isEditingJob ? (editingJobId ? "Edit Job Opening" : "Add Job Opening") : "Career Job Openings")}
              {activeTab === "seo" && "Site SEO Meta Settings"}
              {activeTab === "teachers" && (isEditingTeacher ? (editingTeacherId ? "Edit Teacher Profile" : "Register New Teacher") : "Teacher Profiles")}
              {activeTab === "courses" && (isEditingCourse ? (editingCourseId ? "Edit Course Details" : "Add New Course") : "Islamic Courses")}
              {activeTab === "testimonials" && (isEditingTestimonial ? (editingTestimonialId ? "Edit Testimonial" : "Add New Testimonial") : "Client Testimonials")}
              {activeTab === "plans" && (isEditingPlan ? (editingPlanId ? "Edit Pricing Plan" : "Create Pricing Plan") : "Pricing Plans")}
              {activeTab === "profile" && "Profile Credentials Settings"}
            </h2>
            <p style={{ color: "var(--fg-muted)", fontSize: "14px", marginTop: "4px" }}>
              {activeTab === "overview" && "Real-time summary metrics across database logs."}
              {activeTab === "blogs" && "Author articles, categories, list points, and search engine fields."}
              {activeTab === "contacts" && "Review customer forms, inquiries, and details."}
              {activeTab === "freeTrials" && "Review free trial class booking requests submitted by visitors."}
              {activeTab === "teacherApps" && "Review teacher job applications with full details, CV and audio files."}
              {activeTab === "studentApps" && "Review student registration form submissions with course, plan, and scheduling details."}
              {activeTab === "jobs" && "Add, edit and remove the job openings shown on the Careers page."}
              {activeTab === "seo" && "Configure key page head parameters for Google crawlers."}
              {activeTab === "teachers" && "Manage profiles, avatars, languages, experience, and topics of Islamic teachers."}
              {activeTab === "courses" && "Manage online courses, thumbnails, icons, and display order."}
              {activeTab === "testimonials" && "Manage customer testimonials and select target pages for display."}
              {activeTab === "plans" && "Configure pricing plans, rates, ribbons, and itemized feature checklists."}
              {activeTab === "profile" && "Manage your login email and password."}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {activeTab === "studentApps" && (
              <a 
                href="/student-form" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ 
                  textDecoration: "none", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  backgroundColor: "#4A5D3B",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(74, 93, 59, 0.2)",
                  transition: "background-color 0.2s ease"
                }}
              >
                👁️ View Page
              </a>
            )}
            {loading && <span style={{ color: "var(--secondary-color)", fontSize: "13px" }}>Syncing Database...</span>}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Stats Cards Row */}
            <div className="admin-overview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "12px" }}>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Published Blogs</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "var(--secondary-color)" }}>{blogs.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Registered Teachers</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "#C99B4D" }}>{teachers.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Client Testimonials</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "#8c5d31" }}>{testimonials.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Active Courses</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "#4A5D3B" }}>{courses.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Active Plans</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "#C99B4D" }}>{plans.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Contact Forms</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "var(--accent-color)" }}>{contacts.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "16px 12px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "11px" }}>Waitlist Leads</div>
                <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "8px", color: "var(--primary-color)" }}>{leadsCount}</div>
              </div>
            </div>

            {/* Analytics and Inquiries Container */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
              {/* Left Side: Recent Inquiries */}
              <div className="glass-panel" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Recent Inquiries</h3>
                {contacts.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px" }}>No recent contact messages found.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Name</th>
                          <th style={{ padding: "12px" }}>Email</th>
                          <th style={{ padding: "12px" }}>Subject</th>
                          <th style={{ padding: "12px" }}>Submitted At</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.slice(0, 10).map((c) => (
                          <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{c.name}</td>
                            <td style={{ padding: "12px" }}><a href={`mailto:${c.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>{c.email}</a></td>
                            <td style={{ padding: "12px" }}>{c.subject}</td>
                            <td style={{ padding: "12px" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: "12px", textAlign: "right" }}>
                              <button 
                                onClick={() => setSelectedContact(c)} 
                                className="btn-secondary" 
                                style={{ padding: "4px 10px", fontSize: "12px" }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Side: Geolocation Analytics */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Country Breakdown Panel */}
                <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#2B1F14", margin: 0, fontFamily: "var(--font-serif), Georgia, serif" }}>
                    🌍 Country Geolocation Analytics
                  </h3>
                  
                  {contacts.length === 0 ? (
                    <p style={{ color: "var(--fg-muted)", fontSize: "13px" }}>No location data logged yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {getCountryStats().map(({ country, count }) => {
                        const percent = Math.round((count / contacts.length) * 100);
                        return (
                          <div key={country} style={{ fontSize: "13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontWeight: "500" }}>
                              <span>{getCountryFlag(country)} {country}</span>
                              <span style={{ color: "var(--secondary-color)" }}>{count} {count === 1 ? "user" : "users"} ({percent}%)</span>
                            </div>
                            <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(0,0,0,0.03)", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{
                                width: `${percent}%`,
                                height: "100%",
                                backgroundColor: "var(--secondary-color)",
                                borderRadius: "3px"
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BLOG MANAGEMENT */}
        {activeTab === "blogs" && (
          <div>
            {!isEditingBlog ? (
              // Blogs List Screen
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Published Records</h3>
                  <button onClick={triggerCreateBlog} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    + New Blog Post
                  </button>
                </div>

                {blogs.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No posts created. Click New Blog to write your first post.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Title</th>
                          <th style={{ padding: "12px" }}>Category</th>
                          <th style={{ padding: "12px" }}>Author</th>
                          <th style={{ padding: "12px" }}>Slug</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((b) => (
                          <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{b.title}</td>
                            <td style={{ padding: "12px" }}><span style={{ padding: "3px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", fontSize: "12px" }}>{b.category}</span></td>
                            <td style={{ padding: "12px" }}>{b.author}</td>
                            <td style={{ padding: "12px", fontFamily: "monospace", color: "var(--fg-muted)" }}>{b.slug}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button onClick={() => triggerEditBlog(b)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeleteBlog(b.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Blog Write / Edit Form
              <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Article Details</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Article Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={blogForm.title}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. The Beauty of Tadabbur: Reflecting on the Quran"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Slug (URL Part) *</label>
                      <input
                        type="text"
                        name="slug"
                        value={blogForm.slug}
                        onChange={handleBlogFormChange}
                        placeholder="beauty-of-tadabbur-reflecting-on-the-quran"
                        required
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Category</label>
                      <input
                        type="text"
                        name="category"
                        value={blogForm.category}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. Quran & Tafsir"
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Read Time</label>
                      <input
                        type="text"
                        name="read_time"
                        value={blogForm.read_time}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. 5 min read"
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Author</label>
                      <input
                        type="text"
                        name="author"
                        value={blogForm.author}
                        onChange={handleBlogFormChange}
                        placeholder="Yaqeen Institute Team"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Featured Image URL</label>
                      <input
                        type="text"
                        name="featured_image"
                        value={blogForm.featured_image}
                        onChange={handleBlogFormChange}
                        placeholder="https://images.unsplash.com/..."
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Or Upload Local Image</label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          style={{
                            ...formInputStyle,
                            padding: "8px 12px",
                            flex: 1,
                            fontSize: "13px"
                          }}
                        />
                        {uploading && <span style={{ color: "var(--secondary-color)", fontSize: "12px" }}>Uploading...</span>}
                      </div>
                    </div>
                  </div>

                  {blogForm.featured_image && (
                    <div style={{ marginTop: "4px", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "8px", width: "fit-content", display: "flex", gap: "12px", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blogForm.featured_image} alt="Preview" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>Image Preview</span>
                        <button type="button" onClick={() => setBlogForm(prev => ({ ...prev, featured_image: "" }))} style={{ color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove Image</button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Article Body Content *</label>
                    <div style={{ position: "relative" }} className="quill-editor-container">
                      <div ref={quillRef} style={{ minHeight: "250px" }} />
                    </div>
                  </div>
                </div>

                {/* Structured Sections builder */}
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Bullet Sections (List Points)</h3>
                    <button type="button" onClick={handleAddSection} className="btn-secondary" style={{ padding: "4px 12px", fontSize: "12px" }}>
                      + Add List Item
                    </button>
                  </div>
                  <p style={{ color: "var(--fg-muted)", fontSize: "12px" }}>These generate the circle-numbered points (like What is Tadabbur?, Why is it Important?, etc.) in the blog body.</p>
                  
                  {blogSections.map((sec, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "16px", alignItems: "start", borderBottom: "1px dashed rgba(255,255,255,0.03)", paddingBottom: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <input
                          type="text"
                          placeholder={`Item ${idx + 1} Title`}
                          value={sec.title}
                          onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                          style={formInputStyle}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <textarea
                          placeholder={`Explanatory text for list item ${idx + 1}`}
                          rows="2"
                          value={sec.content}
                          onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                          style={{ ...formTextareaStyle, padding: "8px 12px", borderRadius: "8px" }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        disabled={blogSections.length === 1}
                        className="btn-secondary"
                        style={{ padding: "8px 12px", color: "#ef4444", fontSize: "12px", alignSelf: "center" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quotes Panels */}
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Featured Quotes (Block Quotes)</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Featured Quote 1 (Top Block)</label>
                      <input
                        type="text"
                        name="quote"
                        value={blogForm.quote}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. Do they not then reflect on the Quran?"
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Quote 1 Source</label>
                      <input
                        type="text"
                        name="quote_source"
                        value={blogForm.quote_source}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. Quran (47:24)"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Featured Quote 2 (Bottom Lantern Block)</label>
                      <input
                        type="text"
                        name="second_quote"
                        value={blogForm.second_quote}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. And We have certainly made the Quran easy for remembrance..."
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Quote 2 Source</label>
                      <input
                        type="text"
                        name="second_quote_source"
                        value={blogForm.second_quote_source}
                        onChange={handleBlogFormChange}
                        placeholder="e.g. Quran (54:17)"
                        style={formInputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Panel */}
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>SEO Search Meta</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>SEO Header Title</label>
                    <input
                      type="text"
                      name="seo_title"
                      value={blogForm.seo_title}
                      onChange={handleBlogFormChange}
                      placeholder="Custom SEO Title (uses Blog Title if empty)"
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>SEO Description</label>
                    <textarea
                      name="seo_description"
                      rows="2"
                      value={blogForm.seo_description}
                      onChange={handleBlogFormChange}
                      placeholder="Write brief crawler summary..."
                      style={formTextareaStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>SEO Keywords</label>
                    <input
                      type="text"
                      name="seo_keywords"
                      value={blogForm.seo_keywords}
                      onChange={handleBlogFormChange}
                      placeholder="Tadabbur, Quran, reflection, Yaqeen"
                      style={formInputStyle}
                    />
                  </div>
                </div>

                {/* Action Form buttons */}
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsEditingBlog(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                    {editingBlogId ? "Save Article" : "Publish Article"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT INBOX */}
        {activeTab === "contacts" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Received Inquiries</h3>
            
            {inquiries.length === 0 ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Inbox empty. All clean!</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                      <th style={{ padding: "12px" }}>Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Subject</th>
                      <th style={{ padding: "12px" }}>Date</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((msg) => (
                      <tr key={msg.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{msg.name}</td>
                        <td style={{ padding: "12px" }}>
                          <a href={`mailto:${msg.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>{msg.email}</a>
                        </td>
                        <td style={{ padding: "12px" }}>{msg.subject}</td>
                        <td style={{ padding: "12px" }}>{new Date(msg.created_at).toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "49px", alignItems: "center" }}>
                          <button onClick={() => setSelectedContact(msg)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                            View Detail
                          </button>
                          <button onClick={() => handleDeleteContact(msg.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "freeTrials" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Free Trial Class Bookings</h3>

            {freeTrials.length === 0 ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No free trial bookings yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                      <th style={{ padding: "12px" }}>Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Interested In</th>
                      <th style={{ padding: "12px" }}>Booked On</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {freeTrials.map((booking) => {
                      const parts = (booking.subject || "").split("—");
                      const course = parts.length > 1 ? parts[1].trim() : "General";
                      return (
                        <tr key={booking.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "12px", fontWeight: "600" }}>{booking.name}</td>
                          <td style={{ padding: "12px" }}>
                            <a href={`mailto:${booking.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>{booking.email}</a>
                          </td>
                          <td style={{ padding: "12px" }}>{course}</td>
                          <td style={{ padding: "12px" }}>{new Date(booking.created_at).toLocaleString()}</td>
                          <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "49px", alignItems: "center" }}>
                            <button onClick={() => setSelectedContact(booking)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                              View Detail
                            </button>
                            <button onClick={() => handleDeleteContact(booking.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "teacherApps" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Teacher Job Applications</h3>

            {teacherApps.length === 0 ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No teacher applications yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                      <th style={{ padding: "12px" }}>Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Applying For</th>
                      <th style={{ padding: "12px" }}>Applied On</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherApps.map((app) => (
                      <tr key={app.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{`${app.first_name || ""} ${app.last_name || ""}`.trim() || "—"}</td>
                        <td style={{ padding: "12px" }}>
                          <a href={`mailto:${app.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>{app.email}</a>
                        </td>
                        <td style={{ padding: "12px" }}>{app.applying_for || "—"}</td>
                        <td style={{ padding: "12px" }}>{new Date(app.created_at).toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "49px", alignItems: "center" }}>
                          <button onClick={() => setSelectedTeacherApp(app)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                            View Detail
                          </button>
                          <button onClick={() => handleDeleteTeacherApp(app.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "studentApps" && (
          <div className="glass-panel" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Student Registrations</h3>

            {studentApps.length === 0 ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No student registrations yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                      <th style={{ padding: "12px" }}>Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Course</th>
                      <th style={{ padding: "12px" }}>Plan</th>
                      <th style={{ padding: "12px" }}>Price/Month</th>
                      <th style={{ padding: "12px" }}>Applied On</th>
                      <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentApps.map((app) => (
                      <tr key={app.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{`${app.first_name || ""} ${app.last_name || ""}`.trim() || "—"}</td>
                        <td style={{ padding: "12px" }}>
                          <a href={`mailto:${app.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>{app.email}</a>
                        </td>
                        <td style={{ padding: "12px" }}>{app.course || "—"}</td>
                        <td style={{ padding: "12px" }}>{app.pricing_plan || "—"}</td>
                        <td style={{ padding: "12px" }}>${app.monthly_price || "0"}</td>
                        <td style={{ padding: "12px" }}>{new Date(app.created_at).toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "49px", alignItems: "center" }}>
                          <button onClick={() => setSelectedStudentApp(app)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>
                            View Detail
                          </button>
                          <button onClick={() => handleDeleteStudentApp(app.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Student Application Detail Modal */}
        {selectedStudentApp && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px", boxSizing: "border-box" }}>
            <div className="glass-panel" style={{ width: "100%", maxWidth: "720px", backgroundColor: "#FFFDF9", border: "1px solid #EADDC8", borderRadius: "20px", boxShadow: "0 20px 50px rgba(44, 37, 30, 0.15)", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#2B1F14", margin: 0, fontFamily: "var(--font-serif), Georgia, serif" }}>
                  {`${selectedStudentApp.first_name || ""} ${selectedStudentApp.last_name || ""}`.trim()} — Student Details
                </h3>
                <button onClick={() => setSelectedStudentApp(null)} style={{ background: "none", border: "none", fontSize: "24px", color: "var(--fg-muted)", cursor: "pointer", padding: 0, lineHeight: 1 }}>&times;</button>
              </div>

              <div style={{ padding: "24px", overflowY: "auto", textAlign: "left" }}>
                {(() => {
                  const a = selectedStudentApp;
                  const rows = [
                    ["Gender", a.gender], ["Email", a.email], ["Mobile", `${a.dial_code || ""} ${a.mobile || ""}`.trim()],
                    ["Country", a.country], ["Age Group", a.age_group],
                    ["Course", a.course], ["Hours / Week", a.hours_per_week],
                    ["Pricing Plan", a.pricing_plan], ["Estimated Price/Month", `$${a.monthly_price}`],
                    ["Preferred Days", a.preferred_days], ["Preferred Start Date", a.preferred_date],
                    ["Preferred Daily Time", a.preferred_time], ["Applied On", new Date(a.created_at).toLocaleString()]
                  ];
                  return (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
                        {rows.filter(([, v]) => v).map(([label, v]) => (
                          <div key={label}>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>{label}</span>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#2B1F14", marginTop: "3px", wordBreak: "break-word" }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "22px" }}>
                        <button onClick={() => handleDeleteStudentApp(a.id)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px", color: "#ef4444" }}>Delete Registration</button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Teacher Application Detail Modal */}
        {selectedTeacherApp && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px", boxSizing: "border-box" }}>
            <div className="glass-panel" style={{ width: "100%", maxWidth: "720px", backgroundColor: "#FFFDF9", border: "1px solid #EADDC8", borderRadius: "20px", boxShadow: "0 20px 50px rgba(44, 37, 30, 0.15)", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#2B1F14", margin: 0, fontFamily: "var(--font-serif), Georgia, serif" }}>
                  {`${selectedTeacherApp.first_name || ""} ${selectedTeacherApp.last_name || ""}`.trim()} — Application
                </h3>
                <button onClick={() => setSelectedTeacherApp(null)} style={{ background: "none", border: "none", fontSize: "24px", color: "var(--fg-muted)", cursor: "pointer", padding: 0, lineHeight: 1 }}>&times;</button>
              </div>

              <div style={{ padding: "24px", overflowY: "auto", textAlign: "left" }}>
                {(() => {
                  const a = selectedTeacherApp;
                  const rows = [
                    ["Gender", a.gender], ["Email", a.email], ["Mobile", `${a.dial_code || ""} ${a.mobile || ""}`.trim()],
                    ["Country", a.country], ["Date of Birth", a.date_of_birth], ["Nationality", a.nationality],
                    ["Occupation", a.occupation], ["Marital Status", a.marital_status], ["Facebook", a.facebook],
                    ["Education", a.education], ["Years of Experience", a.years_experience],
                    ["Mother Language", a.mother_language], ["Other Language", a.other_language],
                    ["Applying For", a.applying_for], ["Has Ijazah", a.has_ijazah],
                    ["Teach Tajweed in English", a.teach_tajweed_english], ["Has Children", a.has_children],
                    ["Preferred Interview Time", a.preferred_interview_time], ["Expected Salary", a.expected_salary],
                    ["Hours / Week", a.hours_per_week], ["Employment Type", a.employment_type],
                    ["How Found Us", a.how_found], ["Applied On", new Date(a.created_at).toLocaleString()]
                  ];
                  const files = [
                    ["Profile Image", a.profile_image_url], ["CV", a.cv_url],
                    ["Reading Audio", a.reading_audio_url], ["Recitation Audio", a.recitation_audio_url]
                  ].filter(([, url]) => url);
                  return (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px" }}>
                        {rows.filter(([, v]) => v).map(([label, v]) => (
                          <div key={label}>
                            <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>{label}</span>
                            <div style={{ fontSize: "14px", fontWeight: "600", color: "#2B1F14", marginTop: "3px", wordBreak: "break-word" }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {a.about_me && (
                        <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "18px", paddingTop: "14px" }}>
                          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>About Me</span>
                          <p style={{ fontSize: "14px", color: "#4A3B2C", marginTop: "6px", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{a.about_me}</p>
                        </div>
                      )}
                      {a.ideal_candidate && (
                        <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "14px", paddingTop: "14px" }}>
                          <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Ideal Candidate</span>
                          <p style={{ fontSize: "14px", color: "#4A3B2C", marginTop: "6px", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{a.ideal_candidate}</p>
                        </div>
                      )}

                      {files.length > 0 && (
                        <div style={{ borderTop: "1px solid var(--card-border)", marginTop: "14px", paddingTop: "16px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {files.map(([label, url]) => (
                            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "13px", textDecoration: "none", borderRadius: "8px" }}>
                              ⬇ {label}
                            </a>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "22px" }}>
                        <button onClick={() => handleDeleteTeacherApp(a.id)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px", color: "#ef4444" }}>Delete Application</button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div>
            {!isEditingJob ? (
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Job Openings</h3>
                  <button onClick={triggerCreateJob} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>+ Add Job</button>
                </div>
                {careerJobs.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No job openings yet. Click &ldquo;Add Job&rdquo; to create one.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px", width: "70px" }}>Order</th>
                          <th style={{ padding: "12px" }}>Title</th>
                          <th style={{ padding: "12px" }}>Job Title</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {careerJobs.map((job) => (
                          <tr key={job.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px" }}>{job.order_index}</td>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{job.title}</td>
                            <td style={{ padding: "12px" }}>{job.job_title}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "49px", alignItems: "center" }}>
                              <button onClick={() => triggerEditJob(job)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeleteJob(job.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveJob} className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Title *</label>
                    <input value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Quran Teacher — Female" style={formInputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Job Title</label>
                    <input value={jobForm.job_title} onChange={(e) => setJobForm((p) => ({ ...p, job_title: e.target.value }))} placeholder="e.g. Quran Study with Tajweed" style={formInputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 100px", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Meta (details line)</label>
                    <input value={jobForm.meta} onChange={(e) => setJobForm((p) => ({ ...p, meta: e.target.value }))} placeholder="Permanent | 2 Years Exp. | Bilingual" style={formInputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Badge</label>
                    <input value={jobForm.badge} onChange={(e) => setJobForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Online" style={formInputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Order</label>
                    <input type="number" value={jobForm.order_index} onChange={(e) => setJobForm((p) => ({ ...p, order_index: e.target.value }))} style={formInputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={formLabelStyle}>Description</label>
                  <textarea value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description of the role and requirements…" style={{ ...formInputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setIsEditingJob(false)} className="btn-secondary" style={{ padding: "10px 20px", fontSize: "13px" }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: "10px 22px", fontSize: "13px" }}>{editingJobId ? "Update Job" : "Save Job"}</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Contact Inquiry Detail Modal */}
        {selectedContact && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box"
          }}>
            <div className="glass-panel" style={{
              width: "100%",
              maxWidth: "650px",
              backgroundColor: "#FFFDF9",
              border: "1px solid #EADDC8",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(44, 37, 30, 0.15)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              overflow: "hidden"
            }}>
              {/* Modal Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--card-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "500", color: "#2B1F14", margin: 0, fontFamily: "var(--font-serif), Georgia, serif" }}>
                  Inquiry Detail
                </h3>
                <button 
                  onClick={() => setSelectedContact(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    color: "var(--fg-muted)",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                textAlign: "left"
              }}>
                {/* Contact Basics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Sender Name</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#2B1F14", marginTop: "4px" }}>{selectedContact.name}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Email Address</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", marginTop: "4px" }}>
                      <a href={`mailto:${selectedContact.email}`} style={{ color: "var(--secondary-color)", textDecoration: "none" }}>
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Subject</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#2B1F14", marginTop: "4px" }}>{selectedContact.subject}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Date Submitted</span>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "#2B1F14", marginTop: "4px" }}>
                      {new Date(selectedContact.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>Message Content</span>
                  <p style={{
                    fontSize: "14.5px",
                    lineHeight: "1.6",
                    color: "#4A3B2C",
                    backgroundColor: "rgba(0,0,0,0.015)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "10px",
                    padding: "14px",
                    marginTop: "6px",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedContact.message}
                  </p>
                </div>

                {/* Telemetry metadata block */}
                <div style={{
                  borderTop: "1px solid var(--card-border)",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "500", color: "var(--fg-muted)" }}>User Telemetry Metadata</span>
                  
                  <div style={{
                    padding: "14px",
                    backgroundColor: "#FAF6F0",
                    border: "1px solid rgba(201, 155, 77, 0.2)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    <div>
                      🌐 <strong>IP Address:</strong> <span style={{ fontFamily: "monospace", color: "#C99B4D", fontWeight: "600" }}>{selectedContact.ip_address || "N/A (Local / Legacy)"}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", borderTop: "1px dashed rgba(201, 155, 77, 0.15)", paddingTop: "8px", color: "#2B1F14" }}>
                      <span>📍 <strong>City:</strong> {selectedContact.city || "Unknown"}</span>
                      <span>🏛️ <strong>State/Region:</strong> {selectedContact.state || "Unknown"}</span>
                      <span>🗺️ <strong>Country:</strong> {selectedContact.country || "Unknown"}</span>
                      <span>🏢 <strong>Provider/ISP:</strong> {selectedContact.provider || "Unknown"}</span>
                    </div>
                    <div>
                      💻 <strong>System Specs:</strong> <span style={{ color: "#2B1F14" }}>{selectedContact.system_info || "N/A"}</span>
                    </div>
                    <div style={{ borderTop: "1px dashed rgba(201, 155, 77, 0.15)", paddingTop: "8px", overflowX: "auto" }}>
                      🔍 <strong>User-Agent:</strong> <br />
                      <span style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--fg-muted)" }}>{selectedContact.browser_info || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: "16px 24px",
                borderTop: "1px solid var(--card-border)",
                display: "flex",
                justifyContent: "flex-end"
              }}>
                <button 
                  onClick={() => setSelectedContact(null)} 
                  className="btn-primary" 
                  style={{ padding: "10px 24px" }}
                >
                  Close Inquiry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEO MANAGER */}
        {activeTab === "seo" && (
          <form onSubmit={handleSaveSEO} className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Global Site Metadata</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={formLabelStyle}>Site Meta Title Template</label>
              <input
                type="text"
                value={seoSettings.title}
                onChange={(e) => setSeoSettings((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Aero - Premium Next.js App"
                required
                style={formInputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={formLabelStyle}>Site Meta Description</label>
              <textarea
                value={seoSettings.description}
                onChange={(e) => setSeoSettings((prev) => ({ ...prev, description: e.target.value }))}
                rows="4"
                placeholder="Deploy high-performance web applications..."
                required
                style={formTextareaStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={formLabelStyle}>Global Target Keywords</label>
              <input
                type="text"
                value={seoSettings.keywords}
                onChange={(e) => setSeoSettings((prev) => ({ ...prev, keywords: e.target.value }))}
                placeholder="nextjs, react, vanilla css, premium ui"
                required
                style={formInputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid var(--card-border)", paddingTop: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={formLabelStyle}>Favicon Icon URL</label>
                <input
                  type="text"
                  value={seoSettings.favicon_url || ""}
                  onChange={(e) => setSeoSettings((prev) => ({ ...prev, favicon_url: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                  style={formInputStyle}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={formLabelStyle}>Or Upload Favicon (.ico, .png, .jpg)</label>
                <input
                  type="file"
                  accept=".ico,.png,.jpg,.jpeg"
                  onChange={handleFaviconUpload}
                  disabled={loading}
                  style={{
                    ...formInputStyle,
                    padding: "10px 14px",
                    cursor: "pointer"
                  }}
                />
              </div>
            </div>

            {/* Live Favicon Preview */}
            {seoSettings.favicon_url && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(0,0,0,0.02)", padding: "12px 18px", borderRadius: "8px", border: "1px dashed var(--card-border)" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--fg-muted)" }}>Live Favicon Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={seoSettings.favicon_url} 
                  alt="Favicon Preview" 
                  style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "4px", backgroundColor: "#fff", padding: "2px", border: "1px solid #e3dbc9" }} 
                />
                <button 
                  type="button" 
                  onClick={() => setSeoSettings(prev => ({ ...prev, favicon_url: "" }))} 
                  style={{ marginLeft: "auto", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                >
                  Remove Favicon
                </button>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: "fit-content", alignSelf: "flex-end", marginTop: "12px" }}>
              Save Global Configuration
            </button>
          </form>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Admin Access Credentials</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Admin Email Address (OTP will be sent here)</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="objectsquarerajan@gmail.com"
                      required
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Admin Password</label>
                    <input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter new password"
                      required
                      style={formInputStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Website Logo Settings</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Logo Text (Displays when no image is uploaded)</label>
                    <input
                      type="text"
                      value={profileForm.logo_text}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, logo_text: e.target.value }))}
                      placeholder="yaqeen"
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Logo Image URL</label>
                    <input
                      type="text"
                      value={profileForm.logo_url}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, logo_url: e.target.value }))}
                      placeholder="https://example.com/logo.png"
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={formLabelStyle}>Or Upload Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{
                      ...formInputStyle,
                      padding: "8px 12px",
                      fontSize: "13px"
                    }}
                  />
                </div>

                {/* Logo Preview Block */}
                <div style={{ marginTop: "10px", padding: "16px", border: "1px dashed var(--card-border)", borderRadius: "8px", background: "rgba(0,0,0,0.01)" }}>
                  <div style={{ fontSize: "11px", color: "var(--fg-muted)", marginBottom: "8px" }}>Live Logo Preview (Header & Footer Mock)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", background: "#fcf9f2", border: "1px solid #e3dbc9", borderRadius: "6px", width: "fit-content" }}>
                    {profileForm.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={profileForm.logo_url} alt="Logo" style={{ height: "32px", maxHeight: "32px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", color: "#8c5d31", fontSize: "18px" }}>
                        <span style={{ width: "8px", height: "8px", backgroundColor: "#3c3022", borderRadius: "50%" }}></span>
                        <span style={{ textTransform: "capitalize" }}>{profileForm.logo_text || "yaqeen"}</span>
                      </div>
                    )}
                  </div>
                  {profileForm.logo_url && (
                    <button type="button" onClick={() => setProfileForm(prev => ({ ...prev, logo_url: "" }))} style={{ color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", marginTop: "8px", padding: 0 }}>
                      Remove Image Logo (Fallback to Text)
                    </button>
                  )}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Contact Details & Social Media Links</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Contact Email Address</label>
                    <input
                      type="email"
                      value={profileForm.contact_email}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="info@yaqeeninstitute.com"
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Contact Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={profileForm.contact_phone}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+44 7700 183483"
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Working Hours Details</label>
                    <input
                      type="text"
                      value={profileForm.contact_hours}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, contact_hours: e.target.value }))}
                      placeholder="24x7 - We're always here for you."
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Worldwide Support Subtitle</label>
                    <input
                      type="text"
                      value={profileForm.contact_support}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, contact_support: e.target.value }))}
                      placeholder="We serve students from around the world."
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px dashed var(--card-border)", paddingTop: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Facebook Profile URL</label>
                    <input
                      type="text"
                      value={profileForm.social_facebook}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, social_facebook: e.target.value }))}
                      placeholder="https://facebook.com/..."
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Instagram Profile URL</label>
                    <input
                      type="text"
                      value={profileForm.social_instagram}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, social_instagram: e.target.value }))}
                      placeholder="https://instagram.com/..."
                      style={formInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>YouTube Channel URL</label>
                    <input
                      type="text"
                      value={profileForm.social_youtube}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, social_youtube: e.target.value }))}
                      placeholder="https://youtube.com/..."
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>WhatsApp Chat Link / Number</label>
                    <input
                      type="text"
                      value={profileForm.social_whatsapp}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, social_whatsapp: e.target.value }))}
                      placeholder="https://wa.me/..."
                      style={formInputStyle}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "fit-content", alignSelf: "flex-end" }}>
                Save Settings & Credentials
              </button>
            </form>

            {/* Manage Admin Accounts */}
            <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Manage Admin Accounts</h3>
                <p style={{ color: "var(--fg-muted)", fontSize: "13px", marginTop: "10px" }}>
                  Add another admin who can log in to this console. They will sign in with their own email &amp; password and receive an OTP on their email — exactly like you do.
                </p>
              </div>

              {/* Existing accounts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {adminAccounts.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "13px" }}>No admin accounts loaded.</p>
                ) : (
                  adminAccounts.map((acc) => (
                    <div key={acc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 14px", border: "1px solid var(--card-border)", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.015)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span style={{ fontSize: "16px" }}>👤</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#2B1F14", wordBreak: "break-all" }}>{acc.email}</span>
                        {acc.is_self && <span style={{ fontSize: "11px", fontWeight: "500", color: "var(--secondary-color)", backgroundColor: "rgba(85,107,59,0.12)", padding: "2px 8px", borderRadius: "9999px" }}>You</span>}
                      </div>
                      {!acc.is_self && (
                        <button type="button" onClick={() => handleDeleteAdmin(acc.id)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", color: "#ef4444", flexShrink: 0 }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add new admin */}
              <form onSubmit={handleCreateAdmin} style={{ borderTop: "1px solid var(--card-border)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "500", color: "#2B1F14", margin: 0 }}>Add Admin Account</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>New Admin Email</label>
                    <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="newadmin@email.com" style={formInputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Password (min 6 characters)</label>
                    <input type="text" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} placeholder="Set a password" style={formInputStyle} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: "fit-content" }}>+ Create Admin Account</button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: MANAGE TEACHERS */}
        {activeTab === "teachers" && (
          <div>
            {!isEditingTeacher ? (
              // Teachers List Screen
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Islamic Teachers</h3>
                  <button onClick={triggerCreateTeacher} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    + Register Teacher
                  </button>
                </div>

                {teachers.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No teacher profiles found. Click Register Teacher to add one.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Avatar</th>
                          <th style={{ padding: "12px" }}>Name</th>
                          <th style={{ padding: "12px" }}>Languages</th>
                          <th style={{ padding: "12px" }}>Experience</th>
                          <th style={{ padding: "12px" }}>Specialization</th>
                          <th style={{ padding: "12px" }}>Sort Order</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((t) => (
                          <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={t.avatar_url || "/images/teacher_rahman.png"} 
                                alt={t.name} 
                                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--card-border)" }} 
                              />
                            </td>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{t.name}</td>
                            <td style={{ padding: "12px" }}>{t.languages}</td>
                            <td style={{ padding: "12px" }}>{t.experience}</td>
                            <td style={{ padding: "12px" }}>{t.specialization}</td>
                            <td style={{ padding: "12px" }}>{t.order_index}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "64px", alignItems: "center" }}>
                              <button onClick={() => triggerEditTeacher(t)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeleteTeacher(t.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Teacher Register / Edit Form
              <form onSubmit={handleSaveTeacher} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Teacher Details</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Full Name *</label>
                      <input
                        type="text"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Ustadh Rahman Ali"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Sort Order Index</label>
                      <input
                        type="number"
                        value={teacherForm.order_index}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, order_index: e.target.value }))}
                        placeholder="e.g. 1"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Languages *</label>
                      <input
                        type="text"
                        value={teacherForm.languages}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, languages: e.target.value }))}
                        placeholder="e.g. Arabic, English, Urdu"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Experience *</label>
                      <input
                        type="text"
                        value={teacherForm.experience}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g. 8+ Years"
                        required
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Specialization / Subjects *</label>
                    <input
                      type="text"
                      value={teacherForm.specialization}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g. Qur'an, Tajweed"
                      required
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Bio / Description (shown on the Featured Teacher card)</label>
                    <textarea
                      value={teacherForm.bio}
                      onChange={(e) => setTeacherForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Passionate and dedicated educator with a love for helping students grow and succeed…"
                      style={{ ...formInputStyle, minHeight: "100px", resize: "vertical", lineHeight: 1.6 }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Avatar Image URL</label>
                      <input
                        type="text"
                        value={teacherForm.avatar_url}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/... or /images/..."
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Or Upload Local Avatar Image</label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                          style={{
                            ...formInputStyle,
                            padding: "8px 12px",
                            flex: 1,
                            fontSize: "13px"
                          }}
                        />
                        {uploading && <span style={{ color: "var(--secondary-color)", fontSize: "12px" }}>Uploading...</span>}
                      </div>
                    </div>
                  </div>

                  {teacherForm.avatar_url && (
                    <div style={{ marginTop: "4px", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "8px", width: "fit-content", display: "flex", gap: "12px", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={teacherForm.avatar_url} alt="Preview" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>Avatar Preview</span>
                        <button type="button" onClick={() => setTeacherForm(prev => ({ ...prev, avatar_url: "" }))} style={{ color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove Image</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsEditingTeacher(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                    {editingTeacherId ? "Save Profile" : "Register Teacher"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB: MANAGE TESTIMONIALS */}
        {activeTab === "testimonials" && (
          <div>
            {!isEditingTestimonial ? (
              // Testimonials List Screen
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Client Testimonials</h3>
                  <button onClick={triggerCreateTestimonial} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    + Add Testimonial
                  </button>
                </div>

                {testimonials.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No testimonials found. Click Add Testimonial to create one.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Avatar</th>
                          <th style={{ padding: "12px" }}>Author Name</th>
                          <th style={{ padding: "12px" }}>Role</th>
                          <th style={{ padding: "12px" }}>Content Snippet</th>
                          <th style={{ padding: "12px" }}>Target Pages</th>
                          <th style={{ padding: "12px" }}>Sort Order</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map((t) => (
                          <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={t.avatar_url || "/images/testi_ayesha.png"} 
                                alt={t.name} 
                                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--card-border)" }} 
                              />
                            </td>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{t.name}</td>
                            <td style={{ padding: "12px" }}>{t.role}</td>
                            <td style={{ padding: "12px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.content}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "3px 8px", background: "rgba(201, 155, 77, 0.08)", border: "1px solid rgba(201, 155, 77, 0.2)", borderRadius: "4px", fontSize: "11px", color: "#8c5d31", fontWeight: "600", textTransform: "uppercase" }}>
                                {t.page_target === "all" ? "All Pages" : t.page_target}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>{t.order_index}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "64px", alignItems: "center" }}>
                              <button onClick={() => triggerEditTestimonial(t)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeleteTestimonial(t.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Testimonial Register / Edit Form
              <form onSubmit={handleSaveTestimonial} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Testimonial Details</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Author Full Name *</label>
                      <input
                        type="text"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Ayesha Khan"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Sort Order Index</label>
                      <input
                        type="number"
                        value={testimonialForm.order_index}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, order_index: e.target.value }))}
                        placeholder="e.g. 1"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Author Description / Role *</label>
                    <input
                      type="text"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Mother of 2, Adult Learner, Parent"
                      required
                      style={formInputStyle}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Testimonial Content *</label>
                    <textarea
                      rows="4"
                      value={testimonialForm.content}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write customer review..."
                      required
                      style={formTextareaStyle}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Avatar Image URL</label>
                      <input
                        type="text"
                        value={testimonialForm.avatar_url}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/... or /images/..."
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Or Upload Local Avatar Image</label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTestimonialAvatarUpload}
                          disabled={uploading}
                          style={{
                            ...formInputStyle,
                            padding: "8px 12px",
                            flex: 1,
                            fontSize: "13px"
                          }}
                        />
                        {uploading && <span style={{ color: "var(--secondary-color)", fontSize: "12px" }}>Uploading...</span>}
                      </div>
                    </div>
                  </div>

                  {testimonialForm.avatar_url && (
                    <div style={{ marginTop: "4px", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "8px", width: "fit-content", display: "flex", gap: "12px", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={testimonialForm.avatar_url} alt="Preview" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>Avatar Preview</span>
                        <button type="button" onClick={() => setTestimonialForm(prev => ({ ...prev, avatar_url: "" }))} style={{ color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove Image</button>
                      </div>
                    </div>
                  )}

                  {/* Target Pages Checkboxes */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--card-border)", paddingTop: "20px", marginTop: "10px" }}>
                    <label style={formLabelStyle}>Target Pages for Display *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                        <input
                          type="checkbox"
                          checked={testimonialForm.page_targets.all}
                          onChange={(e) => setTestimonialForm(prev => ({
                            ...prev,
                            page_targets: {
                              ...prev.page_targets,
                              all: e.target.checked,
                              home: false,
                              about: false,
                              courses: false,
                              pricing: false
                            }
                          }))}
                        />
                        Show on All Pages
                      </label>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", opacity: testimonialForm.page_targets.all ? 0.5 : 1 }}>
                        <input
                          type="checkbox"
                          disabled={testimonialForm.page_targets.all}
                          checked={testimonialForm.page_targets.home}
                          onChange={(e) => setTestimonialForm(prev => ({
                            ...prev,
                            page_targets: { ...prev.page_targets, home: e.target.checked }
                          }))}
                        />
                        Home Page
                      </label>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", opacity: testimonialForm.page_targets.all ? 0.5 : 1 }}>
                        <input
                          type="checkbox"
                          disabled={testimonialForm.page_targets.all}
                          checked={testimonialForm.page_targets.about}
                          onChange={(e) => setTestimonialForm(prev => ({
                            ...prev,
                            page_targets: { ...prev.page_targets, about: e.target.checked }
                          }))}
                        />
                        About Page
                      </label>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", opacity: testimonialForm.page_targets.all ? 0.5 : 1 }}>
                        <input
                          type="checkbox"
                          disabled={testimonialForm.page_targets.all}
                          checked={testimonialForm.page_targets.courses}
                          onChange={(e) => setTestimonialForm(prev => ({
                            ...prev,
                            page_targets: { ...prev.page_targets, courses: e.target.checked }
                          }))}
                        />
                        Courses Page
                      </label>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", opacity: testimonialForm.page_targets.all ? 0.5 : 1 }}>
                        <input
                          type="checkbox"
                          disabled={testimonialForm.page_targets.all}
                          checked={testimonialForm.page_targets.pricing}
                          onChange={(e) => setTestimonialForm(prev => ({
                            ...prev,
                            page_targets: { ...prev.page_targets, pricing: e.target.checked }
                          }))}
                        />
                        Pricing Page
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsEditingTestimonial(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                    {editingTestimonialId ? "Save Testimonial" : "Add Testimonial"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB: MANAGE COURSES */}
        {activeTab === "courses" && (
          <div>
            {!isEditingCourse ? (
              // Courses List Screen
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Active Courses</h3>
                  <button onClick={triggerCreateCourse} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    + Add Course
                  </button>
                </div>

                {courses.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No courses found. Click Add Course to create one.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Thumbnail</th>
                          <th style={{ padding: "12px" }}>Course Title</th>
                          <th style={{ padding: "12px" }}>Icon Tag</th>
                          <th style={{ padding: "12px" }}>Sort Order</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((c) => (
                          <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={c.image_url || "/images/course_quran.png"} 
                                alt={c.title} 
                                style={{ width: "70px", height: "45px", borderRadius: "6px", objectFit: "cover", border: "1px solid var(--card-border)" }} 
                              />
                            </td>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{c.title}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "3px 8px", background: "rgba(74, 93, 59, 0.08)", border: "1px solid rgba(74, 93, 59, 0.2)", borderRadius: "4px", fontSize: "11px", color: "#4A5D3B", fontWeight: "600", textTransform: "uppercase" }}>
                                {c.icon}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>{c.order_index}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "69px", alignItems: "center" }}>
                              <button onClick={() => triggerEditCourse(c)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeleteCourse(c.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Course Create / Edit Form
              <form onSubmit={handleSaveCourse} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Course Details</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Course Title *</label>
                      <input
                        type="text"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Quran Learning with Tajweed"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Sort Order Index</label>
                      <input
                        type="number"
                        value={courseForm.order_index}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, order_index: e.target.value }))}
                        placeholder="e.g. 1"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Badge Icon Type *</label>
                    <select
                      value={courseForm.icon}
                      onChange={(e) => setCourseForm(prev => ({ ...prev, icon: e.target.value }))}
                      style={{
                        ...formInputStyle,
                        backgroundColor: "#fdfcf9",
                        color: "var(--fg-color)",
                        cursor: "pointer"
                      }}
                    >
                      <option value="book">Book Icon (Quran)</option>
                      <option value="dad">Arabic Dad Letter (Arabic Language)</option>
                      <option value="mosque">Mosque Icon (Islamic Studies)</option>
                      <option value="badge">Badge/Star Icon (Hifz/Memorization)</option>
                      <option value="pencil">Pencil Icon (Noorani Qaida)</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Thumbnail Image URL</label>
                      <input
                        type="text"
                        value={courseForm.image_url}
                        onChange={(e) => setCourseForm(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/... or /images/..."
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Or Upload Local Image Thumbnail</label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCourseImageUpload}
                          disabled={uploading}
                          style={{
                            ...formInputStyle,
                            padding: "8px 12px",
                            flex: 1,
                            fontSize: "13px"
                          }}
                        />
                        {uploading && <span style={{ color: "var(--secondary-color)", fontSize: "12px" }}>Uploading...</span>}
                      </div>
                    </div>
                  </div>

                  {courseForm.image_url && (
                    <div style={{ marginTop: "4px", border: "1px solid var(--card-border)", borderRadius: "8px", padding: "8px", width: "fit-content", display: "flex", gap: "12px", alignItems: "center", backgroundColor: "rgba(255,255,255,0.01)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={courseForm.image_url} alt="Preview" style={{ width: "90px", height: "60px", borderRadius: "6px", objectFit: "cover" }} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "11px", color: "var(--fg-muted)" }}>Thumbnail Preview</span>
                        <button type="button" onClick={() => setCourseForm(prev => ({ ...prev, image_url: "" }))} style={{ color: "#ef4444", border: "none", background: "none", fontSize: "11px", cursor: "pointer", textAlign: "left", padding: 0 }}>Remove Image</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ---- Course Detail Page Content (optional) ---- */}
                <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: "500", margin: 0 }}>Course Detail Page Content</h4>
                    <p style={{ color: "var(--fg-muted)", fontSize: "12.5px", marginTop: "6px" }}>These fields power the course detail page. Leave any field blank to use the default template text.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Short Description (hero subtitle)</label>
                    <textarea value={courseForm.short_description} onChange={(e) => setCourseForm(p => ({ ...p, short_description: e.target.value }))} placeholder="One or two lines shown under the course title in the hero." style={{ ...formInputStyle, minHeight: "70px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Level</label>
                      <input value={courseForm.level} onChange={(e) => setCourseForm(p => ({ ...p, level: e.target.value }))} placeholder="e.g. Intermediate" style={formInputStyle} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Class Duration</label>
                      <input value={courseForm.class_duration} onChange={(e) => setCourseForm(p => ({ ...p, class_duration: e.target.value }))} placeholder="e.g. 45–60 min" style={formInputStyle} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Course Duration</label>
                      <input value={courseForm.course_duration} onChange={(e) => setCourseForm(p => ({ ...p, course_duration: e.target.value }))} placeholder="e.g. 3–6 Months" style={formInputStyle} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Mode</label>
                      <input value={courseForm.mode} onChange={(e) => setCourseForm(p => ({ ...p, mode: e.target.value }))} placeholder="e.g. Online" style={formInputStyle} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Age Group</label>
                      <input value={courseForm.age_group} onChange={(e) => setCourseForm(p => ({ ...p, age_group: e.target.value }))} placeholder="e.g. Teens & Adults" style={formInputStyle} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Description</label>
                    <textarea value={courseForm.description} onChange={(e) => setCourseForm(p => ({ ...p, description: e.target.value }))} placeholder="Main description. Separate paragraphs with a blank line." style={{ ...formInputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>What You&apos;ll Learn <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(one point per line)</span></label>
                    <textarea value={courseForm.learn_points} onChange={(e) => setCourseForm(p => ({ ...p, learn_points: e.target.value }))} placeholder={"Improve reading fluency\nDevelop conversational skills\n..."} style={{ ...formInputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Requirements <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(one per line)</span></label>
                      <textarea value={courseForm.requirements} onChange={(e) => setCourseForm(p => ({ ...p, requirements: e.target.value }))} placeholder={"A laptop or smartphone\nStable internet\n..."} style={{ ...formInputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Who This Course Is For <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(one per line)</span></label>
                      <textarea value={courseForm.who_for} onChange={(e) => setCourseForm(p => ({ ...p, who_for: e.target.value }))} placeholder={"Beginners\nIntermediate learners\n..."} style={{ ...formInputStyle, minHeight: "110px", resize: "vertical", lineHeight: 1.6 }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Detailed Content <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(paragraphs separated by a blank line)</span></label>
                    <textarea value={courseForm.content_details} onChange={(e) => setCourseForm(p => ({ ...p, content_details: e.target.value }))} placeholder="Longer descriptive content shown lower on the page." style={{ ...formInputStyle, minHeight: "120px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Course Content / Modules <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(one per line — format: Title | Description)</span></label>
                    <textarea value={courseForm.course_modules} onChange={(e) => setCourseForm(p => ({ ...p, course_modules: e.target.value }))} placeholder={"Reading Skills | Learn to read fluently\nWriting Skills | Build strong writing\n..."} style={{ ...formInputStyle, minHeight: "120px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={formLabelStyle}>Course FAQs <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>(one per line — format: Question | Answer)</span></label>
                    <textarea value={courseForm.faqs} onChange={(e) => setCourseForm(p => ({ ...p, faqs: e.target.value }))} placeholder={"What does this course cover? | It covers...\nIs it suitable for beginners? | Yes...\n..."} style={{ ...formInputStyle, minHeight: "130px", resize: "vertical", lineHeight: 1.6 }} />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsEditingCourse(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                    {editingCourseId ? "Save Course" : "Add Course"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB: MANAGE PLANS */}
        {activeTab === "plans" && (
          <div>
            {!isEditingPlan ? (
              // Plans List Screen
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Pricing Packages</h3>
                  <button onClick={triggerCreatePlan} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                    + Create Package
                  </button>
                </div>

                {plans.length === 0 ? (
                  <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No pricing packages found. Click Create Package to add one.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--fg-muted)" }}>
                          <th style={{ padding: "12px" }}>Package Name</th>
                          <th style={{ padding: "12px" }}>Subtitle</th>
                          <th style={{ padding: "12px" }}>Rate Price</th>
                          <th style={{ padding: "12px" }}>Icon</th>
                          <th style={{ padding: "12px" }}>Ribbon Badge</th>
                          <th style={{ padding: "12px" }}>Features Count</th>
                          <th style={{ padding: "12px" }}>Sort Order</th>
                          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((p) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "12px", fontWeight: "600" }}>{p.name}</td>
                            <td style={{ padding: "12px" }}>{p.subtitle}</td>
                            <td style={{ padding: "12px", fontWeight: "600" }}>${p.price}{p.period}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ padding: "3px 8px", background: "rgba(201, 155, 77, 0.08)", border: "1px solid rgba(201, 155, 77, 0.2)", borderRadius: "4px", fontSize: "11px", color: "#8c5d31", fontWeight: "600", textTransform: "uppercase" }}>
                                {p.icon}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>
                              {p.badge ? (
                                <span style={{ padding: "3px 8px", background: "rgba(74, 93, 59, 0.08)", border: "1px solid rgba(74, 93, 59, 0.2)", borderRadius: "4px", fontSize: "11px", color: "#4A5D3B", fontWeight: "600" }}>
                                  {p.badge}
                                </span>
                              ) : (
                                <span style={{ color: "var(--fg-muted)", fontSize: "12px" }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: "12px" }}>{p.features?.length || 0} items</td>
                            <td style={{ padding: "12px" }}>{p.order_index}</td>
                            <td style={{ padding: "12px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end", height: "53px", alignItems: "center" }}>
                              <button onClick={() => triggerEditPlan(p)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }}>Edit</button>
                              <button onClick={() => handleDeletePlan(p.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Plan Create / Edit Form
              <form onSubmit={handleSavePlan} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Package Details</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Plan Name *</label>
                      <input
                        type="text"
                        value={planForm.name}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Basic"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Subtitle / Description</label>
                      <input
                        type="text"
                        value={planForm.subtitle}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="e.g. Entry Level Package"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Price Rate ($) *</label>
                      <input
                        type="text"
                        value={planForm.price}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. 8.00"
                        required
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Rate Period</label>
                      <input
                        type="text"
                        value={planForm.period}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, period: e.target.value }))}
                        placeholder="e.g. /hour"
                        style={formInputStyle}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Sort Order Index</label>
                      <input
                        type="number"
                        value={planForm.order_index}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, order_index: e.target.value }))}
                        placeholder="e.g. 1"
                        style={formInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Brand Header Icon *</label>
                      <select
                        value={planForm.icon}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, icon: e.target.value }))}
                        style={{
                          ...formInputStyle,
                          backgroundColor: "#fdfcf9",
                          color: "var(--fg-color)",
                          cursor: "pointer"
                        }}
                      >
                        <option value="plane">Paper Plane Icon (Basic)</option>
                        <option value="star">Star Award Icon (Essentials)</option>
                        <option value="diamond">Diamond Icon (Premium)</option>
                        <option value="crown">Crown Icon (Platinum)</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={formLabelStyle}>Ribbon Badge Text (Best Value, Popular, etc.)</label>
                      <input
                        type="text"
                        value={planForm.badge}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, badge: e.target.value }))}
                        placeholder="e.g. Best Value (or leave empty)"
                        style={formInputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Features list checklist manager */}
                <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "600", borderBottom: "1px solid var(--card-border)", paddingBottom: "12px" }}>Itemized Features Checklist</h3>
                  
                  {planForm.features.length === 0 ? (
                    <p style={{ color: "var(--fg-muted)", fontSize: "13px", fontStyle: "italic", padding: "10px 0" }}>No feature points configured yet. Use the add panel below to define points.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {planForm.features.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyItems: "space-between", padding: "10px 16px", border: "1px solid var(--card-border)", borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.01)", gap: "12px" }}>
                          {/* Toggle Checkmark vs Cross */}
                          <button 
                            type="button" 
                            onClick={() => handleTogglePlanFeatureIncluded(idx)} 
                            style={{ 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer", 
                              fontSize: "14px", 
                              color: item.included ? "#4A5D3B" : "#ef4444",
                              display: "flex", 
                              alignItems: "center",
                              gap: "6px",
                              padding: 0
                            }}
                          >
                            <span style={{ fontSize: "18px" }}>{item.included ? "✔️" : "❌"}</span>
                            <span style={{ fontSize: "11px", fontWeight: "500", textTransform: "uppercase" }}>{item.included ? "Included" : "Excluded"}</span>
                          </button>
                          
                          <span style={{ flexGrow: 1, fontSize: "14px", color: item.included ? "var(--fg-color)" : "var(--fg-muted)", textDecoration: item.included ? "none" : "line-through", textDecorationColor: "rgba(0,0,0,0.15)" }}>
                            {item.text}
                          </span>

                          <button 
                            type="button" 
                            onClick={() => handleRemovePlanFeature(idx)} 
                            style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", cursor: "pointer", fontWeight: "600", padding: "4px 8px" }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Feature Item Panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "20px", marginTop: "10px" }}>
                    <label style={formLabelStyle}>Add Feature Point</label>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        placeholder="e.g. Proficient Arabic (Native) Teacher"
                        style={{ ...formInputStyle, flexGrow: 1 }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddPlanFeature();
                          }
                        }}
                      />
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", userSelect: "none" }}>
                        <input
                          type="checkbox"
                          checked={newFeatureIncluded}
                          onChange={(e) => setNewFeatureIncluded(e.target.checked)}
                        />
                        Mark Included
                      </label>
                      <button 
                        type="button" 
                        onClick={handleAddPlanFeature} 
                        className="btn-primary" 
                        style={{ padding: "10px 20px", fontSize: "13px" }}
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setIsEditingPlan(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    Cancel & Return
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>
                    {editingPlanId ? "Save Package" : "Create Package"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Styling components
const sidebarBtnStyle = {
  width: "100%",
  padding: "12px 16px",
  textAlign: "left",
  background: "none",
  border: "none",
  borderLeft: "3px solid transparent",
  color: "#4a3e30",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderRadius: "0 6px 6px 0"
};

const formLabelStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--fg-muted)"
};

const formInputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid var(--card-border)",
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  color: "var(--fg-color)",
  outline: "none",
  fontSize: "14px",
  transition: "var(--transition-smooth)"
};

const formTextareaStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid var(--card-border)",
  backgroundColor: "rgba(0, 0, 0, 0.02)",
  color: "var(--fg-color)",
  outline: "none",
  fontSize: "14px",
  resize: "vertical",
  transition: "var(--transition-smooth)"
};
