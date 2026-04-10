type MediaTransformOptions = {
  crop?: "fill" | "fit" | "limit" | "pad" | "scale";
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
  gravity?: string;
  height?: number;
  quality?: number | "auto";
  width?: number;
};

const CLOUDINARY_HOST = "res.cloudinary.com";
const SANITY_HOST = "cdn.sanity.io";

function toUrl(src: string) {
  try {
    return new URL(src);
  } catch {
    return null;
  }
}

export function isCloudinaryUrl(src: string) {
  const url = toUrl(src);
  return url?.hostname === CLOUDINARY_HOST;
}

export function isSanityUrl(src: string) {
  const url = toUrl(src);
  return url?.hostname === SANITY_HOST;
}

export function getCloudinaryPublicIdFromUrl(src: string) {
  const url = toUrl(src);
  if (!url || url.hostname !== CLOUDINARY_HOST) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const uploadIndex = segments.indexOf("upload");
  if (uploadIndex === -1) return null;

  const afterUpload = segments.slice(uploadIndex + 1);
  const versionIndex = afterUpload.findIndex((segment) => /^v\d+$/.test(segment));
  const publicIdSegments =
    versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;

  if (publicIdSegments.length === 0) return null;

  const joined = publicIdSegments.join("/");
  return decodeURIComponent(joined).replace(/\.[^/.]+$/, "");
}

function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  {
    width,
    height,
    quality = "auto",
    crop = "fill",
    gravity,
    format = "auto",
  }: MediaTransformOptions = {},
) {
  const encodedPublicId = publicId
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  const transforms = [
    crop ? `c_${crop}` : "",
    gravity ? `g_${gravity}` : "",
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    quality ? `q_${quality}` : "",
    format ? `f_${format}` : "",
  ]
    .filter(Boolean)
    .join(",");

  const transformPath = transforms ? `${transforms}/` : "";

  return `https://${CLOUDINARY_HOST}/${cloudName}/image/upload/${transformPath}${encodedPublicId}`;
}

export function getOptimizedMediaSrc(
  src: string,
  options: MediaTransformOptions = {},
) {
  if (!isCloudinaryUrl(src)) return src;

  const url = toUrl(src);
  const publicId = getCloudinaryPublicIdFromUrl(src);
  if (!url || !publicId) return src;

  const [, cloudName] = url.pathname.split("/");
  if (!cloudName) return src;

  return buildCloudinaryUrl(cloudName, publicId, options);
}

export function shouldBypassNextImageOptimization(src: string) {
  if (!src.trim()) return false;
  if (src.startsWith("/")) return false;
  if (isCloudinaryUrl(src)) return true;
  if (isSanityUrl(src)) return false;

  return true;
}

export function getAdminPreviewSrc(src: string) {
  return getOptimizedMediaSrc(src, {
    width: 960,
    height: 600,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  });
}

export function getProjectCarouselImageSrc(src: string) {
  return getOptimizedMediaSrc(src, {
    width: 1440,
    height: 1080,
    crop: "limit",
    quality: "auto",
    format: "auto",
  });
}
