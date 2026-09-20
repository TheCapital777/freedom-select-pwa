/**
 * StatusIcons — buyer-facing status, action and navigation glyphs.
 *
 * Per design-system/MASTER.md:
 *  - Inline SVG React components. No network request, CSP-safe, inherit currentColor.
 *  - viewBox="0 0 24 24", fill="none", stroke="currentColor", strokeWidth 1.5,
 *    round caps and joins. Same geometry rules as Lucide.
 *  - Line work only. No text inside icons. No drop shadows.
 *
 * These are STATUS / ACTION / NAV glyphs, not product imagery. They deliberately
 * carry no accent stroke: the surrounding pill or control owns the colour, so the
 * glyph inherits it via currentColor and the Delivered / On the way / Confirmed /
 * Pending colour mapping stays in one place (STATUS_CONFIG in app/orders/page.tsx).
 *
 * Accessibility: every icon defaults to aria-hidden="true" and is decorative —
 * the word always sits next to the glyph. Pass a `label` to make an instance
 * carry meaning on its own (role="img" + aria-label).
 */

export interface IconProps {
  /** Rendered box, px. Default 24 per MASTER.md. */
  size?: number;
  /** Set only when the icon carries meaning with no adjacent word. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
}

function iconAttrs({ size = 24, label, className, style, strokeWidth = 1.5 }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    style,
    ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false }),
  };
}

/* ─── Status glyphs (MASTER.md status table) ──────────────────────────── */

/** Delivered — --color-success */
export const CheckIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <polyline points="4 12.5 9.5 18 20 6.5" />
  </svg>
);

/** On the way — --color-accent */
export const TruckIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M1.5 6.5h12v10H1.5z" />
    <path d="M13.5 10h4l3 3.2v3.3h-7z" />
    <circle cx="6" cy="18.5" r="2" />
    <circle cx="17" cy="18.5" r="2" />
    <line x1="8" y1="18.5" x2="15" y2="18.5" />
  </svg>
);

/** Confirmed — --color-info */
export const ClipboardCheckIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M9 3.5h6v3H9z" />
    <path d="M15 5h2.5a1.5 1.5 0 011.5 1.5v13A1.5 1.5 0 0117.5 21h-11A1.5 1.5 0 015 19.5v-13A1.5 1.5 0 016.5 5H9" />
    <polyline points="8.75 13 11 15.25 15.25 11" />
  </svg>
);

/** Pending — small text, so use --color-text-dim not --color-muted */
export const ClockIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <polyline points="12 7.5 12 12 15.5 14" />
  </svg>
);

/** Address — --color-text-dim */
export const MapPinIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M19 10.2c0 5.1-7 11.3-7 11.3s-7-6.2-7-11.3a7 7 0 1114 0z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

/* ─── Basket / saved-items glyphs ─────────────────────────────────────── */

export const CartIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M2.5 3.5h2.2l2.6 10.4h10.3" />
    <path d="M6.4 6.6h15L19 12.6H7.9" />
    <circle cx="9.5" cy="19" r="1.6" />
    <circle cx="17.5" cy="19" r="1.6" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M12 20.3l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z" />
  </svg>
);

/**
 * Neutral stand-in for a product thumbnail in list rows.
 * TODO(handoff): swap for the real product icon set once lib/productIcon.ts lands.
 */
export const PackageIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M20.5 7.8v8.4L12 21l-8.5-4.8V7.8L12 3z" />
    <polyline points="3.5 7.8 12 12.6 20.5 7.8" />
    <line x1="12" y1="12.6" x2="12" y2="21" />
  </svg>
);

/* ─── Checkout section glyphs ─────────────────────────────────────────── */

export const CreditCardIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <line x1="2.5" y1="9.8" x2="21.5" y2="9.8" />
    <line x1="6.5" y1="14.5" x2="10" y2="14.5" />
  </svg>
);

export const ReceiptIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M5.5 2.5h13v19l-3.25-2-3.25 2-3.25-2-3.25 2z" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="9" y1="12.5" x2="15" y2="12.5" />
  </svg>
);

export const ChatIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M21 12a8.5 8.5 0 01-12.4 7.55L3.5 21l1.45-5.1A8.5 8.5 0 1121 12z" />
  </svg>
);

/* ─── Control glyphs ──────────────────────────────────────────────────── */

export const XIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <polyline points="6 9.5 12 15.5 18 9.5" />
  </svg>
);

/* ─── Role glyphs (RoleSwitcher) ──────────────────────────────────────── */

export const UserIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20.5a7.5 7.5 0 0115 0" />
  </svg>
);

export const StoreIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M3.5 9.5h17v11h-17z" />
    <path d="M2.5 9.5L5 3.5h14l2.5 6" />
    <path d="M9.5 20.5v-6h5v6" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M12 2.8l8 3v5.9c0 4.6-3.3 8.4-8 9.5-4.7-1.1-8-4.9-8-9.5V5.8z" />
    <polyline points="9 12 11.25 14.25 15.25 10.25" />
  </svg>
);

/* ─── Added while finishing the pass: ratings, search, empty states ───── */

/** Featured / rating. Filled deliberately — a hollow star reads as "not rated". */
export const StarIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)} fill="currentColor" stroke="none">
    <path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" />
  </svg>
);

/** Search. Also the right glyph for a no-results empty state. */
export const SearchIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
  </svg>
);

/** Nothing here yet — an open, empty crate rather than a sad face. */
export const EmptyCrateIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <path d="M3 8.5l3-4.5h12l3 4.5" />
    <path d="M3 8.5h18V20H3z" />
    <line x1="9" y1="12.5" x2="15" y2="12.5" />
  </svg>
);

/** WhatsApp. The one brand glyph here, so it is the real mark, not an approximation. */
export const WhatsAppIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)} fill="currentColor" stroke="none">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.24-3.5-.73-2.98-1.17-4.85-4.26-5-4.46-.14-.2-1.18-1.6-1.18-3.05 0-1.45.75-2.16 1.02-2.45.27-.29.58-.36.78-.36l.56.01c.18 0 .42-.07.65.5.24.58.8 1.98.87 2.12.07.15.12.32.02.51-.1.2-.15.32-.29.49l-.44.51c-.15.14-.3.3-.14.59.17.29.73 1.2 1.56 1.95 1.07.95 1.97 1.25 2.25 1.39.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.19-.29.39-.24.65-.14.27.09 1.66.78 1.95.93.29.14.48.22.55.34.07.13.07.74-.17 1.42z" />
  </svg>
);

/** Back. Mirrors ArrowRightIcon so the pair stay visually identical. */
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...iconAttrs(p)}>
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10 6 4 12 10 18" />
  </svg>
);
