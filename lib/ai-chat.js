// ============================================================
//  Self-contained chat responder — NO third-party AI.
//  Every answer is built from Yaqeen Institute's own website data
//  (courses, pricing plans, contact settings) and a curated
//  knowledge base. Nothing leaves our own server/database.
// ============================================================

import { getSupabaseAdmin } from "@/lib/supabase";

const DEFAULT_PHONE = "+44 7488 848483";
const DEFAULT_EMAIL = "support@yaqeeninstitute.online";

// Pull the latest visitor message from the conversation history.
function lastUserText(history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].sender === "user" && history[i].text) return history[i].text;
  }
  return "";
}

const has = (text, words) => words.some((w) => text.includes(w));

const STOP = new Set(["the","a","an","do","you","your","is","are","was","what","how","of","to","with","for","and","or","me","i","can","will","would","give","tell","about","in","on","at","my","we","us","any","please","hai","kya","ka","ki","ke","me","ko"]);

// Fetch the admin-editable welcome message.
export async function getWelcomeMessage(supabase) {
  try {
    const { data } = await supabase.from("chat_config").select("welcome_message").eq("id", "global").single();
    return data?.welcome_message || null;
  } catch { return null; }
}

// Admin-editable widget texts (with safe defaults) for the public widget.
export async function getPublicConfig(supabase) {
  const defaults = {
    assistant_name: "Yaqeen Assistant",
    assistant_status: "Online — we typically reply fast",
    prechat_title: "Start a conversation",
    prechat_subtitle: "Please share your details so our team can assist you.",
    privacy_text: "We use your details only to respond to your enquiry.",
    widget_logo_url: "",
  };
  try {
    const { data } = await supabase.from("chat_config").select("*").eq("id", "global").single();
    if (!data) return defaults;
    return {
      assistant_name: data.assistant_name || defaults.assistant_name,
      assistant_status: data.assistant_status || defaults.assistant_status,
      prechat_title: data.prechat_title || defaults.prechat_title,
      prechat_subtitle: data.prechat_subtitle || defaults.prechat_subtitle,
      privacy_text: data.privacy_text || defaults.privacy_text,
      widget_logo_url: data.widget_logo_url || "",
    };
  } catch { return defaults; }
}

// Fetch admin-managed suggestion questions (for the website chips).
export async function getSuggestions(supabase) {
  try {
    const { data } = await supabase.from("chat_qa").select("question").eq("is_suggestion", true).order("sort_order").limit(8);
    return (data || []).map((r) => r.question).filter(Boolean);
  } catch { return []; }
}

// Match the visitor's text against the admin-managed Q&A (best keyword overlap).
async function matchAdminQa(text, supabase) {
  try {
    const { data } = await supabase.from("chat_qa").select("question, keywords, answer, sort_order").order("sort_order");
    if (!data || !data.length) return null;
    let best = null, bestScore = 0;
    for (const row of data) {
      const source = `${row.keywords || ""} ${row.question || ""}`.toLowerCase();
      const tokens = source.split(/[\s,._-]+/).filter((t) => t.length >= 3 && !STOP.has(t));
      let score = 0;
      for (const t of new Set(tokens)) if (text.includes(t)) score++;
      if (score > bestScore) { bestScore = score; best = row; }
    }
    return bestScore > 0 ? best.answer : null;
  } catch { return null; }
}

// -------- live data helpers (our own DB only) --------
async function getCourses(supabase) {
  try {
    const { data } = await supabase.from("courses").select("title").order("created_at", { ascending: true }).limit(12);
    return (data || []).map((c) => c.title).filter(Boolean);
  } catch { return []; }
}
async function getPlans(supabase) {
  try {
    const { data } = await supabase.from("pricing_plans").select("*").limit(12);
    return data || [];
  } catch { return []; }
}
async function getContact(supabase) {
  try {
    const { data } = await supabase.from("site_settings").select("*").eq("id", "global").single();
    return {
      phone: data?.contact_phone || DEFAULT_PHONE,
      email: data?.contact_email || DEFAULT_EMAIL,
    };
  } catch { return { phone: DEFAULT_PHONE, email: DEFAULT_EMAIL }; }
}

/**
 * Generate a reply from our own data. Fully local — no external API.
 */
