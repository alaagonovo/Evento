/**
 * Public API for the vendors module.
 * Import only from `@/modules/vendors`.
 */
export { CategoryGrid, type CategoryCardItem } from "./components/category-grid";
export { CategorySwiper } from "./components/category-swiper";
export { FeaturedVendors } from "./components/featured-vendors";
export { HeroSearch } from "./components/hero-search";
export { HomeLanding } from "./components/home-landing";
export { OfferCard } from "./components/offer-card";
export { OffersBrowse } from "./components/offers-browse";
export { VendorBrowseGrid } from "./components/vendor-browse-grid";
export { VendorCard } from "./components/vendor-card";
export { VendorDetailView } from "./components/vendor-detail-view";
export {
  CATEGORY_IMAGES,
  CITY_SLUGS,
  HERO_IMAGE,
  HERO_VIDEO,
  HERO_VIDEO_POSTER,
  MOCK_OFFERS,
  listOfferCategories,
  listOffers,
  type CitySlug,
  type MockOffer,
} from "./data/mock";
export {
  getApprovedVendorById,
  listApprovedVendors,
  listFeaturedVendors,
} from "./services/vendors";
export { AdminVendorTable } from "./components/admin-vendor-table";
export { BecomeVendorCard } from "./components/become-vendor-card";
export { VendorOnboardingForm } from "./components/vendor-onboarding-form";
export { VendorStatusBanner } from "./components/vendor-status-banner";
export {
  getVendorByProfileId,
  listVendorsForAdmin,
} from "./services/vendor-account";
export { cityLabel } from "./lib/city-label";
export { parseCategoryQuery } from "./lib/parse-search-query";
export type { VendorView } from "./types/vendor";
export {
  VENDOR_CATEGORY_SLUGS,
  VENDOR_CATEGORY_TO_TYPE,
  VENDOR_TYPE_TO_CATEGORY,
  VENDOR_TYPES,
  isVendorCategorySlug,
  isVendorType,
  type VendorCategorySlug,
  type VendorType,
} from "./types/category";
