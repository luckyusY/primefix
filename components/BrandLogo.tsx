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
      <Image
        src="/media/primefix-london-logo.png"
        alt="PrimeFix London logo"
        width={924}
        height={316}
        priority={priority}
        sizes="(max-width: 768px) 180px, 320px"
        className="brand-logo__image"
      />
    </a>
  );
}
