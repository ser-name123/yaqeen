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

export default function AdminDashboard() {
  // Authentication states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Profile management states
  const [profileForm, setProfileForm] = useState({ email: "", password: "", logo_text: "", logo_url: "" });
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
          logo_url: data.logo_url || ""
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
      const validateSession = async () => {
        try {
          const res = await fetch("/api/admin/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setIsAuthenticated(true);
            setProfileForm({
              email: data.email,
              password: data.password,
              logo_text: data.logo_text || "",
              logo_url: data.logo_url || ""
            });
            setLogoText(data.logo_text || "yaqeen");
            setLogoUrl(data.logo_url || "");
          } else {
            localStorage.removeItem("aero_admin_token");
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          localStorage.removeItem("aero_admin_token");
          setIsAuthenticated(false);
        } finally {
          setIsVerifyingSession(false);
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
          text: "Verification code sent to " + emailInput,
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
    setIsEditingBlog(false);
  };

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
          logo_url: profileForm.logo_url
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
                  fontWeight: "700", 
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
                    fontWeight: "700"
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={authLoading} style={{ justifyContent: "center", marginTop: "8px" }}>
                {authLoading ? "Verifying..." : "Verify & Unlock"}
              </button>

              <button type="button" onClick={handleCancelOtp} className="btn-secondary" style={{ justifyContent: "center" }}>
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

  return (
    <div style={{ ...adminThemeStyle, display: "grid", gridTemplateColumns: "240px 1fr" }}>
      {/* Sidebar navigation */}
      <aside style={{ 
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
        <div style={{ paddingLeft: "12px", display: "flex", alignItems: "center", minHeight: "40px" }}>
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
              fontWeight: "700", 
              fontSize: "20px", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px" 
            }}>
              <span className="logo-dot"></span>
              {profileForm.logo_text || "yaqeen"}
            </span>
          )}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
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
            onClick={() => handleTabChange("seo")}
            style={{ ...sidebarBtnStyle, borderLeftColor: activeTab === "seo" ? "var(--secondary-color)" : "transparent", backgroundColor: activeTab === "seo" ? "rgba(255,255,255,0.02)" : "transparent" }}
          >
            🌐 SEO Manager
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
            fontWeight: "700",
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
      <main style={{ padding: "40px", overflowY: "auto", maxHeight: "100vh" }}>
        {/* Header toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--card-border)", paddingBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
              {activeTab === "overview" && "System Overview"}
              {activeTab === "blogs" && (isEditingBlog ? (editingBlogId ? "Edit Blog Post" : "Write New Publication") : "Blog Publications")}
              {activeTab === "contacts" && "Contact Query Logs"}
              {activeTab === "seo" && "Site SEO Meta Settings"}
              {activeTab === "profile" && "Profile Credentials Settings"}
            </h2>
            <p style={{ color: "var(--fg-muted)", fontSize: "14px", marginTop: "4px" }}>
              {activeTab === "overview" && "Real-time summary metrics across database logs."}
              {activeTab === "blogs" && "Author articles, categories, list points, and search engine fields."}
              {activeTab === "contacts" && "Review customer forms, inquiries, and details."}
              {activeTab === "seo" && "Configure key page head parameters for Google crawlers."}
              {activeTab === "profile" && "Manage your login email and password."}
            </p>
          </div>

          {loading && <span style={{ color: "var(--secondary-color)", fontSize: "13px" }}>Syncing Database...</span>}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Stats Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "13px" }}>Published Blogs</div>
                <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "8px", color: "var(--secondary-color)" }}>{blogs.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "13px" }}>Contact Submissions</div>
                <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "8px", color: "var(--accent-color)" }}>{contacts.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: "24px" }}>
                <div style={{ color: "var(--fg-muted)", fontSize: "13px" }}>Waitlist Leads</div>
                <div style={{ fontSize: "36px", fontWeight: "800", marginTop: "8px", color: "var(--primary-color)" }}>{leadsCount}</div>
              </div>
            </div>

            {/* Recent Contacts Table Preview */}
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
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.slice(0, 5).map((c) => (
                        <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "12px" }}>{c.name}</td>
                          <td style={{ padding: "12px" }}><a href={`mailto:${c.email}`} style={{ color: "var(--secondary-color)" }}>{c.email}</a></td>
                          <td style={{ padding: "12px" }}>{c.subject}</td>
                          <td style={{ padding: "12px" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                        type="url"
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
            
            {contacts.length === 0 ? (
              <p style={{ color: "var(--fg-muted)", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>Inbox empty. All clean!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {contacts.map((msg) => (
                  <div key={msg.id} style={{ padding: "20px", border: "1px solid var(--card-border)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <h4 style={{ fontSize: "16px", fontWeight: "600" }}>{msg.name}</h4>
                        <span style={{ fontSize: "12px", color: "var(--fg-muted)" }}>
                          Email: <a href={`mailto:${msg.email}`} style={{ color: "var(--secondary-color)" }}>{msg.email}</a> | Date: {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteContact(msg.id)} className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444" }}>
                        Delete Record
                      </button>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "12px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--fg-color)", marginBottom: "4px" }}>Subject: {msg.subject}</div>
                      <p style={{ color: "var(--fg-muted)", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                      type="url"
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

              <button type="submit" className="btn-primary" style={{ width: "fit-content", alignSelf: "flex-end" }}>
                Save Settings & Credentials
              </button>
            </form>
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
