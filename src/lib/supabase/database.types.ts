export type UserRole = "customer" | "vendor" | "admin";
export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";
export type VendorCategory =
  | "venue"
  | "bachelorette"
  | "beauty-nails"
  | "caterer"
  | "dj"
  | "entertainment"
  | "favours-products"
  | "florist"
  | "hairdresser"
  | "honeymoon"
  | "makeup-artist"
  | "media-coverage"
  | "officiant"
  | "photographer"
  | "room-decoration"
  | "transportation"
  | "veil-designer"
  | "videographer"
  | "wedding-cake"
  | "planner"
  | "photo-location";
export type DressKind = "wedding" | "engagement" | "soiree";
export type EventType = "wedding" | "engagement" | "birthday" | "general";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type EmailRecipientRole = UserRole;
export type EmailType =
  | "booking_confirmation"
  | "payment_confirmation"
  | "vendor_new_booking";

type Fk<
  Name extends string,
  Column extends string,
  Relation extends string,
  OneToOne extends boolean = false,
> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: OneToOne;
  referencedRelation: Relation;
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      vendors: {
        Row: {
          id: string;
          profile_id: string;
          category: VendorCategory;
          business_name: string;
          description: string | null;
          city: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          cover_image: string | null;
          gallery_images: string[];
          price_starting_at: number | null;
          is_verified: boolean;
          is_approved: boolean;
          status: VendorStatus;
          avg_rating: number | null;
          reviews_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["vendors"]["Row"],
          "id" | "created_at" | "updated_at" | "avg_rating" | "reviews_count"
        > & {
          id?: string;
          avg_rating?: number | null;
          reviews_count?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
        Relationships: [
          Fk<"vendors_profile_id_fkey", "profile_id", "profiles", true>,
        ];
      };
      venue_details: {
        Row: {
          vendor_id: string;
          capacity_min: number | null;
          capacity_max: number | null;
          price_per_event: number;
          amenities: string[];
        };
        Insert: Database["public"]["Tables"]["venue_details"]["Row"];
        Update: Partial<Database["public"]["Tables"]["venue_details"]["Insert"]>;
        Relationships: [
          Fk<"venue_details_vendor_id_fkey", "vendor_id", "vendors", true>,
        ];
      };
      photo_location_details: {
        Row: {
          vendor_id: string;
          hourly_rate: number;
          capacity: number | null;
          indoor_outdoor: "indoor" | "outdoor" | "both" | null;
        };
        Insert: Database["public"]["Tables"]["photo_location_details"]["Row"];
        Update: Partial<
          Database["public"]["Tables"]["photo_location_details"]["Insert"]
        >;
        Relationships: [
          Fk<"photo_location_details_vendor_id_fkey", "vendor_id", "vendors", true>,
        ];
      };
      photographer_packages: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          deliverables: string | null;
          duration_hours: number | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["photographer_packages"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["photographer_packages"]["Insert"]
        >;
        Relationships: [
          Fk<"photographer_packages_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      planner_packages: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          services_included: string[];
        };
        Insert: Omit<
          Database["public"]["Tables"]["planner_packages"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["planner_packages"]["Insert"]>;
        Relationships: [
          Fk<"planner_packages_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      makeup_artist_services: {
        Row: {
          id: string;
          vendor_id: string;
          service_name: string;
          price: number;
          duration_minutes: number | null;
          trial_available: boolean | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["makeup_artist_services"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<
          Database["public"]["Tables"]["makeup_artist_services"]["Insert"]
        >;
        Relationships: [
          Fk<"makeup_artist_services_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      catering_packages: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          price_per_person: number;
          min_guests: number | null;
          menu_items: string[];
        };
        Insert: Omit<
          Database["public"]["Tables"]["catering_packages"]["Row"],
          "id"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["catering_packages"]["Insert"]>;
        Relationships: [
          Fk<"catering_packages_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      dresses: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          category: DressKind;
          sizes_available: string[];
          rental_price: number | null;
          purchase_price: number | null;
          is_rental: boolean;
          images: string[];
          color: string | null;
          description: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["dresses"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["dresses"]["Insert"]>;
        Relationships: [
          Fk<"dresses_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      availability: {
        Row: {
          id: string;
          vendor_id: string;
          date: string;
          is_available: boolean;
          note: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["availability"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["availability"]["Insert"]>;
        Relationships: [
          Fk<"availability_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          vendor_id: string;
          event_date: string;
          event_type: EventType;
          status: BookingStatus;
          payment_status: PaymentStatus;
          package_id: string | null;
          package_type: string | null;
          total_price: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bookings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [
          Fk<"bookings_customer_id_fkey", "customer_id", "profiles">,
          Fk<"bookings_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      dress_bookings: {
        Row: {
          id: string;
          booking_id: string;
          dress_id: string;
          selected_size: string;
          fitting_date: string | null;
          pickup_date: string;
          return_date: string;
          deposit_amount: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["dress_bookings"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["dress_bookings"]["Insert"]>;
        Relationships: [
          Fk<"dress_bookings_booking_id_fkey", "booking_id", "bookings">,
          Fk<"dress_bookings_dress_id_fkey", "dress_id", "dresses">,
        ];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          vendor_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [
          Fk<"reviews_booking_id_fkey", "booking_id", "bookings">,
          Fk<"reviews_customer_id_fkey", "customer_id", "profiles">,
          Fk<"reviews_vendor_id_fkey", "vendor_id", "vendors">,
        ];
      };
      messages: {
        Row: {
          id: string;
          booking_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [
          Fk<"messages_booking_id_fkey", "booking_id", "bookings">,
          Fk<"messages_sender_id_fkey", "sender_id", "profiles">,
        ];
      };
      email_logs: {
        Row: {
          id: string;
          booking_id: string | null;
          recipient_email: string;
          recipient_role: EmailRecipientRole;
          email_type: EmailType;
          status: string;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["email_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["email_logs"]["Insert"]>;
        Relationships: [
          Fk<"email_logs_booking_id_fkey", "booking_id", "bookings">,
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      email_exists: {
        Args: { check_email: string };
        Returns: boolean;
      };
      approve_vendor: {
        Args: { vendor_id: string };
        Returns: undefined;
      };
      delete_vendor_user: {
        Args: { target_vendor_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      vendor_status: VendorStatus;
      vendor_category: VendorCategory;
      dress_category: DressKind;
      event_type: EventType;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      email_type: EmailType;
    };
    CompositeTypes: Record<string, never>;
  };
};
