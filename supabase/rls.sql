-- Run in the Supabase SQL editor if public browse is empty.
-- Tables already exist; this only enables RLS and marketplace read policies.

alter table public.profiles enable row level security;
alter table public.vendors enable row level security;
alter table public.venue_details enable row level security;
alter table public.photo_location_details enable row level security;
alter table public.photographer_packages enable row level security;
alter table public.planner_packages enable row level security;
alter table public.makeup_artist_services enable row level security;
alter table public.catering_packages enable row level security;
alter table public.dresses enable row level security;
alter table public.availability enable row level security;
alter table public.bookings enable row level security;
alter table public.dress_bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.email_logs enable row level security;

drop policy if exists "approved vendors are publicly readable" on public.vendors;
create policy "approved vendors are publicly readable"
on public.vendors
for select
using (is_approved = true);

create policy "approved vendor details are publicly readable"
on public.venue_details
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved photo locations are publicly readable"
on public.photo_location_details
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved photographer packages are publicly readable"
on public.photographer_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved planner packages are publicly readable"
on public.planner_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved makeup services are publicly readable"
on public.makeup_artist_services
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved catering packages are publicly readable"
on public.catering_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved dresses are publicly readable"
on public.dresses
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved vendor availability is publicly readable"
on public.availability
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "approved vendor reviews are publicly readable"
on public.reviews
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

create policy "users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "vendors can read own listing" on public.vendors;
create policy "vendors can read own listing"
on public.vendors
for select
using (profile_id = auth.uid() or is_approved = true);

drop policy if exists "vendors can insert own listing" on public.vendors;
create policy "vendors can insert own listing"
on public.vendors
for insert
with check (profile_id = auth.uid());

drop policy if exists "admins can read all vendors" on public.vendors;
create policy "admins can read all vendors"
on public.vendors
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "admins can update vendors" on public.vendors;
create policy "admins can update vendors"
on public.vendors
for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "customers read own bookings"
on public.bookings
for select
using (auth.uid() = customer_id);

create policy "vendors read own bookings"
on public.bookings
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
);

create index if not exists vendors_category_idx on public.vendors (category);
create index if not exists vendors_city_idx on public.vendors (city);
create index if not exists bookings_vendor_id_idx on public.bookings (vendor_id);
create index if not exists bookings_event_date_idx on public.bookings (event_date);
create index if not exists availability_vendor_date_idx on public.availability (vendor_id, date);

-- Admin approve: SECURITY DEFINER so it still works if table UPDATE grants/policies are missing.
create or replace function public.approve_vendor(vendor_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'not authorized';
  end if;

  update public.vendors
  set
    status = 'approved',
    is_approved = true,
    updated_at = now()
  where id = vendor_id;

  if not found then
    raise exception 'vendor not found';
  end if;
end;
$$;

revoke all on function public.approve_vendor(uuid) from public;
grant execute on function public.approve_vendor(uuid) to authenticated;

grant update on table public.vendors to authenticated;

create or replace function public.delete_vendor_user(target_vendor_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile uuid;
  booking_ids uuid[];
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'not authorized';
  end if;

  select profile_id into target_profile
  from public.vendors
  where id = target_vendor_id;

  if target_profile is null then
    raise exception 'vendor not found';
  end if;

  if target_profile = auth.uid() then
    raise exception 'cannot delete yourself';
  end if;

  if exists (
    select 1 from public.profiles
    where id = target_profile and role = 'admin'
  ) then
    raise exception 'cannot delete an admin';
  end if;

  select coalesce(array_agg(id), '{}') into booking_ids
  from public.bookings
  where vendor_id = target_vendor_id;

  delete from public.messages where booking_id = any (booking_ids);
  delete from public.email_logs where booking_id = any (booking_ids);
  delete from public.dress_bookings where booking_id = any (booking_ids);
  delete from public.reviews where vendor_id = target_vendor_id;
  delete from public.bookings where vendor_id = target_vendor_id;
  delete from public.availability where vendor_id = target_vendor_id;
  delete from public.venue_details where vendor_id = target_vendor_id;
  delete from public.photo_location_details where vendor_id = target_vendor_id;
  delete from public.photographer_packages where vendor_id = target_vendor_id;
  delete from public.planner_packages where vendor_id = target_vendor_id;
  delete from public.makeup_artist_services where vendor_id = target_vendor_id;
  delete from public.catering_packages where vendor_id = target_vendor_id;
  delete from public.dresses where vendor_id = target_vendor_id;
  delete from public.vendors where id = target_vendor_id;
  delete from public.profiles where id = target_profile;
  delete from auth.users where id = target_profile;
end;
$$;

revoke all on function public.delete_vendor_user(uuid) from public;
grant execute on function public.delete_vendor_user(uuid) to authenticated;
