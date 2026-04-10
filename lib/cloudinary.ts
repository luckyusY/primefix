type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  crop?: "fill" | "fit" | "limit" | "pad" | "scale";
  gravity?: string;
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
};

export const cloudinary = {
  cloudName:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    process.env.CLOUDINARY_CLOUD_NAME ??
    "",
  apiKey: process.env.CLOUDINARY_API_KEY ?? "",
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};

export function hasCloudinaryConfig() {
  return Boolean(
    cloudinary.cloudName && cloudinary.apiKey && cloudinary.apiSecret,
  );
}

export function getCloudinaryImageUrl(
  publicId: string,
  {
    width,
    height,
    quality = "auto",
    crop = "fill",
    gravity,
    format = "auto",
  }: CloudinaryImageOptions = {},
) {
  if (!cloudinary.cloudName) {
    throw new Error("Cloudinary cloud name is not configured.");
  }

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

  return `https://res.cloudinary.com/${cloudinary.cloudName}/image/upload/${transformPath}${encodedPublicId}`;
}
