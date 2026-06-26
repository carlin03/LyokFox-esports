-- LyokFox — Realtime en site_cms (sync Studio entre navegadores)
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
