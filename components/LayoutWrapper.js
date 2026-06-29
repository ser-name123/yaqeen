"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children, logoText, logoUrl, faviconUrl }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Hide Navbar and Footer on any administrative routes
  const isAdminRoute = pathname && pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
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
      <Footer faviconUrl={faviconUrl} />
    </>
  );
}
