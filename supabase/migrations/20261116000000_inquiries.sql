-- Project intake form (issue #146)
-- Inquiries are written ONLY by the `submit-inquiry` Edge Function (service role).
-- The anon key ships in the static bundle, so there is intentionally no anon policy.

-- ---------------------------------------------------------------------------
-- Owners: who may read/manage inquiries.
-- signInWithOtp lets anyone create an account, so `authenticated` != owner.
-- Add your email after applying this migration:
--   insert into public.app_owners (email) values ('you@example.com');
-- ---------------------------------------------------------------------------
create table if not exists public.app_owners (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.app_owners enable row level security;
-- No policies: only the security-definer function below reads this table.
revoke all on public.app_owners from anon, authenticated;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_owners o
     where o.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

-- ---------------------------------------------------------------------------
-- Inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  company text check (company is null or char_length(company) <= 160),
  project_type text not null check (project_type in (
    'automation', 'crm_integration', 'apps_script', 'web_app', 'data_pipeline', 'other'
  )),
  tools text[] not null default '{}' check (cardinality(tools) <= 12),
  problem text not null check (char_length(problem) between 10 and 4000),
  outcome text not null check (char_length(outcome) between 10 and 4000),
  budget text not null check (budget in ('lt_500', '500_2k', '2k_5k', '5k_plus', 'not_sure')),
  timeline text not null check (timeline in ('asap', '2_4_weeks', '1_3_months', 'flexible')),
  links text check (links is null or char_length(links) <= 1000),
  source text not null check (source in (
    'fiverr', 'upwork', 'contra', 'linkedin', 'github', 'referral', 'search', 'other'
  )),
  status text not null default 'new' check (status in (
    'new', 'replied', 'call_booked', 'won', 'lost', 'spam'
  )),
  notes text check (notes is null or char_length(notes) <= 4000),
  replied_at timestamptz,
  user_agent text check (user_agent is null or char_length(user_agent) <= 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;

-- Defense in depth on top of RLS: anon gets nothing; authenticated may only
-- read, and update the three owner-managed columns.
revoke all on public.inquiries from anon, authenticated;
grant select on public.inquiries to authenticated;
grant update (status, notes, replied_at) on public.inquiries to authenticated;

drop policy if exists inquiries_owner_select on public.inquiries;
create policy inquiries_owner_select
  on public.inquiries for select
  to authenticated
  using (public.is_owner());

drop policy if exists inquiries_owner_update on public.inquiries;
create policy inquiries_owner_update
  on public.inquiries for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();
