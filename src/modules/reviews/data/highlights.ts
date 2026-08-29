import type { HighlightReview } from "../types/highlight";

export const HIGHLIGHT_REVIEWS: HighlightReview[] = [
  {
    id: "venue-nourhan",
    category: "venues",
    vendorName: { ar: "قصر النيل", en: "Nile Palace" },
    author: { ar: "نورهان ومحمد", en: "Nourhan & Mohamed" },
    rating: 5,
    date: { ar: "يونيو 2026", en: "June 2026" },
    text: {
      ar: "العيلة ارتاحت من أول زيارة. الإضاءة كانت دافية والمكان واسع من غير ما يحسّس حد بالزحمة.",
      en: "The family felt at ease from the first visit. The light was warm and the space felt generous, never crowded.",
    },
  },
  {
    id: "photo-salma",
    category: "photographers",
    vendorName: { ar: "عدسة ونور", en: "Lens & Light" },
    author: { ar: "سلمى وحازم", en: "Salma & Hazem" },
    rating: 5,
    date: { ar: "مايو 2026", en: "May 2026" },
    text: {
      ar: "الصور طلعت طبيعية جدًا. ركّزوا على العيلة والمشاعر، مش على وضعيات مصطنعة.",
      en: "The photos felt completely natural. They stayed with family and feeling, not stiff poses.",
    },
  },
  {
    id: "planner-yasmin",
    category: "planners",
    vendorName: { ar: "بلوم للتنظيم", en: "Bloom Planning" },
    author: { ar: "ياسمين", en: "Yasmin" },
    rating: 5,
    date: { ar: "أبريل 2026", en: "April 2026" },
    text: {
      ar: "من الميزانية لتوقيت الدخول، كل تفصيلة كانت واضحة. يوم الفرح مشى بهدوء.",
      en: "From budget to entrance timing, every detail was clear. The wedding day felt calm.",
    },
  },
  {
    id: "makeup-hadeer",
    category: "makeup-artists",
    vendorName: { ar: "نور بيوتي", en: "Nour Beauty" },
    author: { ar: "هدير", en: "Hadeer" },
    rating: 5,
    date: { ar: "مارس 2026", en: "March 2026" },
    text: {
      ar: "المكياج ثبت للتصوير والفرح، والتجربة المسبقة خلّتني مطمئنة من غير مفاجآت.",
      en: "The makeup held for photos and the party, and the trial meant no surprises on the day.",
    },
  },
  {
    id: "florist-laila",
    category: "florist",
    vendorName: { ar: "ورد الشرق", en: "Sharq Blooms" },
    author: { ar: "ليلى وأحمد", en: "Laila & Ahmed" },
    rating: 4,
    date: { ar: "فبراير 2026", en: "February 2026" },
    text: {
      ar: "الباقات كانت هادية وأنيقة، والطاولات اتنسّقت بنفس روح القاعة من غير مبالغة.",
      en: "The bouquets were quiet and elegant, and the tables matched the hall without feeling loud.",
    },
  },
  {
    id: "catering-mai",
    category: "catering",
    vendorName: { ar: "مطبخ كرم", en: "Karam Kitchen" },
    author: { ar: "مي وعمرو", en: "Mai & Amr" },
    rating: 5,
    date: { ar: "يناير 2026", en: "January 2026" },
    text: {
      ar: "الأكل فضل ثابت الجودة لآخر ضيف، والضيافة كانت مرتّبة من غير زحمة على السفرة.",
      en: "The food stayed consistent to the last guest, and service stayed orderly around the tables.",
    },
  },
];
