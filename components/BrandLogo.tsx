import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  href?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const classes = ["brand-logo", className].filter(Boolean).join(" ");

  return (
    <a href={href} className={classes} aria-label="PrimeFix London home">
      <span className="brand-logo__frame">
        <Image
          src="/media/primefix-london-logo.jpeg"
          alt="PrimeFix London logo"
          fill
          priority={priority}
          sizes="(max-width: 768px) 180px, 320px"
        />
      </span>
    </a>
  );
}
