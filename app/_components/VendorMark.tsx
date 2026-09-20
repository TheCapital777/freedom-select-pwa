/**
 * VendorMark — business identity plate for a vendor, yard or role.
 *
 * A monogram: the business's initials in `--color-accent` on a bordered dark
 * square whose geometry matches the `.plate-border` utility in globals.css,
 * with a 3px accent edge echoing `.steel-bar-left`.
 *
 * Why a monogram rather than drawn logos: there is no real brand artwork for
 * these three yards, and three bespoke pictograms would (a) still be invented,
 * (b) stop scaling the moment a fourth vendor signs up, and (c) be unreadable
 * at the 32–44px this renders at in a dense list. Initials are legible at 28px,
 * unique per vendor, derived from data we already hold, and read as a business
 * mark rather than a picture of a mountain.
 *
 * No emoji, no external request, CSP-safe, no text inside an SVG.
 */

const SKIP_WORDS = new Set([
  "and", "the", "of", "for", "co", "ltd", "limited", "plc", "inc",
]);

/** "Kilimanjaro Hardware" → "KH", "Jua Kali Mabati Works" → "JK" */
export function vendorInitials(name: string, max = 2): string {
  const words = name
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !SKIP_WORDS.has(w.toLowerCase()));

  if (words.length === 0) return "FS";
  if (words.length === 1) return words[0].slice(0, max).toUpperCase();
  return words.slice(0, max).map((w) => w[0]).join("").toUpperCase();
}

interface VendorMarkProps {
  /** Business name — initials are derived from it. */
  name?: string;
  /** Override the derived initials (e.g. "CEO" for a role plate). */
  initials?: string;
  /** Square edge in px. Readable from 28 up. */
  size?: number;
  /** `plate` = neutral steel plate. `accent` = accent-tinted, for the active identity. */
  tone?: "plate" | "accent";
  /**
   * Pass a label ONLY when the mark stands alone and carries meaning.
   * When the business name is already rendered beside it, leave this out and
   * the mark is hidden from assistive tech as decoration.
   */
  label?: string;
}

export default function VendorMark({
  name = "",
  initials,
  size = 44,
  tone = "plate",
  label,
}: VendorMarkProps) {
  const text = (initials ?? vendorInitials(name)).slice(0, 3);
  const accentTone = tone === "accent";

  return (
    <div
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: `${Math.max(6, Math.round(size * 0.18))}px`,
        border: `1px solid ${accentTone ? "rgba(255,187,28,0.25)" : "#2A2A2A"}`,
        background: accentTone ? "rgba(255,187,28,0.10)" : "#1E1E1E",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      {/* Accent edge — the only accent stroke on the mark */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: "#FFBB1C",
          opacity: accentTone ? 0.9 : 0.7,
        }}
      />
      <span
        style={{
          fontSize: `${Math.round(size * (text.length > 2 ? 0.27 : 0.34))}px`,
          fontWeight: 900,
          letterSpacing: text.length > 2 ? "0.01em" : "0.02em",
          lineHeight: 1,
          color: "#FFBB1C",
          paddingLeft: "3px",
        }}
      >
        {text}
      </span>
    </div>
  );
}
