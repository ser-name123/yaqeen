"use client";

import { useEffect } from "react";
import "./contact.css";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const animatedElements = document.querySelectorAll(".reveal-fade, .reveal-slide-up, .reveal-stagger");
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="contact-page-container">
      {/* SVG Clip Path Definition for the Wavy Image */}
      <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.2,0 
                     C 0.1,0.2 0.0,0.4 0.05,0.5 
                     C 0.1,0.6 0.2,0.8 0.18,1 
                     L 1,1 
                     L 1,0 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* =========================================================================
         1. HERO SECTION (FIRST SECTION)
         ========================================================================= */}
      <section className="contact-hero">
        {/* Left Side Content */}
        <div className="contact-hero-content">
          {/* Mosque Background Silhouette */}
          <svg 
            style={{
              position: "absolute",
              bottom: "0",
              right: "5%",
              width: "320px",
              height: "auto",
              opacity: 0.035,
              zIndex: 1,
              pointerEvents: "none"
            }}
            viewBox="0 0 300 300" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Dome */}
            <path d="M150 120 C110 120, 100 170, 100 230 L200 230 C200 170, 190 120, 150 120 Z" fill="#C99B4D" />
            <path d="M150 120 L150 100 M147 105 L153 105" stroke="#C99B4D" strokeWidth="2" />
            {/* Small Left Dome */}
            <path d="M60 170 C40 170, 35 200, 35 230 L85 230 C85 200, 80 170, 60 170 Z" fill="#C99B4D" />
            {/* Small Right Dome */}
            <path d="M240 170 C220 170, 215 200, 215 230 L265 230 C265 200, 260 170, 240 170 Z" fill="#C99B4D" />
            {/* Left Minaret */}
            <path d="M15 150 L25 150 L25 230 L15 230 Z" fill="#C99B4D" />
            <path d="M15 150 C15 140, 25 140, 25 150 Z" fill="#C99B4D" />
            <path d="M20 140 L20 130" stroke="#C99B4D" strokeWidth="1.5" />
            {/* Right Minaret */}
            <path d="M275 150 L285 150 L285 230 L275 230 Z" fill="#C99B4D" />
            <path d="M275 150 C275 140, 285 140, 285 150 Z" fill="#C99B4D" />
            <path d="M280 140 L280 130" stroke="#C99B4D" strokeWidth="1.5" />
            {/* Crescent Moon */}
            <path d="M175 60 A12 12 0 1 0 175 84 A9 9 0 1 1 175 60 Z" fill="#C99B4D" />
          </svg>

          <span className="contact-hero-label reveal-slide-up">Contact Us</span>
          <h1 className="contact-hero-title reveal-slide-up">We're Here to Help You</h1>
          <div className="contact-hero-divider reveal-slide-up"></div>
          <p className="contact-hero-description reveal-slide-up">
            Have a question or need assistance? Our team is happy to support you on your learning journey.
          </p>
        </div>

        {/* Right Side Wavy Image Container */}
        <div className="contact-hero-image-column">
          <div className="contact-hero-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/contact_hero.png" 
              alt="Contact Yaqeen Institute" 
              className="contact-hero-image"
            />
          </div>
          
          {/* Double Gold Wave Border Stroke Overlay */}
          <svg 
            className="contact-wave-svg" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Main Gold Line */}
            <path 
              d="M 20,0 C 10,20 0,40 5,50 C 10,60 20,80 18,100" 
              fill="none" 
              stroke="var(--primary-color)" 
              strokeWidth="1.2" 
              vectorEffect="non-scaling-stroke"
            />
            {/* Offset Thin Gold Line */}
            <path 
              d="M 22,0 C 12,20 2,40 7,50 C 12,60 22,80 20,100" 
              fill="none" 
              stroke="rgba(201, 155, 77, 0.4)" 
              strokeWidth="0.6" 
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================================
         2. DETAILS & FORM GRID SECTION (SECOND SECTION)
         ========================================================================= */}
      <section className="contact-grid-section">
        {/* Left Side: Get in Touch Card */}
        <div className="contact-info-card reveal-slide-up">
          <h2 className="contact-section-title">Get in Touch</h2>
          <div className="contact-section-divider"></div>
          <p className="contact-section-subtitle">We'd love to hear from you.</p>

          <div className="contact-info-list stagger-group">
            {/* Address */}
            <div className="contact-info-item reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-item-label">Address</span>
                <span className="contact-info-item-value">
                  128, City Road, London, EC1V 2NX, UNITED KINGDOM.
                </span>
              </div>
            </div>

            {/* Email Us */}
            <div className="contact-info-item reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-item-label">Email Us</span>
                <span className="contact-info-item-value">info@yaqeeninstitute.com</span>
              </div>
            </div>

            {/* Call / WhatsApp */}
            <div className="contact-info-item reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-item-label">Call / WhatsApp</span>
                <span className="contact-info-item-value">+447488818192</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="contact-info-item reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-item-label">Working Hours</span>
                <span className="contact-info-item-value">24x7 – We're always here for you.</span>
              </div>
            </div>

            {/* Worldwide Support */}
            <div className="contact-info-item reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="contact-info-text-group">
                <span className="contact-info-item-label">Worldwide Support</span>
                <span className="contact-info-item-value">We serve students from around the world.</span>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="contact-social-group">
            <a href="#" className="contact-social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="contact-social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="contact-social-btn" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="contact-social-btn" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: Send Us a Message Form Card */}
        <div className="reveal-slide-up" style={{ width: "100%" }}>
          <ContactForm />
        </div>
      </section>

      {/* =========================================================================
         3. FAQ SECTION (THIRD SECTION)
         ========================================================================= */}
      <section className="contact-faq-section">
        <div className="contact-faq-card reveal-slide-up">
          <h2 className="contact-section-title">Frequently Asked Questions</h2>
          <div className="contact-section-divider"></div>

          <div className="contact-faq-grid stagger-group">
            {/* FAQ 1: Enrollment */}
            <div className="contact-faq-col reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="contact-faq-content">
                <h3 className="contact-faq-question">How can I enroll in a course?</h3>
                <p className="contact-faq-answer">
                  You can enroll by creating an account and selecting your desired course.
                </p>
              </div>
            </div>

            {/* FAQ 2: Scheduling */}
            <div className="contact-faq-col reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="contact-faq-content">
                <h3 className="contact-faq-question">Can I schedule classes at my convenience?</h3>
                <p className="contact-faq-answer">
                  Yes, we offer flexible scheduling to fit your time and learning pace.
                </p>
              </div>
            </div>

            {/* FAQ 3: Trials */}
            <div className="contact-faq-col reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div className="contact-faq-content">
                <h3 className="contact-faq-question">Do you offer trial classes?</h3>
                <p className="contact-faq-answer">
                  Yes, we offer free trial classes for new students. Contact us to book yours.
                </p>
              </div>
            </div>

            {/* FAQ 4: Payments */}
            <div className="contact-faq-col reveal-stagger">
              <div className="contact-info-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div className="contact-faq-content">
                <h3 className="contact-faq-question">What payment methods do you accept?</h3>
                <p className="contact-faq-answer">
                  We accept major credit/debit cards, PayPal, and other secure payment methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         4. CTA BANNER SECTION (LAST SECTION)
         ========================================================================= */}
      <section className="contact-cta-section">
        <div className="contact-cta-card reveal-slide-up">
          {/* Faint Mosque Watermark on the Right */}
          <svg 
            style={{
              position: "absolute",
              bottom: "-25px",
              right: "-15px",
              width: "160px",
              height: "auto",
              opacity: 0.05,
              zIndex: 1,
              pointerEvents: "none"
            }}
            viewBox="0 0 300 300" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M150 120 C110 120, 100 170, 100 230 L200 230 C200 170, 190 120, 150 120 Z" fill="#FFFFFF" />
            <path d="M150 120 L150 100 M147 105 L153 105" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M60 170 C40 170, 35 200, 35 230 L85 230 C85 200, 80 170, 60 170 Z" fill="#FFFFFF" />
            <path d="M240 170 C220 170, 215 200, 215 230 L265 230 C265 200, 260 170, 240 170 Z" fill="#FFFFFF" />
            <path d="M15 150 L25 150 L25 230 L15 230 Z" fill="#FFFFFF" />
            <path d="M15 150 C15 140, 25 140, 25 150 Z" fill="#FFFFFF" />
            <path d="M20 140 L20 130" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M275 150 L285 150 L285 230 L275 230 Z" fill="#FFFFFF" />
            <path d="M275 150 C275 140, 285 140, 285 150 Z" fill="#FFFFFF" />
            <path d="M280 140 L280 130" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M175 60 A12 12 0 1 0 175 84 A9 9 0 1 1 175 60 Z" fill="#FFFFFF" />
          </svg>

          {/* Left Contents */}
          <div className="contact-cta-left">
            <div className="contact-cta-icon-wrapper">
              {/* Headset Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div className="contact-cta-text">
              <h3 className="contact-cta-title">Still have questions?</h3>
              <p className="contact-cta-subtitle">Our support team is ready to assist you!</p>
            </div>
          </div>

          {/* Right Support Button */}
          <a href="#" className="contact-cta-btn">
            {/* Chat Bubble Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" />
            </svg>
            <span>Chat with Support</span>
          </a>
        </div>
      </section>
    </main>
  );
}
