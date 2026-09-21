-- ============================================================
--  Footer (and later header) content — admin editable
--  Run this ONCE in Supabase → SQL Editor
-- ============================================================

create table if not exists public.layout_config (
  id                    text primary key default 'global',
  -- brand / bio
  footer_tagline        text,
  footer_description    text,
  footer_rating_score   text,
  footer_rating_text    text,
  footer_whatsapp_label text,
  -- section titles
  explore_title         text,
  courses_title         text,
  connect_title         text,
  -- courses column
  view_all_label        text,
  view_all_url          text,
  -- help & connect labels
  contact_phone_label   text,
  contact_email_label   text,
  -- newsletter
  newsletter_title      text,
  newsletter_desc       text,
  -- bottom bar
  footer_address        text,
  footer_ssl_text       text,
  social_heading        text,
  -- header
  header_cta_label      text,
  header_cta_url        text,
  header_links          jsonb,   -- [{ "label": "...", "url": "..." } | { "label":"Discover","dropdown":[{label,url}] }]
  -- arrays
  explore_links         jsonb,   -- [{ "label": "...", "url": "...", "badge": "FREE" }]
  trust_badges          jsonb,   -- [{ "title": "...", "subtitle": "..." }]
  footer_courses        jsonb,   -- optional [{ "label": "...", "url": "..." }]; empty = auto from courses table
  updated_at            timestamptz not null default now()
);

-- add newer columns if the table already existed
alter table public.layout_config add column if not exists view_all_label      text;
alter table public.layout_config add column if not exists view_all_url        text;
alter table public.layout_config add column if not exists contact_phone_label text;
alter table public.layout_config add column if not exists contact_email_label text;
alter table public.layout_config add column if not exists footer_courses      jsonb;
alter table public.layout_config add column if not exists header_cta_label     text;
alter table public.layout_config add column if not exists header_cta_url       text;
alter table public.layout_config add column if not exists header_links         jsonb;

alter table public.layout_config enable row level security;
-- server-only (admin API + public API use the service key)

insert into public.layout_config (
  id, footer_tagline, footer_description, footer_rating_score, footer_rating_text, footer_whatsapp_label,
  explore_title, courses_title, connect_title,
  view_all_label, view_all_url, contact_phone_label, contact_email_label,
  newsletter_title, newsletter_desc,
  footer_address, footer_ssl_text, social_heading,
  header_cta_label, header_cta_url, header_links,
  explore_links, trust_badges
) values (
  'global',
  'Excellence in Quranic Education',
  'Dedicated to imparting authentic Quranic learning, Tajweed, and Islamic values with certified male and female scholars through personalized 1-on-1 online classes for kids and adults worldwide.',
  '4.9 / 5.0',
  'Based on 1,200+ Student Reviews',
  'Instant WhatsApp Support',
  'EXPLORE', 'OUR COURSES', 'HELP & CONNECT',
  'View All Courses', '/courses', 'Call / WhatsApp (24/7)', 'Email Us',
  'Subscribe to Newsletter', 'Get free Quran resources, Tajweed guides & updates.',
  '128, City Road, London, EC1V 2NX, United Kingdom',
  '256-Bit SSL Encrypted & Verified',
  'Follow Yaqeen',
  'Book a Free Trial', '/book-free-trial',
  '[
    {"label":"Courses","url":"/courses"},
    {"label":"Pricing","url":"/pricing"},
    {"label":"Discover","dropdown":[
      {"label":"About","url":"/about"},
      {"label":"Teachers","url":"/teachers"},
      {"label":"Testimonials","url":"/testimonials"},
      {"label":"Faq","url":"/faqs"},
      {"label":"Blog","url":"/blog"},
      {"label":"Careers","url":"/careers"},
      {"label":"Contact","url":"/contact"}
    ]}
  ]'::jsonb,
  '[
    {"label":"Book a Free Trial","url":"/book-free-trial","badge":"FREE"},
    {"label":"About Yaqeen","url":"/about"},
    {"label":"Qualified Teachers","url":"/teachers"},
    {"label":"Pricing & Plans","url":"/pricing"},
    {"label":"Student Testimonials","url":"/testimonials"},
    {"label":"Teacher Application","url":"/teacher-application"},
    {"label":"Blog & Islamic Guides","url":"/blog"},
    {"label":"FAQs","url":"/faqs"},
    {"label":"Careers","url":"/careers"}
  ]'::jsonb,
  '[
    {"title":"Native Arabic Tutors","subtitle":"Al-Azhar & Certified Scholars"},
    {"title":"Flexible 24/7 Schedule","subtitle":"1-on-1 Interactive Live Classes"},
    {"title":"4.9 / 5.0 Rated","subtitle":"Trusted by 5,000+ Muslim Families"},
    {"title":"100% Free Trial","subtitle":"No Credit Card Required"}
  ]'::jsonb
)
on conflict (id) do nothing;
