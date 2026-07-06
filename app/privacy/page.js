import "./privacy.css";
import PrivacyToc from "./PrivacyToc";

export const metadata = {
  title: "Privacy Policy — Yaqeen Institute",
  description: "How Yaqeen Institute collects, uses, and protects your personal information."
};

const INTRO = [
  'Welcome to Yaqeen Institute ("Yaqeen Institute," "we," "our," or "us"). We are committed to respecting your privacy and protecting the personal information you provide while using our website and educational services. This Privacy Policy explains what information we collect, how we use it, how we safeguard it, and the choices available to you regarding your personal data.',
  "This Privacy Policy applies solely to information collected through the official Yaqeen Institute website and the online services we provide. It does not apply to websites, services, or organizations that are not owned, operated, or controlled by Yaqeen Institute.",
  "Please note that any information you voluntarily make available in public areas of our website or online communities may be visible to others and may not be protected as private information under this Policy.",
  "By accessing our website, registering for our courses, or using any of our services, you acknowledge that you have read, understood, and accepted the terms of this Privacy Policy."
];

const SECTIONS = [
  {
    id: "s1", title: "Information We Collect", blocks: [
      { p: "To provide high-quality educational services, Yaqeen Institute collects certain information during registration, enrolment, and throughout your learning experience." },
      { lead: "The information we collect may include:", items: [
        "Full name of the student and parent/guardian (where applicable)", "Email address", "Mobile or telephone number", "Country of residence", "Student's age or age group", "Educational background", "Quran learning level", "Arabic language proficiency", "Course preferences and learning objectives", "Class schedules and attendance records"
      ] },
      { p: "When you contact us through our website, email, WhatsApp, telephone, or contact forms, we may collect the information you voluntarily provide, including your messages, inquiries, attachments, and any supporting documents required to assist you." },
      { p: "Where payments are required, certain billing information may also be collected through our secure payment partners to process your enrolment." },
      { p: "To maintain educational quality, improve teaching standards, and support teacher development, online classes may be recorded. These recordings are securely stored and accessed only by authorized personnel for quality assurance, teacher evaluation, dispute resolution, and internal training purposes." },
      { p: "Yaqeen Institute does not knowingly collect personal information directly from children who are below the minimum legal age to provide consent independently. Students under the applicable age must always be registered by their parent or legal guardian." },
      { p: "If we discover that personal information has been submitted by a child without appropriate parental authorization, we will take reasonable steps to remove that information from our systems." },
      { p: "If you believe that a child has provided personal information without your consent, please contact us immediately so that appropriate action can be taken." }
    ]
  },
  {
    id: "s2", title: "How We Use Your Information", blocks: [
      { p: "The information collected allows Yaqeen Institute to provide efficient, secure, and personalized educational services." },
      { lead: "Your information may be used to:", items: [
        "Create and manage your student account.", "Process registrations and enrolments.", "Arrange trial classes and regular lessons.", "Schedule teachers and class timings.", "Monitor student progress.", "Provide educational support.", "Respond to questions and customer service requests.", "Send class reminders and scheduling notifications.", "Process payments and issue invoices.", "Improve course quality and teaching methods.", "Enhance website functionality and user experience.", "Inform you about new courses, educational resources, promotions, or important announcements."
      ] },
      { p: "We may also analyse anonymous usage data to better understand how students and visitors interact with our website. This information helps us improve our services, educational content, website performance, and overall learning experience." },
      { p: "You may unsubscribe from promotional communications at any time; however, important service-related communications will continue to be sent whenever necessary for the administration of your account or classes." }
    ]
  },
  {
    id: "s3", title: "Email and Other Communications", blocks: [
      { lead: "Yaqeen Institute may communicate with students and parents through various official communication channels, including:", items: [
        "Email", "WhatsApp", "SMS", "Telephone", "Video conferencing platforms", "Other digital messaging services"
      ] },
      { lead: "These communications may include:", items: [
        "Class confirmations", "Timetable updates", "Payment reminders", "Academic progress reports", "Technical support", "Service announcements", "New course information", "Promotional offers", "Institute news and updates"
      ] },
      { p: "Marketing communications are intended to provide useful information about our educational services and are not based on behavioural profiling or targeted advertising." },
      { p: "You may choose to stop receiving promotional communications at any time by following the unsubscribe instructions included in our emails or by contacting our support team directly." },
      { p: "To improve communication quality, we may monitor general engagement metrics such as email delivery, open rates, and message performance. These analytics are used solely to improve our communications and are not used to make automated decisions about individual users." }
    ]
  },
  {
    id: "s4", title: "Cookies and Tracking Technologies", blocks: [
      { p: "Yaqeen Institute uses cookies and similar technologies to improve the functionality, performance, and overall user experience of our website. Cookies are small text files stored on your device that help us recognize your browser, remember your preferences, and provide a smoother browsing experience during future visits." },
      { lead: "These technologies may be used to:", items: [
        "Remember your login sessions and user preferences.", "Save language or display settings.", "Improve website speed and usability.", "Analyse website traffic and visitor behaviour.", "Identify technical issues and improve website performance.", "Enhance security by detecting suspicious or fraudulent activity.", "Support essential website features and learning functionality."
      ] },
      { p: "We may also use trusted analytics services, such as Google Analytics or similar tools, to collect anonymous information regarding website usage. This may include pages visited, time spent on the website, navigation patterns, and device information. The information collected through these services does not personally identify individual users and is used solely to improve our website and educational services." },
      { p: "Most web browsers automatically accept cookies; however, you may choose to modify your browser settings to refuse or remove cookies at any time. Please note that disabling cookies may affect certain website features and reduce the overall functionality of your browsing experience." }
    ]
  },
  {
    id: "s5", title: "Payment Information", blocks: [
      { p: "Yaqeen Institute offers secure online payment methods for course enrolment and subscription packages. Payments may be processed through trusted third-party payment providers that support credit cards, debit cards, digital wallets, bank transfers, or other available payment methods." },
      { p: "For your security, Yaqeen Institute does not store your complete debit card or credit card details on its own servers. All payment transactions are processed using encrypted connections through certified payment gateways that comply with applicable security standards." },
      { lead: "Payment information is used solely for purposes such as:", items: [
        "Processing course fees.", "Managing subscriptions.", "Issuing invoices and payment confirmations.", "Processing eligible refunds.", "Preventing fraudulent transactions.", "Maintaining accurate financial records."
      ] },
      { p: "We encourage users to review the privacy and security policies of any third-party payment provider used during the payment process." }
    ]
  },
  {
    id: "s6", title: "Data Sharing and Third-Party Services", blocks: [
      { p: "Yaqeen Institute values your privacy and does not sell, rent, or trade your personal information to advertisers or unrelated third parties." },
      { lead: "However, certain information may be shared with carefully selected service providers where necessary to operate our educational services effectively. These may include:", items: [
        "Secure payment processors.", "Cloud hosting providers.", "Video conferencing platforms.", "Learning management systems.", "Email and communication service providers.", "Technical support partners.", "Internal staff responsible for student administration, academic support, and customer service."
      ] },
      { p: "All third-party service providers are required to handle personal information securely and only for the specific purposes authorized by Yaqeen Institute." },
      { p: "We may also disclose personal information when required by applicable law, court order, government authority, or where disclosure is necessary to protect our legal rights, prevent fraud, investigate security concerns, or comply with legal obligations." },
      { p: "Our website does not display third-party advertising, and we do not permit unrelated companies to use your information for independent marketing purposes." }
    ]
  },
  {
    id: "s7", title: "Data Storage and Security", blocks: [
      { p: "Protecting your personal information is one of our highest priorities. Yaqeen Institute implements appropriate technical, administrative, and organizational measures to safeguard your data against unauthorized access, misuse, alteration, disclosure, or loss." },
      { lead: "Our security measures may include:", items: [
        "Secure SSL/TLS encryption for website communications.", "Encrypted storage of sensitive information.", "Secure cloud-based infrastructure.", "Restricted access to personal data based on staff responsibilities.", "Password-protected administrative systems.", "Regular software updates and security monitoring.", "Internal staff training on data protection and privacy practices.", "Routine security assessments to maintain platform integrity."
      ] },
      { p: "Where lesson recordings are retained for educational quality assurance, they are securely stored and accessible only to authorized personnel." },
      { p: "Although we apply industry-standard security practices, no internet-based system can guarantee absolute security. Users are encouraged to protect their own devices, passwords, and internet connections while accessing our services." }
    ]
  },
  {
    id: "s8", title: "Data Retention", blocks: [
      { p: "Yaqeen Institute retains personal information only for as long as it is reasonably necessary to provide educational services, comply with legal obligations, resolve disputes, maintain accurate records, and improve our services." },
      { p: "Student records, attendance history, payment information, academic progress, and related account information may be retained for an appropriate period after an account becomes inactive or is closed." },
      { p: "Once personal information is no longer required for legitimate business or legal purposes, it will be securely deleted, anonymized, or archived in accordance with applicable data protection laws and our internal data management procedures." }
    ]
  },
  {
    id: "s9", title: "Your Rights and Choices", blocks: [
      { lead: "Yaqeen Institute respects your privacy rights and aims to provide you with reasonable control over your personal information. Subject to applicable data protection laws, you may have the right to:", items: [
        "Access the personal information we hold about you.", "Request correction of inaccurate or incomplete information.", "Update your account details at any time.", "Request the deletion of your personal information where legally permitted.", "Restrict or object to certain types of data processing.", "Request a copy of your personal information in a commonly used electronic format.", "Withdraw consent where processing is based on your consent.", "Opt out of receiving promotional communications while continuing to receive essential service-related notifications."
      ] },
      { p: "Parents or legal guardians may also request access to, correction of, or deletion of personal information relating to their child, subject to applicable legal requirements and verification procedures." },
      { p: "To exercise any of these rights, please contact Yaqeen Institute using the contact information provided at the end of this Privacy Policy. We will respond to your request within a reasonable timeframe and in accordance with applicable laws." }
    ]
  },
  {
    id: "s10", title: "Children's Privacy", blocks: [
      { p: "Yaqeen Institute is committed to protecting the privacy and safety of children who participate in our educational programs." },
      { p: "Students who are below the legal age required to provide independent consent must be registered by their parent or legal guardian. Parents or guardians are responsible for providing accurate registration information, supervising the student's participation where appropriate, and accepting this Privacy Policy on the student's behalf." },
      { p: "We do not knowingly collect personal information directly from children without the knowledge and consent of their parent or legal guardian." },
      { p: "If we become aware that personal information has been collected from a child without the required parental authorization, we will take reasonable steps to delete such information from our records as soon as practicable." },
      { p: "Parents and guardians may contact us at any time to review, update, or request the removal of their child's personal information, subject to applicable legal obligations." }
    ]
  },
  {
    id: "s11", title: "International Data Transfers", blocks: [
      { p: "As an online educational institution serving students worldwide, Yaqeen Institute may process or store personal information using secure systems located in different countries." },
      { p: "Whenever personal information is transferred internationally, we take appropriate measures to ensure that such transfers are protected by suitable technical, contractual, and organizational safeguards consistent with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR) and other relevant privacy legislation where applicable." },
      { p: "Our service providers are selected carefully and are expected to maintain appropriate standards for protecting personal information." }
    ]
  },
  {
    id: "s12", title: "Changes to this Privacy Policy", blocks: [
      { p: "Yaqeen Institute may revise or update this Privacy Policy from time to time to reflect changes in our educational services, website functionality, technology, legal obligations, or operational practices." },
      { p: 'Whenever significant changes are made, the revised Privacy Policy will be published on this page together with an updated "Last Updated" date.' },
      { p: "We encourage all students, parents, and website visitors to review this Privacy Policy periodically to remain informed about how we collect, use, and protect personal information." },
      { p: "Your continued use of our website or services after any updates become effective constitutes your acceptance of the revised Privacy Policy." }
    ]
  },
  {
    id: "s13", title: "Consent", blocks: [
      { p: "By accessing the Yaqeen Institute website, registering for our educational programs, booking trial classes, or using any of our online services, you acknowledge that you have read, understood, and agreed to this Privacy Policy." },
      { p: "Where required by applicable law, parents or legal guardians provide consent on behalf of students who are not legally permitted to provide independent consent." },
      { p: "If you do not agree with the terms of this Privacy Policy, you should discontinue the use of our website and services." }
    ]
  }
];

