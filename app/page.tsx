import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Accreditations from "@/components/Accreditations";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Accreditations />
        <Reviews />
        <Services />
        <Contact />
        <Projects />
        <About />
        <CtaBanner />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
