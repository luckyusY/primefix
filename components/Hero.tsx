import Image from "next/image";

const PILLARS = [
  "Estate Agents",
  "Landlords",
  "Restaurants",
  "Retail Premises",
  "Hotels",
  "Local Councils",
];

const STATS = [
  { value: "5.0", label: "Google Rating" },
  { value: "25+", label: "Years Combined Experience" },
  { value: "1-3hr", label: "Emergency Response" },
];

export default function Hero() {
  return (
    <section className="hero">
      <Image
        src="/media/hero-london.jpg"
        alt="Open-license view of Tower Bridge in London at sunset"
        fill
        priority
        sizes="100vw"
        className="hero__image"
      />
      <div className="hero__overlay"></div>

      <div className="container hero__content">
        <p className="hero__eyebrow">London&apos;s trusted maintenance team</p>
        <h1>UpKeep Property Maintenance &amp; Construction</h1>
        <p className="hero__subcopy">
          From emergency repairs to full refurbishments, UpKeep UK is trusted
          by estate agents, landlords, restaurants, retail premises, hotels,
          and local councils across London.
        </p>

        <div className="hero__actions">
          <a href="#contact" className="btn btn-teal hero__button">
            Request Your Quote
          </a>
          <a href="tel:02031488884" className="btn hero__button hero__button--phone">
            020 3148 8884
          </a>
        </div>

        <div className="hero__pillars">
          {PILLARS.map((pillar) => (
            <span key={pillar}>{pillar}</span>
          ))}
        </div>

        <div className="hero__stats">
          {STATS.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero__curve" aria-hidden="true">
        <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
          <path
            d="M0 86c204 18 420 28 647 22 269-8 533-40 793-33v35H0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
