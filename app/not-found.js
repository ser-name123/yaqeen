"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "85vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fefefe",
      padding: "40px 24px",
      textAlign: "center",
      fontFamily: "var(--font-sans), system-ui, sans-serif"
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .nf-container {
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .nf-ill {
          margin-bottom: 32px;
          animation: float 4s ease-in-out infinite;
          color: #C99B4D;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .nf-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 500;
          color: #2B1F14;
          margin: 0 0 14px 0;
        }
        .nf-subtitle {
          font-size: 15.5px;
          line-height: 1.65;
          color: #6B5B47;
          margin: 0 0 32px 0;
          max-width: 440px;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 34px;
          border-radius: 9999px;
          background-color: #C99B4D;
          color: #ffffff !important;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(201, 155, 77, 0.25);
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .nf-btn:hover {
          background-color: #B3853B;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(201, 155, 77, 0.32);
        }
      `}} />
      <div className="nf-container">
        {/* Elegant guidance compass icon */}
        <svg className="nf-ill" width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(201, 155, 77, 0.08)" />
          <line x1="12" y1="1" x2="12" y2="3" strokeWidth="1.5" />
          <line x1="12" y1="21" x2="12" y2="23" strokeWidth="1.5" />
          <line x1="1" y1="12" x2="3" y2="12" strokeWidth="1.5" />
          <line x1="21" y1="12" x2="23" y2="12" strokeWidth="1.5" />
        </svg>

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-subtitle">
          We couldn&apos;t find the page you were looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>
        <Link href="/" className="nf-btn">
          Go Back Home
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
