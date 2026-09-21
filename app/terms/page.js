import "../privacy/privacy.css";
import PrivacyToc from "../privacy/PrivacyToc";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPageContent } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata(getSupabaseAdmin(), "terms");
}

export const dynamic = "force-dynamic";

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

export default async function TermsOfServicePage() {
  const c = await getPageContent(getSupabaseAdmin(), "terms");
  const sections = c.sections || [];
  const telHref = `tel:${(c.contact?.phone || "").replace(/[^\d+]/g, "")}`;

  const tocItems = [
    { id: "intro", label: "Overview" },
    ...sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: "contact", label: "Contact" }
  ];

  return (
    <main className="pp-page">
      {/* Hero */}
      <section className="pp-hero">
        <span className="pp-badge">{c.hero?.badge}</span>
        <h1>{c.hero?.title} <span>{c.hero?.title_highlight}</span></h1>
        <p>{c.hero?.description}</p>
      </section>

      <div className="pp-layout">
        {/* Table of contents (with scroll-spy) */}
        <PrivacyToc items={tocItems} />

        {/* Content */}
        <article className="pp-content">
          <div id="intro" className="pp-section">
            {(c.intro || []).map((p, i) => <p key={i} className="pp-lead">{p}</p>)}
          </div>

          {sections.map((s, i) => (
            <section id={s.id} className="pp-section" key={s.id || i}>
              <h2><span className="num">{i + 1}.</span> {s.title}</h2>
              {(s.blocks || []).map((b, bi) => <Block key={bi} block={b} />)}
            </section>
          ))}

          {/* Contact */}
          <section id="contact" className="pp-section">
            <h2>{c.contact?.heading || "Contact Us"}</h2>
            <p>{c.contact?.intro}</p>
            <div className="pp-contact">
              <div className="name">{c.contact?.name}</div>
              {(c.contact?.address || []).map((line, i) => <div key={i}>{line}</div>)}
              <div>Phone: <a href={telHref}>{c.contact?.phone}</a></div>
              <div>Email: <a href={`mailto:${c.contact?.email}`}>{c.contact?.email}</a></div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
