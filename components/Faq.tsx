"use client";

import * as Accordion from "@radix-ui/react-accordion";

import type { FaqItem } from "@/lib/types";

const FALLBACK: FaqItem[] = [
  { id: "f1", question: "What does Domestic Appliance Guard cover?",                           answer: "It covers home repair and maintenance services, plumbing, electrical and heating repairs, appliance repairs for fridges, ovens and dishwashers, drainage, locksmith and window repairs, plus pest control support." },
  { id: "f2", question: "Can I book support for appliance faults as well as general repairs?", answer: "Yes. PrimeFix Hub can help arrange support for both household repair issues and appliance faults so clients do not need to manage separate service journeys." },
  { id: "f3", question: "What happens after I request a quote?",                               answer: "The process is straightforward: request a quote, book the visit, have a technician complete the repair, then receive support after the service if anything else is needed." },
  { id: "f4", question: "Do you cover drainage, locksmith, window repair and pest control?",   answer: "Yes. These services sit alongside core repair and appliance support so households can access specialist help through the same PrimeFix Hub contact point." },
  { id: "f5", question: "Is after-service support available?",                                 answer: "Yes. PrimeFix Hub keeps support available after the technician visit so clients have a clear route for follow-up questions or next steps." },
  { id: "f6", question: "How do I request a quote?",                                           answer: "You can call us directly for urgent help or submit the enquiry form on this page. We will review the scope and come back with next steps and pricing guidance." },
];

export default function Faq({ items }: { items?: FaqItem[] }) {
  const questions = (items && items.length > 0 ? items : FALLBACK).map((i) => ({
    key:      i.id,
    question: i.question,
    answer:   i.answer,
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
