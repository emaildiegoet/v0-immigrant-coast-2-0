-- Costa del Inmigrante 2.0 - Database Schema
-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'user' check (role in ('user', 'moderator', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Admin policy to view all profiles
create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- Admin policy to update user roles
create policy "profiles_update_admin"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Properties table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price decimal(12,2),
  currency text default 'USD',
  property_type text not null check (property_type in ('casa', 'apartamento', 'terreno', 'comercial', 'quinta')),
  operation_type text not null check (operation_type in ('venta', 'alquiler', 'alquiler_temporal')),
  bedrooms integer,
  bathrooms integer,
  area_m2 decimal(10,2),
  address text,
  neighborhood text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  images text[] default '{}',
  amenities text[] default '{}',
  contact_name text,
  contact_phone text,
  contact_email text,
  contact_whatsapp text,
  is_featured boolean default false,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.properties enable row level security;

-- Properties policies
create policy "properties_select_all"
  on public.properties for select
  using (is_active = true);

create policy "properties_select_admin"
  on public.properties for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "properties_insert_auth"
  on public.properties for insert
  with check (auth.uid() = created_by);

create policy "properties_update_own"
  on public.properties for update
  using (auth.uid() = created_by);

create policy "properties_update_admin"
  on public.properties for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- Services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('electricista', 'plomero', 'carpintero', 'pintor', 'jardinero', 'limpieza', 'construccion', 'mecanico', 'veterinario', 'medico', 'abogado', 'contador', 'profesor', 'restaurante', 'supermercado', 'farmacia', 'otro')),
  contact_name text not null,
  contact_phone text,
  contact_email text,
  contact_whatsapp text,
  address text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  images text[] default '{}',
  working_hours jsonb,
  website text,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

-- Services policies
create policy "services_select_active"
  on public.services for select
  using (is_active = true);

create policy "services_select_admin"
  on public.services for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "services_insert_auth"
  on public.services for insert
  with check (auth.uid() = created_by);

create policy "services_update_own"
  on public.services for update
  using (auth.uid() = created_by);

create policy "services_update_admin"
  on public.services for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

-- Reviews policies
create policy "reviews_select_approved"
  on public.reviews for select
  using (is_approved = true);

create policy "reviews_select_admin"
  on public.reviews for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "reviews_insert_auth"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews_update_admin"
  on public.reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- News table
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image text,
  category text not null check (category in ('local', 'inmobiliario', 'servicios', 'eventos', 'turismo', 'general')),
  tags text[] default '{}',
  is_published boolean default false,
  is_featured boolean default false,
  published_at timestamp with time zone,
  author_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.news enable row level security;

-- News policies
create policy "news_select_published"
  on public.news for select
  using (is_published = true and published_at <= now());

create policy "news_select_admin"
  on public.news for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "news_insert_admin"
  on public.news for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "news_update_admin"
  on public.news for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- Create indexes for better performance
create index if not exists idx_properties_type on public.properties(property_type);
create index if not exists idx_properties_operation on public.properties(operation_type);
create index if not exists idx_properties_featured on public.properties(is_featured);
create index if not exists idx_properties_active on public.properties(is_active);
create index if not exists idx_services_category on public.services(category);
create index if not exists idx_services_active on public.services(is_active);
create index if not exists idx_reviews_service on public.reviews(service_id);
create index if not exists idx_reviews_approved on public.reviews(is_approved);
create index if not exists idx_news_published on public.news(is_published, published_at);
create index if not exists idx_news_slug on public.news(slug);
