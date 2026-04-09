import Image from "next/image";
import BookingButton from "@/components/BookingButton";

import type { Project } from "@/lib/types";

const FALLBACK: Project[] = [
  { id: "p1", title: "Emergency Kitchen Repair Visit", date: "Typical Call-Out",         description: "Support for leaks, faulty electrics, heating issues and everyday kitchen faults handled through one clear maintenance visit.", image: "/media/home-exterior.jpg", alt: "Domestic repair call-out" },
  { id: "p2", title: "Appliance Fault Support",        date: "Domestic Appliance Guard", description: "Fridge, oven and dishwasher issues triaged quickly so households can get back to normal with less disruption.",                  image: "/media/minimal-living.jpg", alt: "Appliance support for a household" },
  { id: "p3", title: "Specialist Home Services",       date: "Rapid Response",           description: "Drainage, locksmith, window repair and pest control support coordinated through the same trusted service journey.",               image: "/media/modern-home.jpg",    alt: "Specialist domestic support" },
];

export default function Projects({ items }: { items?: Project[] }) {
  const projects = items && items.length > 0 ? items : FALLBACK;

  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">Popular Support Types</span>
          <h2>Where Domestic Appliance Guard Helps Most</h2>
          <div className="divider"></div>
          <p>
            A snapshot of the kinds of household issues PrimeFix Hub helps
            resolve every day across the capital.
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
