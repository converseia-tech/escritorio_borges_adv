-- Ajusta sequences após inserir dados com IDs manuais.
-- Rode no NOVO projeto Supabase depois de importar os dados.

begin;

select setval(pg_get_serial_sequence('public.users', 'id'), coalesce((select max(id) from public.users), 1), true);
select setval(pg_get_serial_sequence('public.associated_lawyers', 'id'), coalesce((select max(id) from public.associated_lawyers), 1), true);
select setval(pg_get_serial_sequence('public.hero_content', 'id'), coalesce((select max(id) from public.hero_content), 1), true);
select setval(pg_get_serial_sequence('public.practice_areas', 'id'), coalesce((select max(id) from public.practice_areas), 1), true);
select setval(pg_get_serial_sequence('public.team_members', 'id'), coalesce((select max(id) from public.team_members), 1), true);
select setval(pg_get_serial_sequence('public.about_content', 'id'), coalesce((select max(id) from public.about_content), 1), true);
select setval(pg_get_serial_sequence('public.about_page', 'id'), coalesce((select max(id) from public.about_page), 1), true);
select setval(pg_get_serial_sequence('public.contact_info', 'id'), coalesce((select max(id) from public.contact_info), 1), true);
select setval(pg_get_serial_sequence('public.blogs', 'id'), coalesce((select max(id) from public.blogs), 1), true);
select setval(pg_get_serial_sequence('public.blog_images', 'id'), coalesce((select max(id) from public.blog_images), 1), true);
select setval(pg_get_serial_sequence('public.site_settings', 'id'), coalesce((select max(id) from public.site_settings), 1), true);

commit;
