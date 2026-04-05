"use client";

import * as Accordion from "@radix-ui/react-accordion";

type FaqItem = { _id?: string; question?: string; q?: string; answer?: string; a?: string };

const FALLBACK: FaqItem[] = [
  { q: "What does Domestic Appliance Guard cover?", a: "It covers home repair and maintenance services, plumbing, electrical and heating repairs, appliance repairs for fridges, ovens and dishwashers, drainage, locksmith and window repairs, plus pest control support." },
  { q: "Can I book support for appliance faults as well as general repairs?", a: "Yes. PrimeFix London can help arrange support for both household repair issues and appliance faults so clients do not need to manage separate service journeys." },
  { q: "What happens after I request a quote?", a: "The process is straightforward: request a quote, book the visit, have a technician complete the repair, then receive support after the service if anything else is needed." },
  { q: "Do you cover drainage, locksmith, window repair and pest control?", a: "Yes. These services sit alongside core repair and appliance support so households can access specialist help through the same PrimeFix London contact point." },
  { q: "Is after-service support available?", a: "Yes. PrimeFix London keeps support available after the technician visit so clients have a clear route for follow-up questions or next steps." },
  { q: "How do I request a quote?", a: "You can call us directly for urgent help or submit the enquiry form on this page. We will review the scope and come back with next steps and pricing guidance." },
];

export default function Faq({ items }: { items?: FaqItem[] }) {
  const questions = (items && items.length > 0 ? items : FALLBACK).map((i) => ({
    key:      i._id ?? i.q ?? i.question ?? "",
    question: i.question ?? i.q ?? "",
    answer:   i.answer   ?? i.a   ?? "",
  }));

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="label">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <div className="divider"></div>
        </div>

        <Accordion.Root
          type="single"
          defaultValue="item-0"
          collapsible
          className="faq-list"
        >
          {questions.map((item, index) => (
            <Accordion.Item
              key={item.key}
              value={`item-${index}`}
              className="faq-item"
            >
              <Accordion.Header className="faq-header">
                <Accordion.Trigger className="faq-q">
                  {item.question}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="faq-a">
                <div className="faq-a__inner">
                  <p>{item.answer}</p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
