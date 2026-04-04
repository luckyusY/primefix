type ScaffoldIllustrationProps = {
  className?: string;
  mirrored?: boolean;
};

export default function ScaffoldIllustration({
  className = "",
  mirrored = false,
}: ScaffoldIllustrationProps) {
  const classes = [
    "scaffold-illustration",
    mirrored ? "is-mirrored" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <svg viewBox="0 0 360 330" role="presentation">
        <g fill="none" fillRule="evenodd">
          <path
            d="M28 274h36V86H28v188Zm78 0h36V112h-36v162Zm78 0h36V96h-36v178Zm78 0h36V126h-36v148Z"
            fill="currentColor"
            opacity="0.22"
          />
          <path
            d="M24 273h292M24 227h292M24 182h292M24 136h292M24 90h292"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M50 272V88m40 184V88m40 184V88m40 184V88m40 184V88m40 184V88m40 184V88"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M24 273 94 210 164 227 234 159 316 182"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M68 82c0-16 12-28 28-28s28 12 28 28v26H68V82Zm118 16c0-16 12-28 28-28s28 12 28 28v26h-56V98Zm76 62c0-14 11-25 25-25s25 11 25 25v24h-50v-24Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}
