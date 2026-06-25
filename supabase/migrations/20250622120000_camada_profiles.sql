-- LyokFox Camada — perfiles, posts X y KP (fase 2)
-- Ejecutar cuando tengas proyecto Supabase conectado.

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
  favorite_game text default 'brawlStars',
  points integer default 0,
  lifetime_points integer default 0,
  streak integer default 0,
  public_ranking boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

alter table public.profiles enable row level security;
alter table public.twitter_posts enable row level security;
alter table public.kp_claims enable row level security;

create policy "profiles read public nicknames"
  on public.profiles for select using (public_ranking = true);

create policy "profiles own row"
  on public.profiles for all using (auth.uid() = id);

create policy "twitter posts public read"
  on public.twitter_posts for select using (true);

create policy "kp claims own"
  on public.kp_claims for all using (auth.uid() = user_id);
