const BADGES = [
  { code: "SC", name: "SafeContractor" },
  { code: "FMB", name: "Master Builders" },
  { code: "SSIP", name: "SSIP Approved" },
  { code: "NAP", name: "NAPIT" },
  { code: "TM", name: "TrustMark" },
  { code: "GS", name: "Gas Safe" },
];

export default function Accreditations() {
  return (
    <section className="accred">
      <div className="container">
        <p className="accred__intro">
          Trusted, insured, and compliant for residential, commercial, and
          reactive works across London.
        </p>

        <div className="accred-row">
          {BADGES.map((badge) => (
            <div className="accred-box" key={badge.code}>
              <div className="accred-square">{badge.code}</div>
              <p>{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
