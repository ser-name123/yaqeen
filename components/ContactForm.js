"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Telemetry gathering
    let userIp = "Unknown / Client-side only";
    let browserInfo = "Unknown Browser";
    let systemInfo = "Unknown System";
    let userCity = "Unknown";
    let userState = "Unknown";
    let userCountry = "Unknown";

    try {
      // 1. Fetch IP Address and Location Info using ipapi.co
      const geoResponse = await fetch("https://ipapi.co/json/");
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        userIp = geoData.ip || userIp;
        userCity = geoData.city || "Unknown";
        userState = geoData.region || "Unknown";
        userCountry = geoData.country_name || "Unknown";
      }
    } catch (geoErr) {
      console.warn("Could not retrieve geolocation data dynamically:", geoErr);
      // Fallback to simple ipify if ipapi.co is rate-limited or fails
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          userIp = ipData.ip || userIp;
        }
      } catch (ipErr) {
        console.warn("Could not retrieve IP address dynamically:", ipErr);
      }
    }

    try {
      // 2. Gather browser information
      if (typeof window !== "undefined" && window.navigator) {
        browserInfo = window.navigator.userAgent || browserInfo;
        
        // 3. Gather system information
        const platform = window.navigator.platform || "unknown-platform";
        const language = window.navigator.language || "unknown-language";
        const screenWidth = window.screen?.width || 0;
        const screenHeight = window.screen?.height || 0;
        systemInfo = `Platform: ${platform} | Language: ${language} | Screen Resolution: ${screenWidth}x${screenHeight}`;
      }
    } catch (sysErr) {
      console.warn("Could not retrieve system info dynamically:", sysErr);
    }

    try {
      const { error } = await supabase
        .from("contacts")
        .insert([{ 
          name, 
          email, 
          subject, 
          message,
          ip_address: userIp,
          browser_info: browserInfo,
          system_info: systemInfo,
          city: userCity,
          state: userState,
          country: userCountry
        }]);

      if (error) throw error;

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMessage(
        err.message?.includes("relation")
          ? "Database schema missing: Please ensure you run the SQL script to create the 'contacts' table in your Supabase panel."
          : err.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="contact-form-card animate-slide-up">
      <h2 className="contact-section-title">Send Us a Message</h2>
      <div className="contact-section-divider"></div>
      <p className="contact-section-subtitle">
        Fill out the form and we will get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="contact-form-grid-row">
          <div className="contact-form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={status === "loading"}
              suppressHydrationWarning
              required
            />
          </div>
          <div className="contact-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={status === "loading"}
              suppressHydrationWarning
              required
            />
          </div>
        </div>

        <div className="contact-form-group">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={status === "loading"}
            suppressHydrationWarning
            required
          />
        </div>

        <div className="contact-form-group">
          <textarea
            name="message"
            rows="6"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            disabled={status === "loading"}
            suppressHydrationWarning
            required
            style={{ resize: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          suppressHydrationWarning
        >
          {/* Paper Plane SVG Icon */}
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ transform: "rotate(-10deg)" }}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
        </button>

        {status === "success" && (
          <p style={{ color: "#10b981", fontSize: "14.5px", fontWeight: "500", textAlign: "center", marginTop: "20px" }}>
            ✓ Thank you! Your message has been sent successfully. We will contact you soon.
          </p>
        )}

        {status === "error" && (
          <p style={{ color: "#ef4444", fontSize: "13.5px", fontWeight: "500", textAlign: "center", marginTop: "20px", lineHeight: "1.4" }}>
            ⚠ {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
