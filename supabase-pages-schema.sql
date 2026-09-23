-- ============================================================================
-- Page Management CMS  —  editable content for every public page
-- One row per page. `content` is a JSONB blob whose shape matches the
-- PAGE_DEFAULTS object in lib/pages.js. Safe to run multiple times.
-- ============================================================================

create table if not exists public.page_content (
  id          text primary key,          -- page slug: 'home', 'about', 'contact', ...
  content     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Keep it idempotent: never wipe existing edited rows.
insert into public.page_content (id, content) values
  ('home', '{}'::jsonb),
  ('about', '{}'::jsonb),
  ('contact', '{}'::jsonb),
  ('privacy', '{}'::jsonb),
  ('terms', '{}'::jsonb),
  ('refund', '{}'::jsonb),
  ('cookies', '{}'::jsonb),
  ('faqs', '{}'::jsonb),
  ('careers', '{}'::jsonb),
  ('testimonials', '{}'::jsonb),
  ('teachers', '{}'::jsonb),
  ('courses', '{}'::jsonb),
  ('pricing', '{}'::jsonb),
  ('bookTrial', '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security: public can READ (site needs it), only service_role writes.
-- ---------------------------------------------------------------------------
alter table public.page_content enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_content'
      and policyname = 'page_content public read'
  ) then
    create policy "page_content public read"
      on public.page_content for select
      using (true);
  end if;
end $$;
