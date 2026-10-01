-- ============================================================================
-- Per-course SEO: meta title, description, keywords for each course detail page.
-- Safe to run multiple times.
-- ============================================================================
alter table public.courses add column if not exists seo_title       text;
alter table public.courses add column if not exists seo_description  text;
alter table public.courses add column if not exists seo_keywords     text;
