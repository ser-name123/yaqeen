"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const { 
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
  const displayWhatsapp = socialWhatsapp || "https://wa.me/447700183483";

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* =========================================================================
           1. TOP LOGO AND BRANDING SECTION
           ========================================================================= */}
        <div className="footer-branding">
          <div className="footer-logo-mark">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stylized organic leaf logo mark matching mockup */}
              <path d="M22.5 40C22.5 40 12 32 12 20C12 12 21 15 21 15C21 15 22.5 28 22.5 40Z" fill="#4A5D3B" />
              <path d="M25.5 40C25.5 40 36 32 36 20C36 12 27 15 27 15C27 15 25.5 28 25.5 40Z" fill="#C99B4D" opacity="0.6" />
              <circle cx="24" cy="10" r="4.5" fill="#C99B4D" />
            </svg>
          </div>
          
          <div className="footer-logo-divider" />
          
          <div className="footer-logo-text-group">
            <span className="footer-logo-title">YAQEEN</span>
            <span className="footer-logo-subtitle">— INSTITUTE —</span>
            <span className="footer-logo-tagline">Learn Quran in Your Own Language</span>
            <div className="footer-logo-diamond">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0L8.5 3.5L12 6L8.5 8.5L6 12L3.5 8.5L0 6L3.5 3.5L6 0Z" fill="#C99B4D" />
              </svg>
            </div>
          </div>
        </div>

        {/* =========================================================================
           2. FOUR-COLUMN GRID SECTION
           ========================================================================= */}
        <div className="footer-columns">
          
          {/* Column 1: DISCOVER */}
          <div className="footer-column">
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

          {/* Column 2: COURSES */}
          <div className="footer-column">
            <h4 className="footer-column-title">COURSES</h4>
            <ul className="footer-links">
              <li className="footer-link-item"><Link href="#courses" className="footer-link">Tajweed Masterclass</Link></li>
              <li className="footer-link-item"><Link href="#courses" className="footer-link">Qur'an Memorization</Link></li>
              <li className="footer-link-item"><Link href="#courses" className="footer-link">Learn the Arabic Language</Link></li>
              <li className="footer-link-item"><Link href="#courses" className="footer-link">Islamic Studies</Link></li>
            </ul>
          </div>

          {/* Column 3: HELP CENTER */}
          <div className="footer-column">
            <h4 className="footer-column-title">HELP CENTER</h4>
            
            <div className="footer-help-item">
              <div className="footer-help-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="footer-help-text">{contactPhone || "UK +44 74 88 818192"}</span>
            </div>

            <div className="footer-help-item">
              <div className="footer-help-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="footer-help-text">
                <a href={`mailto:${contactEmail || "contact@yaqeeninstitute.online"}`} style={{ color: "inherit", textDecoration: "none" }}>{contactEmail || "contact@yaqeeninstitute.online"}</a>
              </span>
            </div>

            <div className="footer-help-divider">
              <div className="footer-help-divider-line" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-help-divider-rosette">
                <path d="M12 2L14.5 5.5L18.5 4.5L17.5 8.5L21 11L17.5 13.5L18.5 17.5L14.5 16.5L12 20L9.5 16.5L5.5 17.5L6.5 13.5L3 11L6.5 8.5L5.5 4.5L9.5 5.5L12 2Z" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
                <circle cx="12" cy="11.2" r="2.5" stroke="#C99B4D" strokeWidth="1.5" fill="none" />
              </svg>
              <div className="footer-help-divider-line" />
            </div>

            <div className="footer-legal-links">
              <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
              <span className="footer-legal-separator">•</span>
              <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
            </div>
          </div>

          {/* Column 4: STAY IN TOUCH */}
          <div className="footer-column">
            <h4 className="footer-column-title">LET’S STAY IN TOUCH</h4>
            <span className="footer-connect-title">CONNECT WITH US</span>
            
            <div className="footer-social-row">
              {/* WhatsApp */}
              <a href={displayWhatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-circle whatsapp" aria-label="WhatsApp">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href={displayFacebook} target="_blank" rel="noopener noreferrer" className="footer-social-circle facebook" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href={displayInstagram} target="_blank" rel="noopener noreferrer" className="footer-social-circle instagram" aria-label="Instagram">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href={displayYoutube} target="_blank" rel="noopener noreferrer" className="footer-social-circle youtube" aria-label="YouTube">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.522 3.5 12 3.5 12 3.5s-7.522 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.478 20.5 12 20.5 12 20.5s7.522 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* =========================================================================
           3. BOTTOM COPYRIGHT & INFO BAR
           ========================================================================= */}
        <div className="footer-bottom-bar">
          
          <div className="footer-bottom-left">
            <button className="footer-chat-btn" aria-label="Chat" suppressHydrationWarning>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className="footer-copyright-info">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C99B4D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="footer-globe-icon">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="footer-copyright-text">© NexaOne Global Ltd.</span>
            <span className="footer-copyright-divider">|</span>
            <span className="footer-address">128, City Road, London, EC1V 2NX, United Kingdom</span>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-whatsapp-widget">
              <div className="footer-whatsapp-badge">
                <span>Need Help? <strong>Chat with us</strong></span>
              </div>
              <a href="https://wa.me/447700183483" target="_blank" rel="noopener noreferrer" className="footer-whatsapp-circle-btn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
