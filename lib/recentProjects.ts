import type { Project, ProjectImage } from "./types";

/** Paths encode spaces in filenames via encodeURI when rendering in <Image> */
const HOUSE1 = [
  "/work/house1/photo_2026-04-03_23-49-40.jpg",
  "/work/house1/photo_2026-04-03_23-49-44 (2).jpg",
  "/work/house1/photo_2026-04-03_23-49-44 (3).jpg",
  "/work/house1/photo_2026-04-03_23-49-44 (4).jpg",
  "/work/house1/photo_2026-04-03_23-49-44.jpg",
  "/work/house1/photo_2026-04-03_23-49-45 (2).jpg",
  "/work/house1/photo_2026-04-03_23-49-45 (3).jpg",
  "/work/house1/photo_2026-04-03_23-49-45.jpg",
  "/work/house1/photo_2026-04-03_23-49-46 (2).jpg",
  "/work/house1/photo_2026-04-03_23-49-46.jpg",
];

const HOUSE2 = [
  "/work/house2/photo_2026-04-03_23-49-46 (3).jpg",
  "/work/house2/photo_2026-04-03_23-49-47 (2).jpg",
  "/work/house2/photo_2026-04-03_23-49-47 (3).jpg",
  "/work/house2/photo_2026-04-03_23-49-47 (4).jpg",
  "/work/house2/photo_2026-04-03_23-49-47.jpg",
];

const HOUSE3 = [
  "/work/house3/photo_2026-04-03_23-56-56 (2).jpg",
  "/work/house3/photo_2026-04-03_23-56-56 (3).jpg",
  "/work/house3/photo_2026-04-03_23-56-56 (4).jpg",
  "/work/house3/photo_2026-04-03_23-56-56.jpg",
  "/work/house3/photo_2026-04-03_23-56-57 (2).jpg",
  "/work/house3/photo_2026-04-03_23-56-57 (3).jpg",
  "/work/house3/photo_2026-04-03_23-56-57 (4).jpg",
  "/work/house3/photo_2026-04-03_23-56-57.jpg",
  "/work/house3/photo_2026-04-03_23-56-58 (2).jpg",
  "/work/house3/photo_2026-04-03_23-56-58.jpg",
];

const HOUSE4 = [
  "/work/house4/photo_2026-04-03_23-56-59 (2).jpg",
  "/work/house4/photo_2026-04-03_23-56-59 (3).jpg",
  "/work/house4/photo_2026-04-03_23-56-59.jpg",
  "/work/house4/photo_2026-04-03_23-57-00 (2).jpg",
  "/work/house4/photo_2026-04-03_23-57-00 (3).jpg",
  "/work/house4/photo_2026-04-03_23-57-00.jpg",
];

export function encodeProjectImagePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return encodeURI(path);
  if (!path.startsWith("/")) return path;

  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

function toImages(paths: string[], houseLabel: string): ProjectImage[] {
  return paths.map((src, i) => ({
    src: encodeProjectImagePath(src),
    alt: `${houseLabel} - photo ${i + 1}`,
  }));
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "house1",
    kicker: "Strip-Out",
    title: "Kitchen reset with first-fix access",
    description:
      "This gallery shows the heavy-lift stage done properly: surfaces taken back, pipework exposed, and the room prepared cleanly so the rebuild can follow without guesswork.",
    scope: "Strip-out and prep",
    outcome: "Ready for rebuild",
    tags: ["Pipework access", "Wall prep", "Clean sequencing"],
    images: toImages(HOUSE1, "House project 1"),
  },
  {
    id: "house2",
    kicker: "Interior Finish",
    title: "Lighting and ceiling work with a cleaner final look",
    description:
      "Fresh ceiling work, recessed lighting, and decorative detailing brought this room back with a brighter feel and a much more complete finish.",
    scope: "Ceiling and lighting",
    outcome: "Finished living space",
    tags: ["Downlights", "Decorative finish", "Living room refresh"],
    images: toImages(HOUSE2, "House project 2"),
  },
  {
    id: "house3",
    kicker: "Hallway Refresh",
    title: "A brighter entrance with crisp, simple detailing",
    description:
      "A straightforward hallway refresh that makes the home feel lighter on arrival, with clean paintwork, warm flooring, and a neater visual flow from the front door inward.",
    scope: "Hallway improvement",
    outcome: "Sharper first impression",
    tags: ["Clean walls", "Warm flooring", "Staged finish"],
    images: toImages(HOUSE3, "House project 3"),
  },
  {
    id: "house4",
    kicker: "Bathroom Upgrade",
    title: "Bathroom flooring and panelling with a sharper finish",
    description:
      "Large-format marble-look surfaces and tighter finishing details gave this bathroom a more modern, durable, and easy-to-maintain feel.",
    scope: "Bathroom finish",
    outcome: "Completed upgrade",
    tags: ["Tile finish", "Panelling", "Clean edges"],
    images: toImages(HOUSE4, "House project 4"),
  },
];

