"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "What property maintenance services do you provide?",
    a: "We handle reactive repairs, plumbing, electrical fault finding, roof works, heating issues, general maintenance, and planned upkeep for residential and commercial properties.",
  },
  {
    q: "Do you also take on full refurbishments and fit-outs?",
    a: "Yes. UpKeep UK supports loft conversions, extensions, kitchen and bathroom renovations, interior fit-outs, and broader design-and-build projects.",
  },
  {
    q: "How quickly can you respond to urgent call-outs?",
    a: "For urgent issues across London, our team aims to respond within 1 to 3 hours depending on location, access, and the nature of the issue.",
  },
  {
    q: "Who do you work with?",
    a: "We work with homeowners, landlords, estate agents, restaurants, retail operators, hotels, and local commercial clients who need reliable maintenance or refurbishment support.",
  },
  {
    q: "Are your works insured and guaranteed?",
    a: "Yes. Our work is fully insured, professionally managed, and completed with quality control and clear communication throughout.",
  },
  {
    q: "How do I request a quote?",
    a: "You can call us directly for urgent help or submit the enquiry form on this page. We will review the scope and come back with next steps and pricing guidance.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq">
      <div className="container">
        <div className="section-head">
          <span className="label">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <div className="divider"></div>
        </div>

        <div className="faq-list">
          {QUESTIONS.map((item, index) => (
            <div
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              key={item.q}
            >
              <button
                className="faq-q"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                {item.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
