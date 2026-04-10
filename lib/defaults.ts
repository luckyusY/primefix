import type { Content } from "./types";
import { DEFAULT_PROJECTS } from "./recentProjects";

export const DEFAULTS: Content = {
  reviews: [
    { id: "r1", name: "Maria D.", type: "Homeowner", text: "Responsive, organised, and easy to work with. PrimeFix Hub kept the visit clear from the first quote and handled the repair without fuss." },
    { id: "r2", name: "James P.", type: "Landlord",  text: "We needed quick support for a fault at short notice. The technician arrived prepared, explained the issue well, and got everything moving again." },
    { id: "r3", name: "Rina K.",  type: "Homeowner", text: "From the quote to the after-service follow-up, everything felt clear and professional. We would happily use PrimeFix Hub again." },
  ],

  faqs: [
    { id: "f1", question: "What does Domestic Appliance Guard cover?",                                    answer: "It covers home repair and maintenance services, plumbing, electrical and heating repairs, appliance repairs for fridges, ovens and dishwashers, drainage, locksmith and window repairs, plus pest control support." },
    { id: "f2", question: "Can I book support for appliance faults as well as general repairs?",          answer: "Yes. PrimeFix Hub can help arrange support for both household repair issues and appliance faults so clients do not need to manage separate service journeys." },
    { id: "f3", question: "What happens after I request a quote?",                                        answer: "The process is straightforward: request a quote, book the visit, have a technician complete the repair, then receive support after the service if anything else is needed." },
    { id: "f4", question: "Do you cover drainage, locksmith, window repair and pest control?",            answer: "Yes. These services sit alongside core repair and appliance support so households can access specialist help through the same PrimeFix Hub contact point." },
    { id: "f5", question: "Is after-service support available?",                                          answer: "Yes. PrimeFix Hub keeps support available after the technician visit so clients have a clear route for follow-up questions or next steps." },
    { id: "f6", question: "How do I request a quote?",                                                    answer: "You can call us directly for urgent help or submit the enquiry form on this page. We will review the scope and come back with next steps and pricing guidance." },
  ],

  steps: [
    { id: "s1", n: "01", title: "Request Quote",         desc: "Tell us what needs attention, whether it is a home repair, appliance fault, drainage problem or another domestic issue." },
    { id: "s2", n: "02", title: "Book Visit",            desc: "We confirm the right service, arrange a visit time, and keep communication simple so you know exactly what happens next." },
    { id: "s3", n: "03", title: "Technician Repairs",    desc: "A technician carries out the repair, diagnoses the fault properly, and works toward a fast, practical fix on site." },
    { id: "s4", n: "04", title: "Support After Service", desc: "We stay available after the visit so clients have a clear point of contact if anything needs follow-up or further guidance." },
  ],

  projects: DEFAULT_PROJECTS,
};
