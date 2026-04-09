import Image from "next/image";
import BookingButton from "@/components/BookingButton";

import type { Project } from "@/lib/types";

const FALLBACK: Project[] = [
  {
    id: "h1",
    title: "Kitchen Refresh & Finishing",
    date: "Recent work",
    description:
      "Practical repairs and finishing touches that restore function, cleanliness, and a polished look.",
    image: "/work/house1/photo_2026-04-03_23-49-40.jpg",
    alt: "Kitchen refresh work",
  },
  {
    id: "h2",
    title: "Interior Fixes & Touch-ups",
    date: "Recent work",
    description:
      "Wall, fittings, and small fixes completed with tidy prep and a clean handover.",
    image: "/work/house2/photo_2026-04-03_23-49-47 (4).jpg",
    alt: "Interior repair and touch-ups",
  },
  {
    id: "h3",
    title: "Bathroom / Utility Repairs",
    date: "Recent work",
    description:
      "Maintenance and repairs carried out quickly, with clear communication and after-service support.",
    image: "/work/house3/photo_2026-04-03_23-56-56.jpg",
    alt: "Bathroom and utility repairs",
  },
  {
    id: "h4",
    title: "Before & After Improvements",
    date: "Recent work",
    description:
      "From problem areas to a finished result—small improvements that make a big difference day-to-day.",
    image: "/work/house4/photo_2026-04-03_23-57-00.jpg",
    alt: "Before and after improvements",
  },
  {
    id: "h5",
    title: "Detail Work & Finishing",
    date: "Recent work",
    description:
      "Attention to the details—sealant lines, edges, fittings, and tidy finishes.",
    image: "/work/house1/photo_2026-04-03_23-49-45.jpg",
    alt: "Detail work and finishing",
  },
  {
    id: "h6",
    title: "On-site Fixes, Done Properly",
    date: "Recent work",
    description:
      "Fast diagnosis, the right tools, and a clean wrap-up—so the job is resolved without hassle.",
    image: "/work/house3/photo_2026-04-03_23-56-58 (2).jpg",
    alt: "On-site maintenance and repairs",
  },
];

export default function Projects({ items }: { items?: Project[] }) {
  const projects = items && items.length > 0 ? items : FALLBACK;

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">Past Work</span>
          <h2>Recent Repairs & Maintenance Projects</h2>
          <div className="divider"></div>
          <p>
            A quick look at recent work across London—repairs, touch-ups, and
            practical improvements delivered with a tidy finish.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-card__media">
                <Image
                  src={project.image}
                  alt={project.alt ?? project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="project-card__body">
                <p className="project-card__date">{project.date}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <BookingButton className="project-card__link">Book a similar visit</BookingButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
