"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "All fields are required.",
        confirmButtonColor: "#c99b4d",
        background: "#fdfcf9",
        color: "#2c251e"
      });
      return;
    }

    if (!email.includes("@")) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#c99b4d",
        background: "#fdfcf9",
        color: "#2c251e"
      });
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

    const apis = [
      {
        url: "https://ipwho.is/",
        parse: (data) => ({
          ip: data.ip,
          city: data.city,
          state: data.region,
          country: data.country
        })
      },
      {
        url: "https://freeipapi.com/api/json",
        parse: (data) => ({
          ip: data.ipAddress,
          city: data.cityName,
          state: data.regionName,
          country: data.countryName
        })
      },
      {
        url: "https://ipapi.co/json/",
        parse: (data) => ({
          ip: data.ip,
          city: data.city,
          state: data.region,
          country: data.country_name
        })
      }
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api.url);
        if (response.ok) {
          const data = await response.json();
          const parsed = api.parse(data);
          if (parsed.ip) {
            userIp = parsed.ip;
            userCity = parsed.city || "Unknown";
            userState = parsed.state || "Unknown";
            userCountry = parsed.country || "Unknown";
            break; // Exit loop once lookup succeeds
          }
        }
      } catch (err) {
        console.warn(`Geolocation lookup failed for ${api.url}:`, err);
      }
    }

    // Final raw IP lookup fallback
    if (userIp === "Unknown / Client-side only") {
      try {
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          userIp = ipData.ip || userIp;
        }
      } catch (ipErr) {
        console.warn("Could not retrieve fallback IP address:", ipErr);
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          browser_info: browserInfo,
          system_info: systemInfo,
          ip_address: userIp !== "Unknown / Client-side only" ? userIp : undefined,
          city: userCity !== "Unknown" ? userCity : undefined,
          state: userState !== "Unknown" ? userState : undefined,
          country: userCountry !== "Unknown" ? userCountry : undefined
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit message.");
      }

      setStatus("idle");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Your message has been sent successfully. We will contact you soon.",
        confirmButtonColor: "#c99b4d",
        background: "#fdfcf9",
        color: "#2c251e"
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("idle");
      
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#c99b4d",
        background: "#fdfcf9",
        color: "#2c251e"
      });
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
      </form>
    </div>
  );
}
