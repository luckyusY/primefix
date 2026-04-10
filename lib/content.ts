import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULTS } from "./defaults";
import type { Content, ContentKey } from "./types";
import { normalizeProjects } from "./recentProjects";

const CONTENT_FILE_PATH = path.join(process.cwd(), "data", "content.json");

// Lazy-load KV to avoid crashing when env vars are absent
async function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

function normalizeContent(value: Partial<Content> | null | undefined): Content {
  return {
    reviews: Array.isArray(value?.reviews) ? value.reviews : DEFAULTS.reviews,
    faqs: Array.isArray(value?.faqs) ? value.faqs : DEFAULTS.faqs,
    steps: Array.isArray(value?.steps) ? value.steps : DEFAULTS.steps,
    projects: normalizeProjects(value?.projects ?? DEFAULTS.projects),
  };
}

async function readFileContent(): Promise<Content | null> {
  try {
    const raw = await readFile(CONTENT_FILE_PATH, "utf8");
    return normalizeContent(JSON.parse(raw) as Partial<Content>);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    return null;
  }
}

async function writeFileContent(content: Content): Promise<void> {
  try {
    await mkdir(path.dirname(CONTENT_FILE_PATH), { recursive: true });
    await writeFile(CONTENT_FILE_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "EROFS"
    ) {
      throw new Error(
        "No writable content store is configured. Add KV credentials for deployed environments.",
      );
    }

    throw error;
  }
}

export async function getContent(): Promise<Content> {
  const kv = await getKV();
  if (kv) {
    try {
      const [reviews, faqs, steps, projects] = await Promise.all([
        kv.get<Content["reviews"]>("reviews"),
        kv.get<Content["faqs"]>("faqs"),
        kv.get<Content["steps"]>("steps"),
        kv.get<Content["projects"]>("projects"),
      ]);
      return {
        reviews: reviews ?? DEFAULTS.reviews,
        faqs: faqs ?? DEFAULTS.faqs,
        steps: steps ?? DEFAULTS.steps,
        projects: normalizeProjects(projects ?? DEFAULTS.projects),
      };
    } catch {
      // Fall through to the file store if KV is unavailable at runtime.
    }
  }

  return (await readFileContent()) ?? DEFAULTS;
}

export async function setSection<K extends ContentKey>(
  key: K,
  value: Content[K],
): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.set(key, value);
    return;
  }

  const current = (await readFileContent()) ?? DEFAULTS;
  const nextContent = normalizeContent({
    ...current,
    [key]: value,
  });
  await writeFileContent(nextContent);
}
