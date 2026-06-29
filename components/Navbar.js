"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar({ logoText = "yaqeen", logoUrl = "", faviconUrl = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header" style={{
      position: "relative",
      width: "100%",
      zIndex: 1000,
      backgroundColor: "rgba(251, 248, 243, 0.95)",
      borderBottom: "1px solid var(--card-border)",
      boxShadow: "0 2px 10px rgba(44, 37, 30, 0.03)",
      transition: "all 0.3s ease"
    }}>
      <div className="nav-container" style={{
        maxWidth: "1350px",
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "var(--fg-color)", fontFamily: "var(--font-sans)", fontWeight: "700", fontSize: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {faviconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={faviconUrl} 
                alt="YAQEEN INSTITUTE" 
                style={{ height: "32px", width: "auto", objectFit: "contain" }} 
              />
            ) : (
              <svg width="32" height="28" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
                <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
                <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
                <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
            <span style={{ 
              textTransform: "uppercase", 
              fontWeight: "800", 
              color: "var(--fg-color)", 
              fontSize: "16px", 
              letterSpacing: "1.5px" 
            }}>YAQEEN INSTITUTE</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="nav-menu">
          <li>
            <Link href="/" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/courses" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              Our Courses
            </Link>
          </li>
          <li>
            <Link href="/blog" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              About Us
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/contact" className="nav-link-custom" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)", transition: "color 0.2s ease" }}>
              Contact Us
            </Link>
          </li>
        </nav>

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          
          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu" suppressHydrationWarning style={{ border: "none", background: "none", cursor: "pointer" }}>
            <span style={{ transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none", backgroundColor: "var(--fg-color)" }}></span>
            <span style={{ opacity: isOpen ? 0 : 1, backgroundColor: "var(--fg-color)" }}></span>
            <span style={{ transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", backgroundColor: "var(--fg-color)" }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: "24px",
          right: "24px",
          marginTop: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 999,
          backgroundColor: "var(--bg-color)",
          border: "1px solid var(--card-border)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(44, 37, 30, 0.05)"
        }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/courses" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            Our Courses
          </Link>
          <Link href="/blog" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            Blog
          </Link>
          <Link href="/about" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link href="/pricing" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            Pricing
          </Link>
          <Link href="/contact" style={{ textDecoration: "none", fontSize: "15px", fontWeight: "600", color: "var(--fg-color)" }} onClick={() => setIsOpen(false)}>
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
