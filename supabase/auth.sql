-- Run in the Supabase SQL editor once.
-- Creates a profile for every new auth user and respects intended_role from signup metadata.
-- Admin is never taken from signup metadata — only from the allowlisted emails below.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  intended text;
  new_role public.user_role;
begin
  intended := coalesce(new.raw_user_meta_data->>'intended_role', 'customer');

  if lower(coalesce(new.email, '')) = 'dev@gonovo.tech' then
    new_role := 'admin';
  elsif intended in ('customer', 'vendor') then
    new_role := intended::public.user_role;
  else
    new_role := 'customer';
  end if;

  insert into public.profiles (id, role, email, full_name)
  values (
    new.id,
    new_role,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1))
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Safe existence check for signup. Does not return any user data.
create or replace function public.email_exists(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users
    where lower(email) = lower(trim(check_email))
  );
$$;

revoke all on function public.email_exists(text) from public;
grant execute on function public.email_exists(text) to anon, authenticated;

-- Promote the Gonovo operator account. Requires an auth.users row for this email.
insert into public.profiles (id, role, email, full_name, phone, avatar_url)
select
  u.id,
  'admin'::public.user_role,
  'dev@gonovo.tech',
  'Gonovo',
  '0449582',
  'https://media.licdn.com/dms/image/v2/D4E0BAQEnpqztslZ1FQ/company-logo_200_200/B4EZT_mAjXHcAM-/0/1739454941761/gonovo_logo?e=2147483647&v=beta&t=ncOf6-_HYK7ydkN6RAA6VzM_iKvapXbIC6IuM4wx5Lk'
from auth.users u
where lower(u.email) = 'dev@gonovo.tech'
on conflict (id) do update
set
  role = excluded.role,
  email = excluded.email,
  full_name = excluded.full_name,
  phone = excluded.phone,
  avatar_url = excluded.avatar_url,
  updated_at = now();
