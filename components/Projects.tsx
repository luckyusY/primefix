import Image from "next/image";

const PROJECTS = [
  {
    title: "Richmond Refurbishment",
    date: "October 2025",
    description:
      "A full property refresh focused on curb appeal, brighter circulation, and a cleaner handover for long-term value.",
    image: "/media/home-exterior.jpg",
    alt: "Open-license exterior image representing a residential refurbishment project",
  },
  {
    title: "Primrose Hill Interior Refresh",
    date: "October 2025",
    description:
      "A minimalist living space reworked with calmer finishes, better light, and practical detailing for everyday use.",
    image: "/media/minimal-living.jpg",
    alt: "Open-license living room image representing an interior refurbishment project",
  },
  {
    title: "Flexible Home Office Build",
    date: "September 2025",
    description:
      "A new multi-purpose workspace delivered from strip-out through final fit-out, ready for modern hybrid working.",
    image: "/media/modern-home.jpg",
    alt: "Open-license renovation image representing an in-progress fit-out project",
  },
];

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">Featured Work</span>
          <h2>PrimeFix London Projects</h2>
          <div className="divider"></div>
          <p>
            Recent examples of refurbishment, fit-out, and maintenance work
            delivered for homes and businesses across London.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-card__media">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="project-card__body">
                <p className="project-card__date">{project.date}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a href="#contact" className="project-card__link">
                  Request a similar quote
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
