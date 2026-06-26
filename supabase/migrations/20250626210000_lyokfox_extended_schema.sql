-- LyokFox — tablas extra + correcciones RLS/seguridad

-- ─── Snapshots CMS (backup automático al publicar) ───
create table if not exists public.site_cms_snapshots (
  id uuid primary key default gen_random_uuid(),
  cms_id text not null default 'main',
  payload jsonb not null,
  build text,
  source text default 'studio-api',
  created_at timestamptz not null default now()
);

create index if not exists site_cms_snapshots_created_idx on public.site_cms_snapshots (created_at desc);

alter table public.site_cms_snapshots enable row level security;
-- Sin políticas públicas: solo service_role

-- ─── Estado comunidad por usuario (KP, misiones — sync entre dispositivos) ───
create table if not exists public.user_community_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists user_community_state_updated_idx on public.user_community_state (updated_at desc);

alter table public.user_community_state enable row level security;

drop policy if exists "community state own" on public.user_community_state;
create policy "community state own"
  on public.user_community_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Registro salud / versión (diagnóstico) ───
create table if not exists public.site_health (
  id text primary key default 'main',
  last_cms_pull_ok timestamptz,
  last_publish_at timestamptz,
  build text,
  meta jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_health enable row level security;

drop policy if exists "site_health public read" on public.site_health;
create policy "site_health public read"
  on public.site_health for select using (true);

insert into public.site_health (id) values ('main') on conflict (id) do nothing;

-- ─── Vista leaderboard (security invoker) ───
drop view if exists public.leaderboard;
create view public.leaderboard
  with (security_invoker = true) as
  select
    id,
    nickname,
    avatar_url,
    favorite_game,
    points,
    lifetime_points,
    streak,
    public_ranking
  from public.profiles
  where public_ranking = true;

grant select on public.leaderboard to anon, authenticated;
grant select, insert, update, delete on public.user_community_state to authenticated;

-- ─── Funciones: search_path + permisos ───
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;

-- ─── Realtime site_cms (idempotente) ───
alter table public.site_cms replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'site_cms'
  ) then
    alter publication supabase_realtime add table public.site_cms;
  end if;
end $$;

-- ─── Grants REST ───
grant select on public.site_health to anon, authenticated;
