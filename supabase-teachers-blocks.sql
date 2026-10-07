-- ============================================================================
-- Per-teacher "About" + "Verified Teachers" blocks for the detail page.
-- Stored as JSONB so each teacher can have its own heading text and cards,
-- all editable from Manage Teachers. Safe to run multiple times.
--
--   about_block    = { title_line1, title_highlight, subtitle_rest,
--                      features: [ { title, desc }, ... ] }
--   verified_block = { badge, title_line1, title_highlight, subtitle,
--                      cards:    [ { title, desc }, ... ] }
-- ============================================================================
alter table public.teachers add column if not exists about_block     jsonb;
alter table public.teachers add column if not exists verified_block  jsonb;
