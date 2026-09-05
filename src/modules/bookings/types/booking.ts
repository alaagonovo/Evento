import type {
  BookingStatus,
  EventType,
  PaymentStatus,
  VendorCategory,
} from "@/lib/supabase/database.types";

export type BookingListItem = {
  id: string;
  eventDate: string;
  eventType: EventType;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  packageType: string | null;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    category: VendorCategory;
    city: string;
    coverImage: string | null;
  } | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

export type BookingResponse = "confirmed" | "cancelled";
