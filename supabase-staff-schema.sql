-- ============================================================================
-- Advanced Staff Account Management
-- Extends admin_profile with name, role, status, per-tab permissions and audit.
-- Safe to run multiple times.
-- ============================================================================

alter table public.admin_profile add column if not exists full_name    text;
alter table public.admin_profile add column if not exists role         text;         -- no default: existing rows stay NULL
alter table public.admin_profile add column if not exists status       text default 'active';
alter table public.admin_profile add column if not exists permissions  jsonb default '[]'::jsonb;
alter table public.admin_profile add column if not exists last_login_at timestamptz;
alter table public.admin_profile add column if not exists created_at    timestamptz default timezone('utc'::text, now());
alter table public.admin_profile add column if not exists created_by    text;

-- Any admin that predates roles (role still NULL) was full-access, so make them super admins.
update public.admin_profile set role = 'super_admin' where role is null;
update public.admin_profile set status = 'active' where status is null;

-- Guarantee the primary seeded owner is a super admin and active.
update public.admin_profile
   set role = 'super_admin', status = 'active'
 where lower(email) = 'objectsquarerajan@gmail.com';
