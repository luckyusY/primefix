export type HouseProjectImage = {
  src: string;
  alt: string;
};

export type HouseProject = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  scope: string;
  outcome: string;
  tags: string[];
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

function encodePath(path: string): string {
  return path
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/");
}

function toImages(paths: string[], houseLabel: string): HouseProjectImage[] {
  return paths.map((src, i) => ({
    src: encodePath(src),
    alt: `${houseLabel} - photo ${i + 1}`,
  }));
}

export const RECENT_HOUSES: HouseProject[] = [
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
