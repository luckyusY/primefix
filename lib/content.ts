import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DEFAULTS } from "./defaults";
import type { Content, ContentKey } from "./types";
import { normalizeProjects } from "./recentProjects";

const LOCAL_CONTENT_FILE_PATH = path.join(process.cwd(), "data", "content.json");
const TEMP_CONTENT_FILE_PATH = path.join(tmpdir(), "primefix", "content.json");
const CONTENT_FILE_PATH =
  process.env.CONTENT_FILE_PATH?.trim() ||
  (process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
    ? TEMP_CONTENT_FILE_PATH
    : LOCAL_CONTENT_FILE_PATH);

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

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String(error.code);
  }

  return "";
}

async function readContentFile(filePath: string): Promise<Content | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return normalizeContent(JSON.parse(raw) as Partial<Content>);
  } catch {
    return null;
  }
}

async function readFileContent(): Promise<Content | null> {
  const candidatePaths = Array.from(
    new Set([CONTENT_FILE_PATH, LOCAL_CONTENT_FILE_PATH, TEMP_CONTENT_FILE_PATH]),
  );

  for (const filePath of candidatePaths) {
    const content = await readContentFile(filePath);
    if (content) {
      return content;
    }
  }

  return null;
}

async function writeJsonFile(filePath: string, content: Content): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

async function writeFileContent(content: Content): Promise<void> {
  try {
    await writeJsonFile(CONTENT_FILE_PATH, content);
  } catch (error) {
    const code = getErrorCode(error);
    const canTryTempFallback =
      CONTENT_FILE_PATH !== TEMP_CONTENT_FILE_PATH &&
      ["ENOENT", "EACCES", "EROFS"].includes(code);

    if (canTryTempFallback) {
      await writeJsonFile(TEMP_CONTENT_FILE_PATH, content);
      return;
    }

    if (["EACCES", "EROFS"].includes(code)) {
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
