import Animate, { StaggerContainer, StaggerItem } from "@/components/Animate";

import type { Step } from "@/lib/types";

const FALLBACK: Step[] = [
  { id: "s1", n: "01", title: "Request Quote",         desc: "Tell us what needs attention, whether it is a home repair, appliance fault, drainage problem or another domestic issue." },
  { id: "s2", n: "02", title: "Book Visit",            desc: "We confirm the right service, arrange a visit time, and keep communication simple so you know exactly what happens next." },
  { id: "s3", n: "03", title: "Technician Repairs",    desc: "A technician carries out the repair, diagnoses the fault properly, and works toward a fast, practical fix on site." },
  { id: "s4", n: "04", title: "Support After Service", desc: "We stay available after the visit so clients have a clear point of contact if anything needs follow-up or further guidance." },
];

export default function HowItWorks({ items }: { items?: Step[] }) {
  const steps = (items && items.length > 0 ? items : FALLBACK).map((s) => ({
    key:   s.id,
    num:   s.n,
    title: s.title,
    desc:  s.desc,
  }));

  return (
    <section className="how" id="process">
      <div className="container">
        <Animate variant="fadeUp">
          <div className="section-head">
            <span className="label">How It Works</span>
            <h2>Simple Support From First Request To Aftercare</h2>
            <div className="divider"></div>
            <p>
              A four-step process that keeps repairs clear, organised and easy to
              follow from quote through to post-service support.
            </p>
          </div>
        </Animate>

        <StaggerContainer className="steps" stagger={0.1} delay={0.1}>
          {steps.map((step) => (
            <StaggerItem key={step.key} variant="fadeUp">
              <div className="step">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
