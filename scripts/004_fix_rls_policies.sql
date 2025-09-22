-- Fix infinite recursion in RLS policies
-- Drop existing problematic policies
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
drop policy if exists "properties_select_admin" on public.properties;
drop policy if exists "properties_update_admin" on public.properties;
drop policy if exists "services_select_admin" on public.services;
drop policy if exists "services_update_admin" on public.services;
drop policy if exists "reviews_select_admin" on public.reviews;
drop policy if exists "reviews_update_admin" on public.reviews;
drop policy if exists "news_select_admin" on public.news;
drop policy if exists "news_insert_admin" on public.news;
drop policy if exists "news_update_admin" on public.news;

-- Create a security definer function to check admin role
create or replace function public.is_admin_or_moderator()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Recreate admin policies using the security definer functions
create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin_or_moderator());

create policy "profiles_update_admin"
  on public.profiles for update
  using (public.is_admin());

create policy "properties_select_admin"
  on public.properties for select
  using (public.is_admin_or_moderator());

create policy "properties_update_admin"
  on public.properties for update
  using (public.is_admin_or_moderator());

create policy "services_select_admin"
  on public.services for select
  using (public.is_admin_or_moderator());

create policy "services_update_admin"
  on public.services for update
  using (public.is_admin_or_moderator());

create policy "reviews_select_admin"
  on public.reviews for select
  using (public.is_admin_or_moderator());

create policy "reviews_update_admin"
  on public.reviews for update
  using (public.is_admin_or_moderator());

create policy "news_select_admin"
  on public.news for select
  using (public.is_admin_or_moderator());

create policy "news_insert_admin"
  on public.news for insert
  with check (public.is_admin_or_moderator());

create policy "news_update_admin"
  on public.news for update
  using (public.is_admin_or_moderator());
