export const DEFAULT_PROJECT_MEDIA_FOLDER = "primefix/projects";

export function normalizeMediaFolder(folder?: string) {
  const cleaned = (folder ?? DEFAULT_PROJECT_MEDIA_FOLDER)
    .trim()
    .replace(/^\/+|\/+$/g, "");

  return cleaned || DEFAULT_PROJECT_MEDIA_FOLDER;
}

export type AdminMediaAsset = {
  assetId: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  createdAt: string;
  folder: string;
  originalFilename: string;
};

export type AdminMediaListResponse = {
  assets: AdminMediaAsset[];
  folder: string;
  nextCursor: string | null;
};

export type AdminMediaUploadResponse = {
  asset: AdminMediaAsset;
  folder: string;
};
