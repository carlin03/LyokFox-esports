-- LyokFox Studio CMS — contenido global de la web (JSON)
create table if not exists public.site_cms (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_cms enable row level security;

-- Todos los visitantes leen el CMS publicado
create policy "site_cms public read"
  on public.site_cms for select
  using (true);

-- Solo usuarios autenticados pueden publicar (cuenta admin del club)
create policy "site_cms auth insert"
  on public.site_cms for insert
  with check (auth.uid() is not null);

create policy "site_cms auth update"
  on public.site_cms for update
  using (auth.uid() is not null);
