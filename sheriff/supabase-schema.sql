create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  discord_id text unique,
  display_name text not null default 'Membru Sheriff',
  avatar_url text,
  grade text not null default 'Membru',
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_grade_length check (char_length(grade) between 1 and 50)
);

create table if not exists public.access_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null,
  discord_id text,
  ip_address inet,
  result text not null check (result in ('allowed', 'blocked')),
  created_at timestamptz not null default now(),
  unique (user_id, session_id)
);

alter table public.access_logs
  add column if not exists ip_address inet;

create index if not exists access_logs_created_at_idx
  on public.access_logs (created_at desc);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and grade = 'STAFF'
      and not is_blocked
  );
$$;

create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  has_discord_identity boolean :=
    coalesce(new.raw_app_meta_data ->> 'provider', '') = 'discord'
    or (coalesce(new.raw_app_meta_data -> 'providers', '[]'::jsonb) ? 'discord');
begin
  insert into public.profiles (id, discord_id, display_name, avatar_url)
  values (
    new.id,
    case
      when has_discord_identity then coalesce(metadata ->> 'provider_id', metadata ->> 'sub')
      else null
    end,
    coalesce(metadata ->> 'global_name', metadata ->> 'full_name', metadata ->> 'name', metadata ->> 'preferred_username', 'Membru Sheriff'),
    metadata ->> 'avatar_url'
  )
  on conflict (id) do update
  set discord_id = coalesce(excluded.discord_id, public.profiles.discord_id),
      display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists sheriff_profile_after_auth_change on auth.users;
create trigger sheriff_profile_after_auth_change
after insert or update of raw_user_meta_data, raw_app_meta_data on auth.users
for each row execute function public.sync_profile_from_auth();

drop function if exists public.record_access();
create function public.record_access(p_ip_address inet)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  current_session_id uuid := nullif((select auth.jwt() ->> 'session_id'), '')::uuid;
  blocked boolean;
  current_discord_id text;
begin
  if current_user_id is null or current_session_id is null then
    raise exception 'Autentificarea este necesară pentru înregistrarea accesului.';
  end if;

  select is_blocked, discord_id
    into blocked, current_discord_id
    from public.profiles
    where id = current_user_id;

  if not found then
    raise exception 'Profilul utilizatorului nu a fost găsit.';
  end if;

  insert into public.access_logs (user_id, session_id, discord_id, ip_address, result)
  values (
    current_user_id,
    current_session_id,
    current_discord_id,
    p_ip_address,
    case when blocked then 'blocked' else 'allowed' end
  )
  on conflict (user_id, session_id) do update
    set discord_id = excluded.discord_id,
        ip_address = excluded.ip_address,
        result = excluded.result,
        created_at = now();

  return not blocked;
end;
$$;

create or replace function public.set_member_access(
  p_user_id uuid,
  p_grade text,
  p_is_blocked boolean
)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_profile public.profiles;
begin
  if not public.is_staff() then
    raise exception 'Este necesar gradul STAFF pentru această operație.';
  end if;

  if p_user_id = (select auth.uid()) then
    raise exception 'Nu îți poți modifica propriul grad sau accesul.';
  end if;

  if p_grade is null or char_length(trim(p_grade)) not between 1 and 50 then
    raise exception 'Gradul trebuie să conțină între 1 și 50 de caractere.';
  end if;

  update public.profiles
     set grade = trim(p_grade),
         is_blocked = p_is_blocked,
         updated_at = now()
   where id = p_user_id
   returning * into updated_profile;

  if not found then
    raise exception 'Membrul nu a fost găsit.';
  end if;

  return updated_profile;
end;
$$;

alter table public.profiles enable row level security;
alter table public.access_logs enable row level security;

drop policy if exists "Members can read own profile and staff can read all" on public.profiles;
create policy "Members can read own profile and staff can read all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_staff()));

drop policy if exists "Staff can read recent access logs" on public.access_logs;
create policy "Staff can read recent access logs"
  on public.access_logs for select to authenticated
  using ((select public.is_staff()) and created_at >= now() - interval '30 days');

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
revoke all on public.access_logs from anon, authenticated;
grant select on public.access_logs to authenticated;
revoke all on function public.record_access(inet) from public, anon;
grant execute on function public.record_access(inet) to authenticated;
revoke all on function public.set_member_access(uuid, text, boolean) from public, anon;
grant execute on function public.set_member_access(uuid, text, boolean) to authenticated;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

create extension if not exists pg_cron with schema pg_catalog;
select cron.unschedule(jobid)
  from cron.job
  where jobname = 'sheriff-access-log-retention';
select cron.schedule(
  'sheriff-access-log-retention',
  '15 * * * *',
  $job$delete from public.access_logs where created_at < now() - interval '30 days'$job$
);
