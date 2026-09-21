-- ============================================================
--  Live AI Chat — database schema
--  Run this ONCE in Supabase → SQL Editor (project: yaqeen12)
-- ============================================================

-- 1) Sessions: one row per visitor conversation (holds the PII)
create table if not exists public.chat_sessions (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  mobile          text not null,
  status          text not null default 'ai',      -- 'ai' = bot replies | 'admin' = human took over
  admin_joined_at timestamptz,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  -- captured on start (IP + browser), shown to admin
  ip_address      text,
  city            text,
  state           text,
  country         text,
  provider        text,
  user_agent      text,
  browser_info    text,
  system_info     text,
  device_type     text,
  language        text,
  timezone        text,
  screen_size     text,
  page_url        text,
  referrer        text
);

-- 2) Messages: every message in a conversation
create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  sender      text not null,                        -- 'user' | 'ai' | 'admin'
  text        text,
  audio_url   text,
  created_at  timestamptz not null default now()
);

create index if not exists chat_messages_session_idx
  on public.chat_messages (session_id, created_at);
create index if not exists chat_sessions_recent_idx
  on public.chat_sessions (last_message_at desc);

-- ============================================================
--  Row Level Security
--  - Sessions hold PII (name/email/mobile): NO anon access.
--    Only the server (service-role key) touches this table.
--  - Messages: anon may SELECT (needed so the widget can receive
--    live replies over Realtime). Writes go through the server.
-- ============================================================
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- messages: allow the public (anon) to read, so Realtime can push
drop policy if exists "chat_messages anon read" on public.chat_messages;
create policy "chat_messages anon read"
  on public.chat_messages for select
  to anon
  using (true);

-- (no anon policies on chat_sessions → fully private, server-only)

-- ============================================================
--  Realtime: broadcast INSERTs on chat_messages to subscribers
-- ============================================================
alter publication supabase_realtime add table public.chat_messages;
