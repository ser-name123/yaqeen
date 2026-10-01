-- ============================================================================
-- Custom sitemap.xml & robots.txt upload support.
-- When these columns hold text, that exact content is served at
--   /sitemap.xml  and  /robots.txt
-- overriding the auto-generated output. Leave NULL to use the generated one.
-- Safe to run multiple times.
-- ============================================================================
alter table public.seo_settings add column if not exists custom_sitemap_xml  text;
alter table public.seo_settings add column if not exists custom_robots_txt   text;

-- Make sure the global settings row exists. `title` is NOT NULL on this table,
-- so seed it with an empty string (only used if the row doesn't exist yet).
insert into public.seo_settings (id, title)
values ('global', '')
on conflict (id) do nothing;
