import BookingButton from "@/components/BookingButton";

const SERVICE_POINTS = [
  {
    title: "Home repair & maintenance services",
    description:
      "One reliable team for everyday upkeep, urgent faults, and practical repair visits across London homes.",
  },
  {
    title: "Plumbing, electrical & heating repairs",
    description:
      "Core household systems handled with clear diagnosis, tidy workmanship, and dependable follow-through.",
  },
  {
    title: "Appliance repairs",
    description:
      "Fridge, oven, and dishwasher support designed to get busy kitchens back to normal quickly.",
  },
  {
    title: "Drainage, locksmith, window repairs",
    description:
      "Property access, drainage, and window issues managed through one simple service journey.",
  },
  {
    title: "Pest control services",
    description:
      "Fast support to protect comfort, cleanliness, and peace of mind when unexpected issues appear.",
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
      "Choose a suitable appointment window and let PrimeFix London confirm the visit.",
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

export default function ServicesOverview() {
  return (
    <section className="services-overview">
      <div className="container">
        <div className="services-overview__hero">
          <div className="services-overview__copy">
            <span className="label">Domestic Appliance Guard</span>
            <h2>Short overview, clear process, one reliable team</h2>
            <div className="divider"></div>
            <p>
              PrimeFix London keeps the offer simple: one clear service page,
              one clear booking route, and one dependable team for repairs,
              appliance support, and household call-outs.
            </p>
          </div>

          <div className="services-overview__booking">
            <strong>Need a visit?</strong>
            <p>
              Book an appointment now and let PrimeFix London confirm the best
              next slot for your repair or support request.
            </p>
            <BookingButton className="btn btn-teal">
              Book Appointment
            </BookingButton>
          </div>
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
      </div>
    </section>
  );
}
