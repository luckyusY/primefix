import Image from "next/image";
import Link from "next/link";

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
    <Link href={href} className={classes} aria-label="PrimeFix Hub home">
      <Image
        src="/media/primefix-hub-logo.png"
        alt="PrimeFix Hub logo"
        width={905}
        height={371}
        priority={priority}
        sizes="(max-width: 480px) 118px, (max-width: 768px) 220px, 280px"
        className="brand-logo__image"
      />
    </Link>
  );
}
