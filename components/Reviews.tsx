const REVIEWS = [
  {
    name: "Maria D.",
    type: "Block Management",
    text:
      "Responsive, organised, and easy to work with. UpKeep handled reactive issues quickly and kept everyone updated throughout.",
  },
  {
    name: "James P.",
    type: "Hospitality Client",
    text:
      "We needed fast repair work without disruption to service. The team delivered exactly that and the finish was excellent.",
  },
  {
    name: "Rina K.",
    type: "Homeowner",
    text:
      "From the quote to completion, everything felt clear and professional. We would happily use UpKeep again.",
  },
];

export default function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="reviews-layout">
          <div className="review-score">
            <span className="label">Google Reviews</span>
            <h2>Rated 5 Stars By London Clients</h2>
            <div className="divider"></div>
            <div className="review-score__value">5.0</div>
            <p className="review-score__stars">★★★★★</p>
            <p>Based on 100+ recent client reviews and repeat referrals.</p>
            <a href="#contact" className="btn btn-teal">
              Request Your Custom Quote
            </a>
          </div>

          <div className="review-grid">
            {REVIEWS.map((review) => (
              <article className="review-card" key={review.name}>
                <p className="review-card__stars">★★★★★</p>
                <p className="review-text">&quot;{review.text}&quot;</p>
                <div className="reviewer-info">
                  <strong>{review.name}</strong>
                  <span>{review.type}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
