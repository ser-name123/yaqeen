"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children, logoText, logoUrl, faviconUrl }) {
  const pathname = usePathname();
  
  // Hide Navbar and Footer on any administrative routes
  const isAdminRoute = pathname && pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar logoText={logoText} logoUrl={logoUrl} faviconUrl={faviconUrl} />
      <div>{children}</div>
      <Footer faviconUrl={faviconUrl} />
    </>
  );
}
