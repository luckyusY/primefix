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
  const encodeSegment = (segment: string) => {
    const decoded = (() => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })();

    return encodeURIComponent(decoded).replace(
      /[!'()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );
  };

  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      url.pathname = url.pathname
        .split("/")
        .map((segment, index) => (index === 0 ? segment : encodeSegment(segment)))
        .join("/");
      return url.toString();
    } catch {
      return encodeURI(path);
    }
  }
  if (!path.startsWith("/")) return path;

  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeSegment(segment)))
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
    id: "p01",
    kicker: "Strip-Out",
    title: "Kitchen prep — surfaces cleared and ready",
    description: "Walls taken back and pipework exposed so the rebuild can start clean.",
    scope: "Strip-out",
    outcome: "Ready for rebuild",
    tags: ["Kitchen", "Strip-out"],
    images: [{ src: encodeProjectImagePath(HOUSE1[0]), alt: "Kitchen strip-out — surfaces cleared" }],
  },
  {
    id: "p02",
    kicker: "First Fix",
    title: "Pipework exposed and correctly positioned",
    description: "First-fix plumbing laid out cleanly before the walls were closed.",
    scope: "Plumbing first fix",
    outcome: "Ready for boarding",
    tags: ["Plumbing", "First fix"],
    images: [{ src: encodeProjectImagePath(HOUSE1[3]), alt: "First-fix pipework positioned correctly" }],
  },
  {
    id: "p03",
    kicker: "Wall Prep",
    title: "Walls back to bare — clean base for replastering",
    description: "Old finishes removed entirely so fresh plaster has a solid, even surface to bond to.",
    scope: "Wall prep",
    outcome: "Plaster-ready surface",
    tags: ["Wall prep", "Plaster"],
    images: [{ src: encodeProjectImagePath(HOUSE1[7]), alt: "Walls stripped back ready for replastering" }],
  },
  {
    id: "p04",
    kicker: "Interior Finish",
    title: "Ceiling work and recessed lighting installed",
    description: "Fresh ceiling with flush downlights for a cleaner, more modern look.",
    scope: "Ceiling and lighting",
    outcome: "Finished ceiling",
    tags: ["Ceiling", "Lighting"],
    images: [{ src: encodeProjectImagePath(HOUSE2[0]), alt: "Recessed lighting and finished ceiling" }],
  },
  {
    id: "p05",
    kicker: "Living Room",
    title: "Decorative detailing with a bright, complete finish",
    description: "Coving, cornice, and paint brought this living room up to a sharp, final standard.",
    scope: "Decorative finish",
    outcome: "Completed living room",
    tags: ["Decoration", "Paint"],
    images: [{ src: encodeProjectImagePath(HOUSE2[3]), alt: "Finished living room with decorative detailing" }],
  },
  {
    id: "p06",
    kicker: "Hallway Refresh",
    title: "Clean walls and warm flooring at the entrance",
    description: "Freshly painted walls and new flooring make this hallway feel lighter on arrival.",
    scope: "Hallway",
    outcome: "Sharper first impression",
    tags: ["Hallway", "Flooring"],
    images: [{ src: encodeProjectImagePath(HOUSE3[0]), alt: "Hallway with clean walls and warm flooring" }],
  },
  {
    id: "p07",
    kicker: "Flooring",
    title: "Warm-toned flooring laid throughout the hall",
    description: "Consistent, well-fitted flooring that ties the entrance space together neatly.",
    scope: "Flooring installation",
    outcome: "Clean floor finish",
    tags: ["Flooring", "Hall"],
    images: [{ src: encodeProjectImagePath(HOUSE3[4]), alt: "Warm-toned hallway flooring installed" }],
  },
  {
    id: "p08",
    kicker: "Staircase",
    title: "Stair treads replaced with a neater visual line",
    description: "New stair covering fitted straight and tight for a cleaner look top to bottom.",
    scope: "Staircase finish",
    outcome: "Neat stair finish",
    tags: ["Stairs", "Flooring"],
    images: [{ src: encodeProjectImagePath(HOUSE3[8]), alt: "Staircase with new tread covering" }],
  },
  {
    id: "p09",
    kicker: "Bathroom Upgrade",
    title: "Large-format tiles with tight, even grout lines",
    description: "Marble-look tiles laid to a high standard — flat, level, and easy to keep clean.",
    scope: "Tiling",
    outcome: "Finished bathroom floor",
    tags: ["Bathroom", "Tiling"],
    images: [{ src: encodeProjectImagePath(HOUSE4[0]), alt: "Bathroom large-format tile floor" }],
  },
  {
    id: "p10",
    kicker: "Bathroom Panelling",
    title: "Wall panelling fitted for a modern, durable finish",
    description: "Panelled walls give this bathroom a cleaner look and a surface that holds up long-term.",
    scope: "Wall panelling",
    outcome: "Completed bathroom",
    tags: ["Bathroom", "Panelling"],
    images: [{ src: encodeProjectImagePath(HOUSE4[3]), alt: "Bathroom wall panelling complete" }],
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
