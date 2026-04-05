import Hero from "@/components/Hero";
import Accreditations from "@/components/Accreditations";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import { client } from "@/lib/sanity.client";
import {
  reviewsQuery,
  projectsQuery,
  faqQuery,
  howItWorksQuery,
} from "@/lib/sanity.queries";

export const revalidate = 60; // ISR — refresh every 60 s

async function getData() {
  if (!client) {
    // Sanity not yet configured — components will use their built-in fallbacks
    return { reviews: [], projects: [], faqs: [], steps: [] };
  }
  try {
    const [reviews, projects, faqs, steps] = await Promise.all([
      client.fetch(reviewsQuery),
      client.fetch(projectsQuery),
      client.fetch(faqQuery),
      client.fetch(howItWorksQuery),
    ]);
    return { reviews, projects, faqs, steps };
  } catch {
    return { reviews: [], projects: [], faqs: [], steps: [] };
  }
}

export default async function Home() {
  const { reviews, projects, faqs, steps } = await getData();

  return (
    <main>
      <Hero />
      <Accreditations />
      <Reviews items={reviews} />
      <Services />
      <HowItWorks items={steps} />
      <Projects items={projects} />
      <About />
      <CtaBanner />
      <Faq items={faqs} />
    </main>
  );
}
