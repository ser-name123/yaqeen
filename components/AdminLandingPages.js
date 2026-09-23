"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DEFAULT_LANDING_PAGE_CONTENT, DEFAULT_LANDING_PAGE_SEO } from "@/lib/landing-page-defaults";
import { AdminIconPicker, AdminImagePicker } from "./AdminLandingAssetPickers";
import RichTextEditor from "@/components/RichTextEditor";
import AdminDataTable from "@/components/AdminDataTable";
import "./AdminLandingPages.css";

export function getPagePublicPath(page) {
  if (!page) return "/";
  const slug = page.slug || "";
  const usePrefix = Boolean(page.seo?.useLandingPrefix);
  return usePrefix ? `/landing/${slug}` : `/${slug}`;
}

export default function AdminLandingPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Editor State
  const [editingPageId, setEditingPageId] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("seo");
  const [saving, setSaving] = useState(false);

  // Fetch all landing pages on mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/landing-pages");
      const json = await res.json();
      if (json.success) {
        setPages(json.pages || []);
      }
    } catch (err) {
      console.error("Error loading landing pages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open editor for a page
  const handleEdit = async (pageId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/landing-pages/${pageId}`);
      const json = await res.json();
      if (json.success && json.page) {
        setPageData(json.page);
        setEditingPageId(pageId);
        setActiveSubTab("seo");
      }
    } catch (err) {
      console.error("Error opening editor:", err);
      Swal.fire("Error", "Could not load page details", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create new page modal
  const handleCreateNew = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create New Landing Page",
      html: `
        <div style="text-align: left; font-size: 14px; font-family: inherit;">
          <label style="font-weight: 600; display: block; margin-bottom: 5px;">Page Title</label>
          <input id="swal-title" class="swal2-input" placeholder="e.g. Learn Quran for Kids in UK" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
          
          <label style="font-weight: 600; display: block; margin-bottom: 5px;">URL Slug</label>
          <input id="swal-slug" class="swal2-input" placeholder="e.g. learn-quran-for-kids" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
          
          <label style="font-weight: 600; display: block; margin-bottom: 5px;">URL Prefix / Path Structure</label>
          <select id="swal-prefix" class="swal2-select" style="margin: 0 0 15px 0; width: 100%; box-sizing: border-box;">
            <option value="direct">🌐 Direct Root URL (/{slug}) — Recommended</option>
            <option value="landing">📁 Under /landing/ (/landing/{slug})</option>
          </select>

          <label style="font-weight: 600; display: block; margin-bottom: 5px;">Publish Status</label>
          <select id="swal-status" class="swal2-select" style="margin: 0; width: 100%; box-sizing: border-box;">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create & Edit Page",
      confirmButtonColor: "#CE7823",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const slug = document.getElementById("swal-slug").value;
        const prefix = document.getElementById("swal-prefix").value;
        const status = document.getElementById("swal-status").value;
        if (!title || !title.trim()) {
          Swal.showValidationMessage("Please enter a page title");
          return false;
        }
        return {
          title,
          slug,
          status,
          seo: {
            useLandingPrefix: prefix === "landing"
          }
        };
      }
    });

    if (formValues) {
      try {
        setSaving(true);
        const res = await fetch("/api/landing-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        });
        const json = await res.json();
        if (json.success && json.page) {
          Swal.fire({
            icon: "success",
            title: "Landing Page Created!",
            text: "You can now edit its sections and SEO.",
            timer: 1500,
            showConfirmButton: false
          });
          await fetchPages();
          handleEdit(json.page.id);
        } else {
          Swal.fire("Error", json.message || "Failed to create page", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      } finally {
        setSaving(false);
      }
    }
  };

  // Duplicate / Clone page
  const handleDuplicate = async (page) => {
    const { value: newTitle } = await Swal.fire({
      title: "Duplicate Landing Page",
      text: `Create a copy of "${page.title}" with all its section content and structure:`,
      input: "text",
      inputValue: `${page.title} (Copy)`,
      showCancelButton: true,
      confirmButtonText: "Duplicate",
      confirmButtonColor: "#CE7823"
    });

    if (newTitle && newTitle.trim()) {
      try {
        const res = await fetch("/api/landing-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle.trim(),
            slug: `${page.slug}-copy`,
            cloneFromId: page.id,
            status: "draft"
          })
        });
        const json = await res.json();
        if (json.success) {
          Swal.fire({
            icon: "success",
            title: "Page Duplicated!",
            text: "A draft copy has been created.",
            timer: 1500,
            showConfirmButton: false
          });
          fetchPages();
        } else {
          Swal.fire("Error", json.message, "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Delete page
  const handleDelete = async (page) => {
    const res = await Swal.fire({
      title: "Delete Landing Page?",
      text: `Are you sure you want to permanently delete "${page.title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete"
    });

    if (res.isConfirmed) {
      try {
        const delRes = await fetch(`/api/landing-pages/${page.id}`, { method: "DELETE" });
        const json = await delRes.json();
        if (json.success) {
          Swal.fire("Deleted!", "Landing page removed.", "success");
          fetchPages();
          if (editingPageId === page.id) {
            setEditingPageId(null);
            setPageData(null);
          }
        } else {
          Swal.fire("Error", json.message, "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Save Page Changes
  const handleSavePage = async () => {
    if (!pageData) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/landing-pages/${pageData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageData.title,
          slug: pageData.slug,
          status: pageData.status,
          is_default: pageData.is_default,
          seo: pageData.seo,
          content: pageData.content
        })
      });
      const json = await res.json();
      if (json.success) {
        Swal.fire({
          icon: "success",
          title: "Saved Successfully!",
          text: "All landing page sections & SEO have been updated.",
          timer: 1600,
          showConfirmButton: false
        });
        fetchPages();
      } else {
        Swal.fire("Error", json.message || "Failed to save", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // State update helpers for deep section content
  const updateSeo = (field, val) => {
    setPageData((prev) => ({
      ...prev,
      seo: { ...(prev.seo || {}), [field]: val }
    }));
  };

  const updateSection = (sectionKey, field, val) => {
    setPageData((prev) => ({
      ...prev,
      content: {
        ...(prev.content || {}),
        [sectionKey]: {
          ...((prev.content && prev.content[sectionKey]) || {}),
          [field]: val
        }
      }
    }));
  };

  const updateNested = (sectionKey, parentField, field, val) => {
    setPageData((prev) => {
      const currentSection = (prev.content && prev.content[sectionKey]) || {};
      const currentParent = currentSection[parentField] || {};
      return {
        ...prev,
        content: {
          ...prev.content,
          [sectionKey]: {
            ...currentSection,
            [parentField]: {
              ...currentParent,
              [field]: val
            }
          }
        }
      };
    });
  };

  const updateArrayItem = (sectionKey, arrayField, index, itemField, val) => {
    setPageData((prev) => {
      const currentSection = (prev.content && prev.content[sectionKey]) || {};
      const arr = [...(currentSection[arrayField] || [])];
      if (arr[index]) {
        arr[index] = { ...arr[index], [itemField]: val };
      }
      return {
        ...prev,
        content: {
          ...prev.content,
          [sectionKey]: {
            ...currentSection,
            [arrayField]: arr
          }
        }
      };
    });
  };

  const updateStringArrayItem = (sectionKey, arrayField, index, val) => {
    setPageData((prev) => {
      const currentSection = (prev.content && prev.content[sectionKey]) || {};
      const arr = [...(currentSection[arrayField] || (DEFAULT_LANDING_PAGE_CONTENT[sectionKey]?.[arrayField] || []))];
      arr[index] = val;
      return {
        ...prev,
        content: {
          ...prev.content,
          [sectionKey]: {
            ...currentSection,
            [arrayField]: arr
          }
        }
      };
    });
  };

  const updateArrayItemSubArray = (sectionKey, arrayField, index, subArrayField, subIndex, val) => {
    setPageData((prev) => {
      const currentSection = (prev.content && prev.content[sectionKey]) || {};
      const arr = [...(currentSection[arrayField] || (DEFAULT_LANDING_PAGE_CONTENT[sectionKey]?.[arrayField] || []))];
      if (arr[index]) {
        const subArr = [...(arr[index][subArrayField] || (DEFAULT_LANDING_PAGE_CONTENT[sectionKey]?.[arrayField]?.[index]?.[subArrayField] || []))];
        subArr[subIndex] = val;
        arr[index] = { ...arr[index], [subArrayField]: subArr };
      }
      return {
        ...prev,
        content: {
          ...prev.content,
          [sectionKey]: {
            ...currentSection,
            [arrayField]: arr
          }
        }
      };
    });
  };

  // Filtered pages for table view (by status)
  const statusFilteredPages = pages.filter((p) => {
    return statusFilter === "all" || p.status === statusFilter;
  });

  // =========================================================================
  // RENDER: LIST VIEW
  // =========================================================================
  if (!editingPageId || !pageData) {
    return (
      <div className="alp-wrap">
        <div className="glass-panel" style={{ padding: "24px" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>
              Loading landing pages...
            </div>
          ) : (
            <AdminDataTable
              title="Dynamic Landing Pages"
              subtitle="Custom marketing funnels, promo pages and regional landing pages."
              data={statusFilteredPages}
              keyField="id"
              defaultPageSize={10}
              searchPlaceholder="Search by title, slug..."
              searchKeys={["title", "slug"]}
              headerAction={
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="alp-filter-select"
                    style={{ height: "38px" }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button onClick={handleCreateNew} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Landing Page
                  </button>
                </div>
              }
              columns={[
                {
                  key: "title",
                  label: "Page Title & URL",
                  render: (page) => (
                    <div className="alp-page-title-cell">
                      <span className="alp-page-title" style={{ fontWeight: "600", color: "#2B1F14" }}>{page.title}</span>
                      <span className="alp-page-slug" style={{ fontSize: "12px", color: "var(--fg-muted)" }}>
                        URL:{" "}
                        <a href={getPagePublicPath(page)} target="_blank" rel="noopener noreferrer" style={{ color: "#8c5d31", textDecoration: "none" }}>
                          {getPagePublicPath(page)} ↗
                        </a>
                      </span>
                    </div>
                  )
                },
                {
                  key: "status",
                  label: "Status",
                  width: "130px",
                  render: (page) => (
                    <span className={`alp-status-badge ${page.status || "published"}`}>
                      <span className="alp-badge-dot" />
                      {page.status === "draft" ? "Draft" : "Published"}
                    </span>
                  )
                },
                {
                  key: "updated_at",
                  label: "Last Updated",
                  width: "140px",
                  render: (page) => (
                    <span style={{ color: "#6B7280", fontSize: "13px" }}>
                      {page.updated_at ? new Date(page.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recently"}
                    </span>
                  )
                }
              ]}
              actions={(page) => (
                <div className="alp-actions" style={{ justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(page.id)} className="alp-btn-action edit">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDuplicate(page)} className="alp-btn-action">
                    📋 Duplicate
                  </button>
                  <a
                    href={getPagePublicPath(page)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alp-btn-action"
                  >
                    👁️ View
                  </a>
                  <button onClick={() => handleDelete(page)} className="alp-btn-action delete">
                    🗑️ Delete
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </div>
    );
  }

  // Safe accessor shortcuts
  const seo = pageData.seo || DEFAULT_LANDING_PAGE_SEO;
  const content = pageData.content || DEFAULT_LANDING_PAGE_CONTENT;
  const hero = content.hero || DEFAULT_LANDING_PAGE_CONTENT.hero;
  const whyChoose = content.whyChoose || DEFAULT_LANDING_PAGE_CONTENT.whyChoose;
  const difference = content.difference || DEFAULT_LANDING_PAGE_CONTENT.difference;
  const ukTrust = content.ukTrust || DEFAULT_LANDING_PAGE_CONTENT.ukTrust;
  const courses = content.courses || DEFAULT_LANDING_PAGE_CONTENT.courses;
  const journey = content.journey || DEFAULT_LANDING_PAGE_CONTENT.journey;
  const faqs = content.faqs || DEFAULT_LANDING_PAGE_CONTENT.faqs;

  // =========================================================================
  // RENDER: EDITOR VIEW
  // =========================================================================
  return (
    <div className="alp-wrap">
      <div className="alp-editor-card">
        {/* Editor Top Bar */}
        <div className="alp-editor-header">
          <div className="alp-editor-title-row">
            <button
              onClick={() => {
                setEditingPageId(null);
                setPageData(null);
              }}
              className="alp-btn-back"
            >
              ← Back to Pages
            </button>
            <h2 className="alp-editor-heading">
              Editing: <span style={{ color: "#CE7823" }}>{pageData.title}</span>
            </h2>
          </div>

          <div className="alp-editor-controls">
            <select
              value={pageData.status || "published"}
              onChange={(e) => setPageData({ ...pageData, status: e.target.value })}
              className="alp-select"
              style={{ width: "130px" }}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <a
              href={getPagePublicPath(pageData)}
              target="_blank"
              rel="noopener noreferrer"
              className="alp-btn-action"
              style={{ padding: "8px 14px", textDecoration: "none" }}
            >
              👁️ Preview Live
            </a>

            <button onClick={handleSavePage} disabled={saving} className="alp-btn-save">
              {saving ? "Saving Changes..." : "💾 Save Changes"}
            </button>
          </div>
        </div>

        {/* Section Tabs Bar */}
        <div className="alp-subtabs-nav">
          <button
            className={`alp-subtab-btn ${activeSubTab === "seo" ? "active" : ""}`}
            onClick={() => setActiveSubTab("seo")}
          >
            ⚙️ SEO & Settings
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "hero" ? "active" : ""}`}
            onClick={() => setActiveSubTab("hero")}
          >
            🏷️ Section 1: Hero & Highlights
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "whyChoose" ? "active" : ""}`}
            onClick={() => setActiveSubTab("whyChoose")}
          >
            💡 Section 2: Why Choose Us
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "difference" ? "active" : ""}`}
            onClick={() => setActiveSubTab("difference")}
          >
            💎 Section 3: The Difference
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "ukTrust" ? "active" : ""}`}
            onClick={() => setActiveSubTab("ukTrust")}
          >
            🇬🇧 Section 4: UK Trust & Stats
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveSubTab("courses")}
          >
            📚 Section 5: Courses Showcase
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "journey" ? "active" : ""}`}
            onClick={() => setActiveSubTab("journey")}
          >
            🎯 Section 6: Journey & Pillars
          </button>
          <button
            className={`alp-subtab-btn ${activeSubTab === "faqs" ? "active" : ""}`}
            onClick={() => setActiveSubTab("faqs")}
          >
            ❓ Section 7: FAQs
          </button>
        </div>

        {/* Subtab Content Form Body */}
        <div className="alp-editor-body">
          {/* ================= 1. SEO & METADATA ================= */}
          {activeSubTab === "seo" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Page Identity & URL Structure</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Internal Page Title</label>
                    <input
                      className="alp-input"
                      value={pageData.title || ""}
                      onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">URL Slug (e.g. online-quran-classes-uk)</label>
                    <input
                      className="alp-input"
                      value={pageData.slug || ""}
                      onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">URL Path Structure (Prefix Option)</label>
                    <select
                      className="alp-select"
                      value={pageData.seo?.useLandingPrefix ? "landing" : "direct"}
                      onChange={(e) => {
                        const isLanding = e.target.value === "landing";
                        updateSeo("useLandingPrefix", isLanding);
                      }}
                    >
                      <option value="direct">🌐 Direct Root URL: /{pageData.slug || "your-slug"} (No "/landing/" prefix)</option>
                      <option value="landing">📁 Subdirectory: /landing/{pageData.slug || "your-slug"}</option>
                    </select>
                    <span className="alp-hint" style={{ color: "#2E6A3B", fontWeight: "600", marginTop: "4px", display: "block" }}>
                      🔗 Public Live Link: https://yaqeeninstitute.online{getPagePublicPath(pageData)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Search Engine Optimization (SEO)</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group full">
                    <label className="alp-label">Meta Title (Browser & Google Search Title)</label>
                    <input
                      className="alp-input"
                      value={seo.metaTitle || ""}
                      onChange={(e) => updateSeo("metaTitle", e.target.value)}
                    />
                    <span className="alp-hint">Recommended length: 50-60 characters</span>
                  </div>

                  <div className="alp-form-group full">
                    <label className="alp-label">Meta Description</label>
                    <textarea
                      className="alp-textarea"
                      value={seo.metaDescription || ""}
                      onChange={(e) => updateSeo("metaDescription", e.target.value)}
                    />
                    <span className="alp-hint">Recommended length: 140-160 characters</span>
                  </div>

                  <div className="alp-form-group full">
                    <label className="alp-label">Keywords / Tags (Comma separated)</label>
                    <input
                      className="alp-input"
                      value={seo.keywords || ""}
                      onChange={(e) => updateSeo("keywords", e.target.value)}
                    />
                  </div>

                  <div className="alp-form-group full">
                    <AdminImagePicker
                      label="OG Social Share Image"
                      value={seo.ogImage || ""}
                      onChange={(val) => updateSeo("ogImage", val)}
                      hint="Image shown when sharing this landing page on WhatsApp, Facebook, Twitter (1200x630px recommended)."
                    />
                  </div>

                  <div className="alp-form-group">
                    <label className="alp-label">Search Indexing</label>
                    <select
                      className="alp-select"
                      value={seo.noindex ? "noindex" : "index"}
                      onChange={(e) => updateSeo("noindex", e.target.value === "noindex")}
                    >
                      <option value="index">Index (Show on Google)</option>
                      <option value="noindex">No-Index (Hide from Google)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. HERO & HIGHLIGHTS ================= */}
          {activeSubTab === "hero" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Hero Headings & Text</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Headline Prefix</label>
                    <input
                      className="alp-input"
                      value={hero.headlinePrefix || ""}
                      onChange={(e) => updateSection("hero", "headlinePrefix", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Highlight Word 1 (Orange)</label>
                    <input
                      className="alp-input"
                      value={hero.headlineHighlight1 || ""}
                      onChange={(e) => updateSection("hero", "headlineHighlight1", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Highlight Word 2 (Green)</label>
                    <input
                      className="alp-input"
                      value={hero.headlineHighlight2 || ""}
                      onChange={(e) => updateSection("hero", "headlineHighlight2", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Headline Suffix</label>
                    <input
                      className="alp-input"
                      value={hero.headlineSuffix || ""}
                      onChange={(e) => updateSection("hero", "headlineSuffix", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Subheading Tagline</label>
                    <input
                      className="alp-input"
                      value={hero.tagline || ""}
                      onChange={(e) => updateSection("hero", "tagline", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Main Description Paragraph</label>
                    <RichTextEditor
                      value={hero.description || ""}
                      onChange={(val) => updateSection("hero", "description", val)}
                      minHeight="100px"
                      placeholder="Enter hero main description..."
                    />
                  </div>
                </div>
              </div>

              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Action Buttons & Hero Media</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button Text</label>
                    <input
                      className="alp-input"
                      value={hero.primaryBtnText || ""}
                      onChange={(e) => updateSection("hero", "primaryBtnText", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button URL</label>
                    <input
                      className="alp-input"
                      value={hero.primaryBtnUrl || ""}
                      onChange={(e) => updateSection("hero", "primaryBtnUrl", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button Text</label>
                    <input
                      className="alp-input"
                      value={hero.secondaryBtnText || ""}
                      onChange={(e) => updateSection("hero", "secondaryBtnText", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button URL</label>
                    <input
                      className="alp-input"
                      value={hero.secondaryBtnUrl || ""}
                      onChange={(e) => updateSection("hero", "secondaryBtnUrl", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <AdminImagePicker
                      label="Hero Main Student Image"
                      value={hero.heroImage || ""}
                      onChange={(val) => updateSection("hero", "heroImage", val)}
                      altValue={hero.heroImageAlt || ""}
                      onAltChange={(val) => updateSection("hero", "heroImageAlt", val)}
                      hint="Upload or paste URL for the main hero student image."
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Hero Bottom Mission Quote</label>
                    <RichTextEditor
                      value={hero.quoteText || ""}
                      onChange={(val) => updateSection("hero", "quoteText", val)}
                      minHeight="80px"
                      placeholder="Enter hero mission quote..."
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Highlight Strip (Image 1) */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom Highlight Strip (4 Features + Right Card)</h3>
                <div className="alp-form-grid">
                  {(hero.trustStrip || DEFAULT_LANDING_PAGE_CONTENT.hero.trustStrip || []).map((item, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Feature #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Title</label>
                        <input
                          className="alp-input"
                          value={item.title || ""}
                          onChange={(e) => updateArrayItem("hero", "trustStrip", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Description</label>
                        <RichTextEditor
                          value={item.description || ""}
                          onChange={(val) => updateArrayItem("hero", "trustStrip", idx, "description", val)}
                          minHeight="70px"
                          placeholder="Enter description..."
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Feature Icon"
                          value={item.icon || "users"}
                          onChange={(val) => updateArrayItem("hero", "trustStrip", idx, "icon", val)}
                          colorTheme="#2E6A3B"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="alp-form-grid" style={{ marginTop: "16px" }}>
                  <div className="alp-form-group">
                    <label className="alp-label">Right Journey Card Title</label>
                    <input
                      className="alp-input"
                      value={hero.stripRightCard?.title || ""}
                      onChange={(e) => updateNested("hero", "stripRightCard", "title", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Right Journey Card Description</label>
                    <RichTextEditor
                      value={hero.stripRightCard?.text || ""}
                      onChange={(val) => updateNested("hero", "stripRightCard", "text", val)}
                      minHeight="80px"
                      placeholder="Enter right journey card description..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. WHY CHOOSE US ================= */}
          {activeSubTab === "whyChoose" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Section Headings & Intro</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={whyChoose.headingPrefix || ""}
                      onChange={(e) => updateSection("whyChoose", "headingPrefix", e.target.value)}
                      placeholder="e.g. Why Choose Online Quran Classes\nat Yaqeen "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={whyChoose.headingHighlight || ""}
                      onChange={(e) => updateSection("whyChoose", "headingHighlight", e.target.value)}
                      placeholder="e.g. Institute?"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Intro Description (Paragraphs)</label>
                    <RichTextEditor
                      value={whyChoose.intro || ""}
                      onChange={(val) => updateSection("whyChoose", "intro", val)}
                      minHeight="120px"
                      placeholder="Enter intro description paragraphs..."
                    />
                  </div>
                </div>
              </div>

              {/* 8 Feature Cards */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">8 Feature Cards (Icons & Texts)</h3>
                <div className="alp-form-grid">
                  {(whyChoose.features || DEFAULT_LANDING_PAGE_CONTENT.whyChoose.features || []).map((feat, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Feature #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "8px" }}>
                        <label className="alp-label">Feature Title</label>
                        <input
                          className="alp-input"
                          value={feat.title || ""}
                          onChange={(e) => updateArrayItem("whyChoose", "features", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Feature Icon"
                          value={feat.icon || "monitor"}
                          onChange={(val) => updateArrayItem("whyChoose", "features", idx, "icon", val)}
                          colorTheme="#CE7823"
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Description</label>
                        <RichTextEditor
                          value={feat.description || ""}
                          onChange={(val) => updateArrayItem("whyChoose", "features", idx, "description", val)}
                          minHeight="80px"
                          placeholder="Enter feature description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Card */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom Action Card</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Card Title</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.title || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "title", e.target.value)}
                      placeholder="e.g. Start Your Online Quran Learning Journey Today"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Card Description</label>
                    <RichTextEditor
                      value={whyChoose.bottomBox?.description || ""}
                      onChange={(val) => updateNested("whyChoose", "bottomBox", "description", val)}
                      minHeight="80px"
                      placeholder="Enter card description..."
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button Text (Gold Solid)</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.primaryBtnText || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "primaryBtnText", e.target.value)}
                      placeholder="e.g. Book Free Trial Class"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button URL</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.primaryBtnUrl || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "primaryBtnUrl", e.target.value)}
                      placeholder="e.g. /book-free-trial"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button Text (Gold Outline)</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.secondaryBtnText || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "secondaryBtnText", e.target.value)}
                      placeholder="e.g. Contact Us"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button URL</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.secondaryBtnUrl || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "secondaryBtnUrl", e.target.value)}
                      placeholder="e.g. /contact"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Bottom Trust Note</label>
                    <input
                      className="alp-input"
                      value={whyChoose.bottomBox?.trustBadgeText || ""}
                      onChange={(e) => updateNested("whyChoose", "bottomBox", "trustBadgeText", e.target.value)}
                      placeholder="e.g. Trusted by thousands of students and parents worldwide."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. THE DIFFERENCE ================= */}
          {activeSubTab === "difference" && (
            <div className="alp-form-section">
              {/* Left 5 Feature Cards */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Left Column: 5 Stacked Feature Cards</h3>
                <div className="alp-form-grid">
                  {(difference.leftCards || DEFAULT_LANDING_PAGE_CONTENT.difference.leftCards || []).map((card, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Card #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Title</label>
                        <input
                          className="alp-input"
                          value={card.title || ""}
                          onChange={(e) => updateArrayItem("difference", "leftCards", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Description</label>
                        <RichTextEditor
                          value={card.description || ""}
                          onChange={(val) => updateArrayItem("difference", "leftCards", idx, "description", val)}
                          minHeight="70px"
                          placeholder="Enter description..."
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Card Icon"
                          value={card.icon || "users"}
                          onChange={(val) => updateArrayItem("difference", "leftCards", idx, "icon", val)}
                          colorTheme={card.colorTheme === "green" ? "#2E6A3B" : "#CE7823"}
                        />
                      </div>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Color Theme</label>
                        <select
                          className="alp-select"
                          value={card.colorTheme || "orange"}
                          onChange={(e) => updateArrayItem("difference", "leftCards", idx, "colorTheme", e.target.value)}
                        >
                          <option value="orange">Orange / Amber</option>
                          <option value="green">Green</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center Main Content */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Center Column Content & Headings</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Top Badge Text</label>
                    <input
                      className="alp-input"
                      value={difference.centerBadge || ""}
                      onChange={(e) => updateSection("difference", "centerBadge", e.target.value)}
                      placeholder="e.g. THE YAQEEN INSTITUTE DIFFERENCE"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={difference.centerHeadingPrefix || ""}
                      onChange={(e) => updateSection("difference", "centerHeadingPrefix", e.target.value)}
                      placeholder="e.g. The Yaqeen Institute"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={difference.centerHeadingHighlight || ""}
                      onChange={(e) => updateSection("difference", "centerHeadingHighlight", e.target.value)}
                      placeholder="e.g. Difference"
                    />
                  </div>
                  {(difference.centerParagraphs || DEFAULT_LANDING_PAGE_CONTENT.difference.centerParagraphs || []).map((para, idx) => (
                    <div key={idx} className="alp-form-group full">
                      <label className="alp-label">Paragraph #{idx + 1}</label>
                      <RichTextEditor
                        value={para || ""}
                        onChange={(val) => updateStringArrayItem("difference", "centerParagraphs", idx, val)}
                        minHeight="80px"
                        placeholder={`Enter paragraph #${idx + 1}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Center 4 Pillars */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Center Column 4 Bottom Pillars</h3>
                <div className="alp-form-grid">
                  {(difference.centerPillars || DEFAULT_LANDING_PAGE_CONTENT.difference.centerPillars || []).map((pil, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Pillar #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Title</label>
                        <input
                          className="alp-input"
                          value={pil.title || ""}
                          onChange={(e) => updateArrayItem("difference", "centerPillars", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Description</label>
                        <RichTextEditor
                          value={pil.description || ""}
                          onChange={(val) => updateArrayItem("difference", "centerPillars", idx, "description", val)}
                          minHeight="70px"
                          placeholder="Enter description..."
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Pillar Icon"
                          value={pil.icon || "book"}
                          onChange={(val) => updateArrayItem("difference", "centerPillars", idx, "icon", val)}
                          colorTheme={pil.colorTheme === "green" ? "#2E6A3B" : "#CE7823"}
                        />
                      </div>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Color Theme</label>
                        <select
                          className="alp-select"
                          value={pil.colorTheme || "orange"}
                          onChange={(e) => updateArrayItem("difference", "centerPillars", idx, "colorTheme", e.target.value)}
                        >
                          <option value="orange">Orange</option>
                          <option value="green">Green</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Dark Green Card */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Right Column Dark Green Card</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Tag (Top Gold)</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.tag || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "tag", e.target.value)}
                      placeholder="e.g. START YOUR"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Card Title</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.title || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "title", e.target.value)}
                      placeholder="e.g. Quran Journey Today"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Card Description</label>
                    <RichTextEditor
                      value={difference.rightCard?.description || ""}
                      onChange={(val) => updateNested("difference", "rightCard", "description", val)}
                      minHeight="80px"
                      placeholder="Enter card description..."
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button Text</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.primaryBtnText || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "primaryBtnText", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Primary Button URL</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.primaryBtnUrl || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "primaryBtnUrl", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button Text</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.secondaryBtnText || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "secondaryBtnText", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Secondary Button URL</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.secondaryBtnUrl || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "secondaryBtnUrl", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Bottom Trust Badge Text</label>
                    <input
                      className="alp-input"
                      value={difference.rightCard?.trustBadgeText || ""}
                      onChange={(e) => updateNested("difference", "rightCard", "trustBadgeText", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Taglines */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom Tagline Bar</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Left Tagline</label>
                    <input
                      className="alp-input"
                      value={difference.taglineLeft || ""}
                      onChange={(e) => updateSection("difference", "taglineLeft", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Right Script Tagline</label>
                    <input
                      className="alp-input"
                      value={difference.taglineRight || ""}
                      onChange={(e) => updateSection("difference", "taglineRight", e.target.value)}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 5. UK FAMILIES & TRUST ================= */}
          {activeSubTab === "ukTrust" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Top Header & Left Column Headings</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group full">
                    <AdminImagePicker
                      label="Section Top Logo Image"
                      value={ukTrust.logoUrl || ""}
                      onChange={(val) => updateSection("ukTrust", "logoUrl", val)}
                      hint="Upload or choose a logo specific for this landing page (default: /images/logo.png)"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Top Right Tagline</label>
                    <input
                      className="alp-input"
                      value={ukTrust.tagline || ""}
                      onChange={(e) => updateSection("ukTrust", "tagline", e.target.value)}
                      placeholder="e.g. LEARN • GROW • BELONG"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Pill Badge Text</label>
                    <input
                      className="alp-input"
                      value={ukTrust.badgeText || ""}
                      onChange={(e) => updateSection("ukTrust", "badgeText", e.target.value)}
                      placeholder="e.g. TRUSTED BY MUSLIM FAMILIES"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={ukTrust.headingPrefix || ""}
                      onChange={(e) => updateSection("ukTrust", "headingPrefix", e.target.value)}
                      placeholder="e.g. Trusted by Muslim Families Across the "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={ukTrust.headingHighlight || ""}
                      onChange={(e) => updateSection("ukTrust", "headingHighlight", e.target.value)}
                      placeholder="e.g. United Kingdom"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Lead Paragraph</label>
                    <RichTextEditor
                      value={ukTrust.leadParagraph || ""}
                      onChange={(val) => updateSection("ukTrust", "leadParagraph", val)}
                      minHeight="90px"
                      placeholder="Enter lead paragraph..."
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Highlights Box Title</label>
                    <input
                      className="alp-input"
                      value={ukTrust.highlightsBoxTitle || ""}
                      onChange={(e) => updateSection("ukTrust", "highlightsBoxTitle", e.target.value)}
                      placeholder="e.g. Key Highlights of Yaqeen Institute"
                    />
                  </div>
                </div>
              </div>

              {/* 6 Highlights Grid */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">6 Key Highlights Cards (Left Column Box)</h3>
                <div className="alp-form-grid">
                  {(ukTrust.highlights || DEFAULT_LANDING_PAGE_CONTENT.ukTrust.highlights || []).map((item, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Highlight #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Title</label>
                        <input
                          className="alp-input"
                          value={item.title || ""}
                          onChange={(e) => updateArrayItem("ukTrust", "highlights", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Description</label>
                        <RichTextEditor
                          value={item.description || ""}
                          onChange={(val) => updateArrayItem("ukTrust", "highlights", idx, "description", val)}
                          minHeight="70px"
                          placeholder="Enter description..."
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Highlight Icon"
                          value={item.icon || "book"}
                          onChange={(val) => updateArrayItem("ukTrust", "highlights", idx, "icon", val)}
                          colorTheme="#2E6A3B"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right White Card: 5 Paragraphs */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Right Column White Card Content</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Card Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={ukTrust.whyCardHeadingPrefix || ""}
                      onChange={(e) => updateSection("ukTrust", "whyCardHeadingPrefix", e.target.value)}
                      placeholder="e.g. Why Families Choose "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Card Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={ukTrust.whyCardHeadingHighlight || ""}
                      onChange={(e) => updateSection("ukTrust", "whyCardHeadingHighlight", e.target.value)}
                      placeholder="e.g. Yaqeen Institute"
                    />
                  </div>
                  {(ukTrust.whyCardParagraphs || DEFAULT_LANDING_PAGE_CONTENT.ukTrust.whyCardParagraphs || []).map((para, idx) => (
                    <div key={idx} className="alp-form-group full">
                      <label className="alp-label">Paragraph #{idx + 1}</label>
                      <RichTextEditor
                        value={para || ""}
                        onChange={(val) => updateStringArrayItem("ukTrust", "whyCardParagraphs", idx, val)}
                        minHeight="80px"
                        placeholder={`Enter paragraph #${idx + 1}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom White Banner Strip */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom Full-Width Banner Strip</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Item 1 Title</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.item1Title || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "item1Title", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Item 1 Description</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.item1Desc || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "item1Desc", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <AdminIconPicker
                      label="Item 1 Icon"
                      value={ukTrust.bottomStrip?.item1Icon || "calendar"}
                      onChange={(val) => updateNested("ukTrust", "bottomStrip", "item1Icon", val)}
                      colorTheme="#2E6A3B"
                    />
                  </div>

                  <div className="alp-form-group">
                    <label className="alp-label">Item 2 Title</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.item2Title || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "item2Title", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Item 2 Description</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.item2Desc || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "item2Desc", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <AdminIconPicker
                      label="Item 2 Icon"
                      value={ukTrust.bottomStrip?.item2Icon || "shield"}
                      onChange={(val) => updateNested("ukTrust", "bottomStrip", "item2Icon", val)}
                      colorTheme="#2E6A3B"
                    />
                  </div>

                  <div className="alp-form-group">
                    <label className="alp-label">CTA Button Text</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.btnText || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "btnText", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">CTA Button URL</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.btnUrl || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "btnUrl", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Item 4 Text</label>
                    <input
                      className="alp-input"
                      value={ukTrust.bottomStrip?.item4Title || ""}
                      onChange={(e) => updateNested("ukTrust", "bottomStrip", "item4Title", e.target.value)}
                    />
                  </div>
                  <div className="alp-form-group full">
                    <AdminIconPicker
                      label="Item 4 Icon"
                      value={ukTrust.bottomStrip?.item4Icon || "heart"}
                      onChange={(val) => updateNested("ukTrust", "bottomStrip", "item4Icon", val)}
                      colorTheme="#CE7823"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 6. COURSES SHOWCASE ================= */}
          {activeSubTab === "courses" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Section Headings & Tag</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Tag / Eyebrow (Gold uppercase)</label>
                    <input
                      className="alp-input"
                      value={courses.tag || ""}
                      onChange={(e) => updateSection("courses", "tag", e.target.value)}
                      placeholder="e.g. EXPLORE OUR COMPREHENSIVE PROGRAMS"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={courses.mainHeadingPrefix || ""}
                      onChange={(e) => updateSection("courses", "mainHeadingPrefix", e.target.value)}
                      placeholder="e.g. Online Quran Courses\nat "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={courses.mainHeadingHighlight || ""}
                      onChange={(e) => updateSection("courses", "mainHeadingHighlight", e.target.value)}
                      placeholder="e.g. Yaqeen Institute"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Subheading / Description</label>
                    <RichTextEditor
                      value={courses.subheading || ""}
                      onChange={(val) => updateSection("courses", "subheading", val)}
                      minHeight="80px"
                      placeholder="Enter subheading / description..."
                    />
                  </div>
                </div>
              </div>

              {/* 5 Course Cards */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">5 Course Cards</h3>
                {(courses.courseCards || DEFAULT_LANDING_PAGE_CONTENT.courses.courseCards || []).map((course, idx) => (
                  <div key={idx} className="alp-item-card" style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span className="alp-item-badge">Course #{idx + 1} ({course.number || course.id || `0${idx + 1}`})</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: course.colorTheme === "green" ? "#2E6A3B" : "#CE7823" }}>
                        Theme: {course.colorTheme === "green" ? "🟢 Green" : "🟠 Orange"}
                      </span>
                    </div>
                    
                    <div className="alp-form-grid" style={{ marginTop: "8px" }}>
                      <div className="alp-form-group">
                        <label className="alp-label">Badge Number</label>
                        <input
                          className="alp-input"
                          value={course.number || course.id || `0${idx + 1}`}
                          onChange={(e) => updateArrayItem("courses", "courseCards", idx, "number", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group">
                        <label className="alp-label">Course Title</label>
                        <input
                          className="alp-input"
                          value={course.title || ""}
                          onChange={(e) => updateArrayItem("courses", "courseCards", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group">
                        <label className="alp-label">Color Theme</label>
                        <select
                          className="alp-select"
                          value={course.colorTheme || "orange"}
                          onChange={(e) => updateArrayItem("courses", "courseCards", idx, "colorTheme", e.target.value)}
                        >
                          <option value="orange">Orange (#CE7823)</option>
                          <option value="green">Green (#2E6A3B)</option>
                        </select>
                      </div>
                      <div className="alp-form-group full">
                        <AdminIconPicker
                          label="Course Card Icon"
                          value={course.icon || "book"}
                          onChange={(val) => updateArrayItem("courses", "courseCards", idx, "icon", val)}
                          colorTheme={course.colorTheme === "green" ? "#2E6A3B" : "#CE7823"}
                        />
                      </div>
                      <div className="alp-form-group full">
                        <label className="alp-label">Short Description</label>
                        <RichTextEditor
                          value={course.description || ""}
                          onChange={(val) => updateArrayItem("courses", "courseCards", idx, "description", val)}
                          minHeight="80px"
                          placeholder="Enter short description..."
                        />
                      </div>

                      {/* 4 Bullet Points */}
                      <div className="alp-form-group full" style={{ backgroundColor: "#F9FAFB", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                        <label className="alp-label" style={{ fontWeight: "700", marginBottom: "8px" }}>4 Bullet Points (Feature Checklist)</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {(course.bulletPoints || DEFAULT_LANDING_PAGE_CONTENT.courses.courseCards[idx]?.bulletPoints || ["", "", "", ""]).map((bullet, bIdx) => (
                            <div key={bIdx}>
                              <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "2px" }}>Point #{bIdx + 1}</label>
                              <input
                                className="alp-input"
                                value={bullet || ""}
                                onChange={(e) => updateArrayItemSubArray("courses", "courseCards", idx, "bulletPoints", bIdx, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="alp-form-group full">
                        <label className="alp-label">"Ideal For:" Description</label>
                        <input
                          className="alp-input"
                          value={course.idealFor || ""}
                          onChange={(e) => updateArrayItem("courses", "courseCards", idx, "idealFor", e.target.value)}
                          placeholder="e.g. Beginners of all ages starting their Quran learning journey."
                        />
                      </div>
                      <div className="alp-form-group full">
                        <label className="alp-label">Course Page Link URL</label>
                        <input
                          className="alp-input"
                          value={course.btnUrl || ""}
                          onChange={(e) => updateArrayItem("courses", "courseCards", idx, "btnUrl", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Full-Width Strip */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom Full-Width Action Strip</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Strip Title</label>
                    <input
                      className="alp-input"
                      value={courses.bottomStrip?.title || ""}
                      onChange={(e) => updateNested("courses", "bottomStrip", "title", e.target.value)}
                      placeholder="e.g. Start Your Quran Learning Journey Today"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Strip Description</label>
                    <RichTextEditor
                      value={courses.bottomStrip?.desc || ""}
                      onChange={(val) => updateNested("courses", "bottomStrip", "desc", val)}
                      minHeight="70px"
                      placeholder="Enter strip description..."
                    />
                  </div>
                  <div className="alp-form-group full">
                    <AdminIconPicker
                      label="Left Circular Badge Icon"
                      value={courses.bottomStrip?.icon || "book"}
                      onChange={(val) => updateNested("courses", "bottomStrip", "icon", val)}
                      colorTheme="#CE7823"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Dark Green Button Text</label>
                    <input
                      className="alp-input"
                      value={courses.bottomStrip?.btnText || ""}
                      onChange={(e) => updateNested("courses", "bottomStrip", "btnText", e.target.value)}
                      placeholder="e.g. Explore All Courses"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Button URL</label>
                    <input
                      className="alp-input"
                      value={courses.bottomStrip?.btnUrl || ""}
                      onChange={(e) => updateNested("courses", "bottomStrip", "btnUrl", e.target.value)}
                      placeholder="e.g. /courses"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Script / Cursive Tagline</label>
                    <input
                      className="alp-input"
                      value={courses.bottomStrip?.tagline || ""}
                      onChange={(e) => updateNested("courses", "bottomStrip", "tagline", e.target.value)}
                      placeholder="e.g. Your Journey Starts Here"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 7. JOURNEY & PILLARS ================= */}
          {activeSubTab === "journey" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Section Headings & Tag</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Tag / Eyebrow (Gold uppercase)</label>
                    <input
                      className="alp-input"
                      value={journey.tag || ""}
                      onChange={(e) => updateSection("journey", "tag", e.target.value)}
                      placeholder="e.g. AT YAQEEN INSTITUTE"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={journey.headingPrefix || ""}
                      onChange={(e) => updateSection("journey", "headingPrefix", e.target.value)}
                      placeholder="e.g. Your Quran Journey, "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Gold)</label>
                    <input
                      className="alp-input"
                      value={journey.headingHighlight || ""}
                      onChange={(e) => updateSection("journey", "headingHighlight", e.target.value)}
                      placeholder="e.g. Our Responsibility."
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Right Column Quote Text</label>
                    <input
                      className="alp-input"
                      value={journey.quoteText || ""}
                      onChange={(e) => updateSection("journey", "quoteText", e.target.value)}
                      placeholder='e.g. “Knowledge today, a brighter tomorrow.”'
                    />
                  </div>
                </div>
              </div>

              {/* Column 1: Left Text Block */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Column 1: Left Text Block & Tagline</h3>
                <div className="alp-form-grid">
                  {(journey.leftParagraphs || DEFAULT_LANDING_PAGE_CONTENT.journey.leftParagraphs || []).map((para, idx) => (
                    <div key={idx} className="alp-form-group full">
                      <label className="alp-label">Paragraph #{idx + 1}</label>
                      <RichTextEditor
                        value={para || ""}
                        onChange={(val) => updateStringArrayItem("journey", "leftParagraphs", idx, val)}
                        minHeight="80px"
                        placeholder={`Enter paragraph #${idx + 1}...`}
                      />
                    </div>
                  ))}
                  <div className="alp-form-group full">
                    <label className="alp-label">Bottom Tagline (All Caps)</label>
                    <input
                      className="alp-input"
                      value={journey.leftTagline || ""}
                      onChange={(e) => updateSection("journey", "leftTagline", e.target.value)}
                      placeholder="e.g. KNOWLEDGE TODAY, A BRIGHTER TOMORROW."
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Center Light Cream Card */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Column 2: Center Light Cream Card (3 Paragraphs)</h3>
                <div className="alp-form-grid">
                  {(journey.centerParagraphs || DEFAULT_LANDING_PAGE_CONTENT.journey.centerParagraphs || []).map((para, idx) => (
                    <div key={idx} className="alp-form-group full">
                      <label className="alp-label">Paragraph #{idx + 1}</label>
                      <RichTextEditor
                        value={para || ""}
                        onChange={(val) => updateStringArrayItem("journey", "centerParagraphs", idx, val)}
                        minHeight="80px"
                        placeholder={`Enter paragraph #${idx + 1}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Dark Green Card ("What You Will Gain") */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Column 3: Dark Green Card ("What You Will Gain")</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Card Title</label>
                    <input
                      className="alp-input"
                      value={journey.gainCard?.title || ""}
                      onChange={(e) => updateNested("journey", "gainCard", "title", e.target.value)}
                      placeholder="e.g. What You Will Gain"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Bottom Script Tagline</label>
                    <input
                      className="alp-input"
                      value={journey.gainCard?.tagline || ""}
                      onChange={(e) => updateNested("journey", "gainCard", "tagline", e.target.value)}
                      placeholder="e.g. A Brighter You Through Knowledge"
                    />
                  </div>
                </div>

                <h4 style={{ fontSize: "13px", fontWeight: "700", margin: "16px 0 10px 0", color: "#374151" }}>5 Gain Items</h4>
                <div className="alp-form-grid">
                  {(journey.gainCard?.items || DEFAULT_LANDING_PAGE_CONTENT.journey.gainCard.items || []).map((item, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Gain Item #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Title</label>
                        <input
                          className="alp-input"
                          value={item.title || ""}
                          onChange={(e) => {
                            const newItems = [...(journey.gainCard?.items || DEFAULT_LANDING_PAGE_CONTENT.journey.gainCard.items || [])];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            updateNested("journey", "gainCard", "items", newItems);
                          }}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Gain Item Icon"
                          value={item.icon || "book"}
                          onChange={(val) => {
                            const newItems = [...(journey.gainCard?.items || DEFAULT_LANDING_PAGE_CONTENT.journey.gainCard.items || [])];
                            newItems[idx] = { ...newItems[idx], icon: val };
                            updateNested("journey", "gainCard", "items", newItems);
                          }}
                          colorTheme="#CE7823"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom 5 Pillars Strip */}
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">Bottom 5 Pillars Strip</h3>
                <div className="alp-form-grid">
                  {(journey.pillars || DEFAULT_LANDING_PAGE_CONTENT.journey.pillars || []).map((pil, idx) => (
                    <div key={idx} className="alp-item-card">
                      <span className="alp-item-badge">Pillar #{idx + 1}</span>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Pillar Title</label>
                        <input
                          className="alp-input"
                          value={pil.title || ""}
                          onChange={(e) => updateArrayItem("journey", "pillars", idx, "title", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group" style={{ marginTop: "6px" }}>
                        <label className="alp-label">Subtitle</label>
                        <input
                          className="alp-input"
                          value={pil.subtitle || ""}
                          onChange={(e) => updateArrayItem("journey", "pillars", idx, "subtitle", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full" style={{ marginTop: "6px" }}>
                        <AdminIconPicker
                          label="Pillar Icon"
                          value={pil.icon || "star"}
                          onChange={(val) => updateArrayItem("journey", "pillars", idx, "icon", val)}
                          colorTheme="#CE7823"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= 8. FAQS ================= */}
          {activeSubTab === "faqs" && (
            <div className="alp-form-section">
              <div className="alp-section-card">
                <h3 className="alp-section-card-title">FAQs Heading & Subtitle</h3>
                <div className="alp-form-grid">
                  <div className="alp-form-group">
                    <label className="alp-label">Tag / Eyebrow (Gold uppercase)</label>
                    <input
                      className="alp-input"
                      value={faqs.tag || ""}
                      onChange={(e) => updateSection("faqs", "tag", e.target.value)}
                      placeholder="e.g. FAQs"
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Prefix</label>
                    <input
                      className="alp-input"
                      value={faqs.headingPrefix || ""}
                      onChange={(e) => updateSection("faqs", "headingPrefix", e.target.value)}
                      placeholder="e.g. Frequently Asked "
                    />
                  </div>
                  <div className="alp-form-group">
                    <label className="alp-label">Heading Highlight (Dark Green)</label>
                    <input
                      className="alp-input"
                      value={faqs.headingHighlight || ""}
                      onChange={(e) => updateSection("faqs", "headingHighlight", e.target.value)}
                      placeholder="e.g. Questions"
                    />
                  </div>
                  <div className="alp-form-group full">
                    <label className="alp-label">Subtitle</label>
                    <input
                      className="alp-input"
                      value={faqs.subtitle || ""}
                      onChange={(e) => updateSection("faqs", "subtitle", e.target.value)}
                      placeholder="e.g. Everything you need to know about our online Quran classes."
                    />
                  </div>
                </div>
              </div>

              <div className="alp-section-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 className="alp-section-card-title" style={{ margin: 0 }}>
                    FAQ Items ({(faqs.items || []).length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq = {
                        id: Date.now(),
                        icon: "book",
                        question: "New Question",
                        answer: "New Answer text."
                      };
                      updateSection("faqs", "items", [...(faqs.items || []), newFaq]);
                    }}
                    className="alp-btn-add-item"
                  >
                    + Add FAQ Item
                  </button>
                </div>

                {(faqs.items || DEFAULT_LANDING_PAGE_CONTENT.faqs.items || []).map((faq, idx) => (
                  <div key={faq.id || idx} className="alp-item-card" style={{ marginBottom: "14px" }}>
                    <div className="alp-item-header">
                      <span className="alp-item-badge">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (faqs.items || DEFAULT_LANDING_PAGE_CONTENT.faqs.items || []).filter((_, i) => i !== idx);
                          updateSection("faqs", "items", updated);
                        }}
                        className="alp-btn-remove-item"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div className="alp-form-grid" style={{ marginTop: "8px" }}>
                      <div className="alp-form-group full">
                        <AdminIconPicker
                          label="FAQ Question Icon"
                          value={faq.icon || (idx === 0 ? "book" : idx === 1 ? "user" : idx === 2 ? "screen" : idx === 3 ? "calendar" : idx === 4 ? "laptop" : "gift")}
                          onChange={(val) => updateArrayItem("faqs", "items", idx, "icon", val)}
                          colorTheme="#CE7823"
                        />
                      </div>
                      <div className="alp-form-group full">
                        <label className="alp-label">Question</label>
                        <input
                          className="alp-input"
                          value={faq.question || ""}
                          onChange={(e) => updateArrayItem("faqs", "items", idx, "question", e.target.value)}
                        />
                      </div>
                      <div className="alp-form-group full">
                        <label className="alp-label">Answer</label>
                        <RichTextEditor
                          value={faq.answer || ""}
                          onChange={(val) => updateArrayItem("faqs", "items", idx, "answer", val)}
                          minHeight="90px"
                          placeholder="Enter answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
