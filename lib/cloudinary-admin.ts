import { Buffer } from "buffer";
import { createHash } from "crypto";

import { cloudinary, getCloudinaryImageUrl, hasCloudinaryConfig } from "./cloudinary";
import {
  DEFAULT_PROJECT_MEDIA_FOLDER,
  normalizeMediaFolder,
  type AdminMediaAsset,
  type AdminMediaListResponse,
} from "./media";

type CloudinaryResource = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  created_at?: string;
  original_filename?: string;
  asset_folder?: string;
};

function requireCloudinaryConfig() {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary is not fully configured.");
  }
}

function inferFolder(publicId: string, fallback = DEFAULT_PROJECT_MEDIA_FOLDER) {
  const slashIndex = publicId.lastIndexOf("/");
  return slashIndex > 0 ? publicId.slice(0, slashIndex) : fallback;
}

function mapCloudinaryResource(resource: CloudinaryResource): AdminMediaAsset {
  const publicId = resource.public_id ?? "";

  return {
    assetId: resource.asset_id ?? publicId,
    publicId,
    url: resource.secure_url ?? getCloudinaryImageUrl(publicId),
    thumbnailUrl: getCloudinaryImageUrl(publicId, {
      width: 480,
      height: 320,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "auto",
    }),
    width: resource.width ?? 0,
    height: resource.height ?? 0,
    bytes: resource.bytes ?? 0,
    format: resource.format ?? "",
    createdAt: resource.created_at ?? "",
    folder:
      typeof resource.asset_folder === "string" && resource.asset_folder.trim()
        ? resource.asset_folder.trim()
        : inferFolder(publicId),
    originalFilename: resource.original_filename ?? "",
  };
}

function signCloudinaryParams(params: Record<string, string | number>) {
  const serialized = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${cloudinary.apiSecret}`)
    .digest("hex");
}

function getCloudinaryAdminHeaders() {
  const credentials = Buffer.from(
    `${cloudinary.apiKey}:${cloudinary.apiSecret}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${credentials}`,
  };
}

function parseCloudinaryError(errorBody: unknown, fallback: string) {
  if (
    errorBody &&
    typeof errorBody === "object" &&
    "error" in errorBody &&
    errorBody.error &&
    typeof errorBody.error === "object" &&
    "message" in errorBody.error &&
    typeof errorBody.error.message === "string"
  ) {
    return errorBody.error.message;
  }

  return fallback;
}

export async function listCloudinaryImages({
  folder = DEFAULT_PROJECT_MEDIA_FOLDER,
  maxResults = 80,
  nextCursor,
}: {
  folder?: string;
  maxResults?: number;
  nextCursor?: string;
} = {}): Promise<AdminMediaListResponse> {
  requireCloudinaryConfig();

  const activeFolder = normalizeMediaFolder(folder);
  const safeMaxResults = Math.min(Math.max(maxResults, 1), 60);
  const url = new URL(
    `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/resources/image/upload`,
  );

  url.searchParams.set("prefix", activeFolder);
  url.searchParams.set("max_results", String(safeMaxResults));
  url.searchParams.set("direction", "desc");
  if (nextCursor) {
    url.searchParams.set("next_cursor", nextCursor);
  }

  const response = await fetch(url, {
    headers: getCloudinaryAdminHeaders(),
    cache: "no-store",
  });
  const data = (await response.json()) as {
    next_cursor?: string;
    resources?: CloudinaryResource[];
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(parseCloudinaryError(data, "Unable to load media library."));
  }

  return {
    assets: Array.isArray(data.resources)
      ? data.resources.map(mapCloudinaryResource)
      : [],
    folder: activeFolder,
    nextCursor: data.next_cursor ?? null,
  };
}

export async function uploadCloudinaryImage(
  file: File,
  { folder = DEFAULT_PROJECT_MEDIA_FOLDER }: { folder?: string } = {},
) {
  requireCloudinaryConfig();

  const activeFolder = normalizeMediaFolder(folder);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    folder: activeFolder,
    timestamp,
    unique_filename: "true",
    use_filename: "true",
  };
  const signature = signCloudinaryParams(params);

  const body = new FormData();
  body.set("file", file);
  body.set("folder", activeFolder);
  body.set("api_key", cloudinary.apiKey);
  body.set("timestamp", String(timestamp));
  body.set("signature", signature);
  body.set("unique_filename", "true");
  body.set("use_filename", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`,
    {
      method: "POST",
      body,
    },
  );
  const data = (await response.json()) as CloudinaryResource & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(parseCloudinaryError(data, "Unable to upload image."));
  }

  return mapCloudinaryResource(data);
}

export async function deleteCloudinaryImage(publicId: string) {
  requireCloudinaryConfig();

  const normalizedPublicId = publicId.trim();
  if (!normalizedPublicId) {
    throw new Error("A Cloudinary public ID is required.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    invalidate: "true",
    public_id: normalizedPublicId,
    timestamp,
  };
  const signature = signCloudinaryParams(params);

  const body = new FormData();
  body.set("public_id", normalizedPublicId);
  body.set("invalidate", "true");
  body.set("api_key", cloudinary.apiKey);
  body.set("timestamp", String(timestamp));
  body.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/destroy`,
    {
      method: "POST",
      body,
    },
  );
  const data = (await response.json()) as {
    result?: string;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(parseCloudinaryError(data, "Unable to delete image."));
  }

  return {
    deleted: data.result === "ok",
    publicId: normalizedPublicId,
  };
}
