import { createClient } from "@/lib/supabase/server";
import type {
  BookingStatus,
  EventType,
  PaymentStatus,
  VendorCategory,
} from "@/lib/supabase/database.types";
import { getVendorByProfileId } from "@/modules/vendors/services/vendor-account";
import { canRespondToBooking, sortBookingsForVendor } from "../lib/booking-status";
import type { BookingListItem, BookingResponse } from "../types/booking";

type VendorEmbed = {
  id: string;
  business_name: string;
  category: VendorCategory;
  city: string;
  cover_image: string | null;
};

type ProfileEmbed = {
  full_name: string;
  email: string;
  phone: string | null;
};

type BookingRow = {
  id: string;
  event_date: string;
  event_type: EventType;
  status: BookingStatus;
  payment_status: PaymentStatus;
  package_type: string | null;
  total_price: number;
  notes: string | null;
  created_at: string;
  vendor_id: string;
  customer_id: string;
  vendors?: VendorEmbed | VendorEmbed[] | null;
  profiles?: ProfileEmbed | ProfileEmbed[] | null;
};

function firstRelated<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapBooking(row: BookingRow): BookingListItem {
  const vendor = firstRelated(row.vendors);
  const profile = firstRelated(row.profiles);

  return {
    id: row.id,
    eventDate: row.event_date,
    eventType: row.event_type,
    status: row.status,
    paymentStatus: row.payment_status,
    packageType: row.package_type,
    totalPrice: Number(row.total_price),
    notes: row.notes,
    createdAt: row.created_at,
    vendor: vendor
      ? {
          id: vendor.id,
          name: vendor.business_name,
          category: vendor.category,
          city: vendor.city,
          coverImage: vendor.cover_image,
        }
      : null,
    customer: profile
      ? {
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        }
      : null,
  };
}

export async function listCustomerBookings(customerId: string): Promise<BookingListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, event_date, event_type, status, payment_status, package_type, total_price, notes, created_at, vendor_id, customer_id, vendors!bookings_vendor_id_fkey (id, business_name, category, city, cover_image)",
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) {
      console.error("listCustomerBookings", error.message);
    }
    return [];
  }
  return data.map((row) => mapBooking(row as BookingRow));
}

export async function listVendorBookings(vendorId: string): Promise<BookingListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, event_date, event_type, status, payment_status, package_type, total_price, notes, created_at, vendor_id, customer_id",
    )
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) {
      console.error("listVendorBookings", error.message);
    }
    return [];
  }

  const { data: contacts } = await supabase.rpc("profiles_for_vendor_bookings");
  const byId = new Map((contacts ?? []).map((profile) => [profile.id, profile]));

  return sortBookingsForVendor(
    data.map((row) => {
      const item = mapBooking(row as BookingRow);
      const profile = byId.get(row.customer_id);
      if (!profile) return item;
      return {
        ...item,
        customer: {
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
        },
      };
    }),
  );
}

export async function countPendingVendorBookings(vendorId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
    .eq("status", "pending");

  if (error) return 0;
  return count ?? 0;
}

async function markDateAvailability(
  vendorId: string,
  eventDate: string,
  isAvailable: boolean,
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("availability")
    .select("id")
    .eq("vendor_id", vendorId)
    .eq("date", eventDate)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("availability")
      .update({ is_available: isAvailable, note: isAvailable ? null : "booking" })
      .eq("id", existing.id);
    return;
  }

  if (!isAvailable) {
    await supabase.from("availability").insert({
      vendor_id: vendorId,
      date: eventDate,
      is_available: false,
      note: "booking",
    });
  }
}

export async function respondToBooking(bookingId: string, nextStatus: BookingResponse) {
  const supabase = await createClient();
  const { error: rpcError } = await supabase.rpc("respond_to_booking", {
    target_booking_id: bookingId,
    next_status: nextStatus,
  });

  if (!rpcError) return;

  if (!/could not find the function/i.test(rpcError.message)) {
    throw new Error(rpcError.message);
  }

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("not authenticated");

  const vendor = await getVendorByProfileId(user.id);
  if (!vendor) throw new Error("not authorized");

  const { data: booking, error: loadError } = await supabase
    .from("bookings")
    .select("id, vendor_id, event_date, status")
    .eq("id", bookingId)
    .eq("vendor_id", vendor.id)
    .maybeSingle();

  if (loadError || !booking) throw new Error("booking not found");
  if (!canRespondToBooking(booking.status, nextStatus)) throw new Error("invalid status");

  if (nextStatus === "confirmed") {
    const { data: taken } = await supabase
      .from("bookings")
      .select("id")
      .eq("vendor_id", vendor.id)
      .eq("event_date", booking.event_date)
      .eq("status", "confirmed")
      .maybeSingle();

    if (taken) throw new Error("date unavailable");
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: nextStatus })
    .eq("id", booking.id);

  if (updateError) throw new Error(updateError.message);

  if (nextStatus === "confirmed") {
    await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("vendor_id", vendor.id)
      .eq("event_date", booking.event_date)
      .eq("status", "pending")
      .neq("id", booking.id);
    await markDateAvailability(vendor.id, booking.event_date, false);
    return;
  }

  if (booking.status === "confirmed") {
    const { data: stillTaken } = await supabase
      .from("bookings")
      .select("id")
      .eq("vendor_id", vendor.id)
      .eq("event_date", booking.event_date)
      .eq("status", "confirmed")
      .maybeSingle();

    if (!stillTaken) {
      await markDateAvailability(vendor.id, booking.event_date, true);
    }
  }
}
