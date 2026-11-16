-- =====================================================
-- Customers schema for Supabase (PostgreSQL)
-- شغّله في Supabase Dashboard > SQL Editor
-- =====================================================

-- ---------- Extensions ----------
create extension if not exists citext;

-- ---------- Enums ----------
create type public.gender_type     as enum ('male', 'female', 'unspecified');
create type public.customer_role   as enum ('customer', 'admin');
create type public.customer_status as enum ('pending', 'active', 'blocked');

-- ---------- Customers ----------
-- id = نفس id بتاع المستخدم في auth.users (UUID)
create table public.customers (
  id                uuid primary key references auth.users (id) on delete cascade,
  first_name        text not null default '',
  last_name         text not null default '',
  email             citext not null unique,          -- citext: مش حساس لحالة الحروف
  phone             text,                            -- يتطلب في الـ checkout
  gender            public.gender_type not null default 'unspecified',
  birth_date        date,
  image_url         text,

  role              public.customer_role   not null default 'customer',
  status            public.customer_status not null default 'pending',
  marketing_consent boolean not null default false,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,                     -- soft delete

  constraint customers_birth_date_check
    check (birth_date is null or birth_date < current_date),
  constraint customers_phone_check
    check (phone is null or phone ~ '^\+?[0-9\s\-()]{7,20}$')
);

create index customers_status_idx     on public.customers (status);
create index customers_created_at_idx on public.customers (created_at desc);
create index customers_name_idx       on public.customers (lower(first_name), lower(last_name));

-- ---------- Addresses ----------
create table public.customer_addresses (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  label       text,                                  -- بيت، شغل
  address     text not null,
  city        text not null,
  state       text not null,
  postal_code text,
  country     text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index customer_addresses_customer_idx on public.customer_addresses (customer_id);

-- عنوان افتراضي واحد فقط لكل عميل
create unique index customer_addresses_one_default_idx
  on public.customer_addresses (customer_id)
  where is_default;

-- ---------- Helper: updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
-- ال trigger ميزته انه بيتنفذ ذاتيا بعد ما حدث معين يحصل
-- هنا قبل update علي الجدول الداله set_updated_at هتتنفذ علي كل صف ال update هيأثر فيه
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

create trigger customer_addresses_set_updated_at
  before update on public.customer_addresses
  for each row execute function public.set_updated_at();

-- ---------- Helper: is_admin ----------
-- security definer عشان نتجنب recursion جوه الـ RLS policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.customers
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
      and deleted_at is null
  );
$$;

-- ---------- إنشاء صف customer تلقائياً عند التسجيل ----------
-- مهم: الـ role والـ status بياخدوا القيم الافتراضية، ومش بنقراهم من metadata أبداً
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- حماية role و status من التعديل بواسطة العميل ----------
-- auth.uid() = null يعني تنفيذ من SQL Editor أو service role، فمسموح
create or replace function public.protect_customer_privileged_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role   is distinct from old.role
    or new.status is distinct from old.status
    or new.deleted_at is distinct from old.deleted_at then
      raise exception 'Not allowed to change role, status or deleted_at';
    end if;
  end if;
  return new;
end;
$$;

create trigger customers_protect_privileged_fields
  before update on public.customers
  for each row execute function public.protect_customer_privileged_fields();

-- ---------- Row Level Security ----------
alter table public.customers          enable row level security;
alter table public.customer_addresses enable row level security;

-- customers
create policy "customers: read own or admin"
  on public.customers for select
  using (id = auth.uid() or public.is_admin());

create policy "customers: update own or admin"
  on public.customers for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "customers: admin delete"
  on public.customers for delete
  using (public.is_admin());

-- الإضافة بتتم من الـ trigger (handle_new_user) أو الأدمن فقط
create policy "customers: admin insert"
  on public.customers for insert
  with check (public.is_admin());

-- addresses
create policy "addresses: read own or admin"
  on public.customer_addresses for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "addresses: insert own or admin"
  on public.customer_addresses for insert
  with check (customer_id = auth.uid() or public.is_admin());

create policy "addresses: update own or admin"
  on public.customer_addresses for update
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

create policy "addresses: delete own or admin"
  on public.customer_addresses for delete
  using (customer_id = auth.uid() or public.is_admin());

-- =====================================================
-- بعد ما تسجل أول حساب، خليه أدمن (من SQL Editor):
--
-- update public.customers
--   set role = 'admin', status = 'active'
--   where email = 'your-email@example.com';
-- =====================================================