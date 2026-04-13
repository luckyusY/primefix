import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DEFAULTS } from "./defaults";
import { hasMongoConfig, withMongoDb } from "./mongodb";
import type { Content, ContentKey } from "./types";
import { normalizeProjects } from "./recentProjects";

const LOCAL_CONTENT_FILE_PATH = path.join(process.cwd(), "data", "content.json");
const TEMP_CONTENT_FILE_PATH = path.join(tmpdir(), "primefix", "content.json");
const CONTENT_COLLECTION_NAME = "site_content";
const CONTENT_DOCUMENT_ID = "primefix-site-content";
const IS_SERVERLESS_RUNTIME = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT,
);
const CONTENT_FILE_PATH =
  process.env.CONTENT_FILE_PATH?.trim() ||
  (IS_SERVERLESS_RUNTIME ? TEMP_CONTENT_FILE_PATH : LOCAL_CONTENT_FILE_PATH);

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

async function cacheContentSnapshot(content: Content): Promise<void> {
  try {
    await writeFileContent(content);
  } catch {
    // Snapshot caching is a best-effort fallback, so don't block reads or writes here.
  }
}

async function readMongoContent(): Promise<Content | null> {
  const doc = await withMongoDb((db) =>
    db
      .collection<Partial<Content> & { _id: string }>(CONTENT_COLLECTION_NAME)
      .findOne({ _id: CONTENT_DOCUMENT_ID }),
  );

  if (!doc) return null;
  return normalizeContent(doc);
}

async function writeMongoSection<K extends ContentKey>(
  key: K,
  value: Content[K],
): Promise<boolean> {
  const result = await withMongoDb((db) =>
    db
      .collection<
        Partial<Content> & {
          _id: string;
          createdAt?: string;
          updatedAt?: string;
        }
      >(CONTENT_COLLECTION_NAME)
      .updateOne(
        { _id: CONTENT_DOCUMENT_ID },
        {
          $set: {
            [key]: value,
            updatedAt: new Date().toISOString(),
          },
          $setOnInsert: {
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      ),
  );

  return Boolean(result);
}

async function buildNextContent<K extends ContentKey>(
  key: K,
  value: Content[K],
): Promise<Content> {
  const currentContent =
    (hasMongoConfig() ? await readMongoContent().catch(() => null) : null) ??
    (await readFileContent()) ??
    DEFAULTS;

  return normalizeContent({
    ...currentContent,
    [key]: value,
  });
}

export async function getContent(): Promise<Content> {
  if (hasMongoConfig()) {
    try {
      const mongoContent = await readMongoContent();

      if (mongoContent) {
        await cacheContentSnapshot(mongoContent);
        return mongoContent;
      }
    } catch {
      // Fall through to legacy stores when Mongo is configured but unavailable.
    }
  }

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
  const nextContent = await buildNextContent(key, value);

  if (hasMongoConfig()) {
    try {
      const storedInMongo = await writeMongoSection(key, value);

      if (storedInMongo) {
        await cacheContentSnapshot(nextContent);
        return;
      }
    } catch (error) {
      if (IS_SERVERLESS_RUNTIME) {
        const kv = await getKV();
        if (kv) {
          await kv.set(key, value);
          await cacheContentSnapshot(nextContent);
          return;
        }

        throw error;
      }
    }
  }

  const kv = await getKV();
  if (kv) {
    await kv.set(key, value);
    await cacheContentSnapshot(nextContent);
    return;
  }

  await writeFileContent(nextContent);
}
