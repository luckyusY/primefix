import Hero from "@/components/Hero";
import Accreditations from "@/components/Accreditations";
import Reviews from "@/components/Reviews";
import ServicesOverview from "@/components/ServicesOverview";
import HowItWorks from "@/components/HowItWorks";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const { reviews, faqs, steps, projects } = await getContent();

  return (
    <main>
      <Hero />
      <Accreditations />
      <Reviews items={reviews} />
      <ServicesOverview compact />
      <HowItWorks items={steps} />
      <Projects items={projects} />
      <About />
      <CtaBanner />
      <Faq items={faqs} />
    </main>
  );
}
