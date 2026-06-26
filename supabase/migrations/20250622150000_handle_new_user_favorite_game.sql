-- LyokFox — favorito de juego al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nick text;
  fav text;
begin
  nick := coalesce(nullif(trim(new.raw_user_meta_data->>'nickname'), ''), split_part(coalesce(new.email, 'fox'), '@', 1));
  nick := left(nick, 18);
  if char_length(nick) < 2 then nick := 'Fox' || left(replace(new.id::text, '-', ''), 4); end if;
  fav := coalesce(nullif(trim(new.raw_user_meta_data->>'favorite_game'), ''), 'Clash Royale');
  insert into public.profiles (id, nickname, email, favorite_game, camada_data)
  values (new.id, nick, new.email, fav, jsonb_build_object('role', 'fan', 'created', now()))
  on conflict (id) do update set
    email = excluded.email,
    favorite_game = coalesce(excluded.favorite_game, profiles.favorite_game);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
