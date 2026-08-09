-- Violet's Memoirs — database schema
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It is safe to re-run: objects are dropped first where needed.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles
-- One row per signed-up user. Anonymous visitors ("readers") have no row.
-- role: 'admin' (Violette) or 'subscriber' (anyone with a free account)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Reader'
    check (char_length(display_name) between 1 and 60),
  role text not null default 'subscriber'
    check (role in ('admin', 'subscriber')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Column-level privileges stop users from promoting themselves to admin.
-- They may only edit their display name.
revoke update on table public.profiles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant update (display_name) on table public.profiles to authenticated;

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helper functions used by policies
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Poems
-- ---------------------------------------------------------------------------
create table if not exists public.poems (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,120}$'),
  title text not null check (char_length(title) between 1 and 200),
  excerpt text check (char_length(excerpt) <= 400),
  body text not null check (char_length(body) between 1 and 40000),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists poems_created_at_idx on public.poems (created_at desc);

alter table public.poems enable row level security;

drop policy if exists "poems_select_public" on public.poems;
create policy "poems_select_public" on public.poems
  for select using (published or public.is_admin());

drop policy if exists "poems_admin_all" on public.poems;
create policy "poems_admin_all" on public.poems
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Comments (account required to post; anyone may read)
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  poem_id uuid not null references public.poems (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_poem_idx on public.comments (poem_id, created_at);

alter table public.comments enable row level security;

drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
  for select using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments
  for insert with check (auth.uid() = author_id);

drop policy if exists "comments_delete_own_or_admin" on public.comments;
create policy "comments_delete_own_or_admin" on public.comments
  for delete using (auth.uid() = author_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- Likes
-- Signed-in users like with their user id. Anonymous readers like with a
-- random device id kept in their browser; one like per poem either way.
-- ---------------------------------------------------------------------------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  poem_id uuid not null references public.poems (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  anon_id text check (char_length(anon_id) between 8 and 64),
  created_at timestamptz not null default now(),
  constraint like_has_one_owner check (
    (user_id is not null and anon_id is null)
    or (user_id is null and anon_id is not null)
  )
);

create unique index if not exists likes_user_unique on public.likes (poem_id, user_id)
  where user_id is not null;
create unique index if not exists likes_anon_unique on public.likes (poem_id, anon_id)
  where anon_id is not null;
create index if not exists likes_poem_idx on public.likes (poem_id);

alter table public.likes enable row level security;

drop policy if exists "likes_select" on public.likes;
create policy "likes_select" on public.likes
  for select using (true);

drop policy if exists "likes_insert" on public.likes;
create policy "likes_insert" on public.likes
  for insert with check (
    (auth.uid() is not null and user_id = auth.uid() and anon_id is null)
    or (auth.uid() is null and user_id is null and anon_id is not null)
  );

drop policy if exists "likes_delete" on public.likes;
create policy "likes_delete" on public.likes
  for delete using (
    (user_id is not null and user_id = auth.uid())
    or (auth.uid() is null and user_id is null)
  );

-- ---------------------------------------------------------------------------
-- Forum: threads and replies (account required to post; anyone may read)
-- ---------------------------------------------------------------------------
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 8000),
  author_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists threads_created_at_idx on public.threads (created_at desc);

alter table public.threads enable row level security;

drop policy if exists "threads_select" on public.threads;
create policy "threads_select" on public.threads
  for select using (true);

drop policy if exists "threads_insert_own" on public.threads;
create policy "threads_insert_own" on public.threads
  for insert with check (auth.uid() = author_id);

drop policy if exists "threads_delete_own_or_admin" on public.threads;
create policy "threads_delete_own_or_admin" on public.threads
  for delete using (auth.uid() = author_id or public.is_admin());

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  author_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists replies_thread_idx on public.replies (thread_id, created_at);

alter table public.replies enable row level security;

drop policy if exists "replies_select" on public.replies;
create policy "replies_select" on public.replies
  for select using (true);

drop policy if exists "replies_insert_own" on public.replies;
create policy "replies_insert_own" on public.replies
  for insert with check (auth.uid() = author_id);

drop policy if exists "replies_delete_own_or_admin" on public.replies;
create policy "replies_delete_own_or_admin" on public.replies
  for delete using (auth.uid() = author_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- Quick chat
-- A single running feed on the forum page for short messages that don't
-- need a full thread. Anyone can read; posting needs an account.
-- ---------------------------------------------------------------------------
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_created_at_idx
  on public.chat_messages (created_at desc);

alter table public.chat_messages enable row level security;

drop policy if exists "chat_select" on public.chat_messages;
create policy "chat_select" on public.chat_messages
  for select using (true);

drop policy if exists "chat_insert_own" on public.chat_messages;
create policy "chat_insert_own" on public.chat_messages
  for insert with check (auth.uid() = author_id);

drop policy if exists "chat_delete_own_or_admin" on public.chat_messages;
create policy "chat_delete_own_or_admin" on public.chat_messages
  for delete using (auth.uid() = author_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- After running this file:
-- 1. Sign up through the site with Violette's email.
-- 2. Promote that account to admin:
--
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'violette@example.com');
--
-- ---------------------------------------------------------------------------
