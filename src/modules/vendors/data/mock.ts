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
  photographers: unsplash("photo-1606800052052-a08af7148866", 1200),
  planners: unsplash("photo-1464366400600-7168b8af9bc3", 1200),
  "makeup-artists": unsplash("photo-1487412947147-5cebf100ffc2", 1200),
  catering: unsplash("photo-1555244162-803834f70033", 1200),
  "photo-locations": unsplash("photo-1519225421980-715cb0215aed", 1200),
  dresses: unsplash("photo-1594552072238-b8a33785b261", 1200),
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
    id: "ivory-atelier",
    category: "dresses",
    name: { ar: "أتيليه إيڤوري", en: "Ivory Atelier" },
    city: "cairo",
    neighborhood: { ar: "مصر الجديدة", en: "Heliopolis" },
    startingPrice: 4500,
    rating: 4.8,
    reviewCount: 86,
    verified: true,
    featured: true,
    coverImage: unsplash("photo-1594552072238-b8a33785b261", 1400),
    description: {
      ar: "فساتين زفاف وخطوبة بخامات هادئة وقصة تليق بالجسم. تجربة المقاس في الأتيليه، ثم استلام وإرجاع بمواعيد واضحة.",
      en: "Wedding and engagement dresses in quiet fabrics and considered cuts. Fit in the atelier, then pick up and return on clear dates.",
    },
    highlights: [
      { ar: "تعديل بسيط مشمول", en: "Minor alterations included" },
      { ar: "تجربة في الأتيليه", en: "In-atelier fitting" },
      { ar: "إيجار من 3 أيام", en: "Rentals from 3 days" },
      { ar: "عناية وتنظيف بعد الإرجاع", en: "Cleaning after return" },
    ],
    gallery: [
      {
        src: unsplash("photo-1594552072238-b8a33785b261", 1800),
        alt: { ar: "فستان زفاف إيڤوري من الأمام", en: "Ivory wedding dress, front view" },
        angle: "front",
      },
      {
        src: unsplash("photo-1566174053879-31528523f8ae", 1800),
        alt: { ar: "تفاصيل الظهر والدانتيل", en: "Back and lace details" },
        angle: "back",
      },
      {
        src: unsplash("photo-1549417229-aa67d3263c09", 1800),
        alt: { ar: "قصة جانبية للفستان", en: "Side silhouette of the dress" },
        angle: "side",
      },
      {
        src: unsplash("photo-1515372039744-b8f02a3ae446", 1800),
        alt: { ar: "تفاصيل القماش والتطريز", en: "Fabric and embroidery details" },
        angle: "detail",
      },
      {
        src: unsplash("photo-1595777457583-95e059d581b8", 1800),
        alt: { ar: "فستان خطوبة بلون شامبانيا", en: "Champagne engagement dress" },
        angle: "front",
      },
    ],
    packages: [
      {
        id: "rent-3",
        name: { ar: "إيجار 3 أيام", en: "3-day rental" },
        price: 4500,
        unit: "event",
        details: {
          ar: "يشمل التجربة، تعديلات بسيطة، والتنظيف بعد الإرجاع.",
          en: "Includes fitting, minor alterations, and cleaning after return.",
        },
      },
      {
        id: "rent-7",
        name: { ar: "إيجار أسبوع", en: "7-day rental" },
        price: 6200,
        unit: "event",
        details: {
          ar: "مناسب لو التصوير والفرح مش في نفس اليوم.",
          en: "Better when the photoshoot and wedding fall on different days.",
        },
      },
    ],
    bookedDates: ["2026-08-30", "2026-09-03", "2026-09-10", "2026-09-17", "2026-09-24"],
    reviews: [
      {
        id: "d1",
        author: { ar: "سلمى", en: "Salma" },
        rating: 5,
        date: { ar: "يوليو 2026", en: "July 2026" },
        text: {
          ar: "المقاس طلع مضبوط من أول تجربة، والقماش مش بيلمع زيادة. حسّيت الفستان غالي من غير مبالغة.",
          en: "The size was right from the first fitting, and the fabric didn’t over-shine. It felt expensive without being loud.",
        },
      },
      {
        id: "d2",
        author: { ar: "هدير", en: "Hadeer" },
        rating: 4,
        date: { ar: "أبريل 2026", en: "April 2026" },
        text: {
          ar: "تجربة المقاس كانت هادية والمواعيد واضحة. رجّعت الفستان من غير أي توتر.",
          en: "The fitting felt unhurried and the dates were clear. Returning the dress was simple.",
        },
      },
    ],
    sizes: ["36", "38", "40", "42", "44", "46"],
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
