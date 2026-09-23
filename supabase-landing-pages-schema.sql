-- ============================================================================
-- Landing Page Management CMS
-- Allows creating, editing, and managing multiple dynamic landing pages
-- with full SEO configuration and 100% editable section content.
-- ============================================================================

create table if not exists public.landing_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  status      text not null default 'published' check (status in ('published', 'draft')),
  is_default  boolean not null default false,
  seo         jsonb not null default '{}'::jsonb,
  content     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for high-performance public slug lookups
create index if not exists idx_landing_pages_slug on public.landing_pages (slug);
create index if not exists idx_landing_pages_status on public.landing_pages (status);

-- Seed initial default landing page ('online-quran-classes-uk')
insert into public.landing_pages (
  slug,
  title,
  status,
  is_default,
  seo,
  content
) values (
  'online-quran-classes-uk',
  'Online Quran Classes in UK',
  'published',
  true,
  '{
    "metaTitle": "Online Quran Classes in UK | Learn Quran Online with Qualified Teachers",
    "metaDescription": "Learn Quran online with qualified male and female teachers at Yaqeen Institute. Online Quran classes for kids and adults across the UK with Tajweed, Hifz, and flexible timings. Book a free trial today!",
    "keywords": "online quran classes, learn quran online, quran classes uk, online quran teacher, quran with tajweed, quran memorization, yaqeen institute",
    "ogImage": "/images/hero_student_boy.jpg",
    "canonicalSlug": "online-quran-classes-uk",
    "noindex": false
  }'::jsonb,
  '{}'::jsonb
) on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- Public can READ published pages. Admin / Service role has full write access.
-- ---------------------------------------------------------------------------
alter table public.landing_pages enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'landing_pages'
      and policyname = 'landing_pages public select'
  ) then
    create policy "landing_pages public select"
      on public.landing_pages for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'landing_pages'
      and policyname = 'landing_pages service_role all'
  ) then
    create policy "landing_pages service_role all"
      on public.landing_pages for all
      using (true)
      with check (true);
  end if;
end $$;
