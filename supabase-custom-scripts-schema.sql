-- =========================================================
-- CUSTOM TRACKING & HEADER / BODY / FOOTER SCRIPTS MIGRATION
-- Run this in your Supabase SQL Editor
-- =========================================================

-- Add Google Tag ID and custom insertion script columns to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS google_tag_id TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS header_scripts TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS body_scripts TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_scripts TEXT DEFAULT '';
