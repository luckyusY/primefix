import Hero from "@/components/Hero";
import Accreditations from "@/components/Accreditations";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <Accreditations />
      <Reviews />
      <Services />
      <HowItWorks />
      <Projects />
      <About />
      <CtaBanner />
      <Faq />
    </main>
  );
}
