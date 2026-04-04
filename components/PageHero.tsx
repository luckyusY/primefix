import { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container page-hero__content">
        <span className="label">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children ? <div className="page-hero__actions">{children}</div> : null}
      </div>
    </section>
  );
}
