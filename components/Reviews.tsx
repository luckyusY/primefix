import Animate, { StaggerContainer, StaggerItem } from "@/components/Animate";
import BookingButton from "@/components/BookingButton";

import type { Review } from "@/lib/types";

const FALLBACK: Review[] = [
  { id: "r1", name: "Maria D.", type: "Homeowner", text: "Responsive, organised, and easy to work with. PrimeFix London kept the visit clear from the first quote and handled the repair without fuss." },
  { id: "r2", name: "James P.", type: "Landlord",  text: "We needed quick support for a fault at short notice. The technician arrived prepared, explained the issue well, and got everything moving again." },
  { id: "r3", name: "Rina K.",  type: "Homeowner", text: "From the quote to the after-service follow-up, everything felt clear and professional. We would happily use PrimeFix London again." },
];

export default function Reviews({ items }: { items?: Review[] }) {
  const reviews = items && items.length > 0 ? items : FALLBACK;

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="reviews-layout">
          <Animate variant="fadeLeft">
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
              <BookingButton className="btn btn-teal">Book Appointment</BookingButton>
            </div>
          </Animate>

          <StaggerContainer className="review-grid" stagger={0.12} delay={0.1}>
            {reviews.map((review) => (
              <StaggerItem key={review.id} variant="fadeUp">
                <article className="review-card">
                  <p className="review-card__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>
                  <p className="review-text">&quot;{review.text}&quot;</p>
                  <div className="reviewer-info">
                    <strong>{review.name}</strong>
                    <span>{review.type}</span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
