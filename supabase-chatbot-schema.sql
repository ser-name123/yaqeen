-- ============================================================
--  Admin-managed chat bot: welcome message + Q&A knowledge base
--  Run this ONCE in Supabase → SQL Editor (after the chat schema)
-- ============================================================

-- Single-row config (welcome message + widget texts, all admin-editable)
create table if not exists public.chat_config (
  id                text primary key default 'global',
  welcome_message   text,
  assistant_name    text,
  assistant_status  text,
  prechat_title     text,
  prechat_subtitle  text,
  privacy_text      text,
  updated_at        timestamptz not null default now()
);

-- Add the widget-text columns if the table already existed from an earlier run
alter table public.chat_config add column if not exists assistant_name   text;
alter table public.chat_config add column if not exists assistant_status text;
alter table public.chat_config add column if not exists prechat_title    text;
alter table public.chat_config add column if not exists prechat_subtitle text;
alter table public.chat_config add column if not exists privacy_text     text;
alter table public.chat_config add column if not exists widget_logo_url  text;

insert into public.chat_config (id, welcome_message, assistant_name, assistant_status, prechat_title, prechat_subtitle, privacy_text)
values (
  'global',
  'Assalamu Alaikum! Welcome to Yaqeen Institute. How can I help you today — Quran, Arabic, or Islamic Studies?',
  'Yaqeen Assistant',
  'Online — we typically reply fast',
  'Start a conversation',
  'Please share your details so our team can assist you.',
  'We use your details only to respond to your enquiry.'
)
on conflict (id) do nothing;

-- Admin-managed question / answer pairs (the bot's brain)
create table if not exists public.chat_qa (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,          -- shown as the suggestion chip / the question
  keywords      text,                   -- optional extra match words (space or comma separated)
  answer        text not null,
  is_suggestion boolean not null default true,   -- show as a quick chip on the website
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists chat_qa_order_idx on public.chat_qa (sort_order, created_at);

alter table public.chat_config enable row level security;
alter table public.chat_qa     enable row level security;
-- (no anon policies → server-only; the widget reads these through our API)

-- Seed 12 starter Q&A (the ones with is_suggestion=true also show as website chips)
insert into public.chat_qa (question, keywords, answer, is_suggestion, sort_order) values
('What courses do you offer?', 'course courses subject offer teach programs classes', 'We teach the Quran (with Tajweed & Hifz), the Arabic language, and Islamic Studies — one-to-one with certified teachers, for all ages. You can start with a FREE trial. Which one interests you?', true, 1),
('Do you teach Quran with Tajweed?', 'quran tajweed tajwid hifz recitation qaida noorani nazra', 'Yes! We teach the Quran with proper Tajweed — from beginner (Qaida/Noorani) to fluent recitation and Hifz (memorization), one-to-one with certified teachers, for all ages. Would you like to book a free Quran trial?', true, 2),
('What are your fees?', 'fee fees price pricing cost charges plan package monthly payment', 'Our plans are affordable and depend on the course and classes per week. The best way is to start with a FREE trial class (no payment needed) and our team will share the exact plan that fits you. Shall I help you book it?', true, 3),
('How do I book a free trial?', 'free trial demo book booking start register', 'Just click the “Book a Free Trial” button on our website, fill your details and pick a time — a certified teacher will take your 100% free session (no card needed). Would you like help choosing a course?', true, 4),
('What are the class timings?', 'time timing schedule when hours availability flexible slot day night', 'Classes are fully flexible and available 24/7 — you choose the days and times that suit you in your own timezone. Want to pick a time and book a free trial?', true, 5),
('Can I get a female teacher?', 'female sister male brother teacher tutor ustad ustadh instructor gender', 'Yes — we have both male and female certified teachers, so you can request whichever you prefer, especially for sisters and children. Would you like to book a free trial with one?', true, 6),
('Do you teach the Arabic language?', 'arabic arbi language spoken grammar nahw reading writing', 'Yes, we offer Arabic language classes — reading, writing, grammar and conversation — taught step by step by qualified teachers. It also helps you understand the Quran. Want to try a free Arabic class?', false, 7),
('What is included in Islamic Studies?', 'islamic islam studies aqeedah fiqh seerah hadith duas deen character', 'Our Islamic Studies cover the essentials — Aqeedah, Fiqh, Seerah, daily Duas, and good character (Akhlaq) — in a simple, structured way for both children and adults. Would you like a free trial?', false, 8),
('Do you teach children and beginners?', 'kid kids child children age beginner young son daughter adult level', 'Absolutely — we teach all ages, from young children and complete beginners to adults. Every lesson is adjusted to the student’s level and pace. Shall I help you book a free trial?', false, 9),
('Which language do teachers speak?', 'language medium english urdu hindi understand speak explain', 'Our teachers can teach in multiple languages including English, Urdu, Hindi and Arabic, so you can learn comfortably in the language you understand best. Want to try a free class?', false, 10),
('Are the classes one-to-one and online?', 'online one to one individual private worldwide zoom skype where location', 'Yes — all classes are one-to-one (individual) and fully online, so you learn from anywhere in the world from the comfort of your home, at your own pace. Would you like a free trial?', false, 11),
('How do I get started?', 'start begin register join enroll admission sign up how', 'Getting started is easy: 1) Click “Book a Free Trial”, 2) Fill your details and choose a time, 3) Attend your free class with a certified teacher. If you like it, simply pick a plan. Want me to guide you to the free trial?', false, 12)
on conflict do nothing;
