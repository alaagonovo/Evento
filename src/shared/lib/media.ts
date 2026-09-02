import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "./upload-limits";

const VIDEO_PATH = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export function isImageFile(file: File) {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export function isVideoFile(file: File) {
  return (ALLOWED_VIDEO_TYPES as readonly string[]).includes(file.type);
}

export function isVideoUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "res.cloudinary.com" && /\/video\/upload\//.test(parsed.pathname)) {
      return true;
    }
    return VIDEO_PATH.test(parsed.pathname);
  } catch {
    return VIDEO_PATH.test(url);
  }
}

export function countVideoUrls(urls: string[]) {
  return urls.filter(isVideoUrl).length;
}

export function countImageUrls(urls: string[]) {
  return urls.length - countVideoUrls(urls);
}