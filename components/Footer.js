"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { supabase } from "@/lib/supabase";

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function Footer({ faviconUrl: propFaviconUrl }) {
  const [footerCourses, setFooterCourses] = useState([
    { id: "tajweed-masterclass", title: "Tajweed Masterclass" },
    { id: "quran-memorization", title: "Qur'an Memorization" },
    { id: "learn-arabic", title: "Learn the Arabic Language" },
    { id: "islamic-studies", title: "Islamic Studies" }
  ]);

  useEffect(() => {
    async function loadLatestCourses() {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("id, title")
          .order("created_at", { ascending: false })
          .limit(4);
        if (error) throw error;
        if (data && data.length > 0) {
          setFooterCourses(data);
        }
      } catch (err) {
        console.warn("Could not load latest courses for footer:", err);
      }
    }
    loadLatestCourses();
  }, []);

  const settings = useSettings();
  const faviconUrl = propFaviconUrl || settings.faviconUrl;
  const { 
    logoText,
    contactEmail, 
    contactPhone, 
    socialFacebook, 
    socialInstagram, 
    socialYoutube, 
    socialWhatsapp 
  } = useSettings();

  const displayFacebook = socialFacebook || "https://facebook.com";
  const displayInstagram = socialInstagram || "https://instagram.com";
  const displayYoutube = socialYoutube || "https://youtube.com";

  // Format WhatsApp dynamically using contactPhone from admin settings
  const whatsappPhone = contactPhone || "+44 7700 183483";
  const cleanWhatsappPhone = whatsappPhone.replace(/[^\d]/g, "");
  const displayWhatsapp = `https://wa.me/${cleanWhatsappPhone}`;

  // Brand Dynamic details based on the website configuration
  const displayPhone = contactPhone || "+44 7700 183483";
  const displayEmail = contactEmail || "info@yaqeeninstitute.com";
  const displayCompany = logoText ? `${logoText.toUpperCase()} INSTITUTE` : "YAQEEN INSTITUTE";
  const displayAddress = "128, City Road, London, EC1V 2NX, United Kingdom";

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* =========================================================================
           1. THREE-COLUMN GRID SECTION
           ========================================================================= */}
        <div className="footer-columns">
          
          {/* Column 1: DISCOVER & COURSES */}
          <div className="footer-column footer-col-left">
            <div className="footer-section">
              <h4 className="footer-column-title">DISCOVER</h4>
              <ul className="footer-links">
                <li className="footer-link-item"><Link href="/book-free-trial" className="footer-link">Book a Free Trial</Link></li>
                <li className="footer-link-item"><Link href="/teacher-application" className="footer-link">Teacher Application</Link></li>
                <li className="footer-link-item"><Link href="/about" className="footer-link">About</Link></li>
                <li className="footer-link-item"><Link href="/teachers" className="footer-link">Teachers</Link></li>
                <li className="footer-link-item"><Link href="/blog" className="footer-link">Blog</Link></li>
                <li className="footer-link-item"><Link href="/testimonials" className="footer-link">Testimonials</Link></li>
                <li className="footer-link-item"><Link href="/careers" className="footer-link">Careers</Link></li>
                <li className="footer-link-item"><Link href="/faqs" className="footer-link">FAQs</Link></li>
                <li className="footer-link-item"><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="footer-link">Sitemap</a></li>
              </ul>
            </div>
            
            <div className="footer-section" style={{ marginTop: "24px" }}>
              <h4 className="footer-column-title">COURSES</h4>
              <ul className="footer-links courses-list">
                {footerCourses.map((c) => (
                  <li key={c.id} className="footer-link-item">
                    <Link href={`/courses/${slugify(c.title)}`} className="footer-link">
                      • {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: HELP CENTER, LOGO, LEGAL & COPYRIGHT */}
          <div className="footer-column footer-col-center">
            <h4 className="footer-column-title">HELP CENTER</h4>
            <div className="footer-help-details">
              <p className="footer-help-phone">{displayPhone}</p>
              <p className="footer-help-email">Email: <a href={`mailto:${displayEmail}`}>{displayEmail}</a></p>
            </div>

            {/* White favicon Logo representing Yaqeen / Book and Student */}
            <div className="footer-logo-calligraphy-wrap">
              {faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={faviconUrl} 
                  alt="YAQEEN Logo" 
                  style={{ 
                    height: "72px", 
                    width: "auto", 
                    objectFit: "contain"
                  }} 
                />
              ) : (
                <svg width="82" height="72" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20C7.5 20 4.5 16 4.5 11C4.5 7 7.5 6 12 9V20Z" fill="#C99B4D" />
                  <path d="M12 20C16.5 20 19.5 16 19.5 11C19.5 7 16.5 6 12 9V20Z" fill="#B3853B" />
                  <circle cx="12" cy="3.5" r="1.5" fill="#C99B4D" />
                  <path d="M12 6V9" stroke="#C99B4D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <div className="footer-legal-links">
              <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
              <span className="footer-legal-separator">·</span>
              <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
            </div>

            <div className="footer-copyright-info-center">
              <p className="footer-copyright-text">© {displayCompany}</p>
              <p className="footer-address">{displayAddress}</p>
            </div>
          </div>

          {/* Column 3: STAY IN TOUCH & CONNECT WITH US */}
          <div className="footer-column footer-col-right">
            <h4 className="footer-column-title">LET’S STAY IN TOUCH</h4>
            <span className="footer-connect-title">CONNECT WITH US</span>
            
            <div className="footer-social-row">
              {/* WhatsApp */}
              {socialWhatsapp && socialWhatsapp !== "" && (
                <a href={displayWhatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-circle whatsapp" aria-label="WhatsApp">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/>
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {socialFacebook && socialFacebook !== "" && (
                <a href={displayFacebook} target="_blank" rel="noopener noreferrer" className="footer-social-circle facebook" aria-label="Facebook">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {socialInstagram && socialInstagram !== "" && (
                <a href={displayInstagram} target="_blank" rel="noopener noreferrer" className="footer-social-circle instagram" aria-label="Instagram">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {socialYoutube && socialYoutube !== "" && (
                <a href={displayYoutube} target="_blank" rel="noopener noreferrer" className="footer-social-circle youtube" aria-label="YouTube">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Floating Fixed WhatsApp Widget */}
      <div className="footer-whatsapp-widget">
        <div className="footer-whatsapp-badge">
          <span>Need Help? <strong>Chat with us</strong></span>
        </div>
        <a href={displayWhatsapp} target="_blank" rel="noopener noreferrer" className="footer-whatsapp-circle-btn">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}
