"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import RichTextEditor from "@/components/RichTextEditor";
import { htmlToText } from "@/lib/richtext";
import "./AdminChat.css";

const token = () => { try { return localStorage.getItem("aero_admin_token"); } catch { return null; } };

function timeAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function AdminChat() {
  const [sessions, setSessions] = useState([]);
  const [active, setActive] = useState(null);       // session object
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const bodyRef = useRef(null);

  // ---- bot settings (welcome + Q&A) ----
  const [view, setView] = useState("chats");        // 'chats' | 'settings'
  const [cfg, setCfg] = useState({ welcome_message: "", assistant_name: "", assistant_status: "", prechat_title: "", prechat_subtitle: "", privacy_text: "", widget_logo_url: "" });
  const [qa, setQa] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [savingCfg, setSavingCfg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
        // keep the open conversation's status fresh (e.g. visitor ended the chat)
        setActive((a) => {
          if (!a) return a;
          const fresh = data.sessions.find((s) => s.id === a.id);
          return fresh ? { ...a, status: fresh.status } : a;
        });
      }
    } catch { /* ignore */ }
  }, []);

  async function deleteSession(id) {
    if (!confirm("Delete this conversation permanently? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/chat?sessionId=${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        if (active?.id === id) { setActive(null); setMessages([]); }
        loadSessions();
      }
    } catch { /* ignore */ }
  }

  const pillOf = (s) => s === "admin" ? { c: "human", t: "You joined" } : s === "ended" ? { c: "ended", t: "Ended" } : { c: "ai", t: "AI" };

  const openSession = useCallback(async (s) => {
    setActive(s);
    try {
      const res = await fetch(`/api/admin/chat?sessionId=${s.id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) { setMessages(data.messages); if (data.session) setActive(data.session); }
    } catch { /* ignore */ }
  }, []);

  /* poll the session list */
  useEffect(() => { loadSessions(); const t = setInterval(loadSessions, 8000); return () => clearInterval(t); }, [loadSessions]);

  /* realtime for the open conversation */
  useEffect(() => {
    if (!active?.id) return;
    const ch = supabase
      .channel(`admin-chat:${active.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${active.id}` },
        (payload) => {
          setMessages((prev) => prev.some((x) => x.id === payload.new.id) ? prev : [...prev, payload.new]);
        })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [active?.id]);

  useEffect(() => {
    requestAnimationFrame(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; });
  }, [messages]);

  const loadBot = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat-bot", { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        const c = data.config || {};
        setCfg({
          welcome_message: c.welcome_message || "",
          assistant_name: c.assistant_name || "",
          assistant_status: c.assistant_status || "",
          prechat_title: c.prechat_title || "",
          prechat_subtitle: c.prechat_subtitle || "",
          privacy_text: c.privacy_text || "",
          widget_logo_url: c.widget_logo_url || "",
        });
        setQa(data.qa || []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { if (view === "settings") loadBot(); }, [view, loadBot]);

  async function saveConfig() {
    setSavingCfg(true);
    try {
      await fetch("/api/admin/chat-bot", { method: "POST", headers: authHeaders(), body: JSON.stringify({ type: "config", config: { ...cfg, welcome_message: htmlToText(cfg.welcome_message) } }) });
    } catch { /* ignore */ }
    finally { setSavingCfg(false); }
  }

  async function uploadLogo(file) {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `chat-widget/logo_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      setCfg((c) => ({ ...c, widget_logo_url: data.publicUrl }));
    } catch (e) {
      alert("Logo upload failed: " + (e?.message || "please try again"));
    } finally { setUploadingLogo(false); }
  }

  async function saveQa(item) {
    if (!item.question?.trim() || !item.answer?.trim()) return;
    try {
      const clean = { ...item, answer: htmlToText(item.answer) };
      const res = await fetch("/api/admin/chat-bot", { method: "POST", headers: authHeaders(), body: JSON.stringify({ type: "qa", item: clean }) });
      const data = await res.json();
      if (data.success) { setEditItem(null); loadBot(); }
    } catch { /* ignore */ }
  }

  async function deleteQa(id) {
    if (!confirm("Delete this Q&A?")) return;
    try {
      await fetch(`/api/admin/chat-bot?id=${id}`, { method: "DELETE", headers: authHeaders() });
      loadBot();
    } catch { /* ignore */ }
  }

  async function sendReply() {
    const text = reply.trim();
    if (!text || !active || sending) return;
    setSending(true); setReply("");
    try {
      const res = await fetch("/api/admin/chat", { method: "POST", headers: authHeaders(), body: JSON.stringify({ sessionId: active.id, text }) });
      const data = await res.json();
      if (data.success) { setActive((a) => ({ ...a, status: "admin" })); loadSessions(); }
    } catch { /* ignore */ }
    finally { setSending(false); }
  }

  return (
    <div>
      <div className="ac-tabs">
        <button className={view === "chats" ? "active" : ""} onClick={() => setView("chats")}>💬 Conversations</button>
        <button className={view === "settings" ? "active" : ""} onClick={() => setView("settings")}>⚙️ Welcome &amp; AI Q&amp;A</button>
      </div>

      {view === "settings" ? (
        <div className="ac-settings glass-panel">
          {/* widget texts + welcome message */}
          <div className="ac-set-block">
            <h4>Chat widget texts</h4>
            <p className="ac-set-hint">These control what a visitor sees in the chat popup.</p>

            <label className="ac-lbl">Chat logo / avatar</label>
            <div className="ac-logo-row">
              <div className="ac-logo-preview">{cfg.widget_logo_url ? <img src={cfg.widget_logo_url} alt="logo" /> : "Y"}</div>
              <label className="ac-upload-btn">{uploadingLogo ? "Uploading…" : "Upload logo"}
                <input type="file" accept="image/*" hidden onChange={(e) => uploadLogo(e.target.files[0])} />
              </label>
              {cfg.widget_logo_url && <button type="button" className="ac-remove-btn" onClick={() => setCfg({ ...cfg, widget_logo_url: "" })}>Remove</button>}
            </div>
            <p className="ac-set-hint">A square image looks best. Leave empty to show the letter “Y”. Click “Save” below to apply.</p>

            <label className="ac-lbl">Assistant name (header title)</label>
            <input className="ac-set-input" value={cfg.assistant_name} onChange={(e) => setCfg({ ...cfg, assistant_name: e.target.value })} placeholder="Yaqeen Assistant" />

            <label className="ac-lbl">Status line (under the name)</label>
            <input className="ac-set-input" value={cfg.assistant_status} onChange={(e) => setCfg({ ...cfg, assistant_status: e.target.value })} placeholder="Online — we typically reply fast" />

            <label className="ac-lbl">Pre-chat heading</label>
            <input className="ac-set-input" value={cfg.prechat_title} onChange={(e) => setCfg({ ...cfg, prechat_title: e.target.value })} placeholder="Start a conversation" />

            <label className="ac-lbl">Pre-chat sub-text</label>
            <input className="ac-set-input" value={cfg.prechat_subtitle} onChange={(e) => setCfg({ ...cfg, prechat_subtitle: e.target.value })} placeholder="Please share your details so our team can assist you." />

            <label className="ac-lbl">Privacy line (below Start Chat)</label>
            <input className="ac-set-input" value={cfg.privacy_text} onChange={(e) => setCfg({ ...cfg, privacy_text: e.target.value })} placeholder="We use your details only to respond to your enquiry." />

            <label className="ac-lbl">Welcome message (first bot message after starting)</label>
            <p className="ac-set-hint">Keep the phrase “Assalamu Alaikum” to auto-add the visitor's name.</p>
            <RichTextEditor value={cfg.welcome_message} onChange={(html) => setCfg({ ...cfg, welcome_message: html })} placeholder="Assalamu Alaikum! How can we help you today?" minHeight="90px" />

            <button className="ac-save-btn" onClick={saveConfig} disabled={savingCfg}>{savingCfg ? "Saving…" : "Save widget texts"}</button>
          </div>

          {/* Q&A list */}
          <div className="ac-set-block">
            <div className="ac-set-head">
              <h4>AI Questions &amp; Answers</h4>
              <button className="ac-add-btn" onClick={() => setEditItem({ question: "", keywords: "", answer: "", is_suggestion: true, sort_order: (qa.length + 1) })}>+ Add Q&amp;A</button>
            </div>
            <p className="ac-set-hint">The bot answers using these first. Tick “Show as suggestion” to display it as a clickable chip on the website.</p>
            {qa.length === 0 && <div className="ac-empty">No Q&amp;A yet. Add one above.</div>}
            {qa.map((row) => (
              <div className="ac-qa-row" key={row.id}>
                <div className="ac-qa-main">
                  <div className="ac-qa-q">{row.question} {row.is_suggestion && <span className="ac-qa-chip">suggestion</span>}</div>
                  <div className="ac-qa-a">{row.answer}</div>
                  {row.keywords && <div className="ac-qa-kw">keywords: {row.keywords}</div>}
                </div>
                <div className="ac-qa-actions">
                  <button onClick={() => setEditItem(row)}>Edit</button>
                  <button className="del" onClick={() => deleteQa(row.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {editItem && (
            <div className="ac-modal-overlay" onClick={() => setEditItem(null)}>
              <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ac-modal-head"><span>{editItem.id ? "Edit Q&A" : "Add Q&A"}</span><button onClick={() => setEditItem(null)}>✕</button></div>
                <div className="ac-modal-body">
                  <label className="ac-lbl">Question (also shown as suggestion chip)</label>
                  <input className="ac-set-input" value={editItem.question} onChange={(e) => setEditItem({ ...editItem, question: e.target.value })} placeholder="e.g. Do you teach Quran?" />
                  <label className="ac-lbl">Answer</label>
                  <RichTextEditor value={editItem.answer} onChange={(html) => setEditItem({ ...editItem, answer: html })} placeholder="The bot's reply…" minHeight="110px" />
                  <label className="ac-lbl">Extra keywords (optional, space or comma separated)</label>
                  <input className="ac-set-input" value={editItem.keywords || ""} onChange={(e) => setEditItem({ ...editItem, keywords: e.target.value })} placeholder="quran tajweed hifz recitation" />
                  <div className="ac-set-row">
                    <label className="ac-check"><input type="checkbox" checked={editItem.is_suggestion !== false} onChange={(e) => setEditItem({ ...editItem, is_suggestion: e.target.checked })} /> Show as suggestion on website</label>
                    <label className="ac-order">Order <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: e.target.value })} /></label>
                  </div>
                  <button className="ac-save-btn" onClick={() => saveQa(editItem)}>{editItem.id ? "Update" : "Add"} Q&amp;A</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ac-wrap glass-panel">
      {/* sessions list */}
      <div className="ac-list">
        <div className="ac-list-head">Conversations <span>{sessions.length}</span></div>
        {sessions.length === 0 && <div className="ac-empty">No chats yet.</div>}
        {sessions.map((s) => (
          <div key={s.id} className={`ac-item ${active?.id === s.id ? "active" : ""}`} onClick={() => openSession(s)} role="button" tabIndex={0}>
            <div className="ac-item-top">
              <span className="ac-name">{s.name}</span>
              <span className="ac-time">{timeAgo(s.last_message_at)}</span>
            </div>
            <div className="ac-item-sub">
              <span className="ac-contact">{s.email}</span>
              <span className={`ac-pill ${pillOf(s.status).c}`}>{pillOf(s.status).t}</span>
            </div>
            <button className="ac-item-del" title="Delete conversation" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}>🗑</button>
          </div>
        ))}
      </div>

      {/* conversation */}
      <div className="ac-conv">
        {!active ? (
          <div className="ac-placeholder">Select a conversation to view and reply.</div>
        ) : (
          <>
            <div className="ac-conv-head">
              <div>
                <div className="ac-conv-name">{active.name}</div>
                <div className="ac-conv-meta">{active.email} · {active.mobile}</div>
              </div>
              <div className="ac-head-actions">
                <button className="ac-info-btn" onClick={() => setShowInfo(true)}>ℹ️ Visitor details</button>
                <button className="ac-info-btn del" onClick={() => deleteSession(active.id)}>🗑 Delete</button>
                <span className={`ac-pill ${pillOf(active.status).c}`}>
                  {active.status === "admin" ? "AI paused" : active.status === "ended" ? "Chat ended" : "AI answering"}
                </span>
              </div>
            </div>

            <div className="ac-body" ref={bodyRef}>
              {messages.map((m) => (
                <div key={m.id} className={`ac-msg ${m.sender}`}>
                  <div className="ac-msg-sender">{m.sender === "user" ? active.name : m.sender === "ai" ? "AI Assistant" : "You"}</div>
                  {m.text && <div className="ac-bubble">{m.text}</div>}
                  {m.audio_url && <audio className="ac-audio" controls src={m.audio_url} />}
                </div>
              ))}
            </div>

            {active.status === "ended" ? (
              <div className="ac-note ended">This chat was ended by the visitor.</div>
            ) : active.status !== "admin" ? (
              <div className="ac-note">Replying below will take over this chat and pause the AI for this visitor.</div>
            ) : null}
            {active.status !== "ended" && (
              <div className="ac-replybar">
                <input
                  className="ac-reply-input"
                  placeholder="Type your reply…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                />
                <button className="ac-reply-send" onClick={sendReply} disabled={sending || !reply.trim()}>{sending ? "…" : "Send"}</button>
              </div>
            )}

            {showInfo && (
              <div className="ac-modal-overlay" onClick={() => setShowInfo(false)}>
                <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="ac-modal-head">
                    <span>Visitor Details</span>
                    <button onClick={() => setShowInfo(false)}>✕</button>
                  </div>
                  <div className="ac-modal-body">
                    {[
                      ["Name", active.name],
                      ["Email", active.email],
                      ["Mobile", active.mobile],
                      ["IP Address", active.ip_address],
                      ["Location", [active.city, active.state, active.country].filter(Boolean).join(", ")],
                      ["Internet Provider", active.provider],
                      ["Device", active.device_type],
                      ["Browser", active.browser_info],
                      ["Operating System", active.system_info],
                      ["Language", active.language],
                      ["Timezone", active.timezone],
                      ["Screen", active.screen_size],
                      ["Page opened from", active.page_url],
                      ["Referrer", active.referrer],
                      ["Chat started", active.created_at ? new Date(active.created_at).toLocaleString() : ""],
                      ["User agent", active.user_agent],
                    ].map(([k, v]) => (
                      <div className="ac-info-row" key={k}>
                        <span className="ac-info-k">{k}</span>
                        <span className="ac-info-v">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
        </div>
      )}
    </div>
  );
}
