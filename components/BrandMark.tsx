type BrandMarkProps = {
  className?: string;
  href?: string;
};

export default function BrandMark({
  className = "",
  href = "#",
}: BrandMarkProps) {
  const classes = ["brand-mark", className].filter(Boolean).join(" ");

  return (
    <a href={href} className={classes} aria-label="UpKeep home">
      <span className="brand-mark__glyph brand-mark__glyph--u">U</span>
      <span className="brand-mark__glyph brand-mark__glyph--p">P</span>
      <span className="brand-mark__text">KEEP</span>
    </a>
  );
}
