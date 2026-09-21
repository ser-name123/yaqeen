"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/settings-context";
import "./ChatWidget.css";

const LS_KEY = "yaqeen_chat_session";
const LS_TEASER = "yaqeen_chat_teaser_seen";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* gather whatever the browser will tell us about the visitor */
function collectClientMeta() {
  if (typeof window === "undefined") return {};
  const ua = navigator.userAgent || "";
  const browser =
    /edg/i.test(ua) ? "Edge" : /opr|opera/i.test(ua) ? "Opera" :
    /chrome|crios/i.test(ua) ? "Chrome" : /firefox|fxios/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) ? "Safari" : "Unknown browser";
  const os =
    /windows/i.test(ua) ? "Windows" : /android/i.test(ua) ? "Android" :
    /iphone|ipad|ipod/i.test(ua) ? "iOS" : /mac os/i.test(ua) ? "macOS" :
    /linux/i.test(ua) ? "Linux" : "Unknown OS";
  const device = /mobile|iphone|android/i.test(ua) ? "Mobile" : /ipad|tablet/i.test(ua) ? "Tablet" : "Desktop";
  return {
    user_agent: ua, browser_info: browser, system_info: os, device_type: device,
    language: navigator.language || "",
    timezone: (typeof Intl !== "undefined" && Intl.DateTimeFormat().resolvedOptions().timeZone) || "",
    screen_size: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    page_url: window.location.href, referrer: document.referrer || "Direct",
  };
}

/* soft notification chime (no asset needed) */
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine"; o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.36);
    o.onended = () => ctx.close();
  } catch { /* ignore */ }
}

