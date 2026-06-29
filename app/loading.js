"use client";

import React from "react";

export default function Loading() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#FAF7F2",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
      fontFamily: "'Inter', sans-serif"
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .premium-spinner {
          width: 56px;
          height: 56px;
          border: 3.5px solid rgba(62, 84, 70, 0.1);
          border-top: 3.5px solid #3E5446;
          border-right: 3.5px solid #C99B4D;
          border-radius: 50%;
          animation: spin-loader 1s linear infinite;
          margin-bottom: 24px;
        }
        .premium-loader-text {
          font-size: 15px;
          font-weight: 600;
          color: #3E5446;
          letter-spacing: 2px;
          text-transform: uppercase;
          animation: pulse-text 1.5s ease-in-out infinite;
          font-family: 'Inter', sans-serif;
        }
      `}} />
      <div className="premium-spinner"></div>
      <div className="premium-loader-text">Loading Yaqeen</div>
    </div>
  );
}
