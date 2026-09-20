/**
 * ProductIcons — the product imagery layer.
 *
 * Replaces the fifteen hotlinked fluentui-emoji PNGs (see design-system/MASTER.md,
 * "Why this is not a taste argument"). Ten icons, one per real product type, drawn
 * to the MASTER.md rules:
 *
 *  - Inline SVG React components. No network request, CSP-safe under
 *    `img-src 'self' data: blob:`, inherit currentColor.
 *  - viewBox="0 0 24 24", fill="none", stroke="currentColor", round caps and joins.
 *    Same geometry rules as Lucide, so these sit beside StatusIcons consistently.
 *  - Line work only. No fills, no text inside the icon, no drop shadows.
 *  - Exactly one accent stroke per icon (`--color-accent`) marking the feature that
 *    identifies the material — the printed band on a cement bag, the ribbing on a
 *    rebar, the corrugation profile on a mabati sheet. Everything else is
 *    `--color-text-dim`, applied as `color` so `currentColor` resolves to it.
 *
 * Optical sizing: `strokeWidth` defaults to 1.5, which is correct at a 24px render.
 * A 24-unit stroke scales with the box, so 1.5 becomes a 6px slab at 96px and a 14px
 * slab at 220px — the opposite of MASTER.md's "thin light strokes". Large renders
 * therefore pass ICON_STROKE.lg / ICON_STROKE.xl, which hold the *rendered* stroke at
 * roughly 3.5–5px. Same geometry, same intent, corrected for optical size.
 *
 * Accessibility: decorative by default (`aria-hidden`), because every call site so far
 * has the product name rendered beside it. Pass `label` where the icon stands alone —
 * that switches it to role="img" + aria-label. The label describes the *icon*, never
 * the product: this is a pictogram for a material type, not a photograph of the goods,
 * so `alt={product.name}` would be a lie to a screen reader.
 */

import type { CSSProperties, SVGProps } from "react";

/** Resolved from globals.css `@theme`; literal fallback so the icons never render invisible. */
export const PRODUCT_ICON_DIM = "var(--color-text-dim, #B0B0B0)";
export const PRODUCT_ICON_ACCENT = "var(--color-accent, #FFBB1C)";

/**
 * Stroke widths by render size. Pick by how large the icon actually draws,
 * not by which icon it is.
 *   base — 20–32px  (cart rows, list rows, chips)
 *   md   — 40–64px  (avatars, wide list thumbnails)
 *   lg   — 80–140px (the product tile frame)
 *   xl   — 180px+   (the product detail hero)
 */
export const ICON_STROKE = {
  base: 1.5,
  md: 1.2,
  lg: 1,
  xl: 0.65,
} as const;

export interface ProductIconProps {
  /** Rendered square. Number = px; a string is passed through, so "58%" or clamp() work. */
  size?: number | string;
  /** Set ONLY when the icon stands alone. Describes the icon, not the product. */
  label?: string;
  className?: string;
  style?: CSSProperties;
  /** Default 1.5 (MASTER.md). Use ICON_STROKE.lg / .xl for large renders. */
  strokeWidth?: number;
}

function frame({
  size = 24,
  label,
  className,
  style,
  strokeWidth = ICON_STROKE.base,
}: ProductIconProps): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style: {
      width: size,
      height: size,
      display: "block",
      color: PRODUCT_ICON_DIM,
      ...style,
    },
    ...(label
      ? { role: "img", "aria-label": label }
      : { "aria-hidden": true, focusable: false }),
  };
}

/* ─── 1. cement-bag ───────────────────────────────────────────────────────
   A gathered sack. Accent: the printed band across the face.               */
export const CementBagIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M9.6 6.8 10.4 4.2h3.2l.8 2.6" />
    <path d="M7.9 6.8h8.2l1.35 3.4.35 8.2a1.8 1.8 0 0 1-1.8 1.9H8a1.8 1.8 0 0 1-1.8-1.9l.35-8.2z" />
    <path d="M6.45 13.2h11.2" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 2. steel-rod ────────────────────────────────────────────────────────
   A bar seen side-on. Accent: the deformation ribbing that makes it rebar. */
export const SteelRodIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M4.5 9.25h15a2.75 2.75 0 0 1 0 5.5h-15a2.75 2.75 0 0 1 0-5.5Z" />
    <path d="M7.5 10 6.3 14M12 10 10.8 14M16.5 10 15.3 14" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 3. iron-sheet ───────────────────────────────────────────────────────
   Mabati, read off its corrugation rather than the house it ends up on.
   Accent: the corrugation profile.                                          */
