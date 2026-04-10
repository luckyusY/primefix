import { DEFAULTS } from "./defaults";
import type { Content, ContentKey } from "./types";
import { normalizeProjects } from "./recentProjects";

// Lazy-load KV to avoid crashing when env vars are absent
async function getKV() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getContent(): Promise<Content> {
  const kv = await getKV();
  if (!kv) return DEFAULTS;

  try {
    const [reviews, faqs, steps, projects] = await Promise.all([
      kv.get<Content["reviews"]>("reviews"),
      kv.get<Content["faqs"]>("faqs"),
      kv.get<Content["steps"]>("steps"),
      kv.get<Content["projects"]>("projects"),
    ]);
    return {
      reviews:  reviews  ?? DEFAULTS.reviews,
      faqs:     faqs     ?? DEFAULTS.faqs,
      steps:    steps    ?? DEFAULTS.steps,
      projects: normalizeProjects(projects ?? DEFAULTS.projects),
    };
  } catch {
    return DEFAULTS;
  }
}

export async function setSection<K extends ContentKey>(
  key: K,
  value: Content[K],
): Promise<void> {
  const kv = await getKV();
  if (!kv) throw new Error("KV not configured");
  await kv.set(key, value);
}
