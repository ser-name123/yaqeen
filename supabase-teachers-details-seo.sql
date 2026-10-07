-- ============================================================================
-- Teacher detail-page fields + per-teacher SEO.
-- Everything the /teachers/[id] page shows now lives in the database so the
-- page can be fully dynamic (no static file / local fallback).
-- Safe to run multiple times.
-- ============================================================================

-- Rich detail fields shown on the public teacher detail page
alter table public.teachers add column if not exists slug             text;
alter table public.teachers add column if not exists gender           text;   -- 'male' | 'female'
alter table public.teachers add column if not exists country          text;
alter table public.teachers add column if not exists headline         text;   -- small role line under the name
alter table public.teachers add column if not exists short_bio        text;   -- hero intro paragraph
alter table public.teachers add column if not exists long_bio         text;   -- "About me" paragraph
alter table public.teachers add column if not exists quote            text;   -- gold quote block
alter table public.teachers add column if not exists education_title  text;   -- Education pill line 1
alter table public.teachers add column if not exists education_sub    text;   -- Education pill line 2
alter table public.teachers add column if not exists approach_title   text;   -- method card 01 title
alter table public.teachers add column if not exists approach_desc    text;   -- method card 01 desc
alter table public.teachers add column if not exists academic_title   text;   -- method card 02 title
alter table public.teachers add column if not exists academic_desc    text;   -- method card 02 desc

-- Per-teacher SEO (meta title / description / keywords for the detail page)
alter table public.teachers add column if not exists seo_title        text;
alter table public.teachers add column if not exists seo_description  text;
alter table public.teachers add column if not exists seo_keywords     text;
