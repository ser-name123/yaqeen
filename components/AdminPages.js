"use client";

import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import RichTextEditor from "@/components/RichTextEditor";
import { htmlToText } from "@/lib/richtext";
import "./AdminPages.css";

// Recursively convert any rich-editor HTML back to clean plain text.
// Page content renders as plain text across the site, so we store it plain
// even though it is edited in the rich editor.
function stripDeep(v) {
  if (typeof v === "string") return htmlToText(v);
  if (Array.isArray(v)) return v.map(stripDeep);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v)) out[k] = stripDeep(v[k]);
    return out;
  }
  return v;
}

// -------- helpers ---------------------------------------------------------
function humanize(key) {
  const withSpaces = String(key)
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// immutable set at a path like ["hero","title"] or ["faq","items",2,"answer"]
function setByPath(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  clone[head] = setByPath(obj?.[head], rest, value);
  return clone;
}

// build a blank template shaped like an existing value (for "add item")
function blankLike(value) {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return value.length ? [blankLike(value[0])] : [];
  if (isPlainObject(value)) {
    const out = {};
    for (const k of Object.keys(value)) out[k] = blankLike(value[k]);
    return out;
  }
  return "";
}

function isLongText(key, val) {
  return (val && val.length > 55) || /description|answer|subtitle|text|body|paragraph|intro|content|desc|lead|essay|quote/i.test(key);
}

// -------- field renderer --------------------------------------------------
function Field({ keyName, value, path, onChange }) {
  // string / number leaf
  if (typeof value === "string" || typeof value === "number") {
    const long = typeof value === "string" && isLongText(keyName, value);
    return (
      <div className={`apg-field ${long ? "full" : ""}`}>
        <label className="apg-lbl">{humanize(keyName)}</label>
        {long ? (
          <RichTextEditor
            value={String(value)}
            onChange={(html) => onChange(path, html)}
            minHeight="90px"
          />
        ) : (
          <input
            className="apg-input"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        )}
      </div>
    );
  }

  // array
  if (Array.isArray(value)) {
    const stringArray = value.length > 0 && value.every((v) => typeof v === "string");
    const move = (from, to) => {
      if (to < 0 || to >= value.length) return;
      const arr = [...value];
      const [it] = arr.splice(from, 1);
      arr.splice(to, 0, it);
      onChange(path, arr);
    };
    const remove = (i) => onChange(path, value.filter((_, idx) => idx !== i));
    const add = () => {
      const template = value.length ? blankLike(value[value.length - 1]) : "";
      onChange(path, [...value, template]);
    };

    return (
      <div className="apg-array">
        <div className="apg-array-head">
          <span className="apg-array-title">{humanize(keyName)}</span>
          <button type="button" className="apg-add" onClick={add}>+ Add</button>
        </div>

        {value.length === 0 && <p className="apg-empty">No items yet. Click “Add”.</p>}

        {value.map((item, i) => (
          <div key={i} className={stringArray ? "apg-strrow" : "apg-card"}>
            {stringArray ? (
              <>
                <input
                  className="apg-input"
                  value={item}
                  onChange={(e) => onChange([...path, i], e.target.value)}
                />
                <div className="apg-row-actions">
                  <button type="button" onClick={() => move(i, i - 1)} title="Move up">↑</button>
                  <button type="button" onClick={() => move(i, i + 1)} title="Move down">↓</button>
                  <button type="button" className="del" onClick={() => remove(i)} title="Remove">✕</button>
                </div>
              </>
            ) : (
              <>
                <div className="apg-card-head">
                  <span className="apg-card-idx">#{i + 1}</span>
                  <div className="apg-row-actions">
                    <button type="button" onClick={() => move(i, i - 1)} title="Move up">↑</button>
                    <button type="button" onClick={() => move(i, i + 1)} title="Move down">↓</button>
                    <button type="button" className="del" onClick={() => remove(i)} title="Remove">✕ Remove</button>
                  </div>
                </div>
                <div className="apg-grid">
                  {isPlainObject(item) ? (
                    Object.keys(item).map((k) => (
                      <Field key={k} keyName={k} value={item[k]} path={[...path, i, k]} onChange={onChange} />
                    ))
                  ) : (
                    <Field keyName={`Item ${i + 1}`} value={item} path={[...path, i]} onChange={onChange} />
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // object (nested group)
  if (isPlainObject(value)) {
    return (
      <div className="apg-group">
        <h4 className="apg-group-title">{humanize(keyName)}</h4>
        <div className="apg-grid">
          {Object.keys(value).map((k) => (
            <Field key={k} keyName={k} value={value[k]} path={[...path, k]} onChange={onChange} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// -------- main component --------------------------------------------------
export default function AdminPages() {
  const [pages, setPages] = useState({});
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("aero_admin_token") : null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/pages", { headers: { Authorization: `Bearer ${token()}` } });
        const data = await res.json();
        if (data.success) {
          setPages(data.pages || {});
          setList(data.list || []);
          const first = (data.list || [])[0]?.slug;
          if (first) {
            setActive(first);
            setDraft(data.pages[first]);
          }
        }
      } catch (err) {
        console.warn("Failed to load page content:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectPage = (slug) => {
    if (dirty) {
      Swal.fire({
        title: "Unsaved changes",
        text: "Switch page and discard your edits?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Discard",
        confirmButtonColor: "#c0392b",
        background: "#fdfcf9",
        color: "#2c251e",
      }).then((r) => {
        if (r.isConfirmed) {
          setActive(slug);
          setDraft(pages[slug]);
          setDirty(false);
        }
      });
      return;
    }
    setActive(slug);
    setDraft(pages[slug]);
  };

  const onChange = (path, value) => {
    setDraft((d) => setByPath(d, path, value));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ slug: active, content: stripDeep(draft) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed.");
      setPages((p) => ({ ...p, [active]: data.content }));
      setDraft(data.content);
      setDirty(false);
      Swal.fire({ icon: "success", title: "Saved!", text: "Page content updated.", timer: 1400, showConfirmButton: false, background: "#fdfcf9", color: "#2c251e" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message, background: "#fdfcf9", color: "#2c251e" });
    } finally {
      setSaving(false);
    }
  };

  const activeLabel = useMemo(() => list.find((p) => p.slug === active)?.label || "", [list, active]);

  if (loading) return <div className="apg-loading">Loading page content…</div>;

  return (
    <div className="apg-wrap">
      {/* sub-menu of pages */}
      <aside className="apg-side">
        <div className="apg-side-title">Pages</div>
        {list.map((p) => (
          <button
            key={p.slug}
            className={`apg-side-item ${active === p.slug ? "active" : ""}`}
            onClick={() => selectPage(p.slug)}
          >
            {p.label}
            {dirty && active === p.slug && <span className="apg-dot" title="Unsaved" />}
          </button>
        ))}
      </aside>

      {/* editor */}
      <section className="apg-editor">
        {draft ? (
          <>
            <div className="apg-editor-head">
              <div>
                <h3>{activeLabel} Page</h3>
                <p>Edit the text below. Changes go live on the {activeLabel.toLowerCase()} page after saving.</p>
              </div>
              <button className="apg-save" onClick={save} disabled={saving || !dirty}>
                {saving ? "Saving…" : dirty ? "Save Changes" : "Saved"}
              </button>
            </div>

            <div className="apg-body">
              {Object.keys(draft).map((k) => (
                <Field key={k} keyName={k} value={draft[k]} path={[k]} onChange={onChange} />
              ))}
            </div>

            <div className="apg-foot">
              <button className="apg-save" onClick={save} disabled={saving || !dirty}>
                {saving ? "Saving…" : dirty ? "Save Changes" : "Saved"}
              </button>
            </div>
          </>
        ) : (
          <p className="apg-empty">Select a page from the left to edit.</p>
        )}
      </section>
    </div>
  );
}
