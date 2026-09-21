"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import RichTextEditor from "@/components/RichTextEditor";
import { htmlToText } from "@/lib/richtext";
import "./AdminSeo.css";

const swal = (o) => Swal.fire({ background: "#fdfcf9", color: "#2c251e", confirmButtonColor: "#8c5d31", ...o });

// character-count meter with recommended range
function Meter({ value, min, max }) {
  const len = (value || "").length;
  const state = len === 0 ? "empty" : len < min ? "low" : len > max ? "high" : "ok";
  return <span className={`aseo-meter ${state}`}>{len} chars {state === "high" ? "· too long" : state === "low" ? "· a bit short" : state === "ok" ? "· good" : ""}</span>;
}

export default function AdminSeo() {
  const [list, setList] = useState([]);
  const [pages, setPages] = useState({});
  const [siteUrl, setSiteUrl] = useState("");
  const [global, setGlobal] = useState({ title: "", description: "", keywords: "", favicon_url: "" });
  const [active, setActive] = useState("__global__");
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("aero_admin_token") : null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/seo-pages", { headers: { Authorization: `Bearer ${token()}` } });
        const data = await res.json();
        if (data.success) {
          setPages(data.pages || {});
          setList(data.list || []);
          setSiteUrl(data.siteUrl || "");
        }
        // global row (title/description/keywords/favicon)
        const { data: g } = await supabase
          .from("seo_settings")
          .select("title, description, keywords, favicon_url")
          .eq("id", "global")
          .maybeSingle();
        if (g) setGlobal({ title: g.title || "", description: g.description || "", keywords: g.keywords || "", favicon_url: g.favicon_url || "" });
      } catch (err) {
        console.warn("SEO load failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectRow = (key) => {
    const go = () => {
      setActive(key);
      setDraft(key === "__global__" ? null : { ...pages[key] });
      setDirty(false);
    };
    if (dirty) {
      swal({ title: "Unsaved changes", text: "Switch and discard your edits?", icon: "warning", showCancelButton: true, confirmButtonText: "Discard", confirmButtonColor: "#c0392b" }).then((r) => { if (r.isConfirmed) go(); });
      return;
    }
    go();
  };

  const setField = (f, v) => { setDraft((d) => ({ ...d, [f]: v })); setDirty(true); };

  const savePage = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ key: active, seo: { ...draft, description: htmlToText(draft.description) } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed.");
      setPages((p) => ({ ...p, [active]: data.seo }));
      setDraft({ ...data.seo });
      setDirty(false);
      swal({ icon: "success", title: "Saved!", text: "Page SEO updated.", timer: 1300, showConfirmButton: false });
    } catch (err) {
      swal({ icon: "error", title: "Failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const saveGlobal = async () => {
    setSaving(true);
    try {
      // Global meta + favicon on seo_settings, and canonical site URL via API.
      const { error } = await supabase.from("seo_settings").upsert({
        id: "global",
        title: global.title,
        description: htmlToText(global.description),
        keywords: global.keywords,
        favicon_url: global.favicon_url || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await fetch("/api/admin/seo-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ siteUrl }),
      });
      setDirty(false);
      swal({ icon: "success", title: "Saved!", text: "Global SEO & site URL updated.", timer: 1300, showConfirmButton: false });
    } catch (err) {
      swal({ icon: "error", title: "Failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const uploadFavicon = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `favicons/favicon_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      setGlobal((g) => ({ ...g, favicon_url: data.publicUrl }));
      setDirty(true);
      swal({ icon: "success", title: "Favicon uploaded", text: "Click Save to apply.", timer: 1400, showConfirmButton: false });
    } catch (err) {
      swal({ icon: "error", title: "Upload failed", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const generateSitemap = async () => {
    const { value: url } = await swal({
      title: "Generate XML Sitemap",
      text: "Enter your live website domain:",
      input: "text",
      inputValue: siteUrl || (typeof window !== "undefined" ? window.location.origin : ""),
      showCancelButton: true,
      confirmButtonText: "Generate",
      inputValidator: (v) => (!v ? "URL required" : !/^https?:\/\//i.test(v) ? "Must start with http(s)://" : undefined),
    });
    if (!url) return;
    try {
      const res = await fetch("/api/admin/generate-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ siteUrl: url }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed.");
      swal({ icon: "success", title: "Sitemap generated", text: `${data.urlCount} URLs written to /sitemap.xml` });
    } catch (err) {
      swal({ icon: "error", title: "Failed", text: err.message });
    }
  };

  const activeLabel = useMemo(() => (list.find((p) => p.key === active) || {}).label || "", [list, active]);
  const base = (siteUrl || "https://yaqeeninstitute.online").replace(/\/$/, "");

  if (loading) return <div className="aseo-loading">Loading SEO settings…</div>;

  return (
    <div className="aseo-wrap">
      {/* sub-menu */}
      <aside className="aseo-side">
        <div className="aseo-side-title">Pages</div>
        <button className={`aseo-side-item ${active === "__global__" ? "active" : ""}`} onClick={() => selectRow("__global__")}>
          🌐 Global &amp; Site URL
        </button>
        <div className="aseo-side-sep" />
        {list.map((p) => (
          <button key={p.key} className={`aseo-side-item ${active === p.key ? "active" : ""}`} onClick={() => selectRow(p.key)}>
            {p.label}
            {dirty && active === p.key && <span className="aseo-dot" />}
          </button>
        ))}
      </aside>

      {/* editor */}
      <section className="aseo-editor">
        {active === "__global__" ? (
          <>
            <div className="aseo-head">
              <div><h3>Global &amp; Site URL</h3><p>Site-wide fallback meta, favicon, and the canonical domain used for all page URLs.</p></div>
              <button className="aseo-save" onClick={saveGlobal} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>

            <label className="aseo-lbl">Canonical Site URL <span className="aseo-hint">(used for canonical tags &amp; sitemap)</span></label>
            <input className="aseo-input" value={siteUrl} placeholder="https://yaqeeninstitute.online" onChange={(e) => { setSiteUrl(e.target.value); setDirty(true); }} />

            <label className="aseo-lbl">Default Meta Title</label>
            <input className="aseo-input" value={global.title} onChange={(e) => { setGlobal((g) => ({ ...g, title: e.target.value })); setDirty(true); }} />

            <label className="aseo-lbl">Default Meta Description</label>
            <RichTextEditor value={global.description} onChange={(html) => { setGlobal((g) => ({ ...g, description: html })); setDirty(true); }} placeholder="Site-wide fallback description…" minHeight="90px" />

            <label className="aseo-lbl">Default Keywords</label>
            <input className="aseo-input" value={global.keywords} onChange={(e) => { setGlobal((g) => ({ ...g, keywords: e.target.value })); setDirty(true); }} />

            <div className="aseo-fav-row">
              <div style={{ flex: 1 }}>
                <label className="aseo-lbl">Favicon URL</label>
                <input className="aseo-input" value={global.favicon_url} placeholder="https://…/favicon.ico" onChange={(e) => { setGlobal((g) => ({ ...g, favicon_url: e.target.value })); setDirty(true); }} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="aseo-lbl">Or upload favicon</label>
                <input className="aseo-input" type="file" accept=".ico,.png,.jpg,.jpeg,.svg" onChange={uploadFavicon} disabled={saving} />
              </div>
              {global.favicon_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={global.favicon_url} alt="favicon" className="aseo-fav-preview" />
              )}
            </div>

            <div className="aseo-foot">
              <button className="aseo-ghost" onClick={generateSitemap}>🗺️ Generate Sitemap</button>
              <button className="aseo-save" onClick={saveGlobal} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </>
        ) : draft ? (
          <>
            <div className="aseo-head">
              <div><h3>{activeLabel} — SEO</h3><p>Meta tags for this page. Leave blank to use the global defaults.</p></div>
              <button className="aseo-save" onClick={savePage} disabled={saving || !dirty}>{saving ? "Saving…" : dirty ? "Save Changes" : "Saved"}</button>
            </div>

            {/* Google preview */}
            <div className="aseo-serp">
              <div className="aseo-serp-url">{base}{draft.slug || "/"}</div>
              <div className="aseo-serp-title">{draft.title || "Page title will appear here"}</div>
              <div className="aseo-serp-desc">{htmlToText(draft.description) || "The meta description that search engines show goes here."}</div>
            </div>

            <label className="aseo-lbl">URL Slug <span className="aseo-hint">(canonical path, e.g. /about)</span></label>
            <input className="aseo-input" value={draft.slug || ""} onChange={(e) => setField("slug", e.target.value)} placeholder="/about" />

            <div className="aseo-lbl-row">
              <label className="aseo-lbl">Meta Title</label>
              <Meter value={draft.title} min={30} max={60} />
            </div>
            <input className="aseo-input" value={draft.title || ""} onChange={(e) => setField("title", e.target.value)} />

            <div className="aseo-lbl-row">
              <label className="aseo-lbl">Meta Description</label>
              <Meter value={htmlToText(draft.description)} min={70} max={160} />
            </div>
            <RichTextEditor value={draft.description || ""} onChange={(html) => setField("description", html)} placeholder="The description search engines show…" minHeight="90px" />

            <label className="aseo-lbl">Keywords <span className="aseo-hint">(comma separated)</span></label>
            <input className="aseo-input" value={draft.keywords || ""} onChange={(e) => setField("keywords", e.target.value)} />

            <div className="aseo-foot">
              <button className="aseo-save" onClick={savePage} disabled={saving || !dirty}>{saving ? "Saving…" : dirty ? "Save Changes" : "Saved"}</button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
