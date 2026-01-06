-- Schema base (PostgreSQL/Supabase)
-- Gerado a partir do modelo em drizzle/schema-pg.ts
-- Objetivo: criar as tabelas no NOVO projeto Supabase antes da migração de dados.

begin;

create table if not exists public.users (
  id serial primary key,
  open_id varchar(64) not null unique,
  name text,
  email varchar(320),
  login_method varchar(64),
  role varchar(20) not null default 'user',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  last_signed_in timestamp not null default now()
);

create table if not exists public.associated_lawyers (
  id serial primary key,
  name varchar(255) not null,
  oab varchar(50) not null,
  display_order integer not null default 0,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.hero_content (
  id serial primary key,
  title varchar(255) not null,
  subtitle text not null,
  cta_text varchar(100),
  cta_link varchar(255),
  background_image text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.practice_areas (
  id serial primary key,
  title varchar(255) not null,
  slug varchar(255) not null,
  description text,
  detailed_content text,
  featured_image text,
  icon varchar(50),
  display_order integer default 0,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  constraint practice_areas_slug_unique unique (slug)
);

create table if not exists public.team_members (
  id serial primary key,
  name varchar(255) not null,
  position varchar(255) not null,
  bio text,
  image text,
  oab varchar(50),
  display_order integer not null default 0,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.about_content (
  id serial primary key,
  title varchar(255) not null,
  subtitle varchar(255),
  content text not null,
  image text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.about_page (
  id serial primary key,
  hero_title varchar(200) not null default 'Sobre nós',
  hero_background_image text,
  history_title varchar(200) not null default 'Conheça nossa história',
  history_subtitle varchar(300),
  history_content text not null,
  history_image text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.contact_info (
  id serial primary key,
  phone varchar(50),
  address text,
  email varchar(320),
  hours jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.blogs (
  id serial primary key,
  title varchar(255) not null,
  slug varchar(255) not null,
  content text not null,
  excerpt text,
  featured_image text,
  author varchar(255),
  published smallint not null default 0,
  published_at timestamp,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  constraint blogs_slug_unique unique (slug)
);

create table if not exists public.blog_images (
  id serial primary key,
  blog_id integer not null,
  image_url text not null,
  alt_text text,
  created_at timestamp not null default now()
);

create table if not exists public.site_settings (
  id serial primary key,
  site_name varchar(255),
  logo_url text,
  favicon_url text,
  social_media jsonb,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

commit;