function Block({ block }) {
  if (block.items) {
    return (
      <>
        {block.lead && <p className="pp-lead">{block.lead}</p>}
        <ul className="pp-list">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </>
    );
  }
  return <p>{block.p}</p>;
}

export default function PrivacyPolicyPage() {
  const tocItems = [
    { id: "intro", label: "Overview" },
    ...SECTIONS.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: "s14", label: "14. Contact Information" }
  ];

  return (
    <main className="pp-page">
      {/* Hero */}
      <section className="pp-hero">
        <span className="pp-badge">Privacy Policy</span>
        <h1>Protecting Your Privacy at <span>Yaqeen Institute</span></h1>
        <p>Learn what information we collect, how we use and protect it, and the choices you have over your personal data.</p>
      </section>

      <div className="pp-layout">
        {/* Table of contents (with scroll-spy) */}
        <PrivacyToc items={tocItems} />

        {/* Content */}
        <article className="pp-content">
          <div id="intro" className="pp-section">
            {INTRO.map((p, i) => <p key={i} className={i === 0 ? "pp-lead" : ""}>{p}</p>)}
          </div>

          {SECTIONS.map((s, i) => (
            <section id={s.id} className="pp-section" key={s.id}>
              <h2><span className="num">{i + 1}.</span> {s.title}</h2>
              {s.blocks.map((b, bi) => <Block key={bi} block={b} />)}
            </section>
          ))}

          {/* Section 14: Contact */}
          <section id="s14" className="pp-section">
            <h2><span className="num">14.</span> Contact Information</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or the way Yaqeen Institute processes your personal information, please contact us using the details below:</p>
            <div className="pp-contact">
              <div className="name">Yaqeen Institute</div>
              <div>128, City Road</div>
              <div>London, EC1V 2NX</div>
              <div>United Kingdom</div>
              <div>Phone: <a href="tel:+447700183483">+44 7700 183483</a></div>
              <div>Email: <a href="mailto:support@yaqeeninstitute.com">support@yaqeeninstitute.com</a></div>
            </div>
            <p>Our team will make every reasonable effort to respond to your inquiry promptly and in accordance with applicable data protection laws.</p>
          </section>

          <p className="pp-updated"><b>Last Updated:</b> July 2026</p>
        </article>
      </div>
    </main>
  );
}
