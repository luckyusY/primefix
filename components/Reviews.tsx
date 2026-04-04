const REVIEWS = [
  {
    name: "Maria D.",
    type: "Homeowner",
    text:
      "Responsive, organised, and easy to work with. PrimeFix London kept the visit clear from the first quote and handled the repair without fuss.",
  },
  {
    name: "James P.",
    type: "Landlord",
    text:
      "We needed quick support for a fault at short notice. The technician arrived prepared, explained the issue well, and got everything moving again.",
  },
  {
    name: "Rina K.",
    type: "Homeowner",
    text:
      "From the quote to the after-service follow-up, everything felt clear and professional. We would happily use PrimeFix London again.",
  },
];

export default function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="reviews-layout">
          <div className="review-score">
            <span className="label">Client Feedback</span>
            <h2>Trusted By London Households</h2>
            <div className="divider"></div>
            <div className="review-score__value">Repair</div>
            <p className="review-score__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
            <p>
              Clear communication, reliable visits, and support that continues
              after the work is done.
            </p>
            <a href="#contact" className="btn btn-teal">
              Request Your Quote
            </a>
          </div>

          <div className="review-grid">
            {REVIEWS.map((review) => (
              <article className="review-card" key={review.name}>
                <p className="review-card__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
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
