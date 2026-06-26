-- LyokFox — esquema completo (idempotente)
-- Tablas: site_cms, profiles, twitter_posts, kp_claims, contact_messages, cms_publish_log

-- ─── CMS (Studio → toda la web) ───
create table if not exists public.site_cms (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists site_cms_updated_at_idx on public.site_cms (updated_at desc);

alter table public.site_cms enable row level security;

drop policy if exists "site_cms public read" on public.site_cms;
create policy "site_cms public read"
  on public.site_cms for select using (true);

drop policy if exists "site_cms auth insert" on public.site_cms;
create policy "site_cms auth insert"
  on public.site_cms for insert with check (auth.uid() is not null);

drop policy if exists "site_cms auth update" on public.site_cms;
create policy "site_cms auth update"
  on public.site_cms for update using (auth.uid() is not null);

-- ─── Perfiles camada (Auth + cuenta) ───
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 18),
  bio text,
  avatar_url text,
  twitter_handle text,
  twitter_user_id text,
  twitter_oauth_connected boolean default false,
  instagram_handle text,
  country text default 'ES',
  favorite_game text default 'Clash Royale',
  points integer default 0,
  lifetime_points integer default 0,
  streak integer default 0,
  public_ranking boolean default true,
  email text,
  camada_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists profiles_points_idx on public.profiles (points desc) where public_ranking = true;
create index if not exists profiles_nickname_idx on public.profiles (nickname);

alter table public.profiles enable row level security;

drop policy if exists "profiles select own or public" on public.profiles;
create policy "profiles select own or public"
  on public.profiles for select using (auth.uid() = id or public_ranking = true);

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles delete own" on public.profiles;
create policy "profiles delete own"
  on public.profiles for delete using (auth.uid() = id);

-- ─── Twitter / KP (comunidad) ───
create table if not exists public.twitter_posts (
  id text primary key,
  tweet_id text unique not null,
  author_handle text default 'LyokFox_',
  text_content text not null,
  tag text,
  tweet_url text not null,
  posted_at timestamptz not null,
  stats_likes integer default 0,
  stats_rts integer default 0,
  synced_at timestamptz default now()
);

create index if not exists twitter_posts_posted_at_idx on public.twitter_posts (posted_at desc);

alter table public.twitter_posts enable row level security;

drop policy if exists "twitter posts public read" on public.twitter_posts;
create policy "twitter posts public read"
  on public.twitter_posts for select using (true);

create table if not exists public.kp_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  post_id text references public.twitter_posts(id),
  action text check (action in ('like', 'rt', 'comment')),
  points integer not null,
  verified boolean default false,
  claimed_at timestamptz default now(),
  unique (user_id, post_id, action)
);

create index if not exists kp_claims_user_idx on public.kp_claims (user_id, claimed_at desc);

alter table public.kp_claims enable row level security;

drop policy if exists "kp claims own" on public.kp_claims;
create policy "kp claims own"
  on public.kp_claims for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─── Contacto (formulario web) ───
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  tipo text default 'general',
  message text not null,
  page_url text,
  created_at timestamptz default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "contact insert public" on public.contact_messages;
create policy "contact insert public"
  on public.contact_messages for insert with check (true);

-- Sin lectura pública (solo service_role / dashboard)
drop policy if exists "contact no public read" on public.contact_messages;
create policy "contact no public read"
  on public.contact_messages for select using (false);

-- ─── Log publicaciones Studio (auditoría) ───
create table if not exists public.cms_publish_log (
  id uuid primary key default gen_random_uuid(),
  cms_id text not null default 'main',
  build text,
  source text default 'studio',
  published_at timestamptz not null default now()
);

create index if not exists cms_publish_log_at_idx on public.cms_publish_log (published_at desc);

alter table public.cms_publish_log enable row level security;
-- Sin políticas = solo service_role

-- ─── Triggers ───
create or replace function public.set_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- ─── Vista ranking KP ───
create or replace view public.leaderboard as
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
  where public_ranking = true
  order by points desc, lifetime_points desc;

grant select on public.leaderboard to anon, authenticated;

-- ─── Permisos API REST ───
grant usage on schema public to anon, authenticated;
grant select on public.site_cms to anon, authenticated;
grant select on public.twitter_posts to anon, authenticated;
grant select on public.leaderboard to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.kp_claims to authenticated;
grant insert on public.contact_messages to anon, authenticated;

-- Fila CMS inicial vacía (seed script la rellena)
insert into public.site_cms (id, payload)
values ('main', '{"data":{},"visibility":{}}'::jsonb)
on conflict (id) do nothing;
