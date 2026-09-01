create table if not exists public.google_ads_leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  source text not null default 'google_ads_lead_form',
  status text not null default 'new' check (status in ('new','contacted','estimate_scheduled','won','lost','test')),
  is_test boolean not null default false,
  full_name text,
  phone text,
  email text,
  postal_code text,
  city text,
  region text,
  campaign_id text,
  form_id text,
  asset_group_id text,
  gclid text,
  lead_stage text,
  lead_source text,
  lead_submit_time timestamptz,
  custom_answers jsonb not null default '[]'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists google_ads_leads_created_at_idx on public.google_ads_leads (created_at desc);
create index if not exists google_ads_leads_status_idx on public.google_ads_leads (status);
create index if not exists google_ads_leads_campaign_id_idx on public.google_ads_leads (campaign_id);

alter table public.google_ads_leads enable row level security;

-- Intentionally no anon/authenticated policies. The webhook and server-side dashboard
-- use the Supabase service role key, which must never be exposed to the browser.
revoke all on table public.google_ads_leads from anon, authenticated;
