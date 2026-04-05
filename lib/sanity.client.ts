import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-01-01";

/** Returns null when Sanity is not yet configured (no projectId in env) */
function makeClient(useCdn: boolean, token?: string): SanityClient | null {
  if (!projectId || projectId === "your_project_id_here") return null;
  return createClient({ projectId, dataset, apiVersion, useCdn, token });
}

export const client       = makeClient(true);
export const serverClient = makeClient(false, process.env.SANITY_API_TOKEN);
