// Footer/header layout content with safe defaults, so the site renders
// correctly even before the layout_config table exists.

export const FOOTER_DEFAULTS = {
  footer_tagline: "Excellence in Quranic Education",
  footer_description:
    "Dedicated to imparting authentic Quranic learning, Tajweed, and Islamic values with certified male and female scholars through personalized 1-on-1 online classes for kids and adults worldwide.",
  footer_rating_score: "4.9 / 5.0",
  footer_rating_text: "Based on 1,200+ Student Reviews",
  footer_whatsapp_label: "Instant WhatsApp Support",
  explore_title: "EXPLORE",
  courses_title: "OUR COURSES",
  connect_title: "HELP & CONNECT",
  view_all_label: "View All Courses",
  view_all_url: "/courses",
  contact_phone_label: "Call / WhatsApp (24/7)",
  contact_email_label: "Email Us",
  footer_courses: [],
  newsletter_title: "Subscribe to Newsletter",
  newsletter_desc: "Get free Quran resources, Tajweed guides & updates.",
  footer_address: "128, City Road, London, EC1V 2NX, United Kingdom",
  footer_ssl_text: "256-Bit SSL Encrypted & Verified",
  social_heading: "Follow Yaqeen",
  header_cta_label: "Book a Free Trial",
  header_cta_url: "/book-free-trial",
  header_links: [
    { label: "Courses", url: "/courses" },
    { label: "Pricing", url: "/pricing" },
    { label: "Discover", dropdown: [
      { label: "About", url: "/about" },
      { label: "Teachers", url: "/teachers" },
      { label: "Testimonials", url: "/testimonials" },
      { label: "Faq", url: "/faqs" },
      { label: "Blog", url: "/blog" },
      { label: "Careers", url: "/careers" },
      { label: "Contact", url: "/contact" },
    ] },
  ],
  explore_links: [
    { label: "Book a Free Trial", url: "/book-free-trial", badge: "FREE" },
    { label: "About Yaqeen", url: "/about" },
    { label: "Qualified Teachers", url: "/teachers" },
    { label: "Pricing & Plans", url: "/pricing" },
    { label: "Student Testimonials", url: "/testimonials" },
    { label: "Teacher Application", url: "/teacher-application" },
    { label: "Blog & Islamic Guides", url: "/blog" },
    { label: "FAQs", url: "/faqs" },
    { label: "Careers", url: "/careers" },
  ],
  trust_badges: [
    { title: "Native Arabic Tutors", subtitle: "Al-Azhar & Certified Scholars" },
    { title: "Flexible 24/7 Schedule", subtitle: "1-on-1 Interactive Live Classes" },
    { title: "4.9 / 5.0 Rated", subtitle: "Trusted by 5,000+ Muslim Families" },
    { title: "100% Free Trial", subtitle: "No Credit Card Required" },
  ],
};

export async function getLayoutConfig(supabase) {
  try {
    const { data } = await supabase.from("layout_config").select("*").eq("id", "global").single();
    if (!data) return FOOTER_DEFAULTS;
    const merged = { ...FOOTER_DEFAULTS };
    for (const k of Object.keys(FOOTER_DEFAULTS)) {
      const v = data[k];
      if (Array.isArray(FOOTER_DEFAULTS[k])) {
        if (Array.isArray(v) && v.length) merged[k] = v;
      } else if (v !== null && v !== undefined && v !== "") {
        merged[k] = v;
      }
    }
    return merged;
  } catch {
    return FOOTER_DEFAULTS;
  }
}
