# Freedom Select — Design System (Master)

Source of truth for the premium pass, 19 September 2026.
Page-specific deviations go in `design-system/pages/<page>.md` and override this file.

---

## What is being changed, and what is not

The design system in `app/globals.css` is **good and stays**. Industrial Black +
Safety Yellow, caution-tape stripes, concrete noise via SVG turbulence, bolt
corners, steel-bar rules, the golden sweep, `prefers-reduced-motion` honoured,
safe-area insets. That is considered work and it matches a construction-materials
yard better than anything generic would.

**One layer is being replaced: the imagery.** Every product "photograph" is
currently an emoji PNG hotlinked from `cdn.jsdelivr.net/gh/microsoft/fluentui-emoji`.
Fifteen of them, on one page.

### Why this is not a taste argument

Only **1 of 15** icons depicts the product it sells:

| Product | Current icon | Reads as |
|---|---|---|
| Dangote Cement 50kg | Building Construction | vague |
| Simba Cement 50kg | **Lion** | a pun on the brand, not the goods |
| Steel Rod 12mm | Gear | wrong object |
| Steel Rod 16mm | Nut and Bolt | wrong object |
| Mabati 26G | House | the outcome, not the material |
| Mabati 28G | **Derelict House** | a ruin, selling new roofing |
| Clay Bricks | Brick | correct — the only one |
| Washed River Sand | **Umbrella on Ground** | a beach |
| Crushed Ballast | Pick | the tool, not the aggregate |
| Crown Paint 20L | Artist Palette | fine art, not trade paint |
| PVC Water Pipe | Wrench | the tool again |
| PVC Drainage Pipe | Bucket | wrong object |
| Floor Tiles | Window | wrong object |
| Wall Tiles | **Card Index Dividers** | office stationery |
| BRC Wire Mesh | **Spider Web** | — |

A buyer pricing 30 sheets of mabati is shown a derelict house. That is the problem;
the emoji are the mechanism.

### Three further costs, beyond how it looks

1. **Fifteen requests to a host nobody controls.** They break if that GitHub
   repository moves or jsDelivr rate-limits.
2. **Incompatible with a strict image policy.** Under a CSP of
   `img-src 'self' data: blob:` every one of them is blocked. Hardening this site
   later means whitelisting jsDelivr or redoing this work then.
3. **No alt text that means anything.** `alt={product.name}` over a picture of a
   lion is worse than no image for a screen reader user.

---

## Decisions

### Keep
- The full `globals.css` token set and utility classes. Do not introduce new colours.
- `--color-bg #0C0C0C`, `--color-accent #FFBB1C`, the concrete/caution utilities.
- framer-motion where it already is. Do not add animation libraries.
- Inter as the typeface.

### Replace
- `lib/fluentEmoji.ts` and every call site, with a **self-hosted inline SVG icon set**.
- Emoji used as status glyphs in copy (tick, lorry, clock, pin, cart, heart).
- Emoji used as vendor avatars in the dashboards.

### Explicitly declined
The `ui-ux-pro-max` tool recommended **Liquid Glass** on a light grey background
(`#F8FAFC`) with slate/orange, and Rubik/Nunito Sans. **Not doing that**, for three
reasons:

1. The tool's own output flags Liquid Glass as *Performance: Moderate-Poor* and
   *Accessibility: text contrast*. This is a PWA for mid-range Android phones on
   Tanzanian mobile data. Backdrop-filter stacks are the wrong trade here.
2. Its own `style-match` rule says match the style to the product. Industrial black
   and safety yellow **is** the match for a construction yard; slate-and-glass is a
   fintech dashboard.
3. Nothing about the current palette is what makes the UI feel unfinished. The
   imagery is. Swapping the palette would be motion without progress.

Taken from the tool instead: the `no-emoji-icons` rule, the pre-delivery checklist,
the marketplace IA pattern (search as the primary CTA, categories, featured,
trust), and the touch/contrast/motion guidance below.

---

## The icon set

One icon per **real product type**, not per emoji. Fifteen products collapse into
these:

| Icon | Products it serves |
|---|---|
| `cement-bag` | Dangote Cement, Simba Cement |
| `steel-rod` | Reinforcement Steel Rod 12mm, 16mm |
| `iron-sheet` | Mabati 26G, 28G |
| `brick` | Clay Bricks |
| `sand` | Washed River Sand |
| `ballast` | Crushed Ballast |
| `paint-tin` | Crown Paints Silk White |
| `pipe` | PVC Water Pipe, PVC Drainage Pipe |
| `tile` | Floor Tiles, Wall Tiles |
| `wire-mesh` | BRC Wire Mesh |

### Drawing rules
- **Inline SVG React components**, not files fetched at runtime. No network request,
  CSP-safe, and they inherit `currentColor`.
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
  `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
  Same geometry rules as Lucide so they sit together consistently.
- **Line work, not filled illustration.** The theme is drawn in thin light strokes
  on near-black; filled shapes will fight the concrete texture.
- Each icon must be **recognisable at 24px and at 96px**. The tile frame renders
  large; the cart row renders small.
- One accent stroke maximum per icon, in `--color-accent`, to mark the thing that
  identifies it — the seam on a mabati sheet, the ribbing on a steel rod. The rest
  in `--color-text-dim`.
- No text inside icons. No drop shadows.

### Accessibility
- Decorative instance (a tile that already has the product name beside it):
  `aria-hidden="true"` and no `alt`.
- Standalone instance carrying meaning: `role="img"` with `aria-label`.
- Never `alt={product.name}` on something that is not a picture of the product.

---

## Status glyphs

Replace emoji in status language with the existing `.badge-construction` plus a
24px SVG. Colour carries the same meaning as elsewhere in the app:

| State | Colour token | Glyph |
|---|---|---|
| Delivered | `--color-success` | check |
| On the way | `--color-accent` | truck |
| Confirmed | `--color-info` | clipboard-check |
| Pending | `--color-muted` | clock |
| Address | `--color-text-dim` | map-pin |

Colour must not be the only signal — the word stays next to the glyph in every case.

---

## Checklist every change is held to

From the tool's pre-delivery list, plus what this codebase needs:

- [ ] No emoji anywhere in rendered output
- [ ] Icons are inline SVG, self-hosted, no external host
- [ ] Touch targets ≥ 44×44px
- [ ] `cursor-pointer` on everything clickable
- [ ] Visible focus ring on every interactive element
- [ ] Text contrast ≥ 4.5:1 against `#0C0C0C`. `--color-muted #6B6B6B` is
      **3.5:1 and fails** — do not use it for body copy, only for large or
      decorative text
- [ ] Transitions 150–300ms for micro-interactions
- [ ] `prefers-reduced-motion` respected (already global; do not bypass it)
- [ ] No layout shift on hover — transform only, never width/height
- [ ] Renders at 375, 768, 1024 and 1440px with no horizontal scroll
- [ ] `npx next build` clean before handing back

## Out of scope for this pass
Not touching data, routing, state, or the fact that roles are a `localStorage`
string. That last one is a real problem and a separate job.
