const ITEMS = [
  "Gas Safe Registered",
  "Fully Insured £5M",
  "Fixed-Rate Pricing",
  "24/7 Emergency",
  "All Works Guaranteed",
];

export default function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-row">
          {ITEMS.map((i) => (
            <div className="trust-item" key={i}>
              <span className="check">✓</span> {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
