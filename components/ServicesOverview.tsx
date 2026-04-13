import Link from "next/link";
import BookingButton from "@/components/BookingButton";

const SERVICE_POINTS = [
  {
    title: "Handyman Service",
    description:
      "One reliable team for everyday fixes, minor repairs, and general household call-outs across London properties.",
  },
  {
    title: "Paint & Decoration",
    description:
      "Interior and exterior painting, feature walls, and decorating work completed to a clean, consistent finish.",
  },
  {
    title: "Flooring",
    description:
      "Supply and installation of a range of floor types, from laminate and vinyl to hardwood and tile.",
  },
  {
    title: "Electrical",
    description:
      "Fault-finding, rewiring, consumer unit upgrades, and general electrical work carried out safely and professionally.",
  },
  {
    title: "Maintenance Manager",
    description:
      "Ongoing property maintenance managed end-to-end so landlords and homeowners stay ahead of issues.",
  },
  {
    title: "Property Renovations",
    description:
      "Full or partial renovation projects handled with clear scoping, dependable tradespeople, and tidy finishing.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Request quote",
    description:
      "Send the issue, service type, and property details so we can guide the right next step.",
  },
  {
    title: "Book visit",
    description:
      "Choose a suitable appointment window and let PrimeFix Hub confirm the visit.",
  },
  {
    title: "Technician repairs",
    description:
      "A technician arrives ready to assess the problem and carry out the repair where possible.",
  },
  {
    title: "Support after service",
    description:
      "Stay backed by clear updates and follow-up support after the work has been completed.",
  },
];

export default function ServicesOverview({ compact = false }: { compact?: boolean }) {
  return (
    <section className="services-overview">
      <div className="container">
        <div className="services-overview__hero">
          <div className="services-overview__copy">
            <span className="label">What We Offer</span>
            <h2>Six services, one reliable team</h2>
            <div className="divider"></div>
            <p>
              PrimeFix Hub covers handyman work, paint and decoration, flooring,
              electrical, maintenance management, and property renovations —
              all through one clear booking route.
            </p>
          </div>

          {compact ? (
            <div className="services-overview__booking">
              <strong>Want the full picture?</strong>
              <p>
                See detailed breakdowns, scope, and examples for every service
                we offer across London properties.
              </p>
              <Link href="/services" className="btn btn-teal">
                View All Services
              </Link>
            </div>
          ) : (
            <div className="services-overview__booking">
              <strong>Need a visit?</strong>
              <p>
                Book an appointment now and let PrimeFix Hub confirm the best
                next slot for your repair or support request.
              </p>
              <BookingButton className="btn btn-teal">
                Book Appointment
              </BookingButton>
            </div>
          )}
        </div>

        <div className="services-overview__grid">
          {SERVICE_POINTS.map((point, index) => (
            <article className="services-overview__card" key={point.title}>
              <span className="services-overview__index">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>

        {!compact && (
          <div className="services-process">
            <div className="services-process__label">Process</div>
            <div className="services-process__track">
              {PROCESS_STEPS.map((step, index) => (
                <div className="services-process__step" key={step.title}>
                  <span className="services-process__number">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
