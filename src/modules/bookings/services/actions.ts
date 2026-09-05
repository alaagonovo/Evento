"use server";

import { revalidatePath } from "next/cache";
import { getAuthUser, createClient } from "@/lib/supabase/server";
import { getApprovedVendorById } from "@/modules/vendors";
import { isBeforeMinBookableDate } from "@/modules/vendors/lib/booking-notice";
import { localized } from "@/shared/lib/utils";
import type { BookingResponse } from "../types/booking";
import { safeParseBookingRequest, type BookingRequestInput } from "./booking-schema";
import { respondToBooking } from "./bookings";

function revalidateBookingViews(locale: string) {
  revalidatePath(`/${locale}/dashboard/bookings`);
  revalidatePath(`/${locale}/dashboard`, "layout");
  revalidatePath(`/${locale}/vendors`, "layout");
}

export async function submitBookingRequest(input: BookingRequestInput, locale: string) {
  const parsed = safeParseBookingRequest(input);
  if (!parsed.success) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const, reason: "auth" as const };
  }

  const vendor = await getApprovedVendorById(parsed.data.vendorId);
  if (!vendor) {
    return { ok: false as const, reason: "invalid" as const };
  }

  if (isBeforeMinBookableDate(parsed.data.eventDate) || vendor.bookedDates.includes(parsed.data.eventDate)) {
    return { ok: false as const, reason: "date-unavailable" as const };
  }

  const selectedPackage = vendor.packages.find((item) => item.id === parsed.data.packageId);
  const totalPrice = selectedPackage?.price ?? vendor.startingPrice;

  const extra =
    parsed.data.paymentMethod === "wallet" && parsed.data.walletPhone
      ? `Wallet (${parsed.data.walletProvider}): ${parsed.data.walletPhone}`
      : parsed.data.paymentMethod === "card" && parsed.data.cardLast4
        ? `Card ending ${parsed.data.cardLast4}`
        : "Pay vendor";

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert({
    customer_id: user.id,
    vendor_id: vendor.id,
    event_date: parsed.data.eventDate,
    event_type: parsed.data.eventType,
    status: "pending",
    payment_status: "unpaid",
    package_id: selectedPackage?.id ?? null,
    package_type: selectedPackage ? localized(selectedPackage.name, "en") : "standard",
    total_price: totalPrice,
    notes: [parsed.data.notes?.trim(), extra].filter(Boolean).join("\n") || null,
  });

  if (error) {
    return { ok: false as const, reason: "failed" as const };
  }

  revalidateBookingViews(locale);
  return { ok: true as const };
}

export async function respondToBookingAction(
  bookingId: string,
  nextStatus: BookingResponse,
  locale: string,
) {
  if (nextStatus !== "confirmed" && nextStatus !== "cancelled") {
    return { ok: false as const, reason: "invalid" as const };
  }

  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const, reason: "auth" as const };
  }

  try {
    await respondToBooking(bookingId, nextStatus);
  } catch {
    return { ok: false as const, reason: "failed" as const };
  }

  revalidateBookingViews(locale);
  return { ok: true as const };
}
