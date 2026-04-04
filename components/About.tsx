import Image from "next/image";

const PRINCIPLES = [
  "Single contact point for home repairs and appliance issues",
  "Clear communication from quote to visit and aftercare",
  "Practical support for plumbing, electrical, heating and appliance faults",
  "Reliable service for homeowners, landlords and busy households",
];

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <div className="about-content">
          <span className="label">Who Is PrimeFix London?</span>
          <h2>Domestic support without the runaround.</h2>
          <div className="divider"></div>
          <p>
            PrimeFix London is built around fast domestic support, dependable
            workmanship, and a simpler service experience for households that
            need issues resolved without chasing different trades.
          </p>
          <p>
            We help with everyday maintenance, urgent faults, appliance
            breakdowns, and specialist services so clients can move from first
            request to repair and follow-up with less friction.
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
              <strong>4 Steps</strong>
              <span>quote, visit, repair, after-service support</span>
            </div>
          </div>

          <blockquote className="about-quote">
            <p>
              &quot;The goal is simple: make it easy to get the right technician,
              get the fault fixed, and keep support available afterwards.&quot;
            </p>
            <footer>PrimeFix London Team</footer>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
