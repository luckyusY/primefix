import Animate, { StaggerContainer, StaggerItem } from "@/components/Animate";

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
        <Animate variant="fadeUp">
          <p className="accred__intro">
            Trusted support for domestic maintenance, appliance repairs and
            specialist home services across London.
          </p>
        </Animate>

        <StaggerContainer className="accred-row" stagger={0.08}>
          {BADGES.map((badge) => (
            <StaggerItem key={badge.code} variant="scaleUp">
              <div className="accred-box">
                <div className="accred-square">{badge.code}</div>
                <p>{badge.name}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
