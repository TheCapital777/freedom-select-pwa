/**
 * productIcon — resolves a product to a product icon.
 *
 * Deliberately does NOT look at `product.emoji`. That field is the mechanism of the
 * problem MASTER.md describes: it maps Simba Cement to a lion and BRC mesh to a
 * spider web, so any resolver keyed on it inherits the same wrong answers. Matching
 * is by product id first (exact, cheap, stable for the fifteen seeded products) and
 * then by name pattern, so a product added later — or a cart line that only carries
 * `product_id` and `name` — still resolves without a data migration.
 *
 * Unmatched products get MaterialIcon, a neutral crate. Never an emoji, and never a
 * guessed material.
 */

import type { ComponentType } from "react";
import {
  BallastIcon,
  BrickIcon,
  CementBagIcon,
  IronSheetIcon,
  MaterialIcon,
  PaintTinIcon,
  PipeIcon,
  SandIcon,
  SteelRodIcon,
  TileIcon,
  WireMeshIcon,
  type ProductIconProps,
} from "@/app/_components/icons/ProductIcons";

/** The ten product types, plus the fallback. */
export const PRODUCT_ICONS = {
  "cement-bag": CementBagIcon,
  "steel-rod": SteelRodIcon,
  "iron-sheet": IronSheetIcon,
  brick: BrickIcon,
  sand: SandIcon,
  ballast: BallastIcon,
  "paint-tin": PaintTinIcon,
  pipe: PipeIcon,
  tile: TileIcon,
  "wire-mesh": WireMeshIcon,
  material: MaterialIcon,
} satisfies Record<string, ComponentType<ProductIconProps>>;

export type ProductIconName = keyof typeof PRODUCT_ICONS;

/** Used when an icon stands alone. Describes the icon, never the product name. */
export const PRODUCT_ICON_LABELS: Record<ProductIconName, string> = {
  "cement-bag": "Cement bag",
  "steel-rod": "Reinforcement steel rod",
  "iron-sheet": "Corrugated iron sheet",
  brick: "Brickwork",
  sand: "Heap of sand",
  ballast: "Crushed ballast",
  "paint-tin": "Tin of paint",
  pipe: "Length of pipe",
  tile: "Tile",
  "wire-mesh": "Welded wire mesh",
  material: "Building material",
};

export const FALLBACK_PRODUCT_ICON: ProductIconName = "material";

/** Exact ids for the seeded catalogue (lib/mockData.ts). */
const BY_ID: Record<string, ProductIconName> = {
  p1: "cement-bag", // Dangote Cement 50kg
  p2: "cement-bag", // Simba Cement 50kg
  p3: "steel-rod", // Reinforcement Steel Rod 12mm
  p4: "steel-rod", // Reinforcement Steel Rod 16mm
  p5: "iron-sheet", // Mabati Iron Sheet 26G (8ft)
  p6: "iron-sheet", // Mabati Iron Sheet 28G (10ft)
  p7: "brick", // Clay Bricks (per 1,000)
  p8: "sand", // Washed River Sand (1 tonne)
  p9: "ballast", // Crushed Ballast (1 tonne)
  p10: "paint-tin", // Crown Paints Silk White 20L
  p11: "pipe", // PVC Water Pipe 4" (6m)
  p12: "pipe", // PVC Drainage Pipe 6" (3m)
  p13: "tile", // Floor Tiles 60x60cm
  p14: "tile", // Wall Tiles 30x60cm
  p15: "wire-mesh", // BRC Wire Mesh A142
};

/**
 * Name patterns, in priority order. First match wins, so the more specific
 * material sits above anything that could also match it.
 */
const BY_NAME: ReadonlyArray<readonly [RegExp, ProductIconName]> = [
  [/\bcement\b|\bportland\b/, "cement-bag"],
  [/\bmabati\b|iron sheet|roof(ing)? sheet|corrugat/, "iron-sheet"],
  [/\brebar\b|reinforcement|steel (rod|bar)|\bdeformed bar\b/, "steel-rod"],
  [/wire mesh|\bbrc\b|\bmesh\b/, "wire-mesh"],
  [/\bbrick/, "brick"],
  [/\bsand\b/, "sand"],
  [/ballast|aggregate|\bgravel\b|\bkokoto\b/, "ballast"],
  [/\bpaint|\bprimer\b|\bundercoat\b|\bemulsion\b/, "paint-tin"],
  [/\bpipe\b|\bconduit\b|\bgutter\b/, "pipe"],
  [/\btile/, "tile"],
];

/** Anything carrying enough to identify a product: a catalogue item or a cart line. */
export interface ProductIconSubject {
  id?: string | null;
  /** Cart and order lines key the product this way. */
  product_id?: string | null;
  name?: string | null;
  product_name?: string | null;
}

export function getProductIconName(subject: ProductIconSubject | null | undefined): ProductIconName {
  if (!subject) return FALLBACK_PRODUCT_ICON;

  const id = subject.id ?? subject.product_id;
  if (id && BY_ID[id]) return BY_ID[id];

  const name = (subject.name ?? subject.product_name ?? "").toLowerCase();
  if (name) {
    for (const [pattern, icon] of BY_NAME) {
      if (pattern.test(name)) return icon;
    }
  }

  return FALLBACK_PRODUCT_ICON;
}

/** The component to render for this product. */
export function getProductIcon(
  subject: ProductIconSubject | null | undefined,
): ComponentType<ProductIconProps> {
  return PRODUCT_ICONS[getProductIconName(subject)];
}

/** aria-label for a standalone instance. Describes the icon, not the product. */
export function getProductIconLabel(subject: ProductIconSubject | null | undefined): string {
  return PRODUCT_ICON_LABELS[getProductIconName(subject)];
}

export type { ProductIconProps };