export async function generateAiReply(history) {
  const raw = lastUserText(history);
  const text = raw.toLowerCase().trim();
  const supabase = getSupabaseAdmin();

  // ---- admin-managed Q&A first (highest priority) ----
  const adminAnswer = await matchAdminQa(text, supabase);
  if (adminAnswer) return adminAnswer;

  // ---- greetings ----
  if (has(text, ["assalam", "salam", "hello", "hi ", "hey", "good morning", "good afternoon", "good evening"]) || text === "hi") {
    return "Wa Alaikum Assalam! 😊 Welcome to Yaqeen Institute. I can help you with our Quran, Arabic and Islamic Studies courses, timings, fees, or booking a free trial. What would you like to know?";
  }

  // ---- free trial ----
  if (has(text, ["trial", "free class", "demo", "try", "book"])) {
    return "You can book a 100% FREE trial class — no card or payment needed. Just click the “Book a Free Trial” button on our website, fill your details, pick a time, and a certified teacher will take your session. Would you like help choosing a course?";
  }

  // ---- pricing / fees ----
  if (has(text, ["price", "pricing", "fee", "fees", "cost", "charge", "how much", "plan", "package", "monthly", "payment"])) {
    const plans = await getPlans(supabase);
    if (plans.length) {
      const lines = plans.slice(0, 6).map((p) => {
        const name = p.name || p.title || "Plan";
        const price = p.price || p.rate || p.amount || "";
        return price ? `• ${name} — ${price}` : `• ${name}`;
      }).join("\n");
      return `Here are our plans:\n${lines}\n\nAll plans include one-to-one classes with certified teachers. You can also start with a FREE trial class first. Want me to help you pick one?`;
    }
    return "Our fees depend on the course and how many classes per week you choose. The best way is to start with a FREE trial class (no payment needed), and our team will share the exact plan that fits you. Shall I help you book the free trial?";
  }

  // ---- courses (specific first) ----
  if (has(text, ["quran", "qur'an", "tajweed", "tajwid", "hifz", "memoriz", "recit", "nazra", "qaida", "noorani"])) {
    return "Yes! We teach the Quran with proper Tajweed — from beginner (Qaida/Noorani) to fluent recitation and Hifz (memorization), one-to-one with certified teachers. Classes are available for all ages. Would you like to book a free trial for Quran?";
  }
  if (has(text, ["arabic", "arbi", "language", "spoken arabic", "grammar", "nahw"])) {
    return "We offer Arabic language classes — reading, writing, grammar and conversation — taught step by step by qualified teachers. Great for understanding the Quran too. Want to try a free Arabic trial class?";
  }
  if (has(text, ["islamic", "islam", "aqeedah", "fiqh", "seerah", "hadith", "duas", "studies", "deen"])) {
    return "Our Islamic Studies cover the essentials of the faith — Aqeedah, Fiqh, Seerah, daily Duas and more — in a simple, structured way for both children and adults. Would you like a free trial class?";
  }
  // ---- teachers (checked before generic courses so "female teacher" matches here) ----
  if (has(text, ["teacher", "ustad", "ustadh", "tutor", "male", "female", "sister", "brother", "instructor"])) {
    return "All our teachers are qualified and certified, with experience teaching students worldwide. Both male and female teachers are available, so you can request whichever you prefer. Would you like to book a free trial with one?";
  }

  // ---- courses (generic) ----
  if (has(text, ["course", "class", "teach", "learn", "subject", "program", "what do you offer"])) {
    const courses = await getCourses(supabase);
    if (courses.length) {
      return `We offer:\n${courses.map((c) => `• ${c}`).join("\n")}\n\nEvery course is one-to-one with a certified teacher, and you can start with a FREE trial. Which one interests you?`;
    }
    return "We teach the Quran (with Tajweed & Hifz), the Arabic language, and Islamic Studies — one-to-one with certified teachers, for all ages. Would you like to book a free trial?";
  }

  // ---- timings / schedule ----
  if (has(text, ["time", "timing", "schedule", "when", "hours", "availab", "flexible", "slot", "day", "night"])) {
    return "Classes are fully flexible and available 24/7 — you choose the days and times that suit you, according to your own timezone. Would you like to pick a time and book a free trial?";
  }

  // ---- age / kids ----
  if (has(text, ["age", "kid", "child", "children", "son", "daughter", "old", "adult", "beginner"])) {
    return "We teach students of all ages — young children, teenagers and adults — including complete beginners. Lessons are adjusted to each student's level. Shall I help you book a free trial?";
  }

  // ---- languages / medium ----
  if (has(text, ["which language", "medium", "english", "urdu", "hindi", "understand", "speak in"])) {
    return "Our teachers can teach in multiple languages including English, Urdu and Arabic, so you can learn comfortably in the language you understand best. Would you like to try a free class?";
  }

  // ---- how to start / register ----
  if (has(text, ["how", "start", "register", "join", "enroll", "sign up", "admission", "get started", "begin"])) {
    return "Getting started is easy: 1) Click “Book a Free Trial”, 2) Fill in your details and pick a time, 3) Attend your free class with a certified teacher. If you like it, you simply choose a plan. Want me to guide you to the free trial?";
  }

  // ---- contact ----
  if (has(text, ["contact", "phone", "number", "whatsapp", "call", "email", "reach", "talk to", "speak to", "human", "agent"])) {
    const c = await getContact(supabase);
    return `You can reach our team directly:\n• Phone/WhatsApp: ${c.phone}\n• Email: ${c.email}\nOr just leave your question here — our team will join this chat shortly to help you personally.`;
  }

  // ---- location / online ----
  if (has(text, ["where", "location", "online", "country", "worldwide", "office", "based"])) {
    return "Yaqeen Institute is a fully online academy — you can learn from anywhere in the world, from the comfort of your home. All you need is a phone or laptop with internet. Would you like a free trial?";
  }

  // ---- thanks ----
  if (has(text, ["thank", "shukriya", "jazak", "thanks", "great", "ok "]) || text === "ok" || text === "thanks") {
    return "You're most welcome! 😊 If you have any more questions, I'm here. And whenever you're ready, you can book your FREE trial class from the button on our website. Jazak Allah Khair!";
  }

  // ---- fallback → nudge to human takeover ----
  return "Thank you for your message! I want to make sure you get the right answer, so our team will join this chat shortly to help you personally. Meanwhile, you can book a FREE trial class from the “Book a Free Trial” button, or ask me about our courses, timings or fees.";
}
