const STEPS = [
  {
    n: "01",
    title: "Request Raised",
    desc: "You or your tenant submits a request by phone, email or our online form. We log every detail and confirm receipt.",
  },
  {
    n: "02",
    title: "Engineer Assigned",
    desc: "The right tradesperson is dispatched and we confirm attendance directly with the site contact or tenant.",
  },
  {
    n: "03",
    title: "Work Completed",
    desc: "Our engineers carry out the job safely with quality checks, before-and-after photos and tenant sign-off.",
  },
  {
    n: "04",
    title: "Report & Invoice",
    desc: "You receive a full report with photos, notes and transparent itemised invoicing — no surprises, ever.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="section-head">
          <span className="label" style={{ color: "var(--teal-light)" }}>
            How It Works
          </span>
          <h2>Simple, Transparent Process</h2>
          <div className="divider"></div>
          <p>
            Four steps from request to resolution — clear communication and
            accountability at every stage.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
