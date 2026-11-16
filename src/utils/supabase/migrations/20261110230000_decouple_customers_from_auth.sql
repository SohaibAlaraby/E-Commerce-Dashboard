-- =====================================================
-- Migration: فصل العميل (customers) عن حساب الدخول (auth.users)
-- شغّله بعد customers-schema.sql
--
-- النتيجة:
--   * customers.id بقى UUID مستقل (default gen_random_uuid())
--   * عمود جديد auth_user_id بيربط العميل بحساب الدخول (اختياري)
--   * تقدر تعمل seed للـ mock data بـ insert عادي
-- =====================================================

-- 1) عمود الربط بحساب الدخول
alter table public.customers
  add column auth_user_id uuid unique
  references auth.users (id) on delete set null;

-- 2) الصفوف الموجودة (لو فيه): كان id = id المستخدم
update public.customers
  set auth_user_id = id
  where auth_user_id is null;

-- 3) فك ربط id بـ auth.users وخليه يتولّد لوحده
alter table public.customers
  drop constraint customers_id_fkey;

alter table public.customers
  alter column id set default gen_random_uuid();

-- 4) دالة بترجّع id العميل بتاع المستخدم الحالي
create or replace function public.current_customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.customers where auth_user_id = auth.uid();
$$;

-- 5) is_admin بقت تدوّر بـ auth_user_id
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
    where auth_user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
      and deleted_at is null
  );
$$;

-- 6) الـ trigger اللي بينشئ العميل عند التسجيل
--    on conflict do nothing: لو الإيميل موجود (من الـ seed) مايكسرش التسجيل
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (auth_user_id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (email) do nothing;
  return new;
end;
$$;

-- 7) حماية الحقول الحساسة (ضفنا auth_user_id)
create or replace function public.protect_customer_privileged_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role         is distinct from old.role
    or new.status       is distinct from old.status
    or new.deleted_at   is distinct from old.deleted_at
    or new.auth_user_id is distinct from old.auth_user_id then
      raise exception 'Not allowed to change role, status, deleted_at or auth_user_id';
    end if;
  end if;
  return new;
end;
$$;

-- 8) إعادة إنشاء الـ policies
drop policy "customers: read own or admin"   on public.customers;
drop policy "customers: update own or admin" on public.customers;

create policy "customers: read own or admin"
  on public.customers for select
  using (auth_user_id = auth.uid() or public.is_admin());

create policy "customers: update own or admin"
  on public.customers for update
  using (auth_user_id = auth.uid() or public.is_admin())
  with check (auth_user_id = auth.uid() or public.is_admin());

drop policy "addresses: read own or admin"   on public.customer_addresses;
drop policy "addresses: insert own or admin" on public.customer_addresses;
drop policy "addresses: update own or admin" on public.customer_addresses;
drop policy "addresses: delete own or admin" on public.customer_addresses;

create policy "addresses: read own or admin"
  on public.customer_addresses for select
  using (customer_id = public.current_customer_id() or public.is_admin());

create policy "addresses: insert own or admin"
  on public.customer_addresses for insert
  with check (customer_id = public.current_customer_id() or public.is_admin());

create policy "addresses: update own or admin"
  on public.customer_addresses for update
  using (customer_id = public.current_customer_id() or public.is_admin())
  with check (customer_id = public.current_customer_id() or public.is_admin());

create policy "addresses: delete own or admin"
  on public.customer_addresses for delete
  using (customer_id = public.current_customer_id() or public.is_admin());

-- =====================================================
-- مثال seed (من SQL Editor أو service role، الـ RLS مش بتمنعه):
--
-- insert into public.customers (first_name, last_name, email, phone, status, created_at)
-- values ('Emily', 'Johnson', 'emily@example.com', '+1 555 0100', 'active', '2026-02-14');
--
-- insert into public.customer_addresses (customer_id, address, city, state, postal_code, country, is_default)
-- select id, '626 Main Street', 'Phoenix', 'Mississippi', '29112', 'United States', true
-- from public.customers where email = 'emily@example.com';
--
-- وبعد ما تسجل حسابك، خليه أدمن:
-- update public.customers set role = 'admin', status = 'active'
--   where email = 'your-email@example.com';
-- =====================================================