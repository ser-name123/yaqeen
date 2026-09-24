-- Add Form Notification Emails column to site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS notification_emails TEXT DEFAULT '';