function normalizeProjectImage(
  image: unknown,
  fallbackAlt: string,
  imageIndex: number,
): ProjectImage | null {
  if (!image || typeof image !== "object") return null;

  const record = image as Record<string, unknown>;
  if (typeof record.src !== "string" || !record.src.trim()) return null;

  return {
    src: encodeProjectImagePath(record.src.trim()),
    alt:
      typeof record.alt === "string" && record.alt.trim()
        ? record.alt.trim()
        : `${fallbackAlt} - photo ${imageIndex + 1}`,
  };
}

function normalizeLegacyImage(project: Record<string, unknown>, fallbackAlt: string) {
  if (typeof project.image !== "string" || !project.image.trim()) return [];

  return [
    {
      src: encodeProjectImagePath(project.image.trim()),
      alt:
        typeof project.alt === "string" && project.alt.trim()
          ? project.alt.trim()
          : `${fallbackAlt} - photo 1`,
    },
  ];
}

function normalizeProject(project: unknown, index: number): Project {
  const fallback = DEFAULT_PROJECTS[index] ?? DEFAULT_PROJECTS[0];

  if (!project || typeof project !== "object") {
    return {
      ...fallback,
      tags: [...fallback.tags],
      images: fallback.images.map((image) => ({ ...image })),
    };
  }

  const record = project as Record<string, unknown>;
  const title =
    typeof record.title === "string" && record.title.trim()
      ? record.title.trim()
      : fallback.title;

  const fallbackAlt = title || fallback.title;
  const normalizedImages = Array.isArray(record.images)
    ? record.images
        .map((image, imageIndex) =>
          normalizeProjectImage(image, fallbackAlt, imageIndex),
        )
        .filter((image): image is ProjectImage => Boolean(image))
    : normalizeLegacyImage(record, fallbackAlt);

  const parsedTags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : typeof record.tags === "string"
      ? record.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  return {
    id:
      typeof record.id === "string" && record.id.trim()
        ? record.id.trim()
        : fallback.id,
    kicker:
      typeof record.kicker === "string" && record.kicker.trim()
        ? record.kicker.trim()
        : typeof record.date === "string" && record.date.trim()
          ? record.date.trim()
          : fallback.kicker,
    title,
    description:
      typeof record.description === "string" && record.description.trim()
        ? record.description.trim()
        : fallback.description,
    scope:
      typeof record.scope === "string" && record.scope.trim()
        ? record.scope.trim()
        : typeof record.date === "string" && record.date.trim()
          ? record.date.trim()
          : fallback.scope,
    outcome:
      typeof record.outcome === "string" && record.outcome.trim()
        ? record.outcome.trim()
        : fallback.outcome,
    tags: parsedTags.length > 0 ? parsedTags : [...fallback.tags],
    images:
      normalizedImages.length > 0
        ? normalizedImages
        : fallback.images.map((image) => ({ ...image })),
  };
}

export function normalizeProjects(projects: unknown): Project[] {
  if (!Array.isArray(projects) || projects.length === 0) {
    return DEFAULT_PROJECTS.map((project) => ({
      ...project,
      tags: [...project.tags],
      images: project.images.map((image) => ({ ...image })),
    }));
  }

  return projects.map((project, index) => normalizeProject(project, index));
}
