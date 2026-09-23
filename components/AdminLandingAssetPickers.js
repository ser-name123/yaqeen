"use client";

import { useState, useRef } from "react";

// Preset Icon Options categorized
export const PRESET_ICONS = [
  { group: "Popular & Quran", options: [
    { value: "book", label: "📖 Book (Quran / Reading)" },
    { value: "book-open", label: "📖 Book Open (Tajweed / Recitation)" },
    { value: "book-bookmark", label: "🔖 Book with Bookmark (Hifz)" },
    { value: "books-stack", label: "📚 Stack of Books (Islamic Studies)" },
    { value: "teacher", label: "🎓 Teacher / Graduation Cap" },
    { value: "users", label: "👥 Users / One-to-One Classroom" },
    { value: "user", label: "👤 Single Student / User" },
  ]},
  { group: "Trust & Safety", options: [
    { value: "shield", label: "🛡️ Shield (Safe & Secure)" },
    { value: "shield-check", label: "🛡️ Shield with Checkmark" },
    { value: "star", label: "⭐ Star (Trusted / Top Rated)" },
    { value: "heart", label: "❤️ Heart (Care & Support)" },
    { value: "trophy", label: "🏆 Trophy / Award" },
    { value: "diamond", label: "💎 Diamond / Premium Quality" },
    { value: "gift", label: "🎁 Gift / Free Trial" },
  ]},
  { group: "Time & Schedule", options: [
    { value: "calendar", label: "📅 Calendar (Flexible Schedule)" },
    { value: "clock", label: "⏰ Clock (Anytime / 24/7)" },
  ]},
  { group: "Technology & Communication", options: [
    { value: "monitor", label: "💻 Monitor / Screen (Live Class)" },
    { value: "screen", label: "🖥️ Screen / Virtual Classroom" },
    { value: "laptop", label: "💻 Laptop / Device" },
    { value: "headset", label: "🎧 Headset (Learn From Home)" },
    { value: "headphones", label: "🎧 Headphones (Support)" },
    { value: "chat", label: "💬 Chat / Speech (Arabic Language)" },
    { value: "speech", label: "💬 Speech Bubble" },
  ]},
  { group: "Analytics & Progress", options: [
    { value: "chart", label: "📊 Bar Chart (Progress Tracking)" },
    { value: "globe", label: "🌐 Globe (Students Worldwide)" },
    { value: "document", label: "📄 Document / Structured Curriculum" },
    { value: "gear", label: "⚙️ Gear (Modern Tools)" },
    { value: "bulb", label: "💡 Lightbulb (Idea / Understanding)" },
  ]}
];

export function getAdminIconSvg(name, color = "#2E6A3B", size = 20) {
  if (!name) return null;
  const raw = String(name).trim();

  // If it's an image URL or upload path
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/") ||
    raw.startsWith("data:image") ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(raw)
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={raw}
        alt="icon"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "inline-block"
        }}
      />
    );
  }

  const icon = raw.toLowerCase();
  switch (icon) {
    case "users":
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "calendar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "shield":
    case "shield-check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "headset":
    case "headphones":
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    case "book":
    case "book-open":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "book-bookmark":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M10 2v8l3-2.5 3 2.5V2" />
        </svg>
      );
    case "books-stack":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v16H6.5a2.5 2.5 0 0 0-2.5 2.5z" />
          <path d="M4 15.5A2.5 2.5 0 0 1 6.5 13H20" />
          <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7H20" />
        </svg>
      );
    case "chat":
    case "speech":
    case "message":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <circle cx="9" cy="10" r="1" fill={color} />
          <circle cx="12" cy="10" r="1" fill={color} />
          <circle cx="15" cy="10" r="1" fill={color} />
        </svg>
      );
    case "clock":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "document":
    case "file":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "screen":
    case "laptop":
    case "monitor":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "tool":
    case "gear":
    case "settings":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "teacher":
    case "graduation":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "chart":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "globe":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "bulb":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      );
    case "trophy":
    case "award":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
        </svg>
      );
    case "diamond":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M11 3L8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    case "gift":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      );
  }
}

// Interactive Icon & Custom Image Selector
export function AdminIconPicker({
  label = "Icon",
  value = "book",
  onChange,
  colorTheme = "#2E6A3B",
  hint = "Select a preset icon or enter a custom image / SVG URL."
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload icon: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isCustomUrl = Boolean(
    value &&
    (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:") || /\.(png|jpg|svg|webp)$/i.test(value))
  );

  return (
    <div className="alp-asset-picker-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label className="alp-label" style={{ margin: 0, fontWeight: "600" }}>{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("book")}
            style={{ fontSize: "11px", color: "#6B7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Reset Default
          </button>
        )}
      </div>

      <div className="alp-asset-picker-row">
        {/* Live Icon / Image Preview Box */}
        <div className="alp-icon-preview-box" title={`Active: ${value}`}>
          {getAdminIconSvg(value, colorTheme, 22)}
        </div>

        {/* Preset Select Dropdown */}
        <select
          className="alp-select"
          style={{ flex: "1 1 180px", minWidth: "150px" }}
          value={isCustomUrl ? "custom" : value}
          onChange={(e) => {
            if (e.target.value !== "custom") {
              onChange(e.target.value);
            }
          }}
        >
          {PRESET_ICONS.map((grp, gIdx) => (
            <optgroup key={gIdx} label={grp.group}>
              {grp.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="custom">⚙️ Custom Image / Icon URL</option>
        </select>

        {/* Upload Custom Icon / Image Button */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*,.svg"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="alp-btn-upload"
          title="Upload PNG, SVG, or WebP icon"
        >
          {uploading ? "⏳ Uploading..." : "📤 Upload Icon"}
        </button>
      </div>

      {/* If custom URL or user wants custom input */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <input
          className="alp-input"
          style={{ fontSize: "12px", padding: "6px 10px" }}
          placeholder="Icon name (e.g. book, shield) or custom Image URL (/images/...)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {hint && <span className="alp-hint">{hint}</span>}
    </div>
  );
}

// Interactive Image Picker & File Uploader
export function AdminImagePicker({
  label = "Image",
  value = "",
  onChange,
  altValue,
  onAltChange,
  hint = "Enter an image URL or click upload."
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="alp-asset-picker-wrap">
      <label className="alp-label" style={{ margin: 0, fontWeight: "600" }}>{label}</label>

      <div className="alp-asset-picker-row">
        <input
          className="alp-input"
          style={{ flex: "1 1 240px" }}
          placeholder="/images/... or https://..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="alp-btn-upload"
          style={{ padding: "8px 14px", backgroundColor: "#FDF3E7", color: "#CE7823", borderColor: "#F4D3B0" }}
        >
          {uploading ? "⏳ Uploading..." : "📤 Upload Image"}
        </button>
      </div>

      {onAltChange !== undefined && (
        <input
          className="alp-input"
          style={{ fontSize: "12px", padding: "6px 10px" }}
          placeholder="Image Alt Text (for SEO & Accessibility)"
          value={altValue || ""}
          onChange={(e) => onAltChange(e.target.value)}
        />
      )}

      {/* Live Thumbnail Preview */}
      {value && (
        <div className="alp-image-preview-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={altValue || "Preview"}
            className="alp-image-thumb"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "260px" }}>
              {value}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <a href={value} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#2563EB", textDecoration: "none" }}>
                👁️ Open Full Size
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                style={{ fontSize: "11px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ✕ Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {hint && <span className="alp-hint">{hint}</span>}
    </div>
  );
}
