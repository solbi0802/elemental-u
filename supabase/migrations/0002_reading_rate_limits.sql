-- Distributed abuse protection for the public AI reading endpoint.

create table if not exists public.reading_rate_limits (
  key         text primary key,
  count       integer not null,
  reset_at    timestamptz not null,
  updated_at  timestamptz not null default now()
);

alter table public.reading_rate_limits enable row level security;

create or replace function public.consume_reading_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  remaining integer,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
  current_reset timestamptz;
begin
  insert into public.reading_rate_limits as limits (
    key,
    count,
    reset_at,
    updated_at
  )
  values (
    p_key,
    1,
    now() + make_interval(secs => p_window_seconds),
    now()
  )
  on conflict (key) do update
  set
    count = case
      when limits.reset_at <= now() then 1
      else limits.count + 1
    end,
    reset_at = case
      when limits.reset_at <= now()
        then now() + make_interval(secs => p_window_seconds)
      else limits.reset_at
    end,
    updated_at = now()
  returning limits.count, limits.reset_at
  into current_count, current_reset;

  return query
  select
    current_count <= p_limit,
    greatest(p_limit - current_count, 0),
    greatest(1, ceil(extract(epoch from (current_reset - now())))::integer);
end;
$$;

revoke all on function public.consume_reading_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_reading_rate_limit(text, integer, integer)
  to service_role;
