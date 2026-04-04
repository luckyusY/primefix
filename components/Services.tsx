import Image from "next/image";
import ScaffoldIllustration from "@/components/ScaffoldIllustration";

const SERVICE_BANDS = [
  {
    id: "services",
    title: "Property Maintenance",
    body:
      "Keep your property safe, functional, and stress-free with our trusted multi-trade team. PrimeFix London responds quickly to urgent issues and delivers precise workmanship for ongoing maintenance and repair needs.",
    bullets: [
      "Plumbing, drainage, and leak repairs",
      "Heating and boiler diagnostics",
      "Electrical fault detection",
      "Roof repairs and full replacements",
      "Emergency call-outs with 1-3 hour response",
    ],
    cta: "Discover PrimeFix Maintenance",
    image: "/media/builder.jpg",
    alt: "Open-license image of a surveyor reviewing plans outside a residential property",
  },
  {
    id: "how",
    title: "Design And Build",
    body:
      "PrimeFix London offers practical project management, trusted trade coordination, and efficient construction delivery to turn improvement plans into finished spaces.",
    bullets: [
      "Loft conversions and home extensions",
      "Kitchen and bathroom renovations",
      "Commercial refurbishments and upgrades",
      "Strip-outs, fit-outs, and finishing packages",
      "Procurement, coordination, and quality control",
    ],
    cta: "Explore PrimeFix Construction",
    image: "/media/modern-home.jpg",
    alt: "Open-license image of an in-progress interior renovation",
    reversed: true,
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">What We Do</span>
          <h2>PrimeFix London Services</h2>
          <div className="divider"></div>
          <p>
            Two specialist service lines, one dependable team. We cover both
            rapid-response maintenance and larger design-and-build projects.
          </p>
        </div>

        <div className="services-stack">
          {SERVICE_BANDS.map((service) => (
            <article
              className={`service-band ${service.reversed ? "is-reversed" : ""}`}
              id={service.id}
              key={service.title}
            >
              <div className="service-band__copy">
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <ul>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="service-band__note">
                  All work guaranteed. Fixed rates. Fast, reliable service.
                </p>
                <a href="#contact" className="service-band__cta">
                  {service.cta}
                </a>
              </div>

              <div className="service-band__visual">
                <ScaffoldIllustration mirrored={Boolean(service.reversed)} />
                <div className="service-band__photo">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
