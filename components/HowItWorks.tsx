const STEPS = [
  {
    n: "01",
    title: "Request Quote",
    desc: "Tell us what needs attention, whether it is a home repair, appliance fault, drainage problem or another domestic issue.",
  },
  {
    n: "02",
    title: "Book Visit",
    desc: "We confirm the right service, arrange a visit time, and keep communication simple so you know exactly what happens next.",
  },
  {
    n: "03",
    title: "Technician Repairs",
    desc: "A technician carries out the repair, diagnoses the fault properly, and works toward a fast, practical fix on site.",
  },
  {
    n: "04",
    title: "Support After Service",
    desc: "We stay available after the visit so clients have a clear point of contact if anything needs follow-up or further guidance.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="process">
      <div className="container">
        <div className="section-head">
          <span className="label">How It Works</span>
          <h2>Simple Support From First Request To Aftercare</h2>
          <div className="divider"></div>
          <p>
            A four-step process that keeps repairs clear, organised and easy to
            follow from quote through to post-service support.
          </p>
        </div>

        <div className="steps">
          {STEPS.map((step) => (
            <div className="step" key={step.n}>
              <div className="step-num">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
