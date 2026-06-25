-- LyokFox Auth fase 2 — email, camada_data, trigger registro
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists camada_data jsonb default '{}'::jsonb;

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nick text;
begin
  nick := coalesce(nullif(trim(new.raw_user_meta_data->>'nickname'), ''), split_part(coalesce(new.email, 'fox'), '@', 1));
  nick := left(nick, 18);
  if char_length(nick) < 2 then nick := 'Fox' || left(replace(new.id::text, '-', ''), 4); end if;
  insert into public.profiles (id, nickname, email)
  values (new.id, nick, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Políticas: el usuario gestiona su fila
drop policy if exists "profiles own row" on public.profiles;
drop policy if exists "profiles read public nicknames" on public.profiles;

create policy "profiles select own or public"
  on public.profiles for select
  using (auth.uid() = id or public_ranking = true);

create policy "profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles delete own"
  on public.profiles for delete
  using (auth.uid() = id);
