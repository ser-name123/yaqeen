-- ============================================================================
-- Admin loader / login logo (separate from the public site logo).
-- Falls back to the site logo when empty. Safe to run multiple times.
-- ============================================================================
alter table public.site_settings add column if not exists admin_loader_logo_url text;
