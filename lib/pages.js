// ============================================================================
// Page Management CMS — content defaults + merge helpers
// Pure JS (no React) so it is safe to import from both server API routes and
// client components. Mirrors the lib/layout.js pattern: a defaults object in
// code + a single merged Supabase row per page + graceful fallback.
// ============================================================================

// Pages that appear in the admin "Page Management" sub-menu, in order.
export const PAGE_LIST = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "courses", label: "Courses" },
  { slug: "pricing", label: "Pricing" },
  { slug: "teachers", label: "Teachers" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "careers", label: "Careers" },
  { slug: "faqs", label: "FAQs" },
  { slug: "contact", label: "Contact" },
  { slug: "bookTrial", label: "Book Free Trial" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms of Service" },
  { slug: "refund", label: "Refund Policy" },
  { slug: "cookies", label: "Cookies Policy" },
];

// ---------------------------------------------------------------------------
// DEFAULTS — current live text for every page, seeded so the editor is never
// empty. The shape of each object is the contract the page + editor rely on.
// ---------------------------------------------------------------------------
export const PAGE_DEFAULTS = {
  // --------------------------------------------------------------------- HOME
  home: {
    hero: {
      badge: "Learn in Any Language",
      headline_line1: "Online Qur’an,",
      headline_line2: "Islamic Studies &",
      headline_line3: "Arabic Classes",
      subheading_prefix: "Learn in Your Own",
      subheading_highlight: "Language",
      languages: ["English", "Arabic", "Urdu", "French", "Chinese", "Marathi", "Tamil", "Malayalam"],
      description: "Quality Islamic education for all ages, from the comfort of your home.",
      cta_label: "Get Started",
      cta_url: "/register",
      features: ["For All Ages", "Live Online Classes", "Learn in Any Language"],
    },
    banner: [
      { title: "No Hidden Fees", desc: "What you see is what you pay." },
      { title: "Family Discounts", desc: "Save more when you learn together." },
      { title: "Flexible Plans", desc: "Choose what works for you." },
      { title: "Quality Education", desc: "Learn from qualified teachers." },
    ],
    lang: {
      title_line1: "Learn in",
      title_highlight: "Your Language",
      desc_line1: "You can learn and understand",
      desc_line2: "Qur'an, Islamic Studies & Arabic",
      desc_line3_prefix: "in ",
      desc_line3_highlight: "the language you understand best.",
      card_title: "Learn Quran Online",
      card_desc: "Choose the words you understand best and learn with ease, clarity, and confidence.",
      card_more: "Master the Qur'an in the language you understand through our online Quran academy. Join online Quran classes, Quran lessons online, and learn Quran with Tajweed from qualified teachers, anytime, anywhere.",
      benefits: [
        { line1: "Clearer", line2: "Understanding" },
        { line1: "Stronger", line2: "Connection" },
        { line1: "Lasting", line2: "Impact" },
      ],
    },
    teach: {
      org_label: "YAQEEN INSTITUTE",
      heading: "What We Teach",
      subtitle: "Explore expert-led Online Quran Classes, Quran Memorization, Tajweed, Arabic Language, and Islamic Studies with interactive live sessions, certified tutors, flexible timings, and multilingual learning support.",
      footer_note: "✦ and many more courses",
      cards: [
        { title: "Learn Quran", desc: "Quran online classes for recitation, memorization, Tajweed, and reading fundamentals with certified Quran teachers for kids and adults.", bullets: ["Tajweed with Makharij", "Qur'an Memorization", "Qur'an Reading", "Noorani Qaidah"] },
        { title: "Islamic Studies", desc: "Islamic Studies online classes covering Aqeedah, Fiqh, Seerah, Hadith, Islamic manners, and character development for kids and adults.", bullets: ["Basics of Islam", "Akhlaaq", "Fiqh", "Seerah & more"] },
        { title: "Arabic Language", desc: "Arabic Language online classes for speaking, reading, writing, grammar, vocabulary, and conversation with qualified Arabic teachers.", bullets: ["Spoken Arabic", "School Arabic", "Professional Arabic", "Conversational Arabic"] },
      ],
    },
    choose: {
      pill: "Why Families Choose Yaqeen",
      title_line1: "More Than Education.",
      title_line2_prefix: "A Journey of ",
      title_highlight: "Faith & Success.",
      desc_line1: "We make Islamic education accessible, engaging and effective",
      desc_line2: "for every learner, in every language.",
      stats: [
        { num: "95%", label: "Student Satisfaction" },
        { num: "50+", label: "Countries" },
        { num: "15+", label: "Languages" },
        { num: "1-on-1", label: "Live Classes" },
      ],
      features: [
        { title: "Learn in Your Own Language", text: "Study with confidence through online Quran classes, online Arabic classes, and Islamic Studies online in the language you understand best. Yaqeen Institute provides multilingual learning with qualified teachers, making Quran learning easier, more engaging, and effective for students worldwide." },
        { title: "Qualified Teachers", text: "Learn from experienced, certified Quran teachers and Arabic language instructors dedicated to delivering high-quality online Quran classes, Tajweed lessons, Islamic Studies, and Arabic language courses. Our expert educators ensure every student receives personalized guidance for lasting academic and spiritual growth." },
        { title: "Flexible Scheduling", text: "Our online Quran academy offers flexible class timings that fit your daily routine. Book online Quran classes, Arabic lessons, or Islamic Studies at your convenience, making it easier for children, adults, and busy families to learn without disrupting their schedules." },
        { title: "One-to-One Classes", text: "Receive personalized instruction through one-to-one online Quran classes, Quran reading with Tajweed, Arabic language learning, and Islamic education. Individual attention helps students improve faster, build confidence, strengthen understanding, and achieve their learning goals more effectively." },
        { title: "Male & Female Teachers", text: "Choose qualified male or female Quran teachers according to your preference for online Quran learning, Arabic classes, Hifz Quran, and Islamic Studies. We provide a comfortable, respectful, and supportive learning environment for students of every age and background." },
        { title: "Classes for All Ages", text: "Yaqeen Institute offers online Quran classes for kids, teenagers, and adults, including Quran reading, Tajweed, Arabic language courses, Islamic Studies, and Hifz Quran. Structured programs ensure every learner progresses confidently regardless of age or experience." },
        { title: "Progress Tracking", text: "Track your success with regular assessments, performance reports, and personalized feedback throughout your online Quran learning journey. Our progress tracking helps students improve Quran recitation, Arabic language skills, Islamic knowledge, and overall academic development with measurable results." },
        { title: "Interactive Learning", text: "Enjoy engaging online Quran classes, interactive Arabic language lessons, and modern Islamic Studies designed to keep students motivated. Our live sessions, practical activities, and experienced teachers create an enjoyable learning experience that improves understanding, participation, and long-term retention." },
      ],
    },
    age: {
      org_label: "YAQEEN INSTITUTE",
      subtitle: "Choose Your Learning Path",
      title_prefix: "Learning for ",
      title_highlight: "Every Age.",
      desc_line1: "Whether you’re a parent looking for the best start for your child",
      desc_line2: "or an adult seeking to grow in faith, we have the right program for you.",
      cards: [
        { title: "Kids Program", range: "Ages 4–12", text: "Fun, engaging and interactive classes designed to build a strong foundation in Islam.", pill: "Build | Learn | Grow" },
        { title: "Teen Program", range: "Ages 13–18", text: "Inspire, educate and empower teens to strengthen their faith and character in today's world.", pill: "Inspire | Understand | Lead" },
        { title: "Adult Program", range: "18+", text: "Deepen your knowledge, reconnect with your faith and grow spiritually at your own pace.", pill: "Learn | Reflect | Grow" },
        { title: "Family Program", range: "All Ages", text: "Learn together as a family and strengthen your bond through Islamic knowledge.", pill: "Learn Together | Grow Together" },
      ],
    },
    journey: {
      pill: "How It Works",
      title_line1: "Begin Your Learning Journey",
      title_line2_prefix: "in ",
      title_highlight: "4 Simple Steps",
      desc: "A simple process to begin a meaningful journey with knowledge and faith.",
      steps: [
        { title: "Trial", text: "Book a free trial class and experience our teaching approach." },
        { title: "Plan", text: "Choose your course and learning path that best fits your goals." },
        { title: "Schedule", text: "Pick a time that works for you and book a class with our teacher." },
        { title: "Start Journey", text: "Complete registration and begin your learning journey with confidence." },
      ],
    },
    teachers: {
      pill: "Meet Our Teachers",
      title_line1: "Learn from Experienced",
      title_line2_prefix: "and ",
      title_highlight: "Caring Teachers.",
      subtitle: "Our qualified Quran, Arabic, and Islamic Studies teachers provide personalized online Quran classes, Quran lessons online, Tajweed, memorization, and Islamic guidance, helping kids and adults build knowledge, confidence, and strong Islamic character.",
    },
    oqc: {
      title_line1: "Online Quran Classes –",
      title_highlight: "Learn, Grow & Excel",
      cta_label: "Join Now & Start Your Quran Journey",
      cta_url: "/register",
      cards: [
        { title: "Expert Online Quran Classes", text: "Join our Online Quran Classes with qualified teachers through a trusted Online Quran Academy. Whether you want to Learn Quran Online, enroll in Quran Courses Online, or find the Best Online Quran Classes, our personalized lessons help children and adults build confidence, improve recitation, and develop a lifelong connection with the Holy Quran." },
        { title: "Flexible Learning for Every Student", text: "Our Quran Lessons Online offer flexible schedules with one-to-one Online Quran Teaching for learners of all ages. Choose Online Quran Classes for Beginners, Online Quran Classes for Adults, or search for a Quran Teacher Near Me to enjoy interactive sessions, structured learning, and expert guidance from anywhere in the world." },
        { title: "Master Tajweed and Quran Memorization", text: "Strengthen your recitation through our Online Tajweed Course and Quran Memorization Course. Learn Quran with Tajweed using step-by-step guidance from experienced instructors. Our engaging Quran Online Lessons combine practical exercises, personalized feedback, and regular progress tracking to help every student achieve excellence." },
        { title: "Learn Quranic Arabic with Qualified Teachers", text: "Deepen your understanding of the Quran by choosing to Learn Quranic Arabic Online with experienced male and Female Quran Teacher Near Me options available. Our Quran Study Online programs combine Online Quran Classes, Quran Courses Online, and Learn Quran Online methods to make learning effective, enjoyable, and accessible for everyone." },
      ],
    },
    blog: {
      pill: "Blogs",
      title_line1: "Insights that inspire faith,",
      title_line2: "learning & growth",
      desc_line1: "Stay updated with our latest articles on Islamic education, personal growth,",
      desc_line2: "and student development.",
    },
    faq: {
      title: "Many People",
      title_highlight: "Ask About this",
      description: "Following are answers to some queries that are posed regularly",
      cta_label: "BOOK YOUR FREE SESSION NOW!",
      cta_url: "/contact",
      items: [
        { q: "What courses does Yaqeen Institute offer?", a: "Yaqeen Institute offers online Quran classes, Quran courses online, Quran lessons online, Quran memorization course (Hifz), online Tajweed course, Islamic Studies, and Quranic Arabic for children, adults, and beginners worldwide." },
        { q: "How are the classes conducted?", a: "Our online Quran academy provides one-to-one live sessions with experienced teachers through interactive virtual classrooms. Students enjoy flexible scheduling, personalized learning, and engaging Quran online lessons from anywhere." },
        { q: "Who can join Yaqeen Institute's classes?", a: "Everyone is welcome! We offer online Quran classes for adults, children, teenagers, and beginners. Whether you're starting from Noorani Qaidah or looking to learn Quran online with confidence, we have the right course for you." },
        { q: "Can I choose my own class time?", a: "Yes. Our online Quran teaching programs are designed around your schedule. You can choose class timings that suit your time zone, making it convenient for students and families across the world." },
        { q: "How do you track student progress?", a: "Each student receives personalized guidance with regular assessments, progress reports, and teacher feedback. Our structured Quran study online approach ensures continuous improvement in recitation, Tajweed, memorization, and understanding." },
        { q: "How can I get support if I have a question?", a: "Our support team is available to assist you before and after enrolment. Whether you're searching for a Quran teacher near me, a female Quran teacher near me, or need help selecting the right course, we're here to guide you every step of the way." },
      ],
    },
    testimonials: {
      badge: "Testimonials",
      title_line1: "Stronger Faith.",
      title_line2_prefix: "Stronger ",
      title_highlight: "Together.",
      description_line1: "Hear from our learners and parents",
      description_line2: "building a stronger connection with Allah, together.",
    },
    newsletter: {
      title: "Get Inspiration Straight to Your Inbox!",
      desc_line1: "Every other week we send out our best advice from our blog.",
      desc_line2: "Subscribe below or connect with us on Facebook, Instagram,",
      desc_line3: "YouTube and LinkedIn",
      placeholder: "Your email address",
      button_label: "Submit",
      success_text: "JazakAllah Khair! You have successfully subscribed to our newsletter.",
    },
  },

  // -------------------------------------------------------------------- ABOUT
  about: {
    hero: {
      badge: "About Us",
      title: "Empowering Minds.",
      title_highlight: "Inspiring Futures.",
      description:
        "At Yaqeen Institute, we make learning the Quran, Arabic, and Islamic studies simple, engaging, and accessible for everyone. Our supportive environment nurtures confidence, strengthens faith, and helps learners grow both in knowledge and character.",
      features: [
        { title: "Expert & Caring Instructors — Passionate educators dedicated to every learner's success.", subtext: "Learn from certified Quran, Arabic, and Islamic Studies teachers delivering Online Quran Classes, Quran Lessons Online, and personalized guidance. Our experienced instructors help children and adults Learn Quran Online with confidence, Tajweed, and lasting Islamic knowledge." },
        { title: "Personalized Learning — Lessons tailored to each student's goals and pace.", subtext: "Every student receives customized Online Quran Classes, Quran Courses Online, and Arabic lessons based on their learning style, age, and goals. Personalized teaching helps beginners and advanced learners Learn Quran Online effectively with measurable progress." },
        { title: "Engaging & Effective — Interactive classes that make learning enjoyable and impactful.", subtext: "Our interactive Online Quran Teaching combines live classes, practical activities, and personalized feedback to make Quran Lessons Online, Arabic, and Islamic Studies engaging. Students Learn Quran with Tajweed while building confidence, understanding, and strong Islamic values." },
        { title: "Global Community of Learners — Connecting students worldwide through faith and knowledge.", subtext: "Join our trusted Online Quran Academy, where students from around the world attend Online Quran Classes, Quran Courses Online, and Arabic lessons. Build faith, connect with expert teachers, and Learn Quran Online in a supportive global community." },
      ],
    },
    banner: {
      quote_line1: "We believe in building strong foundations, nurturing character,",
      quote_line2: "and empowering every learner to lead with faith and purpose.",
    },
    who: {
      heading: "Who",
      heading_highlight: "We Are",
      description: "We are a global online academy founded by passionate educators and Islamic scholars, dedicated to making Quranic education accessible and impactful for students worldwide.",
    },
    what: {
      heading: "What",
      heading_highlight: "We Do",
      description: "We offer expertly structured online courses in Quran Recitation, Tajweed, Hifz, Arabic Language, and Islamic Studies, helping learners of all ages and levels achieve their goals through flexible and personalized learning.",
    },
    mission: {
      heading: "OUR",
      heading_highlight: "MISSION",
      description: "To provide authentic Islamic education that nurtures faith, knowledge, and character, empowering learners to lead purposeful lives and contribute positively to society.",
    },
    vision: {
      heading: "OUR",
      heading_highlight: "VISION",
      description: "To be a trusted global institution recognized for excellence in Islamic education, inspiring generations to embody knowledge, faith, and compassion.",
    },
    mv: {
      badge: "Our Mission & Vision",
      heading_line1_prefix: "Guided by ",
      heading_line1_highlight: "Faith.",
      heading_line2_prefix: "Driven by ",
      heading_line2_highlight: "Purpose.",
      intro: "Our mission and vision reflect our commitment to nurturing minds, strengthening hearts, and building a brighter, faith-centered future for all.",
      guides_title: "What Guides Us",
      guides: [
        { title: "Knowledge", desc: "We believe in seeking and spreading beneficial knowledge." },
        { title: "Integrity", desc: "We uphold honesty, trust, and strong Islamic values in everything we do." },
        { title: "Compassion", desc: "We nurture kindness, empathy, and respect in every learner." },
        { title: "Excellence", desc: "We strive for the highest standards in teaching, learning, and service." },
      ],
    },
    testimonials: {
      badge: "Testimonials",
      title_line1: "Stronger Faith.",
      title_line2_prefix: "Stronger ",
      title_highlight: "Together.",
      description_line1: "Hear from our learners and parents",
      description_line2: "building a stronger connection with Allah, together.",
    },
    cta: {
      heading: "Not sure where to start?",
      description: "Let us guide you to the right path with the right course.",
      button_label: "Find My Course",
      button_url: "/courses",
      features: ["Personalized Recommendation", "Learn from Qualified Teachers", "Quality Islamic Education"],
    },
    faq: {
      title: "Many People",
      title_highlight: "Ask About this",
      description: "Following are answers to some queries that are posed regularly",
      cta_label: "BOOK YOUR FREE SESSION NOW!",
      cta_url: "/contact",
      items: [
        { q: "Is the class schedule suitable for me?", a: "Yes. We offer highly flexible class schedules. You can choose your preferred days and times, and we have teachers available 24/7 across different time zones to fit your busy routine." },
        { q: "How do I begin?", a: "Getting started is very simple. Just click the 'Book Your Free Session Now' button below, fill out a short form with your contact details and preferences, and our academic advisor will contact you within 24 hours to schedule your free trial class." },
        { q: "Are these classes pre-recorded?", a: "No, all our classes are 100% live and interactive, conducted one-on-one via Zoom or our portal. This ensures personalized attention and allows you to ask questions and receive instant feedback from your teacher." },
        { q: "Where is the headquarter of your business?", a: "Our digital headquarters and academic operations are based in London, UK, but our teachers and students are spread globally across the UK, USA, Canada, Middle East, and South Asia, providing a truly international learning experience." },
      ],
    },
  },

  // ------------------------------------------------------------------ COURSES
  courses: {
    hero: {
      badge: "Online Courses",
      title_line1: "Your Learning",
      title_line2: "Journey Starts Here!",
      description:
        "Explore online Quran classes, Quran courses online, Arabic Language, and Islamic Studies designed to help kids and adults learn Quran online, master Tajweed, memorize the Quran, and build strong Islamic knowledge through personalized learning.",
    },
    catalog: {
      badge: "Our Courses",
      heading: "Explore Our Courses",
    },
    learn: {
      badge: "What You Will Learn",
      heading_line1: "Skills for a Lifetime,",
      heading_line2: "Knowledge for the Hereafter.",
      subtitle_line1: "Our structured curriculum helps you build a strong foundation",
      subtitle_line2: "and grow step by step with confidence.",
      skills: [
        { title: ["Correct", "Quran Reading"], desc: "Learn to read the Qur'an accurately with proper pronunciation and beautiful recitation." },
        { title: ["Tajweed", "Rules"], desc: "Understand and apply Tajweed rules to recite the Qur'an the way it was revealed." },
        { title: ["Makharij"], desc: "Master the correct points of articulation (Makharij) for clear and accurate pronunciation." },
        { title: ["Fluency", "Development"], desc: "Improve your reading speed and fluency with consistent practice and expert guidance." },
        { title: ["Confidence in", "Recitation"], desc: "Gain confidence to recite beautifully in daily life and in front of others." },
      ],
    },
    achieve: {
      badge: "Learning Outcomes",
      heading_line1: "What You Will",
      heading_highlight: "Achieve With Us",
      subtitle: "Our programs are thoughtfully designed to help you grow in knowledge, skills, and character—empowering you to succeed in every area of life.",
      items: [
        { title: "Comprehensive Learning", desc: "Gain in-depth knowledge across a wide range of subjects." },
        { title: "Strong Values & Character", desc: "Build strong values and character that guide your decisions." },
        { title: "Practical Skills", desc: "Develop practical skills you can apply in your daily life." },
        { title: "Personal Growth", desc: "Improve your mindset, confidence, and self-discipline." },
        { title: "Positive Mindset", desc: "Cultivate positivity, resilience, and a growth-oriented mindset." },
        { title: "Lifelong Impact", desc: "Create a lasting impact in your life, family, and community." },
      ],
      mission_text: "Our mission is to empower learners with knowledge and skills that inspire purpose, bring positive change, and build a better future.",
      badges: [
        { line1: "Trusted", line2: "Institute" },
        { line1: "Qualified", line2: "Teachers" },
        { line1: "Learners", line2: "Worldwide" },
      ],
    },
    teachers: {
      badge: "Meet Our Teachers",
      heading_line1: "Learn from Experienced",
      heading_line2_prefix: "and ",
      heading_highlight: "Caring Teachers.",
      subtitle: "Our teachers are qualified, experienced, and passionate about helping you grow in your Islamic knowledge.",
    },
    testimonials: {
      badge: "Testimonials",
      title_line1: "Stronger Faith.",
      title_line2_prefix: "Stronger ",
      title_highlight: "Together.",
      description_line1: "Hear from our learners and parents",
      description_line2: "building a stronger connection with Allah, together.",
    },
    faq: {
      title: "Many People",
      title_highlight: "Ask About this",
      description: "Following are answers to some queries that are posed regularly",
      cta_label: "BOOK YOUR FREE SESSION NOW!",
      cta_url: "/contact",
      items: [
        { q: "What will I learn in these courses?", a: "You will learn Quran with Tajweed, Online Quran Reading, Quran Memorization (Hifz), Islamic Studies, and Arabic Language through live online classes. Our courses are suitable for beginners, intermediate, and advanced learners of all ages." },
        { q: "Who can join these courses?", a: "Our online Quran classes are open to children, teenagers, and adults worldwide. Whether you're looking for Quran classes for kids, Arabic language lessons, or Islamic education online, we have the right course for you." },
        { q: "How are the classes conducted?", a: "Yaqeen Institute offers live one-to-one and small group online classes with qualified Quran and Arabic teachers. Learn from the comfort of your home with flexible scheduling and personalized guidance." },
        { q: "What are the course durations?", a: "Our online Quran, Tajweed, Hifz, Islamic Studies, and Arabic courses offer flexible learning plans, including short-term and long-term programs to suit your goals and availability." },
        { q: "What do I need to start learning?", a: "You only need a laptop, tablet, or smartphone with a stable internet connection. Yaqeen Institute provides a simple and engaging online Islamic learning experience from anywhere in the world." },
        { q: "Will I receive progress reports?", a: "Yes. We provide regular progress reports, teacher feedback, and personalized learning guidance to help students achieve success in their online Quran and Arabic learning journey." },
      ],
    },
  },

  // -------------------------------------------------------------- BOOK TRIAL
  bookTrial: {
    hero: {
      badge: "Free Trial Class",
      title_prefix: "Book Your ",
      title_highlight: "Free Trial",
      title_suffix: " Class Today",
      loading_text: "Loading booking form details, please wait...",
      stats: ["100% Free, No Card Needed", "Flexible 24/7 Scheduling", "Certified Teachers"],
    },
    progress: {
      step1_label: "Step 1 — Your Details",
      step2_label: "Step 2 — Preferences",
    },
    step1: {
      title: "Tell us about yourself",
      first_name_label: "First Name",
      last_name_label: "Last Name",
      email_label: "Email",
      phone_label: "Phone",
      country_label: "Country",
      country_placeholder: "Choose your country",
      next_label: "Next Step",
    },
    step2: {
      title: "Your learning preferences",
      learn_label: "What would you like to learn?",
      session_label: "This trial session is for",
      teacher_label: "Your preferred teacher",
      source_label: "How did you find us?",
      date_label: "Preferred Date",
      time_label: "Preferred Time",
      prev_label: "Previous",
      submit_label: "Submit Booking",
    },
    options: {
      learn: ["Quran", "Arabic Language", "Islamic Studies"],
      session_for: ["Myself", "A Family Member"],
      teacher: ["Male", "Female", "Either"],
      source: ["Friends", "Social Media", "Email", "Google", "Others"],
    },
    success: {
      title: "Your Free Trial is Booked!",
      message_suffix: ". We've received your request and our academic advisor will contact you within 24 hours to confirm your class.",
      home_label: "Back to Home",
      another_label: "Book Another",
    },
  },

  // ------------------------------------------------------------------ PRICING
  pricing: {
    header: {
      pill: "Pricing",
      title: "Plans That Fit Your Family",
      subtitle1: "Flexible, affordable plans with family discounts.",
      subtitle2: "Quality Quranic education that fits your budget and supports your spiritual journey.",
      discover_label: "Discover the Perfect Plan for You",
      transparency_prefix: "Transparency You Can Trust • ",
      transparency_highlight: "No Hidden Fees",
    },
    trust: [
      { title: "No Hidden Fees", desc: "What you see is what you pay." },
      { title: "Family Discounts", desc: "Save more when you learn together." },
      { title: "Flexible Plans", desc: "Choose what works for you." },
      { title: "Quality Education", desc: "Learn from qualified & certified teachers." },
    ],
    footnotes: [
      "Rescheduled classes must be completed within 30 days of current month.",
      "Any reschedules or cancellations must be informed to the teacher or admin at least 3-4 hours before the class start time; otherwise, the session is marked attended with no refund or reschedule.",
      "Discounts are offered to families with two or more members as per the applicable plan and are not valid for group classes. The family discount applies only to the second or subsequent student from the same family, not to all students.",
    ],
    testimonials: {
      badge: "Testimonials",
      title_line1: "Stronger Faith.",
      title_line2_prefix: "Stronger ",
      title_highlight: "Together.",
      description_line1: "Hear from our learners and parents",
      description_line2: "building a stronger connection with Allah, together.",
    },
    family: {
      title_gold: "Family Learning,",
      title_white: "Greater Rewards!",
      desc: "Enjoy a 5% discount when family members enroll together.",
      benefits: [
        { line1: "Learn", line2: "Together" },
        { line1: "Save", line2: "More" },
        { line1: "Grow", line2: "Together" },
        { line1: "Stronger", line2: "Connection" },
      ],
    },
    faq: {
      title: "Many People",
      title_highlight: "Ask About this",
      description: "Following are answers to some queries that are posed regularly",
      cta_label: "BOOK YOUR FREE SESSION NOW!",
      cta_url: "/register",
      items: [
        { q: "Is the class schedule suitable for me?", a: "Yes. We offer highly flexible class schedules. You can choose your preferred days and times, and we have teachers available 24/7 across different time zones to fit your busy routine." },
        { q: "How do I begin?", a: "Getting started is very simple. Just click the 'Book Your Free Session Now' button below, fill out a short form with your contact details and preferences, and our academic advisor will contact you within 24 hours to schedule your free trial class." },
        { q: "Are these classes pre-recorded?", a: "No, all our classes are 100% live and interactive, conducted one-on-one via Zoom or our portal. This ensures personalized attention and allows you to ask questions and receive instant feedback from your teacher." },
        { q: "Where is the headquarter of your business?", a: "Our digital headquarters and academic operations are based in London, UK, but our teachers and students are spread globally across the UK, USA, Canada, Middle East, and South Asia, providing a truly international learning experience." },
      ],
    },
  },

  // ------------------------------------------------------------------ CONTACT
  contact: {
    hero: {
      label: "Contact Us",
      title: "We're Here to Help You",
      description:
        "Have a question or need assistance? Our team is happy to support you on your learning journey.",
    },
    info: {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you.",
      email_label: "Email Us",
      phone_label: "Call / WhatsApp",
      hours_label: "Working Hours",
      support_label: "Worldwide Support",
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { question: "How can I enroll in a course?", answer: "You can enroll by creating an account and selecting your desired course." },
        { question: "Can I schedule classes at my convenience?", answer: "Yes, we offer flexible scheduling to fit your time and learning pace." },
        { question: "Do you offer trial classes?", answer: "Yes, we offer free trial classes for new students. Contact us to book yours." },
        { question: "What payment methods do you accept?", answer: "We accept major credit/debit cards, PayPal, and other secure payment methods." },
      ],
    },
    cta: {
      title: "Still have questions?",
      subtitle: "Our support team is ready to assist you!",
      button_label: "Chat with Support",
    },
  },

  // -------------------------------------------------------------------- FAQS
  faqs: {
    hero: {
      badge: "FAQs",
      title: "Frequently Asked",
      title_highlight: "Questions",
      description:
        "Everything you need to know about Yaqeen Institute — our courses, teachers, scheduling and enrolment. Can't find your answer? Reach out and we'll be happy to help.",
    },
    search_placeholder: "Search questions in this category…",
    tabs: [
      {
        key: "about",
        label: "About the Academy",
        items: [
          { q: "What is Yaqeen Institute?", a: "Yaqeen Institute is an online Islamic academy offering live one-to-one and small-group classes in Quran, Arabic and Islamic Studies for students of all ages, anywhere in the world." },
          { q: "What makes your academy unique?", a: "Certified teachers, personalised learning plans, flexible 24/7 scheduling and a supportive, faith-centred environment tailored to each student set us apart." },
          { q: "Who operates the Academy?", a: "Yaqeen Institute is run by a dedicated team of qualified teachers, Islamic scholars and education professionals." },
          { q: "Where are you located?", a: "We are an online academy with a global presence — our teachers and students are spread across the UK, USA, Europe, the Middle East and beyond." },
          { q: "Can I try an online Quran class before enrolling?", a: "Yes. We offer a free trial class so you can experience our teaching before you enrol." },
          { q: "What is the ideal age to start classes?", a: "There is no fixed age — we teach children from around 4–5 years old right through to adults, tailoring every class to the learner." },
          { q: "Are Yaqeen Institute classes secure?", a: "Yes. Classes are held on secure platforms (Zoom or our portal) and your personal information is always kept private and safe." },
          { q: "How can I contact Yaqeen Institute?", a: "You can reach us anytime through our contact page, email or WhatsApp — we are always happy to help." },
          { q: "How quickly do you respond?", a: "Our team typically responds within 24 hours, and often much sooner." },
          { q: "Can I talk to a tutor before enrolling?", a: "Yes. Your free trial class is a great chance to meet a teacher and ask any questions before enrolling." },
          { q: "Do you support international time zones?", a: "Yes. We have teachers available 24/7 across different time zones to fit your schedule." },
          { q: "Can I leave feedback or a complaint?", a: "Absolutely. We welcome all feedback and complaints so we can keep improving — just contact our team." },
          { q: "How do I get help in urgent cases?", a: "For urgent matters, contact us via WhatsApp or email and we will prioritise your request." },
          { q: "Are your testimonials genuine?", a: "Yes. All testimonials are from real students and parents who have studied with us." },
          { q: "Can I send in my review?", a: "Yes. We would love to hear about your experience — you can share your review through our contact page." },
          { q: "Do you publish video testimonials?", a: "Yes. We share both written and video testimonials from our community where available." },
          { q: "How do you collect feedback?", a: "We collect feedback through progress reviews, messages from students and parents, and follow-ups from our team." },
          { q: "Do testimonials reflect current staff?", a: "Yes. Our testimonials reflect the ongoing quality of our current teachers and team." },
          { q: "Are all reviews published?", a: "We aim to share genuine reviews; occasionally some are kept private at the reviewer's request." },
        ],
      },
      {
        key: "courses",
        label: "Courses & Teaching",
        items: [
          { q: "Are your instructors qualified?", a: "Yes. All our instructors are certified, experienced teachers of Quran, Tajweed, Arabic and Islamic Studies, carefully selected for both their knowledge and teaching ability." },
          { q: "What subjects do you offer?", a: "We offer Quran reading & recitation, Tajweed, Quran memorisation (Hifz), the Arabic language and Islamic Studies." },
          { q: "Are these classes based on age or level?", a: "Classes are based on each student's level and goals rather than age alone, so learners are always taught at the right pace." },
          { q: "Can I take more than one course at a time?", a: "Yes. You can enrol in multiple courses at once and we will build a schedule that works for you." },
          { q: "How long are the courses?", a: "Course length is flexible and depends on your goals — we offer both short-term and long-term learning plans." },
          { q: "Can I start anytime?", a: "Yes. You can begin at any time of the year; there are no fixed intake dates." },
          { q: "Are different languages used?", a: "Our teachers can explain lessons in English and other languages to make learning clear and comfortable for every student." },
          { q: "What application do I need for classes?", a: "Classes are held live via Zoom or our learning portal — you only need a device with a stable internet connection." },
          { q: "What does the Quran course cover?", a: "Correct pronunciation, Tajweed rules, fluent recitation and, if desired, memorisation (Hifz) with proper guidance." },
          { q: "What skills are taught in Arabic classes?", a: "Reading, writing, listening, speaking and grammar — building the foundation to understand the Quran and communicate in Arabic." },
          { q: "What is taught in Islamic Studies?", a: "Core beliefs (Aqeedah), worship (Fiqh), the life of the Prophet ﷺ (Seerah), manners (Akhlaq) and everyday Islamic practice." },
          { q: "Is the curriculum authentic?", a: "Yes. Our curriculum is based on authentic sources and taught by qualified scholars and teachers." },
          { q: "Will I get reports on student progress?", a: "Yes. We provide regular progress reports and teacher feedback so you always know how you or your child are doing." },
          { q: "Are certificates given?", a: "Yes. Certificates are awarded on completing key milestones and courses." },
          { q: "How long and frequent are the classes?", a: "Classes are typically 30–60 minutes and you can choose how many sessions per week suit you." },
          { q: "What topics are covered in your blog?", a: "Our blog covers Quran, Tajweed, Arabic learning tips, Islamic knowledge, parenting and student guidance." },
          { q: "How often is new content posted?", a: "We publish new articles regularly, so there is always fresh, beneficial content to read." },
          { q: "Who writes your blog posts?", a: "Our posts are written by knowledgeable teachers and contributors within the Yaqeen team." },
          { q: "Can I share your blog articles?", a: "Yes. You are welcome to share our articles with family and friends." },
          { q: "Can I suggest a topic?", a: "Of course. We love hearing from our community and welcome topic suggestions through our contact page." },
          { q: "Is the blog suitable for families?", a: "Yes. Our blog is family-friendly and beneficial for learners of all ages." },
        ],
      },
      {
        key: "access",
        label: "Scheduling & Access",
        items: [
          { q: "What happens after I book a trial?", a: "After you book, our academic advisor contacts you within 24 hours to confirm your preferred time and match you with a suitable teacher for your free trial class." },
          { q: "Is the trial really free?", a: "Yes. The trial class is completely free — no card details or payment are required." },
          { q: "Can I choose the trial timing?", a: "Yes. You pick the day and time that suits you and we arrange a teacher available then." },
          { q: "Do I need to prepare anything?", a: "No special preparation is needed — just a device with a stable internet connection and Zoom installed." },
          { q: "What if I want to continue after the trial?", a: "If you enjoyed your trial, our advisor will help you enrol and set up a regular schedule that works for you." },
          { q: "Can I give feedback after my trial?", a: "Absolutely. We welcome your feedback after the trial so we can match you with the best teacher and learning plan." },
          { q: "What equipment do I need to teach?", a: "You need a laptop, tablet or smartphone with a stable internet connection, a headset and a quiet space — Zoom or our portal handles the rest." },
          { q: "How do I access or manage online class tools?", a: "Once enrolled, we share simple instructions and links for Zoom or our learning portal, and our support team is always available to help." },
        ],
      },
      {
        key: "enrollment",
        label: "Fees & Enrollment",
        items: [
          { q: "What are the tuition fees?", a: "Tuition fees depend on the course and the number of classes per week. Please visit our pricing page or contact us for a plan tailored to you." },
          { q: "Are there any hidden charges?", a: "No. Our pricing is fully transparent — the fee you see is what you pay, with no hidden charges." },
          { q: "Do you offer any discounts?", a: "Yes. We offer family and sibling discounts, along with occasional seasonal offers." },
          { q: "Is monthly payment available?", a: "Yes. You can pay conveniently on a monthly basis." },
          { q: "Can I change my package later?", a: "Yes. You can upgrade, downgrade or adjust your package at any time — just let our team know." },
          { q: "Do you offer refunds?", a: "Yes. Please contact our team to learn about our refund terms and eligibility." },
          { q: "Is online payment safe?", a: "Yes. All payments are processed through secure, trusted payment gateways to keep your information safe." },
        ],
      },
      {
        key: "teachers",
        label: "Teachers",
        items: [
          { q: "How are your teachers hired?", a: "Teachers go through a careful selection process, including verification of qualifications, a subject and Tajweed assessment, a teaching demo and a character review before joining." },
          { q: "Are teachers trained for child instruction?", a: "Yes. Many of our teachers are experienced in teaching children, using patient, engaging and age-appropriate methods." },
          { q: "Can I select a preferred tutor?", a: "Yes. Wherever possible, we match you with your preferred tutor." },
          { q: "Where are your teachers located?", a: "Our teachers are based across the UK, the Middle East, South Asia and other regions, teaching students online worldwide." },
          { q: "Can I choose a male or female tutor?", a: "Yes. We have both male and female teachers and you may choose your preference." },
          { q: "Do teachers speak multiple languages?", a: "Yes. Many teachers speak English along with Arabic, Urdu and other languages to support diverse students." },
          { q: "How good is the teacher's English?", a: "Our teachers communicate clearly in English so lessons are easy to follow for English-speaking students." },
          { q: "How do I apply to become an online Quran Teacher with Yaqeen Institute?", a: "You can apply through our Teacher Application page — complete the form and upload your details, and our team will review your application." },
          { q: "What are the teaching expectations?", a: "Teachers are expected to be punctual, well-prepared, patient and committed to each student's progress, following our curriculum and values." },
          { q: "What equipment do I need to teach?", a: "A laptop or computer with a stable internet connection, a headset, a webcam and a quiet space are recommended." },
          { q: "What conduct is expected during class?", a: "We expect professional, respectful and Islamic conduct at all times, creating a safe and positive learning environment." },
          { q: "Can I reschedule or cancel a class?", a: "Yes. Classes can be rescheduled or cancelled with reasonable notice through our team." },
          { q: "How is teaching quality monitored?", a: "We monitor quality through student feedback, progress reports and periodic reviews to maintain high teaching standards." },
          { q: "Can I request more students or adjust teaching load?", a: "Yes. Teachers can request more students or adjust their teaching hours by contacting our team." },
          { q: "What should I do in case of a salary issue or delay?", a: "Please contact our administration team directly and we will resolve any salary matter promptly." },
          { q: "Can I take a vacation or adjust my schedule?", a: "Yes. Just inform us in advance and we will help arrange your leave or schedule changes." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ CAREERS
  careers: {
    hero: {
      badge: "Careers",
      title: "Build Your",
      title_highlight: "Career",
      title_suffix: " With Us",
      description: "More than a job — serve Allah and earn blessings in every step.",
    },
    intro: "This is not just a job; it's an opportunity to serve Allah through your work, earning His blessings and rewards with every task you complete.",
    foundation: {
      heading: "Our Foundation",
      heading_highlight: "Commitment",
      subtitle: "We approach teaching with responsibility, ensuring we provide accurate knowledge and guide students with integrity.",
      values: [
        { ar: "Amanah", en: "Trustworthiness", desc: "We approach teaching with responsibility, ensuring we provide accurate knowledge and guide students with integrity." },
        { ar: "Adab", en: "Proper Conduct", desc: "We respect and value each student, fostering an environment where they can develop both academically and ethically." },
        { ar: "Ihsan", en: "Excellence", desc: "We are dedicated to delivering the highest quality of education, striving to inspire students to achieve their full potential." },
        { ar: "Ikhlas", en: "Sincerity", desc: "Our efforts in teaching are driven by a sincere desire to seek the pleasure of Allah and make a positive impact on the lives of our students." },
      ],
    },
    why: {
      heading: "Why Join Us?",
      subtitle: "What we offer is not just employment, but a chance to earn rewards from Allah by fulfilling your duties with sincerity and purpose.",
      cards: [
        { title: "Community", desc: "Build lasting bonds with a team of like-minded individuals, united in their commitment to a shared, greater purpose." },
        { title: "Teamwork", desc: "Collaborate with diverse teams, global colleagues and academics to foster creativity, innovation and mutual learning." },
        { title: "Development", desc: "Thrive in an environment that encourages continuous learning, both spiritually and professionally, supporting your growth." },
        { title: "Empowerment", desc: "Contribute to the positive transformation of lives by nurturing faith and leaving an enduring impact on communities." },
        { title: "Excellence", desc: "Experience a well-structured workplace with high standards of integrity, ensuring a professional atmosphere for all." },
        { title: "Balance", desc: "Work in harmony where both your spiritual values and worldly aspirations align toward a common, purposeful goal." },
      ],
    },
    jobs: {
      heading: "Join Our",
      heading_highlight: "Team",
      subtitle: "We are seeking the perfect candidates for the positions listed below.",
      apply_label: "Apply Now",
      become_tutor_label: "Become a Tutor",
    },
    faq: {
      badge: "Teachers FAQ",
      title: "Questions About Our",
      title_highlight: "Teachers",
      apply_label: "Apply to Teach",
      items: [
        { q: "How do I apply to teach with Yaqeen Institute?", a: "You can apply through our Teacher Application page — complete the form and upload your details, and our team will review your application." },
        { q: "What are the teaching expectations?", a: "Teachers are expected to be punctual, well-prepared, patient and committed to each student's progress, following our curriculum and values." },
        { q: "What equipment do I need to teach?", a: "A laptop or computer with a stable internet connection, a headset, a webcam and a quiet space are recommended." },
        { q: "What conduct is expected during class?", a: "We expect professional, respectful and Islamic conduct at all times, creating a safe and positive learning environment." },
        { q: "Can I reschedule or cancel a class?", a: "Yes. Classes can be rescheduled or cancelled with reasonable notice through our team." },
        { q: "How is teaching quality monitored?", a: "We monitor quality through student feedback, progress reports and periodic reviews to maintain high teaching standards." },
      ],
    },
  },

  // ----------------------------------------------------------------- TEACHERS
  teachers: {
    hero: {
      label: "Meet Our",
      title: "Teachers",
      subtitle:
        "Learn Qur'an online with qualified and experienced teachers. Expert in Tajweed, Hifz, Arabic & Islamic Studies. 1-to-1 classes for kids & adults — flexible, trusted & effective.",
      badges: ["Online Quran Classes", "Tajweed Classes", "Hifz Quran", "Islamic Studies", "Arabic Language"],
      features: ["Qualified & Certified", "Expert in Qur'an & Tajweed", "1-to-1 Online Classes", "Student Focused"],
    },
    grid: {
      badge: "Meet Our Teachers",
      title_line1: "Learn from Experienced",
      title_line2_prefix: "and ",
      title_highlight: "Caring Teachers.",
      subtitle: "Our teachers are qualified, experienced, and passionate about helping you grow in your Islamic knowledge.",
    },
    commit: {
      lead: "Here, your skills become a means of compassion, your dedication becomes a source of reward, and your efforts create lasting impact.",
      heading: "Our Core",
      heading_highlight: "Commitment",
      button_label: "Join Our Team",
      button_url: "/careers",
      values: [
        { ar: "Amanah", en: "Trustworthiness" },
        { ar: "Adab", en: "Proper Conduct" },
        { ar: "Ihsan", en: "Excellence" },
        { ar: "Ikhlas", en: "Sincerity" },
      ],
    },
    learn: {
      badge: "Learn Online",
      title_line1: "Learn with a Professional",
      title_highlight: "Quran Teacher Online",
      items: [
        { q: "Flexibility, Comfort & Personalized Attention", d: "Learn from the comfort of your home with one-to-one classes designed around your schedule and goals.", a: "Your teacher adapts every lesson to your availability, comfort and personal learning goals — so you always progress at your own pace." },
        { q: "Step-by-step Structured Learning Approach", d: "Our well-organized lessons help you build a strong foundation and progress with clarity and confidence.", a: "We follow a clear, structured curriculum that takes you step by step from the fundamentals to advanced levels." },
        { q: "Guidance Tailored to Your Learning Pace", d: "Receive patient guidance and constant support from expert teachers who understand your unique learning needs.", a: "Whether you are a beginner or advanced learner, your teacher tailors the guidance and pace to suit you." },
      ],
    },
    choose: {
      badge: "Teacher & Students",
      title: "What Would You",
      title_highlight: "Like to Do?",
      subtitle: "Whether you want to learn the Quran online or become a Quran teacher, we're here to support and guide you every step of the way.",
      cards: [
        { title: "I want to learn the Quran", desc: "Join interactive Quran classes online with expert teachers and a proven curriculum designed for all age groups and levels.", btn: "Register as Student", href: "/register" },
        { title: "I want to teach the Quran", desc: "Inspire students worldwide by teaching the Quran online and earn rewards while working from the comfort of your home.", btn: "Register as Teacher", href: "/teacher-application" },
      ],
    },
    faq: {
      badge: "Teachers FAQ",
      title: "Questions About Our",
      title_highlight: "Teachers",
      items: [
        { q: "What makes your Quran teachers qualified?", a: "Our teachers are certified and experienced, many holding Ijazah and degrees in Islamic Studies, and are carefully selected for both knowledge and teaching skill." },
        { q: "How are your teachers selected?", a: "Teachers go through a careful selection process including verification of qualifications, a subject and Tajweed assessment, a teaching demo and a character review." },
        { q: "Do your teachers speak different languages?", a: "Yes. Many teachers speak English along with Arabic, Urdu and other languages to support diverse students." },
        { q: "Can I change my teacher if needed?", a: "Yes. Wherever possible we accommodate teacher change requests — just contact our support team." },
        { q: "Do your teachers have teaching experience?", a: "Yes. Our teachers are experienced in teaching students of all ages using patient, engaging and effective methods." },
        { q: "How can I connect with my teacher?", a: "Classes are held live via Zoom or our portal, and you can reach your teacher and our support team anytime." },
      ],
    },
  },

  // ------------------------------------------------------------ TESTIMONIALS
  testimonials: {
    hero: {
      badge: "Testimonials",
      title: "Feedback From Our",
      title_highlight: "Students",
      description:
        "Hear from our learners and parents building a stronger connection with the Quran, Arabic and Islamic knowledge — together.",
    },
    cta: {
      title: "Ready to start your journey?",
      subtitle: "Book a free trial class and experience the difference.",
      button_label: "Book a Free Trial",
      button_url: "/register",
    },
    faq: {
      badge: "Testimonials FAQ",
      title: "Everything About Reviews &",
      title_highlight: "Feedback",
      items: [
        { q: "Are your testimonials genuine?", a: "Yes. All testimonials are from real students and parents who have studied with us." },
        { q: "Can I send in my review?", a: "Yes. We would love to hear about your experience — you can share your review through our contact page." },
        { q: "Do you publish video testimonials?", a: "Yes. We share both written and video testimonials from our community where available." },
        { q: "How do you collect feedback?", a: "We collect feedback through progress reviews, messages from students and parents, and follow-ups from our team." },
        { q: "Do testimonials reflect current staff?", a: "Yes. Our testimonials reflect the ongoing quality of our current teachers and team." },
        { q: "Are all reviews published?", a: "We aim to share genuine reviews; occasionally some are kept private at the reviewer's request." },
      ],
    },
  },

  // ----------------------------------------------------------------- PRIVACY
  privacy: {
    hero: {
      badge: "Privacy Policy",
      title: "Protecting Your Privacy at",
      title_highlight: "Yaqeen Institute",
      description:
        "Learn what information we collect, how we use and protect it, and the choices you have over your personal data.",
    },
    intro: [
      'Welcome to Yaqeen Institute ("Yaqeen Institute," "we," "our," or "us"). We are committed to respecting your privacy and protecting the personal information you provide while using our website and educational services. This Privacy Policy explains what information we collect, how we use it, how we safeguard it, and the choices available to you regarding your personal data.',
      "This Privacy Policy applies solely to information collected through the official Yaqeen Institute website and the online services we provide. It does not apply to websites, services, or organizations that are not owned, operated, or controlled by Yaqeen Institute.",
      "Please note that any information you voluntarily make available in public areas of our website or online communities may be visible to others and may not be protected as private information under this Policy.",
      "By accessing our website, registering for our courses, or using any of our services, you acknowledge that you have read, understood, and accepted the terms of this Privacy Policy.",
    ],
    sections: [
      { id: "s1", title: "Information We Collect", blocks: [
        { p: "To provide high-quality educational services, Yaqeen Institute collects certain information during registration, enrolment, and throughout your learning experience." },
        { lead: "The information we collect may include:", items: ["Full name of the student and parent/guardian (where applicable)", "Email address", "Mobile or telephone number", "Country of residence", "Student's age or age group", "Educational background", "Quran learning level", "Arabic language proficiency", "Course preferences and learning objectives", "Class schedules and attendance records"] },
        { p: "When you contact us through our website, email, WhatsApp, telephone, or contact forms, we may collect the information you voluntarily provide, including your messages, inquiries, attachments, and any supporting documents required to assist you." },
        { p: "Where payments are required, certain billing information may also be collected through our secure payment partners to process your enrolment." },
        { p: "To maintain educational quality, improve teaching standards, and support teacher development, online classes may be recorded. These recordings are securely stored and accessed only by authorized personnel for quality assurance, teacher evaluation, dispute resolution, and internal training purposes." },
        { p: "Yaqeen Institute does not knowingly collect personal information directly from children who are below the minimum legal age to provide consent independently. Students under the applicable age must always be registered by their parent or legal guardian." },
        { p: "If we discover that personal information has been submitted by a child without appropriate parental authorization, we will take reasonable steps to remove that information from our systems." },
        { p: "If you believe that a child has provided personal information without your consent, please contact us immediately so that appropriate action can be taken." },
      ] },
      { id: "s2", title: "How We Use Your Information", blocks: [
        { p: "The information collected allows Yaqeen Institute to provide efficient, secure, and personalized educational services." },
        { lead: "Your information may be used to:", items: ["Create and manage your student account.", "Process registrations and enrolments.", "Arrange trial classes and regular lessons.", "Schedule teachers and class timings.", "Monitor student progress.", "Provide educational support.", "Respond to questions and customer service requests.", "Send class reminders and scheduling notifications.", "Process payments and issue invoices.", "Improve course quality and teaching methods.", "Enhance website functionality and user experience.", "Inform you about new courses, educational resources, promotions, or important announcements."] },
        { p: "We may also analyse anonymous usage data to better understand how students and visitors interact with our website. This information helps us improve our services, educational content, website performance, and overall learning experience." },
        { p: "You may unsubscribe from promotional communications at any time; however, important service-related communications will continue to be sent whenever necessary for the administration of your account or classes." },
      ] },
      { id: "s3", title: "Email and Other Communications", blocks: [
        { lead: "Yaqeen Institute may communicate with students and parents through various official communication channels, including:", items: ["Email", "WhatsApp", "SMS", "Telephone", "Video conferencing platforms", "Other digital messaging services"] },
        { lead: "These communications may include:", items: ["Class confirmations", "Timetable updates", "Payment reminders", "Academic progress reports", "Technical support", "Service announcements", "New course information", "Promotional offers", "Institute news and updates"] },
        { p: "Marketing communications are intended to provide useful information about our educational services and are not based on behavioural profiling or targeted advertising." },
        { p: "You may choose to stop receiving promotional communications at any time by following the unsubscribe instructions included in our emails or by contacting our support team directly." },
        { p: "To improve communication quality, we may monitor general engagement metrics such as email delivery, open rates, and message performance. These analytics are used solely to improve our communications and are not used to make automated decisions about individual users." },
      ] },
      { id: "s4", title: "Cookies and Tracking Technologies", blocks: [
        { p: "Yaqeen Institute uses cookies and similar technologies to improve the functionality, performance, and overall user experience of our website. Cookies are small text files stored on your device that help us recognize your browser, remember your preferences, and provide a smoother browsing experience during future visits." },
        { lead: "These technologies may be used to:", items: ["Remember your login sessions and user preferences.", "Save language or display settings.", "Improve website speed and usability.", "Analyse website traffic and visitor behaviour.", "Identify technical issues and improve website performance.", "Enhance security by detecting suspicious or fraudulent activity.", "Support essential website features and learning functionality."] },
        { p: "We may also use trusted analytics services, such as Google Analytics or similar tools, to collect anonymous information regarding website usage. This may include pages visited, time spent on the website, navigation patterns, and device information. The information collected through these services does not personally identify individual users and is used solely to improve our website and educational services." },
        { p: "Most web browsers automatically accept cookies; however, you may choose to modify your browser settings to refuse or remove cookies at any time. Please note that disabling cookies may affect certain website features and reduce the overall functionality of your browsing experience." },
      ] },
      { id: "s5", title: "Payment Information", blocks: [
        { p: "Yaqeen Institute offers secure online payment methods for course enrolment and subscription packages. Payments may be processed through trusted third-party payment providers that support credit cards, debit cards, digital wallets, bank transfers, or other available payment methods." },
        { p: "For your security, Yaqeen Institute does not store your complete debit card or credit card details on its own servers. All payment transactions are processed using encrypted connections through certified payment gateways that comply with applicable security standards." },
        { lead: "Payment information is used solely for purposes such as:", items: ["Processing course fees.", "Managing subscriptions.", "Issuing invoices and payment confirmations.", "Processing eligible refunds.", "Preventing fraudulent transactions.", "Maintaining accurate financial records."] },
        { p: "We encourage users to review the privacy and security policies of any third-party payment provider used during the payment process." },
      ] },
      { id: "s6", title: "Data Sharing and Third-Party Services", blocks: [
        { p: "Yaqeen Institute values your privacy and does not sell, rent, or trade your personal information to advertisers or unrelated third parties." },
        { lead: "However, certain information may be shared with carefully selected service providers where necessary to operate our educational services effectively. These may include:", items: ["Secure payment processors.", "Cloud hosting providers.", "Video conferencing platforms.", "Learning management systems.", "Email and communication service providers.", "Technical support partners.", "Internal staff responsible for student administration, academic support, and customer service."] },
        { p: "All third-party service providers are required to handle personal information securely and only for the specific purposes authorized by Yaqeen Institute." },
        { p: "We may also disclose personal information when required by applicable law, court order, government authority, or where disclosure is necessary to protect our legal rights, prevent fraud, investigate security concerns, or comply with legal obligations." },
        { p: "Our website does not display third-party advertising, and we do not permit unrelated companies to use your information for independent marketing purposes." },
      ] },
      { id: "s7", title: "Data Storage and Security", blocks: [
        { p: "Protecting your personal information is one of our highest priorities. Yaqeen Institute implements appropriate technical, administrative, and organizational measures to safeguard your data against unauthorized access, misuse, alteration, disclosure, or loss." },
        { lead: "Our security measures may include:", items: ["Secure SSL/TLS encryption for website communications.", "Encrypted storage of sensitive information.", "Secure cloud-based infrastructure.", "Restricted access to personal data based on staff responsibilities.", "Password-protected administrative systems.", "Regular software updates and security monitoring.", "Internal staff training on data protection and privacy practices.", "Routine security assessments to maintain platform integrity."] },
        { p: "Where lesson recordings are retained for educational quality assurance, they are securely stored and accessible only to authorized personnel." },
        { p: "Although we apply industry-standard security practices, no internet-based system can guarantee absolute security. Users are encouraged to protect their own devices, passwords, and internet connections while accessing our services." },
      ] },
      { id: "s8", title: "Data Retention", blocks: [
        { p: "Yaqeen Institute retains personal information only for as long as it is reasonably necessary to provide educational services, comply with legal obligations, resolve disputes, maintain accurate records, and improve our services." },
        { p: "Student records, attendance history, payment information, academic progress, and related account information may be retained for an appropriate period after an account becomes inactive or is closed." },
        { p: "Once personal information is no longer required for legitimate business or legal purposes, it will be securely deleted, anonymized, or archived in accordance with applicable data protection laws and our internal data management procedures." },
      ] },
      { id: "s9", title: "Your Rights and Choices", blocks: [
        { lead: "Yaqeen Institute respects your privacy rights and aims to provide you with reasonable control over your personal information. Subject to applicable data protection laws, you may have the right to:", items: ["Access the personal information we hold about you.", "Request correction of inaccurate or incomplete information.", "Update your account details at any time.", "Request the deletion of your personal information where legally permitted.", "Restrict or object to certain types of data processing.", "Request a copy of your personal information in a commonly used electronic format.", "Withdraw consent where processing is based on your consent.", "Opt out of receiving promotional communications while continuing to receive essential service-related notifications."] },
        { p: "Parents or legal guardians may also request access to, correction of, or deletion of personal information relating to their child, subject to applicable legal requirements and verification procedures." },
        { p: "To exercise any of these rights, please contact Yaqeen Institute using the contact information provided at the end of this Privacy Policy. We will respond to your request within a reasonable timeframe and in accordance with applicable laws." },
      ] },
      { id: "s10", title: "Children's Privacy", blocks: [
        { p: "Yaqeen Institute is committed to protecting the privacy and safety of children who participate in our educational programs." },
        { p: "Students who are below the legal age required to provide independent consent must be registered by their parent or legal guardian. Parents or guardians are responsible for providing accurate registration information, supervising the student's participation where appropriate, and accepting this Privacy Policy on the student's behalf." },
        { p: "We do not knowingly collect personal information directly from children without the knowledge and consent of their parent or legal guardian." },
        { p: "If we become aware that personal information has been collected from a child without the required parental authorization, we will take reasonable steps to delete such information from our records as soon as practicable." },
        { p: "Parents and guardians may contact us at any time to review, update, or request the removal of their child's personal information, subject to applicable legal obligations." },
      ] },
      { id: "s11", title: "International Data Transfers", blocks: [
        { p: "As an online educational institution serving students worldwide, Yaqeen Institute may process or store personal information using secure systems located in different countries." },
        { p: "Whenever personal information is transferred internationally, we take appropriate measures to ensure that such transfers are protected by suitable technical, contractual, and organizational safeguards consistent with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and other relevant privacy legislation where applicable." },
        { p: "Our service providers are selected carefully and are expected to maintain appropriate standards for protecting personal information." },
      ] },
      { id: "s12", title: "Changes to this Privacy Policy", blocks: [
        { p: "Yaqeen Institute may revise or update this Privacy Policy from time to time to reflect changes in our educational services, website functionality, technology, legal obligations, or operational practices." },
        { p: 'Whenever significant changes are made, the revised Privacy Policy will be published on this page together with an updated "Last Updated" date.' },
        { p: "We encourage all students, parents, and website visitors to review this Privacy Policy periodically to remain informed about how we collect, use, and protect personal information." },
        { p: "Your continued use of our website or services after any updates become effective constitutes your acceptance of the revised Privacy Policy." },
      ] },
      { id: "s13", title: "Consent", blocks: [
        { p: "By accessing the Yaqeen Institute website, registering for our educational programs, booking trial classes, or using any of our online services, you acknowledge that you have read, understood, and agreed to this Privacy Policy." },
        { p: "Where required by applicable law, parents or legal guardians provide consent on behalf of students who are not legally permitted to provide independent consent." },
        { p: "If you do not agree with the terms of this Privacy Policy, you should discontinue the use of our website and services." },
      ] },
    ],
    contact: {
      heading: "Contact Information",
      intro: "If you have any questions, concerns, or requests regarding this Privacy Policy or the way Yaqeen Institute processes your personal information, please contact us using the details below:",
      name: "Yaqeen Institute",
      address: ["128, City Road", "London, EC1V 2NX", "United Kingdom"],
      phone: "+44 7700 183483",
      email: "support@yaqeeninstitute.com",
      note: "Our team will make every reasonable effort to respond to your inquiry promptly and in accordance with applicable data protection laws.",
    },
    updated: "July 2026",
  },

  // ------------------------------------------------------------------- TERMS
  terms: {
    hero: {
      badge: "Terms of Service",
      title: "Learn with Confidence at",
      title_highlight: "Yaqeen Institute",
      description:
        "These Terms govern your access to and use of our website, online classes, and educational services.",
    },
    intro: [
      'Welcome to Yaqeen Institute. These Terms of Service ("Terms") govern your access to and use of our website, online classes, and educational services. By registering for our courses, booking a trial class, or using our website, you agree to comply with these Terms. If you do not agree with any part of these Terms, please discontinue the use of our services.',
    ],
    sections: [
      { id: "s1", title: "Definitions", blocks: [
        { lead: "Throughout these Terms:", defs: [
          { term: "Institute", text: "refers to Yaqeen Institute." },
          { term: "Student", text: "means any person enrolled in our courses." },
          { term: "Parent/Guardian", text: "refers to the individual registering or supervising a minor." },
          { term: "Teacher", text: "means an instructor approved by Yaqeen Institute." },
          { term: "Services", text: "include online Quran classes, Tajweed, Hifz, Arabic Language, Islamic Studies, and related educational programs." },
          { term: "Website", text: "refers to all official Yaqeen Institute digital platforms." },
        ] },
      ] },
      { id: "s2", title: "Acceptance of Terms", blocks: [{ p: "By accessing our website or enrolling in any course, you confirm that you have read, understood, and accepted these Terms. Parents or legal guardians accept these Terms on behalf of students under the applicable legal age." }] },
      { id: "s3", title: "Eligibility", blocks: [{ p: "Students of all ages are welcome to join Yaqeen Institute. Students below the age required to register independently must be enrolled by a parent or legal guardian, who remains responsible for their participation and compliance with these Terms." }] },
      { id: "s4", title: "Registration and Account Information", blocks: [{ p: "You agree to provide accurate, complete, and up-to-date information during registration. Yaqeen Institute reserves the right to suspend or terminate accounts containing false or misleading information." }] },
      { id: "s5", title: "Trial Classes and Enrollment", blocks: [{ p: "A free or discounted trial class may be offered to help students evaluate our teaching approach. Enrolling in a regular course after the trial indicates acceptance of the selected package, schedule, and applicable policies." }] },
      { id: "s6", title: "Class Scheduling and Attendance", blocks: [{ p: "Classes are arranged according to mutually agreed schedules. Students are expected to attend classes on time and be prepared for learning. Repeated absence or late attendance may affect learning progress." }] },
      { id: "s7", title: "Cancellation and Rescheduling", blocks: [{ p: "Requests to cancel or reschedule a class should be made at least 4 hours before the scheduled lesson. Rescheduling is subject to teacher availability and must normally be completed within the current billing period." }] },
      { id: "s8", title: "Teacher Assignment and Replacement", blocks: [{ p: "Yaqeen Institute carefully selects qualified teachers for every student. If a teacher becomes unavailable or a replacement is necessary, we will assign another qualified instructor. Students may also request a teacher change by contacting our support team." }] },
      { id: "s9", title: "Fees and Payments", blocks: [{ p: "Course fees must be paid in advance according to the selected learning package. Failure to make payment within the specified period may result in temporary suspension of classes until outstanding balances are cleared." }] },
      { id: "s10", title: "Refund Policy", blocks: [{ p: "Refunds may only be provided for eligible unused prepaid lessons in accordance with our refund policy. Completed classes, missed sessions without proper notice, or voluntarily discontinued packages are generally non-refundable unless otherwise approved by Yaqeen Institute." }] },
      { id: "s11", title: "Student and Parent Responsibilities", blocks: [{ p: "Students are expected to behave respectfully during lessons and maintain a positive learning environment. Parents or guardians should ensure younger students attend classes regularly, have suitable learning equipment, and communicate promptly regarding scheduling or academic concerns." }] },
      { id: "s12", title: "Online Learning Requirements", blocks: [{ p: "Students are responsible for maintaining a stable internet connection, a suitable device, and a quiet learning environment. Yaqeen Institute is not responsible for interruptions caused by personal internet or equipment issues." }] },
      { id: "s13", title: "Website Use", blocks: [{ p: "Users agree not to misuse the website by attempting unauthorized access, distributing harmful content, copying materials without permission, or engaging in any activity that violates applicable laws or disrupts our services." }] },
      { id: "s14", title: "Intellectual Property", blocks: [{ p: "All educational materials, lesson content, graphics, logos, videos, documents, and website content remain the exclusive property of Yaqeen Institute. They may not be copied, reproduced, distributed, or used commercially without prior written permission." }] },
      { id: "s15", title: "Privacy and Child Protection", blocks: [{ p: "We value the privacy of every student and follow appropriate measures to safeguard personal information. Children are enrolled only through their parents or legal guardians, and personal information is handled in accordance with applicable privacy laws." }] },
      { id: "s16", title: "Service Availability", blocks: [{ p: "While we strive to provide uninterrupted educational services, occasional maintenance, technical issues, or unforeseen circumstances may temporarily affect access to classes or our website. We will make reasonable efforts to restore services promptly." }] },
      { id: "s17", title: "Third-Party Platforms", blocks: [{ p: "Our services may utilize trusted third-party platforms for video conferencing, payment processing, communication, or scheduling. Yaqeen Institute is not responsible for the independent policies or practices of these external providers." }] },
      { id: "s18", title: "Changes to Services and Terms", blocks: [{ p: "Yaqeen Institute reserves the right to update these Terms, course structures, pricing, schedules, or educational services whenever necessary. Continued use of our services after such updates constitutes acceptance of the revised Terms." }] },
      { id: "s19", title: "Limitation of Liability", blocks: [{ p: "Yaqeen Institute provides educational services with professionalism and care but does not guarantee specific academic results or outcomes. Our liability shall be limited to the maximum extent permitted by applicable law." }] },
      { id: "s20", title: "Governing Law", blocks: [{ p: "These Terms shall be governed by the laws of England and Wales. Any disputes should first be resolved through good-faith discussions before proceeding through the appropriate legal process." }] },
      { id: "s21", title: "Communication", blocks: [{ p: "Yaqeen Institute may communicate with students and parents through email, WhatsApp, SMS, telephone calls, or other official communication channels regarding class schedules, payment reminders, academic progress, service updates, technical notifications, and important announcements. Promotional messages may also be sent from time to time. You may opt out of marketing communications at any time; however, essential service-related communications will continue to be sent where necessary." }] },
      { id: "s22", title: "Business Transfers", blocks: [{ p: "In the event of a merger, acquisition, restructuring, sale of assets, or any other business transfer involving Yaqeen Institute, student information and related records may be transferred to the successor organization in accordance with applicable data protection laws. Any such transfer will continue to respect the privacy commitments outlined in our policies." }] },
      { id: "s23", title: "Force Majeure", blocks: [{ p: "Yaqeen Institute shall not be held responsible for delays, interruptions, or failure to provide services resulting from circumstances beyond our reasonable control. These may include, but are not limited to, natural disasters, pandemics, government restrictions, war, civil unrest, internet outages, power failures, cyber incidents, or failures of third-party service providers. Where possible, affected classes will be rescheduled at a mutually convenient time." }] },
      { id: "s24", title: "Cookies and Website Analytics", blocks: [{ p: "Our website may use cookies and similar technologies to improve user experience, maintain website functionality, analyze visitor activity, and enhance our services. By continuing to use our website, you consent to the use of cookies in accordance with our Privacy Policy. You may manage or disable cookies through your browser settings, although some website features may not function properly." }] },
      { id: "s25", title: "Dispute Resolution", blocks: [{ p: "If any disagreement arises concerning these Terms or the services provided by Yaqeen Institute, both parties agree to first seek an amicable resolution through good-faith discussions. If the matter cannot be resolved informally, it may proceed to mediation or other appropriate legal proceedings in accordance with the governing laws specified in these Terms." }] },
      { id: "s26", title: "Severability", blocks: [{ p: "If any provision of these Terms of Service is found to be unlawful, invalid, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severed from the remaining Terms. The remaining provisions shall continue to remain valid, enforceable, and in full legal effect." }] },
      { id: "s27", title: "Entire Agreement", blocks: [{ p: "These Terms of Service, together with our Privacy Policy and any other policies published by Yaqeen Institute, constitute the complete agreement between you and Yaqeen Institute regarding the use of our website and educational services. They supersede all previous verbal or written communications, understandings, or agreements relating to the same subject matter." }] },
    ],
    contact: {
      heading: "Contact Us",
      intro: "For any questions regarding these Terms or our services, please contact:",
      name: "Yaqeen Institute",
      address: ["128, City Road, London, EC1V 2NX, United Kingdom"],
      phone: "+44 7700 183483",
      email: "support@yaqeeninstitute.com",
    },
  },

  // ------------------------------------------------------------------ REFUND
  refund: {
    hero: {
      badge: "Refund Policy",
      title: "Fair & Transparent Tuition",
      title_highlight: "Refund Policy",
      description:
        "Understand our money-back guarantees, eligible refund terms, and class cancellation guidelines.",
    },
    intro: [
      'Welcome to Yaqeen Institute. We are dedicated to providing the highest standard of online Quranic, Arabic, and Islamic education. We understand that personal circumstances, scheduling conflicts, or learning needs may change over time.',
      "This Refund Policy outlines the terms and conditions under which refunds, class credits, and subscription adjustments are processed for tuition fees paid to Yaqeen Institute.",
      "By enrolling in our courses or making tuition payments, you agree to the terms described in this Refund Policy.",
    ],
    sections: [
      { id: "s1", title: "Free Trial Class Guarantee", blocks: [
        { p: "To ensure that our teaching methodology and teacher assignment meet your expectations, Yaqeen Institute offers a 100% free initial trial class with no financial commitment or credit card required." },
        { p: "Enrolment in a paid learning package takes place only after you evaluate the trial lesson and decide to proceed with our regular learning program." },
      ] },
      { id: "s2", title: "Eligibility for Refunds", blocks: [
        { p: "Refunds may be requested for eligible unused prepaid lesson hours within the active billing period." },
        { lead: "A refund may be granted under the following conditions:", items: [
          "A formal written refund request is submitted to our support team within 14 days of purchase or renewal.",
          "The requested refund applies only to unused prepaid hours that have not yet been delivered.",
          "In the event of teacher unsuitability, where an alternative instructor replacement or schedule adjustment cannot be arranged.",
          "Documented medical or personal emergencies that prevent the student from continuing lessons."
        ] },
        { p: "All refund requests are reviewed fairly by our administration team on a case-by-case basis." }
      ] },
      { id: "s3", title: "Non-Refundable Circumstances", blocks: [
        { lead: "Tuition fees are non-refundable in the following situations:", items: [
          "Completed lessons that have already been conducted and attended by the student.",
          "Missed classes or student no-shows without the mandatory 4-hour advance cancellation notice.",
          "Voluntarily discontinued packages after lessons have been fully utilized.",
          "Special promotional, deeply discounted, or customized bulk tuition packages explicitly marked as non-refundable upon purchase.",
          "Technical issues, power outages, or internet interruptions occurring on the student's end during scheduled class times."
        ] },
      ] },
      { id: "s4", title: "Class Cancellation and Rescheduling Policy", blocks: [
        { p: "We understand that unforeseen events arise. If a student is unable to attend a scheduled class, they may request to reschedule the lesson by notifying our support team or teacher at least 4 hours before the class begins." },
        { p: "Classes cancelled with at least 4 hours prior notice will be preserved as makeup lesson credits and rescheduled at a mutually agreeable time within the current billing cycle." },
        { p: "Cancellations made with less than 4 hours notice, or missed lessons where the student fails to join without prior notification, are counted as delivered and cannot be refunded or rescheduled." },
      ] },
      { id: "s5", title: "Teacher Unavailability & Cancelled Classes", blocks: [
        { p: "If an assigned teacher is unable to attend a scheduled class due to illness or emergency, Yaqeen Institute will either arrange a qualified substitute instructor or provide a full makeup class at your convenience." },
        { p: "If Yaqeen Institute is unable to deliver a scheduled lesson or provide a suitable replacement, a full credit or refund for that specific class will be provided." },
      ] },
      { id: "s6", title: "Refund Calculation and Pro-Rata Deductions", blocks: [
        { p: "When an eligible refund is approved for a package, the refund amount is calculated based on the pro-rata balance of remaining unused lessons minus any applicable standard transaction fees." },
        { p: "If a package included discounts or bundled pricing, completed lessons will be calculated at the standard hourly rate when determining the remaining refund amount." },
      ] },
      { id: "s7", title: "Payment Processing & Timeline", blocks: [
        { p: "Once an eligible refund request is approved, the refund will be initiated within 3 to 5 business days." },
        { p: "Refunds are processed back to the original payment method (Credit/Debit Card, Stripe, PayPal, or Bank Transfer) used during the initial transaction." },
        { p: "Depending on your financial institution or card issuer, it may take 5 to 10 additional business days for the funds to reflect in your account statement." },
      ] },
      { id: "s8", title: "Subscription Cancellations", blocks: [
        { p: "Monthly recurring tuition plans may be cancelled at any time before the next billing date by contacting our support team." },
        { p: "Upon cancellation, no further charges will be incurred, and you may continue attending any remaining prepaid lessons through the end of the current billing period." },
      ] },
      { id: "s9", title: "Policy Amendments", blocks: [
        { p: "Yaqeen Institute reserves the right to modify or update this Refund Policy at any time. Changes become effective upon publication on this page with an updated revision date." },
      ] },
    ],
    contact: {
      heading: "Refund Inquiries & Support",
      intro: "To request a refund or discuss your tuition account, please reach out to our administration team:",
      name: "Yaqeen Institute Support",
      address: ["128, City Road", "London, EC1V 2NX", "United Kingdom"],
      phone: "+44 7700 183483",
      email: "support@yaqeeninstitute.online",
      note: "Please include your student name, registered email address, and reason for the refund request so our team can assist you quickly.",
    },
    updated: "September 2026",
  },

  // ------------------------------------------------------------------ COOKIES
  cookies: {
    hero: {
      badge: "Cookies Policy",
      title: "How We Use Cookies at",
      title_highlight: "Yaqeen Institute",
      description:
        "Learn about the cookies and tracking technologies we use to provide, secure, and enhance our learning platform.",
    },
    intro: [
      'Welcome to Yaqeen Institute ("Yaqeen Institute," "we," "our," or "us"). This Cookies Policy explains what cookies and similar tracking technologies are, how we use them on our website (https://yaqeeninstitute.online), and how you can manage your cookie preferences.',
      "We respect your privacy and strive to be completely transparent about the technologies we employ to deliver a secure, fast, and personalized educational experience.",
      "By using our website, you agree to the use of cookies in accordance with this policy and our Privacy Policy.",
    ],
    sections: [
      { id: "s1", title: "What Are Cookies?", blocks: [
        { p: "Cookies are small text files that are downloaded to your computer, tablet, or mobile device when you visit a website. They allow the website to recognize your device, remember your preferences, and maintain session state across page navigations." },
        { lead: "Cookies can be categorized by duration:", defs: [
          { term: "Session Cookies:", text: "Temporary cookies that remain in your browser until you close your window. They are essential for navigating our website and staying logged in." },
          { term: "Persistent Cookies:", text: "Cookies that remain stored on your device for a predetermined period or until manually deleted, helping us remember your return visits and saved preferences." },
        ] },
      ] },
      { id: "s2", title: "Categories of Cookies We Use", blocks: [
        { p: "Yaqeen Institute uses both first-party and third-party cookies for several functional, analytical, and security purposes." },
        { lead: "The primary categories of cookies used include:", items: [
          "Strictly Necessary Cookies: Essential for basic website operation, security, and authentication.",
          "Performance & Analytics Cookies: Help us understand how visitors interact with our website to improve usability.",
          "Functionality & Preference Cookies: Remember your choices such as language, timezone, and layout preferences.",
          "Security & Fraud Prevention Cookies: Detect unauthorized login attempts and maintain administrative platform integrity."
        ] },
      ] },
      { id: "s3", title: "Strictly Necessary Cookies", blocks: [
        { p: "These cookies are indispensable for our website to function properly. Without these cookies, services like student registration, admin authentication, secure contact forms, and class bookings cannot be provided." },
        { lead: "Examples of strictly necessary cookies on our platform:", items: [
          "Authentication tokens that keep administrative and student sessions securely logged in.",
          "CSRF tokens and security cookies that protect against malicious form submissions.",
          "Load balancing and routing cookies that distribute traffic evenly across our cloud servers."
        ] },
      ] },
      { id: "s4", title: "Performance and Analytics Cookies", blocks: [
        { p: "We use anonymous analytics tools (such as privacy-friendly web analytics and aggregated performance metrics) to evaluate website traffic, popular course pages, and user engagement." },
        { p: "These cookies collect aggregated, non-personally identifiable information. They help us understand which pages are most useful, measure page load speeds, and identify broken links or navigation issues." },
      ] },
      { id: "s5", title: "Functionality and Preference Cookies", blocks: [
        { p: "Functionality cookies enable our website to remember choices you make, providing a more personalized experience." },
        { lead: "These cookies may store:", items: [
          "Your selected preferred language or country region.",
          "Course filter choices and sorting preferences.",
          "Chat widget open/closed state and interaction status.",
          "Accessibility preferences and display contrast settings."
        ] },
      ] },
      { id: "s6", title: "Third-Party Services & Integrations", blocks: [
        { p: "In order to deliver interactive features and secure communication, our website integrates trusted third-party providers who may also place cookies on your device." },
        { lead: "These integrations include:", items: [
          "Payment Processors (Stripe, PayPal) for encrypted checkout security and anti-fraud verification.",
          "Email & Communication Infrastructure (Brevo) for delivering confirmation emails and class reminders.",
          "Cloud Storage & Database (Supabase) for secure data persistence.",
          "Video Conferencing Tools (Zoom, Google Meet) for conducting online live classes."
        ] },
        { p: "We do not sell your personal browsing information to advertisers or permit third parties to track you across unrelated websites for advertising purposes." },
      ] },
      { id: "s7", title: "Managing Your Cookie Preferences", blocks: [
        { p: "Most web browsers automatically accept cookies, but you have the right and ability to accept, reject, or remove cookies at any time through your browser settings." },
        { lead: "You can configure cookie settings in popular browsers through the links below:", items: [
          "Google Chrome: Settings > Privacy and Security > Cookies and other site data",
          "Mozilla Firefox: Options > Privacy & Security > Cookies and Site Data",
          "Apple Safari: Preferences > Privacy > Block all cookies",
          "Microsoft Edge: Settings > Privacy, search, and services > Cookies and site permissions"
        ] },
        { p: "Please be aware that if you choose to block or delete strictly necessary cookies, some features of our website (such as login sessions and form submissions) may not function as intended." },
      ] },
      { id: "s8", title: "Updates to this Cookies Policy", blocks: [
        { p: "Yaqeen Institute may update this Cookies Policy from time to time to reflect technological changes, legal requirements, or improvements to our platform." },
        { p: 'Any revisions will be published on this page with an updated "Last Updated" date. We encourage you to review this page periodically.' },
      ] },
    ],
    contact: {
      heading: "Questions About Our Cookie Practices",
      intro: "If you have any questions or concerns regarding our use of cookies or tracking technologies, please contact us:",
      name: "Yaqeen Institute Data Protection",
      address: ["128, City Road", "London, EC1V 2NX", "United Kingdom"],
      phone: "+44 7700 183483",
      email: "privacy@yaqeeninstitute.online",
      note: "Our team will be glad to assist you with any privacy or cookie-related inquiries.",
    },
    updated: "September 2026",
  },
};

// ---------------------------------------------------------------------------
// Deep merge: DB content overrides defaults key-by-key. Once a page is saved,
// its row holds the full object, so the DB is source of truth; defaults only
// fill keys that are absent (forward-compatible when new fields are added).
// ---------------------------------------------------------------------------
function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function mergeDeep(def, over) {
  if (!isPlainObject(def)) {
    return over === undefined ? def : over;
  }
  const out = Array.isArray(def) ? [...def] : { ...def };
  const src = isPlainObject(over) ? over : {};
  for (const key of Object.keys(def)) {
    if (isPlainObject(def[key])) {
      out[key] = mergeDeep(def[key], src[key]);
    } else if (key in src && src[key] !== undefined && src[key] !== null) {
      out[key] = src[key];
    }
  }
  return out;
}

// Merge a single page's stored content over its defaults.
export function mergePageContent(slug, dbContent) {
  const def = PAGE_DEFAULTS[slug] || {};
  return mergeDeep(def, dbContent || {});
}

// Server-side: read one page's content row (merged with defaults).
export async function getPageContent(supabase, slug) {
  try {
    const { data } = await supabase
      .from("page_content")
      .select("content")
      .eq("id", slug)
      .maybeSingle();
    return mergePageContent(slug, data?.content);
  } catch {
    return PAGE_DEFAULTS[slug] || {};
  }
}

// Server-side: read every page's content (merged). Used by the admin editor.
export async function getAllPageContent(supabase) {
  const result = {};
  let rows = [];
  try {
    const { data } = await supabase.from("page_content").select("id, content");
    rows = data || [];
  } catch {
    rows = [];
  }
  const byId = {};
  for (const r of rows) byId[r.id] = r.content;
  for (const { slug } of PAGE_LIST) {
    result[slug] = mergePageContent(slug, byId[slug]);
  }
  return result;
}
