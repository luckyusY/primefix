export type HouseProjectImage = {
  src: string;
  alt: string;
};

export type HouseProject = {
  id: string;
  title: string;
  description: string;
  images: HouseProjectImage[];
};

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

function toImages(paths: string[], houseLabel: string): HouseProjectImage[] {
  return paths.map((src, i) => ({
    src: encodeURI(src),
    alt: `${houseLabel} — photo ${i + 1}`,
  }));
}

export const RECENT_HOUSES: HouseProject[] = [
  {
    id: "house1",
    title: "Project 1",
    description:
      "Kitchen and interior finishes across multiple rooms—repair work, tidy prep, and a polished handover.",
    images: toImages(HOUSE1, "House project 1"),
  },
  {
    id: "house2",
    title: "Project 2",
    description:
      "Interior fixes and touch-ups—walls, fittings, and small improvements that bring the space back together.",
    images: toImages(HOUSE2, "House project 2"),
  },
  {
    id: "house3",
    title: "Project 3",
    description:
      "Bathroom and utility repairs with clear communication and fast follow-through on site.",
    images: toImages(HOUSE3, "House project 3"),
  },
  {
    id: "house4",
    title: "Project 4",
    description:
      "Before-and-after improvements across the property—practical upgrades with a tidy finish.",
    images: toImages(HOUSE4, "House project 4"),
  },
];
