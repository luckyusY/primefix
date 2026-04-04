import Image from "next/image";

const PRINCIPLES = [
  "Single point of contact for every stage of work",
  "Clear communication from quote to completion",
  "Reliable multi-trade teams for reactive and planned jobs",
  "Professional standards for both homes and businesses",
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <div className="about-content">
          <span className="label">Who Is PrimeFix London?</span>
          <h2>Property care without the stress.</h2>
          <div className="divider"></div>
          <p>
            PrimeFix London is a property maintenance and repair company built
            around dependable response times, professional workmanship, and
            practical project coordination.
          </p>
          <p>
            We support estate agents, homeowners, landlords, and commercial
            clients who need a team that can handle both urgent reactive work
            and larger refurbishment programmes.
          </p>
          <ul className="about-list">
            {PRINCIPLES.map((principle) => (
              <li key={principle}>
                <span className="check">+</span>
                {principle}
              </li>
            ))}
          </ul>
        </div>

        <aside className="about-aside">
          <div className="about-aside__media">
            <Image
              src="/media/builder.jpg"
              alt="Open-license image of a surveyor reviewing a residential project"
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
            />
            <div className="about-aside__badge">
              <strong>25+</strong>
              <span>years combined experience</span>
            </div>
          </div>

          <blockquote className="about-quote">
            <p>
              &quot;Our goal is simple: help clients move faster, feel informed,
              and trust the finish every time.&quot;
            </p>
            <footer>PrimeFix London Team</footer>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
