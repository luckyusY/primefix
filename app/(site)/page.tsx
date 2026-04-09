import Hero from "@/components/Hero";
import Accreditations from "@/components/Accreditations";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const { reviews, faqs, steps } = await getContent();

  return (
    <main>
      <Hero />
      <Accreditations />
      <Reviews items={reviews} />
      <Services />
      <HowItWorks items={steps} />
      <Projects />
      <About />
      <CtaBanner />
      <Faq items={faqs} />
    </main>
  );
}
