import Image from "next/image";
import ScaffoldIllustration from "@/components/ScaffoldIllustration";
import Animate from "@/components/Animate";
import BookingButton from "@/components/BookingButton";

const SERVICE_BANDS = [
  {
    id: "handyman-paint-flooring",
    title: "Handyman, Paint & Flooring",
    body: "PrimeFix Hub provides skilled tradespeople for day-to-day repairs, full decoration projects, and flooring installations across London properties.",
    bullets: [
      "Handyman call-outs for repairs and minor works",
      "Interior and exterior painting and decorating",
      "Laminate, vinyl, hardwood and tile flooring",
      "Flexible booking for planned or urgent jobs",
      "Tidy workmanship and clear communication throughout",
    ],
    cta: "Book a Visit",
    image: "/media/minimal-living.jpg",
    alt: "PrimeFix London handyman, painting and flooring work",
  },
  {
    id: "electrical-maintenance-renovations",
    title: "Electrical, Maintenance & Renovations",
    body: "From electrical faults to full renovations, PrimeFix Hub manages complex and ongoing property work so clients have one dependable point of contact.",
    bullets: [
      "Electrical fault-finding, rewiring and upgrades",
      "Ongoing maintenance management for landlords and homeowners",
      "Full and partial property renovations",
      "End-to-end project scoping and coordination",
      "After-service support once work is complete",
    ],
    cta: "Request a Quote",
    image: "/media/living-room.jpg",
    alt: "PrimeFix London electrical, maintenance and renovation services",
    reversed: true,
  },
];

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <Animate variant="fadeUp">
          <div className="section-head section-head--left">
            <span className="label">What We Do</span>
            <h2>Our Services in Detail</h2>
            <div className="divider"></div>
            <p>
              PrimeFix Hub brings together handyman work, painting, flooring,
              electrical, maintenance management, and full property renovations
              under one reliable team.
            </p>
          </div>
        </Animate>

        <div className="services-stack">
          {SERVICE_BANDS.map((service, i) => (
            <article
              className={`service-band ${service.reversed ? "is-reversed" : ""}`}
              id={service.id}
              key={service.title}
            >
              <Animate
                className="service-band__copy"
                variant={service.reversed ? "fadeRight" : "fadeLeft"}
                delay={0.1}
              >
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <ul>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="service-band__note">
                  Clear updates, professional workmanship, and dependable after-service support.
                </p>
                <BookingButton className="service-band__cta">
                  {service.cta}
                </BookingButton>
              </Animate>

              <Animate
                className="service-band__visual"
                variant={service.reversed ? "fadeLeft" : "fadeRight"}
                delay={0.2}
              >
                <ScaffoldIllustration mirrored={Boolean(service.reversed)} />
                <div className="service-band__photo">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                  />
                </div>
              </Animate>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
