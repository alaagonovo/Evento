import type { VendorCategorySlug } from "../types/category";

export const CITY_SLUGS = [
  "cairo",
  "giza",
  "alexandria",
  "north-coast",
  "luxor",
  "aswan",
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

export type LocalizedText = {
  ar: string;
  en: string;
};

export type DressAngle = "front" | "back" | "side" | "detail";

export type VendorPhoto = {
  src: string;
  alt: LocalizedText;
  angle?: DressAngle;
};

export type VendorPackage = {
  id: string;
  name: LocalizedText;
  price: number;
  unit: "event" | "day";
  details: LocalizedText;
};

export type VendorReview = {
  id: string;
  author: LocalizedText;
  rating: number;
  date: LocalizedText;
  text: LocalizedText;
};

export type MockVendor = {
  id: string;
  category: VendorCategorySlug;
  name: LocalizedText;
  city: CitySlug;
  neighborhood: LocalizedText;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  capacity?: number;
  verified: boolean;
  featured: boolean;
  coverImage: string;
  description: LocalizedText;
  highlights: LocalizedText[];
  gallery: VendorPhoto[];
  packages: VendorPackage[];
  bookedDates: string[];
  reviews: VendorReview[];
  sizes?: string[];
};

const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const HERO_IMAGE = unsplash("photo-1519741497674-611481863552", 2400);

export const CATEGORY_IMAGES: Record<VendorCategorySlug, string> = {
  venues: unsplash("photo-1511795409834-ef04bbd61622", 1200),
  bachelorette: unsplash("photo-1519671482749-fd09be7ccebf", 1200),
  "beauty-nails": unsplash("photo-1604654894610-df63bc536371", 1200),
  catering: unsplash("photo-1555244162-803834f70033", 1200),
  dj: unsplash("photo-1470225620780-dba8ba36b745", 1200),
  entertainment: unsplash("photo-1492684223066-81342ee5ff30", 1200),
  "favours-products": unsplash("photo-1549465220-1a8b9238cd48", 1200),
  florist: unsplash("photo-1526047932273-341f2a7631f9", 1200),
  hairdresser: unsplash("photo-1560066984-138dadb4c035", 1200),
  honeymoon: unsplash("photo-1573843981267-be1999ff37cd", 1200),
  "makeup-artists": unsplash("photo-1487412947147-5cebf100ffc2", 1200),
  "media-coverage": unsplash("photo-1478737270239-2f02b77fc618", 1200),
  officiant: unsplash("photo-1465495976277-4387d4b0b4c6", 1200),
  photographers: unsplash("photo-1606800052052-a08af7148866", 1200),
  "room-decoration": unsplash("photo-1510076857177-7470076d4098", 1200),
  transportation: unsplash("photo-1519641471654-76ce0107ad1b", 1200),
  "veil-designer": unsplash("photo-1511285560929-80b456fea0bc", 1200),
  videography: unsplash("photo-1492691527719-9d1e07e534b4", 1200),
  "wedding-cake": unsplash("photo-1535254973040-607b474cb50d", 1200),
  planners: unsplash("photo-1464366400600-7168b8af9bc3", 1200),
  "photo-locations": unsplash("photo-1519225421980-715cb0215aed", 1200),
};

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: "nile-palace",
    category: "venues",
    name: { ar: "قصر النيل", en: "Nile Palace" },
    city: "cairo",
    neighborhood: { ar: "الزمالك", en: "Zamalek" },
    startingPrice: 185000,
    rating: 4.9,
    reviewCount: 128,
    capacity: 450,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1465495976277-4387d4b0b4c6", 1400),
    description: {
      ar: "قاعة إطلالة على النيل بروح فندقية هادئة: إضاءة دافئة، مساحات واسعة للعيلة، وفريق يعرف إيقاع الأفراح المصرية من الدخول حتى آخر أغنية.",
      en: "A Nile-facing hall with a quiet hotel soul: warm light, room for family, and a team that knows the rhythm of Egyptian weddings from the entrance to the last song.",
    },
    highlights: [
      { ar: "إطلالة نيل مباشرة", en: "Direct Nile view" },
      { ar: "سعة حتى 450 ضيف", en: "Up to 450 guests" },
      { ar: "موقف سيارات خاص", en: "Private parking" },
      { ar: "تنسيق ورود أساسي", en: "Base floral styling" },
    ],
    gallery: [
      {
        src: unsplash("photo-1465495976277-4387d4b0b4c6", 1800),
        alt: { ar: "قاعة قصر النيل مُنسّقة لحفل زفاف", en: "Nile Palace hall styled for a wedding" },
      },
      {
        src: unsplash("photo-1511795409834-ef04bbd61622", 1800),
        alt: { ar: "قاعة الاحتفال بإضاءة ذهبية", en: "Ballroom with gold lighting" },
      },
      {
        src: unsplash("photo-1478146896981-b80fe463b330", 1800),
        alt: { ar: "تفاصيل السفرة والضيافة", en: "Table setting and hospitality details" },
      },
      {
        src: unsplash("photo-1464366400600-7168b8af9bc3", 1800),
        alt: { ar: "حديقة القاعة للتصوير", en: "Venue garden for portraits" },
      },
      {
        src: unsplash("photo-1519225421980-715cb0215aed", 1800),
        alt: { ar: "مدخل القاعة مساءً", en: "Venue entrance at dusk" },
      },
    ],
    packages: [
      {
        id: "gold",
        name: { ar: "باقة الذهب", en: "Gold package" },
        price: 185000,
        unit: "event",
        details: {
          ar: "القاعة حتى 250 ضيف، تنسيق ورود أساسي، إضاءة، وطاقم استقبال.",
          en: "Hall for up to 250 guests, base florals, lighting, and a reception team.",
        },
      },
      {
        id: "royal",
        name: { ar: "الباقة الملكية", en: "Royal package" },
        price: 265000,
        unit: "event",
        details: {
          ar: "حتى 450 ضيف، تنسيق كامل، جناح للعروسين، وتصوير لحظات الدخول.",
          en: "Up to 450 guests, full styling, a suite for the couple, and entrance photography.",
        },
      },
    ],
    bookedDates: [
      "2026-08-28",
      "2026-08-29",
      "2026-09-04",
      "2026-09-05",
      "2026-09-11",
      "2026-09-18",
      "2026-09-25",
    ],
    reviews: [
      {
        id: "r1",
        author: { ar: "نورهان ومحمد", en: "Nourhan & Mohamed" },
        rating: 5,
        date: { ar: "يونيو 2026", en: "June 2026" },
        text: {
          ar: "العيلة ارتاحت من أول زيارة. الإضاءة كانت دافية والمكان واسع من غير ما يحسّس حد بالزحمة.",
          en: "The family felt at ease from the first visit. The light was warm and the space felt generous, never crowded.",
        },
      },
      {
        id: "r2",
        author: { ar: "ياسمين", en: "Yasmin" },
        rating: 5,
        date: { ar: "مايو 2026", en: "May 2026" },
        text: {
          ar: "فريق القاعة فاهم توقيت الفرح المصري. الدخول، الكيكة، والوداع مشوا بسلاسة.",
          en: "The team understands an Egyptian wedding’s timing. Entrance, cake, and farewell all felt effortless.",
        },
      },
      {
        id: "r3",
        author: { ar: "أحمد وليلى", en: "Ahmed & Laila" },
        rating: 4,
        date: { ar: "مارس 2026", en: "March 2026" },
        text: {
          ar: "الموقف كان مرتّب والطعام ثابت الجودة. حجزنا من Evento وخلّصنا التأكيد في يومين.",
          en: "Parking was orderly and the food stayed consistent. We booked on Evento and confirmed within two days.",
        },
      },
    ],
  },
  {
    id: "lens-and-light",
    category: "photographers",
    name: { ar: "عدسة ونور", en: "Lens & Light" },
    city: "giza",
    neighborhood: { ar: "المهندسين", en: "Mohandessin" },
    startingPrice: 18000,
    rating: 4.9,
    reviewCount: 204,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1537633552985-df8429e8048b", 1400),
    description: {
      ar: "تصوير هادئ يركز على الوجوه والعيلة، مش على الوضعيات المصطنعة.",
      en: "Quiet photography that stays with faces and family, not stiff poses.",
    },
    highlights: [
      { ar: "فوتو وفيديو", en: "Photo and video" },
      { ar: "تسليم خلال 21 يوم", en: "Delivery in 21 days" },
    ],
    gallery: [
      {
        src: unsplash("photo-1537633552985-df8429e8048b", 1600),
        alt: { ar: "جلسة تصوير عروسين", en: "Couple photoshoot" },
      },
    ],
    packages: [
      {
        id: "day",
        name: { ar: "تغطية اليوم كامل", en: "Full-day coverage" },
        price: 28000,
        unit: "event",
        details: {
          ar: "فريق اثنين، ألبوم، وفيلم قصير.",
          en: "Two-person team, album, and a short film.",
        },
      },
    ],
    bookedDates: ["2026-09-04", "2026-09-11"],
    reviews: [],
  },
  {
    id: "bloom-planning",
    category: "planners",
    name: { ar: "بلوم للتنظيم", en: "Bloom Planning" },
    city: "cairo",
    neighborhood: { ar: "المعادي", en: "Maadi" },
    startingPrice: 22000,
    rating: 4.8,
    reviewCount: 67,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1478146896981-b80fe463b330", 1400),
    description: {
      ar: "تنظيم من الميزانية حتى توقيت الدخول، بنبرة هادية تناسب العيلة.",
      en: "Planning from budget to entrance timing, in a tone that suits the family.",
    },
    highlights: [{ ar: "منسّقة يوم الحفل", en: "Day-of coordinator" }],
    gallery: [
      {
        src: unsplash("photo-1478146896981-b80fe463b330", 1600),
        alt: { ar: "تنسيق طاولات الزفاف", en: "Wedding table styling" },
      },
    ],
    packages: [
      {
        id: "full",
        name: { ar: "تنظيم كامل", en: "Full planning" },
        price: 45000,
        unit: "event",
        details: {
          ar: "إدارة المزوّدين، الجدول، ويوم الحفل.",
          en: "Vendor management, timeline, and the wedding day.",
        },
      },
    ],
    bookedDates: [],
    reviews: [],
  },
  {
    id: "nour-beauty",
    category: "makeup-artists",
    name: { ar: "نور بيوتي", en: "Nour Beauty" },
    city: "alexandria",
    neighborhood: { ar: "سموحة", en: "Smouha" },
    startingPrice: 3500,
    rating: 4.7,
    reviewCount: 91,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1522337360788-8b13dee7a37e", 1400),
    description: {
      ar: "مكياج عروس يثبت للتصوير والفرح، مع تجربة مسبقة في الاستوديو.",
      en: "Bridal makeup that holds for photos and the party, with a studio trial.",
    },
    highlights: [{ ar: "تجربة مكياج", en: "Makeup trial" }],
    gallery: [
      {
        src: unsplash("photo-1522337360788-8b13dee7a37e", 1600),
        alt: { ar: "مكياج عروس", en: "Bridal makeup" },
      },
    ],
    packages: [
      {
        id: "bridal",
        name: { ar: "باقة العروس", en: "Bridal package" },
        price: 5500,
        unit: "event",
        details: {
          ar: "تجربة + يوم الفرح + لمسة قبل التصوير.",
          en: "Trial, wedding day, and a touch-up before photos.",
        },
      },
    ],
    bookedDates: [],
    reviews: [],
  },
  {
    id: "garden-house",
    category: "photo-locations",
    name: { ar: "بيت الحديقة", en: "The Garden House" },
    city: "giza",
    neighborhood: { ar: "الهرم", en: "Haram" },
    startingPrice: 2500,
    rating: 4.6,
    reviewCount: 54,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1520854221256-17451cc331bf", 1400),
    description: {
      ar: "حديقة وبيت تراثي للجلسات، يُحجز بالساعة مع خصوصية كاملة.",
      en: "A garden and heritage house for sessions, booked by the hour with full privacy.",
    },
    highlights: [{ ar: "حجز بالساعة", en: "Hourly booking" }],
    gallery: [
      {
        src: unsplash("photo-1520854221256-17451cc331bf", 1600),
        alt: { ar: "جلسة تصوير في الحديقة", en: "Garden photoshoot" },
      },
    ],
    packages: [
      {
        id: "two-hours",
        name: { ar: "ساعتان", en: "Two hours" },
        price: 2500,
        unit: "event",
        details: {
          ar: "الحديقة والبيت من دون مزوّدين إضافيين.",
          en: "Garden and house, without extra vendors.",
        },
      },
    ],
    bookedDates: [],
    reviews: [],
  },
];

export function getFeaturedVendors() {
  return MOCK_VENDORS.filter((vendor) => vendor.featured);
}

export function getVendorById(category: VendorCategorySlug, id: string) {
  return MOCK_VENDORS.find(
    (vendor) => vendor.category === category && vendor.id === id,
  );
}