export const IronSheetIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M2.6 15.4q2.35-3.4 4.7 0q2.35-3.4 4.7 0q2.35-3.4 4.7 0q2.35-3.4 4.7 0" />
    <path d="M2.6 9.4v6M21.4 9.4v6" />
    <path
      d="M2.6 9.4q2.35-3.4 4.7 0q2.35-3.4 4.7 0q2.35-3.4 4.7 0q2.35-3.4 4.7 0"
      stroke={PRODUCT_ICON_ACCENT}
    />
  </svg>
);

/* ─── 4. brick ────────────────────────────────────────────────────────────
   Running bond, so it reads as masonry and not as a window.
   Accent: the course line.                                                 */
export const BrickIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <rect x="3.5" y="6.5" width="17" height="11" rx="1.5" />
    <path d="M9 6.5v5.5M15 6.5v5.5M6.25 12v5.5M12 12v5.5M17.75 12v5.5" />
    <path d="M3.5 12h17" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 5. sand ─────────────────────────────────────────────────────────────
   A smooth heap — deliberately smooth, to read against ballast's angles.
   Accent: the grain.                                                       */
export const SandIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M2.5 19.5h19" />
    <path d="M4 19.5c.9-4.9 3.9-8.4 8-8.4s7.1 3.5 8 8.4" />
    <path d="M9.7 16.4h.01M12 14.2h.01M14.3 16.4h.01" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 6. ballast ──────────────────────────────────────────────────────────
   Crushed aggregate: angular, not the pick that made it.
   Accent: the top stone.                                                   */
export const BallastIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M2.5 19.5h19" />
    <path d="M3.2 19.5l1-4.1 4.2-1.4 2.6 2.6-.6 2.9z" />
    <path d="M13 19.5l-.4-3.6 3.6-2.1 4 2.6-1 3.1z" />
    <path d="M8.2 14l.6-3.7 4-1.5 3 2.6-1.4 3z" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 7. paint-tin ────────────────────────────────────────────────────────
   A trade tin, not an artist's palette. Accent: the bail handle.           */
export const PaintTinIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M5 8.6a7 1.9 0 1 0 14 0a7 1.9 0 1 0-14 0" />
    <path d="M5 8.6v9.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.6" />
    <path d="M8.6 7.3a3.4 2.6 0 0 1 6.8 0" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 8. pipe ─────────────────────────────────────────────────────────────
   A length of tube with an open end. Accent: the bore.                     */
export const PipeIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M6 8.5h12M6 15.5h12" />
    <path d="M6 8.5a1.7 3.5 0 0 0 0 7" />
    <path d="M16.3 12a1.7 3.5 0 1 0 3.4 0a1.7 3.5 0 1 0-3.4 0" />
    <path d="M17.1 12a.9 1.9 0 1 0 1.8 0a.9 1.9 0 1 0-1.8 0" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 9. tile ─────────────────────────────────────────────────────────────
   A single square tile with an inlay, so it does not collide with brick.
   Accent: the inlay.                                                       */
export const TileIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M6.6 6.6 9.3 9.3M17.4 6.6 14.7 9.3M17.4 17.4 14.7 14.7M6.6 17.4 9.3 14.7" />
    <path d="M12 7.2 16.8 12 12 16.8 7.2 12Z" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── 10. wire-mesh ───────────────────────────────────────────────────────
   BRC mesh: square grid with wires running past the last intersection.
   Accent: a weld node.                                                     */
export const WireMeshIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M8 3.5v17M12 3.5v17M16 3.5v17" />
    <path d="M3.5 8h17M3.5 12h17M3.5 16h17" />
    <path d="M9.9 12a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0-4.2 0" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);

/* ─── Fallback ────────────────────────────────────────────────────────────
   For a product no rule matches — a new category, or data we have not seen.
   A neutral crate. Never an emoji, and never a guessed material: showing a
   cement bag for an unknown line item is the exact failure MASTER.md is about.
   Accent: the front edge.                                                  */
export const MaterialIcon = (p: ProductIconProps) => (
  <svg {...frame(p)}>
    <path d="M12 3.5 20.5 8v8.5L12 20.5 3.5 16.5V8z" />
    <path d="M3.5 8 12 12.5 20.5 8" />
    <path d="M12 12.5v8" stroke={PRODUCT_ICON_ACCENT} />
  </svg>
);
