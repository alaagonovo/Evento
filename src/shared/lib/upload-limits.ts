export const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 10 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 10;
export const MAX_GALLERY_VIDEOS = 3;
export const MAX_GALLERY_ITEMS = MAX_GALLERY_IMAGES + MAX_GALLERY_VIDEOS;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;
