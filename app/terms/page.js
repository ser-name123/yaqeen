import "../privacy/privacy.css";
import PrivacyToc from "../privacy/PrivacyToc";

export const metadata = {
  title: "Terms of Service — Yaqeen Institute",
  description: "The terms governing your use of Yaqeen Institute's website, online classes, and educational services."
};

const INTRO = [
  'Welcome to Yaqeen Institute. These Terms of Service ("Terms") govern your access to and use of our website, online classes, and educational services. By registering for our courses, booking a trial class, or using our website, you agree to comply with these Terms. If you do not agree with any part of these Terms, please discontinue the use of our services.'
];

const SECTIONS = [
  {
    id: "s1", title: "Definitions", blocks: [
      { lead: "Throughout these Terms:", defs: [
        { term: "Institute", text: "refers to Yaqeen Institute." },
        { term: "Student", text: "means any person enrolled in our courses." },
        { term: "Parent/Guardian", text: "refers to the individual registering or supervising a minor." },
        { term: "Teacher", text: "means an instructor approved by Yaqeen Institute." },
        { term: "Services", text: "include online Quran classes, Tajweed, Hifz, Arabic Language, Islamic Studies, and related educational programs." },
        { term: "Website", text: "refers to all official Yaqeen Institute digital platforms." }
      ] }
    ]
  },
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
  { id: "s27", title: "Entire Agreement", blocks: [{ p: "These Terms of Service, together with our Privacy Policy and any other policies published by Yaqeen Institute, constitute the complete agreement between you and Yaqeen Institute regarding the use of our website and educational services. They supersede all previous verbal or written communications, understandings, or agreements relating to the same subject matter." }] }
];

function Block({ block }) {
  if (block.defs) {
    return (
      <>
        {block.lead && <p className="pp-lead">{block.lead}</p>}
        <ul className="pp-list">
          {block.defs.map((d, i) => <li key={i}><strong>{d.term}</strong> {d.text}</li>)}
        </ul>
      </>
    );
  }
  if (block.items) {
    return (
      <>
        {block.lead && <p className="pp-lead">{block.lead}</p>}
        <ul className="pp-list">{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
      </>
    );
  }
  return <p>{block.p}</p>;
}

export default function TermsOfServicePage() {
  const tocItems = [
    { id: "intro", label: "Overview" },
    ...SECTIONS.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: "contact", label: "Contact" }
  ];

  return (
    <main className="pp-page">
      {/* Hero */}
      <section className="pp-hero">
        <span className="pp-badge">Terms of Service</span>
        <h1>Learn with Confidence at <span>Yaqeen Institute</span></h1>
        <p>These Terms govern your access to and use of our website, online classes, and educational services.</p>
      </section>

      <div className="pp-layout">
        {/* Table of contents (with scroll-spy) */}
        <PrivacyToc items={tocItems} />

        {/* Content */}
        <article className="pp-content">
          <div id="intro" className="pp-section">
            {INTRO.map((p, i) => <p key={i} className="pp-lead">{p}</p>)}
          </div>

          {SECTIONS.map((s, i) => (
            <section id={s.id} className="pp-section" key={s.id}>
              <h2><span className="num">{i + 1}.</span> {s.title}</h2>
              {s.blocks.map((b, bi) => <Block key={bi} block={b} />)}
            </section>
          ))}

          {/* Contact */}
          <section id="contact" className="pp-section">
            <h2>Contact Us</h2>
            <p>For any questions regarding these Terms or our services, please contact:</p>
            <div className="pp-contact">
              <div className="name">Yaqeen Institute</div>
              <div>128, City Road, London, EC1V 2NX, United Kingdom</div>
              <div>Phone: <a href="tel:+447700183483">+44 7700 183483</a></div>
              <div>Email: <a href="mailto:support@yaqeeninstitute.com">support@yaqeeninstitute.com</a></div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
