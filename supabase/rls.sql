-- Run in the Supabase SQL editor.
-- If profile, bookings, or featured vendors are empty while signed in, this file
-- drops the recursive profiles policy that caused that. Re-run the whole script.

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

drop policy if exists "approved vendor details are publicly readable" on public.venue_details;
create policy "approved vendor details are publicly readable"
on public.venue_details
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved photo locations are publicly readable" on public.photo_location_details;
create policy "approved photo locations are publicly readable"
on public.photo_location_details
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved photographer packages are publicly readable" on public.photographer_packages;
create policy "approved photographer packages are publicly readable"
on public.photographer_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved planner packages are publicly readable" on public.planner_packages;
create policy "approved planner packages are publicly readable"
on public.planner_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved makeup services are publicly readable" on public.makeup_artist_services;
create policy "approved makeup services are publicly readable"
on public.makeup_artist_services
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved catering packages are publicly readable" on public.catering_packages;
create policy "approved catering packages are publicly readable"
on public.catering_packages
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved dresses are publicly readable" on public.dresses;
create policy "approved dresses are publicly readable"
on public.dresses
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved vendor availability is publicly readable" on public.availability;
create policy "approved vendor availability is publicly readable"
on public.availability
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "approved vendor reviews are publicly readable" on public.reviews;
create policy "approved vendor reviews are publicly readable"
on public.reviews
for select
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.is_approved = true
  )
);

drop policy if exists "users can read their own profile" on public.profiles;
create policy "users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

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
using (public.is_admin());

drop policy if exists "admins can update vendors" on public.vendors;
create policy "admins can update vendors"
on public.vendors
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "customers read own bookings" on public.bookings;
create policy "customers read own bookings"
on public.bookings
for select
using (auth.uid() = customer_id);

drop policy if exists "customers insert own bookings" on public.bookings;
create policy "customers insert own bookings"
on public.bookings
for insert
with check (
  auth.uid() = customer_id
  and status = 'pending'
  and payment_status = 'unpaid'
);

grant insert on table public.bookings to authenticated;

drop policy if exists "vendors read own bookings" on public.bookings;
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
grant update on table public.profiles to authenticated;

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

grant select, update on table public.bookings to authenticated;
grant insert, update on table public.availability to authenticated;

drop policy if exists "vendors update own bookings" on public.bookings;
create policy "vendors update own bookings"
on public.bookings
for update
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
);

drop policy if exists "vendors write own availability" on public.availability;
create policy "vendors write own availability"
on public.availability
for insert
with check (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
);

drop policy if exists "vendors update own availability" on public.availability;
create policy "vendors update own availability"
on public.availability
for update
using (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.vendors v
    where v.id = vendor_id and v.profile_id = auth.uid()
  )
);

-- Do not SELECT profiles via bookings/vendors: that recurses
-- profiles -> bookings -> vendors -> profiles and empties signed-in reads.
drop policy if exists "vendors read booking customer profiles" on public.profiles;

create or replace function public.profiles_for_vendor_bookings()
returns table (
  id uuid,
  full_name text,
  email text,
  phone text
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id, p.full_name, p.email, p.phone
  from public.profiles p
  where exists (
    select 1
    from public.bookings b
    join public.vendors v on v.id = b.vendor_id
    where b.customer_id = p.id
      and v.profile_id = auth.uid()
  );
$$;

revoke all on function public.profiles_for_vendor_bookings() from public;
grant execute on function public.profiles_for_vendor_bookings() to authenticated;

create or replace function public.respond_to_booking(
  target_booking_id uuid,
  next_status public.booking_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_row public.bookings%rowtype;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if next_status not in ('confirmed', 'cancelled') then
    raise exception 'invalid status';
  end if;

  select * into booking_row
  from public.bookings
  where id = target_booking_id
  for update;

  if not found then
    raise exception 'booking not found';
  end if;

  if not exists (
    select 1 from public.vendors v
    where v.id = booking_row.vendor_id and v.profile_id = auth.uid()
  ) then
    raise exception 'not authorized';
  end if;

  if next_status = 'confirmed' then
    if booking_row.status <> 'pending' then
      raise exception 'not pending';
    end if;

    if exists (
      select 1 from public.bookings
      where vendor_id = booking_row.vendor_id
        and event_date = booking_row.event_date
        and status = 'confirmed'
        and id <> booking_row.id
    ) then
      raise exception 'date unavailable';
    end if;

    update public.bookings
    set status = 'confirmed', updated_at = now()
    where id = booking_row.id;

    update public.bookings
    set status = 'cancelled', updated_at = now()
    where vendor_id = booking_row.vendor_id
      and event_date = booking_row.event_date
      and status = 'pending'
      and id <> booking_row.id;

    update public.availability
    set is_available = false, note = 'booking'
    where vendor_id = booking_row.vendor_id
      and date = booking_row.event_date;

    if not found then
      insert into public.availability (vendor_id, date, is_available, note)
      values (booking_row.vendor_id, booking_row.event_date, false, 'booking');
    end if;
  else
    if booking_row.status = 'cancelled' then
      return;
    end if;

    update public.bookings
    set status = 'cancelled', updated_at = now()
    where id = booking_row.id;

    if booking_row.status = 'confirmed' then
      if not exists (
        select 1 from public.bookings
        where vendor_id = booking_row.vendor_id
          and event_date = booking_row.event_date
          and status = 'confirmed'
          and id <> booking_row.id
      ) then
        update public.availability
        set is_available = true
        where vendor_id = booking_row.vendor_id
          and date = booking_row.event_date;
      end if;
    end if;
  end if;
end;
$$;

revoke all on function public.respond_to_booking(uuid, public.booking_status) from public;
grant execute on function public.respond_to_booking(uuid, public.booking_status) to authenticated;
