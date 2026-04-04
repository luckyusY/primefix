import Image from "next/image";
import ScaffoldIllustration from "@/components/ScaffoldIllustration";

const SERVICE_BANDS = [
  {
    id: "services",
    title: "Home Repair & Maintenance",
    body:
      "Domestic Appliance Guard gives households one dependable place to handle ongoing home maintenance and urgent repair issues without juggling multiple suppliers.",
    bullets: [
      "Home repair and maintenance services",
      "Plumbing, electrical and heating repairs",
      "Drainage, locksmith and window repairs",
      "Fault diagnosis and practical fixes",
      "Flexible booking for planned or urgent jobs",
    ],
    cta: "Book Home Repair Support",
    image: "/media/builder.jpg",
    alt: "Open-license image of a surveyor reviewing plans outside a residential property",
  },
  {
    id: "appliance-support",
    title: "Appliance & Specialist Support",
    body:
      "PrimeFix London also supports appliance and specialist call-outs so clients can move from first fault to finished repair with one clear service journey.",
    bullets: [
      "Fridge, oven and dishwasher repairs",
      "Pest control services",
      "Reliable technician visits and updates",
      "Support for homeowners, landlords and tenants",
      "After-service guidance once the repair is complete",
    ],
    cta: "Request Appliance Support",
    image: "/media/modern-home.jpg",
    alt: "Open-license image of a modern kitchen representing appliance and specialist support",
    reversed: true,
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <div className="section-head section-head--left">
          <span className="label">What We Do</span>
          <h2>Domestic Appliance Guard Overview</h2>
          <div className="divider"></div>
          <p>
            PrimeFix London combines day-to-day home repair, appliance support,
            and specialist call-outs into a single clear service offer.
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
                  Clear updates, professional workmanship, and dependable
                  after-service support.
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