const fmtTime = (ts) => { try { return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); } catch { return ""; } };
const renderText = (text) => String(text).split(/(https?:\/\/[^\s]+)/g).map((p, i) =>
  /^https?:\/\//.test(p) ? <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p}</a> : p);

/* ---- icons ---- */
const IChat = () => (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const IClose = () => (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const ISend = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const IMic = ({ on }) => (<svg viewBox="0 0 24 24" width="20" height="20" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>);
const ISpeaker = ({ on }) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="4 9 8 9 13 5 13 19 8 15 4 15 4 9"/>{on ? (<><path d="M16 8.5a4.5 4.5 0 0 1 0 7"/><path d="M18.5 6a8 8 0 0 1 0 12"/></>) : (<><line x1="17" y1="9" x2="21" y2="15"/><line x1="21" y1="9" x2="17" y2="15"/></>)}</svg>);
const IWhatsApp = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.031 2c-5.517 0-9.993 4.476-9.993 9.993 0 1.763.459 3.479 1.332 4.996l-1.37 5.007 5.128-1.346a9.92 9.92 0 0 0 4.903 1.328h.005c5.515 0 9.991-4.476 9.991-9.993 0-2.674-1.042-5.188-2.932-7.078-1.89-1.89-4.405-2.932-7.076-2.932zm4.904 13.064c-.269.761-1.385 1.4-1.9 1.452-.464.048-.7.218-2.783-.628-2.148-.872-3.486-3.08-3.593-3.223-.107-.143-.872-1.161-.872-2.213 0-1.052.554-1.57.751-1.782.197-.213.43-.269.574-.269.143 0 .287.005.412.011.127.005.297-.048.464.356.172.417.59 1.439.64 1.543.053.104.088.228.018.368-.07.139-.105.228-.21.35-.105.122-.22.274-.315.374-.105.109-.215.228-.093.439.122.21.541.893 1.157 1.442.795.707 1.463.926 1.667 1.03.205.104.325.088.446-.053.122-.143.522-.607.662-.813.14-.205.281-.172.473-.101.192.071 1.221.576 1.43.681.21.104.35.156.402.246.053.09.053.522-.216 1.283z"/></svg>);
const ICal = () => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IMore = () => (<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>);
const IEnd = () => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [formErr, setFormErr] = useState("");
  const [starting, setStarting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unread, setUnread] = useState(0);
  const [teaser, setTeaser] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ui, setUi] = useState({
    assistant_name: "Yaqeen Assistant",
    assistant_status: "Online — we typically reply fast",
    prechat_title: "Start a conversation",
    prechat_subtitle: "Please share your details so our team can assist you.",
    privacy_text: "We use your details only to respond to your enquiry.",
    widget_logo_url: "",
  });
  const avatarInner = () => ui.widget_logo_url
    ? <img className="cw-av-img" src={ui.widget_logo_url} alt="" />
    : "Y";

  const bodyRef = useRef(null);
  const recogRef = useRef(null);
  const spokenRef = useRef(new Set());
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);

  const { contactPhone } = useSettings();
  const waDigits = (contactPhone || "+44 7700 183483").replace(/[^\d]/g, "");
  const waLink = `https://wa.me/${waDigits}`;

  /* restore an existing session on mount */
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(LS_KEY); } catch { saved = null; }
    if (saved) setSessionId(saved);
  }, []);

  /* teaser bubble a few seconds after load (once) */
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(LS_TEASER) === "1"; } catch { seen = false; }
    if (seen) return;
    const t = setTimeout(() => { if (!openRef.current) setTeaser(true); }, 5000);
    return () => clearTimeout(t);
  }, []);

  /* load suggestion chips + admin-editable widget texts */
  useEffect(() => {
    fetch("/api/chat/suggestions").then((r) => r.json()).then((d) => {
      if (d?.suggestions) setSuggestions(d.suggestions);
      if (d?.ui) setUi((prev) => ({ ...prev, ...d.ui }));
    }).catch(() => {});
  }, []);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; });
  }, []);

  /* load history + subscribe to realtime whenever we have a session */
  useEffect(() => {
    if (!sessionId) return;
    let active = true;

    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("id, sender, text, audio_url, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (active && data) { setMessages(data); scrollDown(); }
    })();

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const m = payload.new;
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            const withoutTemp = prev.filter((x) => !(x.id?.toString().startsWith("temp-") && x.sender === "user" && x.text === m.text));
            return [...withoutTemp, m];
          });
          if (m.sender === "ai" || m.sender === "admin") {
            setAiTyping(false);
            if (!openRef.current) { setUnread((u) => u + 1); playChime(); }
          }
          scrollDown();
        })
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [sessionId, scrollDown]);

  /* speak new AI/admin messages when the speaker is on */
  useEffect(() => {
    if (!speak || typeof window === "undefined" || !window.speechSynthesis) return;
    const last = messages[messages.length - 1];
    if (!last || (last.sender !== "ai" && last.sender !== "admin") || !last.text) return;
    if (spokenRef.current.has(last.id)) return;
    spokenRef.current.add(last.id);
    const u = new SpeechSynthesisUtterance(last.text);
    u.rate = 1; u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [messages, speak]);

  const openChat = () => {
    setOpen(true); setUnread(0); setTeaser(false);
    try { localStorage.setItem(LS_TEASER, "1"); } catch {}
    scrollDown();
  };
  const dismissTeaser = (e) => {
    e?.stopPropagation();
    setTeaser(false);
    try { localStorage.setItem(LS_TEASER, "1"); } catch {}
  };

  async function startChat(e) {
    e.preventDefault();
    if (!form.name.trim()) return setFormErr("Please enter your name.");
    if (!EMAIL_RE.test(form.email)) return setFormErr("Please enter a valid email.");
    if (!form.mobile.trim()) return setFormErr("Please enter your mobile number.");
    setFormErr(""); setStarting(true);
    try {
      const res = await fetch("/api/chat/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, meta: collectClientMeta() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not start chat.");
      try { localStorage.setItem(LS_KEY, data.sessionId); } catch {}
      setSuggestions(data.suggestions || []);
      setSessionId(data.sessionId);
    } catch (err) {
      setFormErr(err.message || "Could not start chat. Please try again.");
    } finally { setStarting(false); }
  }

  async function send(textArg) {
    const text = (textArg ?? input).trim();
    if (!text || !sessionId || sending) return;
    setSending(true);
    setInput("");
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, sender: "user", text, created_at: new Date().toISOString() }]);
    setAiTyping(true);
    scrollDown();
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!data.aiReplied) setAiTyping(false);
    } catch {
      setAiTyping(false);
    } finally { setSending(false); }
  }

  /* browser speech-to-text (free) */
  function toggleMic() {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input is not supported in this browser. Please use Chrome."); return; }
    if (listening) { recogRef.current?.stop(); return; }
    const recog = new SR();
    recog.lang = "en-US"; recog.interimResults = true; recog.continuous = false;
    recog.onresult = (ev) => {
      let txt = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
      setInput(txt);
      if (ev.results[ev.results.length - 1].isFinal) { recog.stop(); send(txt); }
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recogRef.current = recog;
    setListening(true);
    recog.start();
  }

  const reset = () => {
    try { localStorage.removeItem(LS_KEY); } catch {}
    setSessionId(null); setMessages([]); setForm({ name: "", email: "", mobile: "" });
    setSuggestions((s) => s); setInput("");
  };
  const endChat = () => {
    setMenuOpen(false);
    if (typeof window !== "undefined" && !window.confirm("End this chat? Your current conversation will be cleared.")) return;
    const sid = sessionId;
    if (sid) {
      fetch("/api/chat/end", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sid }) }).catch(() => {});
    }
    reset();
  };

  const firstAdminIdx = messages.findIndex((m) => m.sender === "admin");
  const noUserYet = messages.filter((m) => m.sender === "user").length === 0;

  return (
    <>
      {/* launcher + teaser */}
      <div className={`cw-launcher-wrap ${open ? "hide" : ""}`}>
        {teaser && (
          <div className="cw-teaser" onClick={openChat}>
            <button className="cw-teaser-x" onClick={dismissTeaser} aria-label="Dismiss">✕</button>
            <div className="cw-teaser-av">{avatarInner()}</div>
            <div className="cw-teaser-msg">👋 Assalamu Alaikum! Need help choosing a course? Tap to chat with us.</div>
          </div>
        )}
        <button className="cw-launcher" onClick={openChat} aria-label="Chat with us">
          <IChat />
          {unread > 0 && <span className="cw-unread">{unread}</span>}
          <span className="cw-launcher-pulse" />
        </button>
      </div>

      <div className={`cw-panel ${open ? "open" : ""}`} role="dialog" aria-label="Yaqeen Institute chat">
        <div className="cw-header">
          <div className="cw-header-info">
            <div className="cw-avatar">{avatarInner()}</div>
            <div>
              <div className="cw-title">{ui.assistant_name}</div>
              <div className="cw-sub"><span className="cw-dot" /> {ui.assistant_status}</div>
            </div>
          </div>
          <div className="cw-header-actions">
            <div className="cw-menu-wrap">
              <button className="cw-icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu"><IMore /></button>
              {menuOpen && (
                <>
                  <div className="cw-menu-backdrop" onClick={() => setMenuOpen(false)} />
                  <div className="cw-menu">
                    <a href="/book-free-trial" className="cw-menu-item" onClick={() => setMenuOpen(false)}><ICal /> Book a Free Trial</a>
                    {sessionId && <button className="cw-menu-item danger" onClick={endChat}><IEnd /> End Chat</button>}
                  </div>
                </>
              )}
            </div>
            <button className="cw-icon-btn" onClick={() => setOpen(false)} aria-label="Close"><IClose /></button>
          </div>
        </div>

        {!sessionId ? (
          <form className="cw-prechat" onSubmit={startChat}>
            <h4>{ui.prechat_title}</h4>
            <p>{ui.prechat_subtitle}</p>
            <input className="cw-field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="cw-field" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="cw-field" placeholder="Mobile number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d+\s-]/g, "") })} />
            {formErr && <div className="cw-err">{formErr}</div>}
            <button className="cw-start-btn" type="submit" disabled={starting}>{starting ? "Starting…" : "Start Chat"}</button>
            <div className="cw-privacy">{ui.privacy_text}</div>
            <div className="cw-or"><span>or</span></div>
            <a className="cw-wa" href={waLink} target="_blank" rel="noopener noreferrer"><IWhatsApp /> Chat on WhatsApp</a>
          </form>
        ) : (
          <>
            {/* quick actions */}
            <div className="cw-actions">
              <a href="/book-free-trial" className="cw-action primary"><ICal /> Book a Free Trial</a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="cw-action wa"><IWhatsApp /> WhatsApp</a>
            </div>

            <div className="cw-body" ref={bodyRef}>
              {messages.map((m, idx) => (
                <Fragment key={m.id}>
                  {m.sender === "admin" && idx === firstAdminIdx && (
                    <div className="cw-divider"><span>👋 A team member has joined the chat</span></div>
                  )}
                  <div className={`cw-msg ${m.sender === "user" ? "me" : "them"} ${m.sender === "admin" ? "admin" : ""}`}>
                    {m.sender !== "user" && <div className="cw-msg-av">{avatarInner()}</div>}
                    <div className="cw-msg-content">
                      {m.sender === "admin" && <div className="cw-badge">Team</div>}
                      {m.text && <div className="cw-bubble">{renderText(m.text)}</div>}
                      {m.audio_url && <audio className="cw-audio" controls src={m.audio_url} />}
                      <div className="cw-time">{fmtTime(m.created_at)}</div>
                    </div>
                  </div>
                </Fragment>
              ))}
              {aiTyping && (
                <div className="cw-msg them"><div className="cw-msg-av">{avatarInner()}</div><div className="cw-msg-content"><div className="cw-bubble cw-typing"><span/><span/><span/></div></div></div>
              )}
            </div>

            {suggestions.length > 0 && noUserYet && (
              <div className="cw-suggests">
                {suggestions.map((q, i) => (
                  <button key={i} className="cw-chip" onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}

            <div className="cw-inputbar">
              <button className={`cw-icon-btn ${listening ? "rec" : ""}`} onClick={toggleMic} aria-label="Voice input" title="Speak"><IMic on={listening} /></button>
              <button className={`cw-icon-btn ${speak ? "on" : ""}`} onClick={() => setSpeak((s) => !s)} aria-label="Read replies aloud" title="Read replies aloud"><ISpeaker on={speak} /></button>
              <input
                className="cw-input"
                placeholder={listening ? "Listening…" : "Type your message…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <button className="cw-send" onClick={() => send()} disabled={sending || !input.trim()} aria-label="Send"><ISend /></button>
            </div>
            <div className="cw-foot">
              <button className="cw-reset" onClick={endChat}><IEnd /> End Chat</button>
              <span className="cw-powered">Powered by Yaqeen Institute</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
