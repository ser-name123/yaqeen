-- ============================================================================
-- Advanced per-page SEO  —  meta title / description / keywords + slug (canonical)
-- One row per page. Applied via each route's generateMetadata().
-- Safe to run multiple times.
-- ============================================================================

create table if not exists public.page_seo (
  id          text primary key,          -- page key: 'home', 'about', 'contact', ...
  slug        text,                       -- canonical URL path, e.g. '/about'
  title       text,
  description text,
  keywords    text,
  updated_at  timestamptz not null default now()
);

insert into public.page_seo (id) values
  ('home'), ('about'), ('courses'), ('pricing'), ('teachers'),
  ('testimonials'), ('careers'), ('faqs'), ('contact'),
  ('bookTrial'), ('privacy'), ('terms')
on conflict (id) do nothing;

-- Canonical base URL lives on the existing global seo_settings row.
alter table public.seo_settings add column if not exists site_url text;

-- ---------------------------------------------------------------------------
-- RLS: public can READ (metadata is rendered server-side), service_role writes.
-- ---------------------------------------------------------------------------
alter table public.page_seo enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'page_seo'
      and policyname = 'page_seo public read'
  ) then
    create policy "page_seo public read"
      on public.page_seo for select
      using (true);
  end if;
end $$;
