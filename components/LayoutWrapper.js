"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";

export default function LayoutWrapper({ children, logoText, logoUrl, faviconUrl }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Keep loader for at least 800ms to ensure smooth transition
    const timer = setTimeout(() => {
      const handleLoad = () => {
        setInitialLoading(false);
      };
      
      if (document.readyState === "complete") {
        setInitialLoading(false);
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      const unmountTimer = setTimeout(() => {
        setShowPreloader(false);
      }, 500); // 0.5s matches transition
      return () => clearTimeout(unmountTimer);
    }
  }, [initialLoading]);

  // Hide Navbar and Footer on any administrative routes
  const isAdminRoute = pathname && pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Full Screen Page Preloader */}
      {showPreloader && (
        <div className={`preloader-container ${!initialLoading ? "fade-hide" : ""}`}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin-loader {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse-logo {
              0%, 100% { transform: scale(0.95); opacity: 0.85; }
              50% { transform: scale(1.05); opacity: 1; }
            }
            .preloader-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #FAF5EE;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              z-index: 999999;
              transition: opacity 0.5s ease, visibility 0.5s ease;
            }
            .preloader-container.fade-hide {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
            .loader-ring-wrapper {
              position: relative;
              width: 140px;
              height: 140px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .loader-ring {
              position: absolute;
              width: 120px;
              height: 120px;
              border: 3.5px solid rgba(201, 155, 77, 0.1);
              border-top: 3.5px solid #C99B4D;
              border-right: 3.5px solid #556B3B;
              border-radius: 50%;
              animation: spin-loader 1.1s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
            }
            .loader-logo {
              width: 50px;
              height: 50px;
              object-fit: contain;
              animation: pulse-logo 1.8s ease-in-out infinite;
            }
            .loader-text {
              margin-top: 24px;
              font-family: var(--font-sans), sans-serif;
              font-size: 15px;
              font-weight: 700;
              color: #2B1F14;
              letter-spacing: 3px;
              text-transform: uppercase;
              animation: pulse-logo 1.8s ease-in-out infinite;
            }
          `}} />
          <div className="loader-ring-wrapper">
            <div className="loader-ring" />
            <img 
              src="/images/logo.png" 
              alt="YAQEEN Logo" 
              className="loader-logo"
            />
          </div>
          <div className="loader-text">{logoText || "YAQEEN"}</div>
        </div>
      )}

      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          backgroundColor: "#C99B4D",
          zIndex: 99999,
          animation: "load-bar 0.45s ease-out forwards",
          boxShadow: "0 1px 10px rgba(201, 155, 77, 0.4)"
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes load-bar {
              0% { width: 0%; opacity: 1; }
              85% { width: 90%; opacity: 1; }
              100% { width: 100%; opacity: 0; }
            }
          `}} />
        </div>
      )}
      <Navbar logoText={logoText} logoUrl={logoUrl} faviconUrl={faviconUrl} />
      <div>{children}</div>
      <CTABanner />
      <Footer faviconUrl={faviconUrl} />
    </>
  );
}
