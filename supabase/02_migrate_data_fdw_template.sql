-- Migração de dados (SQL puro) entre dois Postgres usando postgres_fdw.
-- Preencha os placeholders OLD_* com os dados do BANCO ANTIGO.
-- Rode este arquivo no NOVO projeto Supabase.
--
-- Importante:
-- - Requer permissão para criar extensão e server (no Supabase normalmente funciona como role postgres/owner).
-- - A forma mais simples e "100% sem dor" ainda é pg_dump/pg_restore, mas este arquivo atende ao pedido de "SQL".
--
-- ⚠️ ATENÇÃO SOBRE OLD_DB_HOST
-- - O erro "could not translate host name 'OLD_DB_HOST'" acontece quando você não substituiu os placeholders
--   (ou quando o hostname informado não existe/ não é resolvível).
-- - OLD_DB_HOST NÃO é a URL do projeto (ex: https://xxxx.supabase.co). Isso é URL da API.
-- - Para Supabase, o host do Postgres antigo normalmente é algo como:
--     db.<project-ref>.supabase.co
--   Você encontra isso em: Supabase (projeto antigo) -> Settings -> Database -> Connection string.
--
-- ✅ No seu caso (projeto antigo: qzcdkfaaivwpfdpxchpl), o host provavelmente é:
--     db.qzcdkfaaivwpfdpxchpl.supabase.co
--   dbname costuma ser: postgres
--   port: 5432
--   user: postgres (ou postgres.<project-ref>, depende do painel)
--
-- ⚠️ Sem a SENHA do Postgres antigo, não tem como usar postgres_fdw.
-- Se você ainda tem acesso ao painel do projeto antigo, faça:
--   Settings -> Database -> Reset database password
-- e use a senha nova na seção (3) abaixo.
-- - Se o ambiente do banco novo não conseguir resolver DNS/chegar no host antigo (restrição de rede),
--   postgres_fdw não vai funcionar. Nesse caso, migre via pg_dump/psql (posso te passar o comando).

begin;

-- 1) Extensão
create extension if not exists postgres_fdw;

-- 2) Conexão com o banco antigo
-- Substitua os valores abaixo (NÃO commitar credenciais!).
drop server if exists old_db_server cascade;
create server old_db_server
  foreign data wrapper postgres_fdw
  options (
    -- Exemplo Supabase antigo: host 'db.qzcdkfaaivwpfdpxchpl.supabase.co'
    host 'OLD_DB_HOST',
    port '5432',
    dbname 'OLD_DB_NAME'
  );

-- 3) Mapeamento de usuário (credenciais do banco antigo)
create user mapping for current_user
  server old_db_server
  options (
    user 'OLD_DB_USER',
    password 'OLD_DB_PASSWORD'
  );

-- 4) Importa as tabelas do schema public do banco antigo como foreign tables
create schema if not exists old_public;
drop schema if exists old_public cascade;
create schema old_public;

import foreign schema public
  from server old_db_server
  into old_public;

-- 4.1) Teste rápido: garante que importou e consegue ler
-- Se falhar aqui, o problema é conexão (host/porta/dbname/user/senha/rede).
-- select count(*) as users_count from old_public.users;

-- 5) Copia dados (mantém IDs)
-- Se o novo banco estiver vazio, isso preserva 100% dos dados.
-- Se rodar mais de uma vez, pode duplicar; por isso está em ordem + você pode truncar antes, se desejar.

insert into public.users (id, open_id, name, email, login_method, role, created_at, updated_at, last_signed_in)
select id, open_id, name, email, login_method, role, created_at, updated_at, last_signed_in
from old_public.users;

insert into public.associated_lawyers (id, name, oab, display_order, created_at, updated_at)
select id, name, oab, display_order, created_at, updated_at
from old_public.associated_lawyers;

insert into public.hero_content (id, title, subtitle, cta_text, cta_link, background_image, created_at, updated_at)
select id, title, subtitle, cta_text, cta_link, background_image, created_at, updated_at
from old_public.hero_content;

insert into public.practice_areas (id, title, slug, description, detailed_content, featured_image, icon, display_order, created_at, updated_at)
select id, title, slug, description, detailed_content, featured_image, icon, display_order, created_at, updated_at
from old_public.practice_areas;

insert into public.team_members (id, name, position, bio, image, oab, display_order, created_at, updated_at)
select id, name, position, bio, image, oab, display_order, created_at, updated_at
from old_public.team_members;

insert into public.about_content (id, title, subtitle, content, image, created_at, updated_at)
select id, title, subtitle, content, image, created_at, updated_at
from old_public.about_content;

insert into public.about_page (id, hero_title, hero_background_image, history_title, history_subtitle, history_content, history_image, created_at, updated_at)
select id, hero_title, hero_background_image, history_title, history_subtitle, history_content, history_image, created_at, updated_at
from old_public.about_page;

insert into public.contact_info (id, phone, address, email, hours, created_at, updated_at)
select id, phone, address, email, hours, created_at, updated_at
from old_public.contact_info;

insert into public.blogs (id, title, slug, content, excerpt, featured_image, author, published, published_at, created_at, updated_at)
select id, title, slug, content, excerpt, featured_image, author, published, published_at, created_at, updated_at
from old_public.blogs;

insert into public.blog_images (id, blog_id, image_url, alt_text, created_at)
select id, blog_id, image_url, alt_text, created_at
from old_public.blog_images;

insert into public.site_settings (id, site_name, logo_url, favicon_url, social_media, created_at, updated_at)
select id, site_name, logo_url, favicon_url, social_media, created_at, updated_at
from old_public.site_settings;

commit;
