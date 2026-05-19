-- Elemental-U: purchases table for anonymous Lemon Squeezy checkouts.
-- Run in Supabase SQL Editor on a fresh project.

create extension if not exists "pgcrypto";

create table if not exists public.purchases (
  id              uuid primary key default gen_random_uuid(),
  session_token   uuid not null unique default gen_random_uuid(),

  -- input from the form
  name            text,
  birth_date      text not null,             -- 'YYYY-MM-DD'
  birth_time      text,                      -- 'HH:MM' nullable

  -- saju calculation result + Gemini readings
  saju_result     jsonb not null,
  readings        jsonb,

  -- payment state
  status          text not null default 'pending'
                  check (status in ('pending', 'paid', 'failed')),
  ls_order_id     text unique,
  paid_amount     integer,                    -- in cents (USD)
  paid_currency   text,

  created_at      timestamptz not null default now(),
  paid_at         timestamptz
);

create index if not exists purchases_session_token_idx
  on public.purchases(session_token);

create index if not exists purchases_ls_order_id_idx
  on public.purchases(ls_order_id);

-- RLS disabled — server-only access via service_role key.
-- The anon key is never exposed to the client; all reads/writes happen in
-- /api/payment/* routes using getDb() from src/lib/db/client.ts.
alter table public.purchases disable row level security;
