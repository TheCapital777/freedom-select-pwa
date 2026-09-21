"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getProductIcon } from "@/lib/productIcon";
import { ICON_STROKE } from "@/app/_components/icons/ProductIcons";
import { getVendorById } from "@/lib/mockData";
import { formatTZS } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * The floating product stage.
 *
 * ── On imagery, which matters more than anything else here ──────────────────
 * This marketplace has no product photographs. Not missing ones — none: the
 * catalogue has always drawn products as SVG line icons over a per-product
 * gradient (gradientFrom / gradientTo on every Product), which is why the
 * tiles read as diagrams rather than goods. So this stage composes what
 * actually exists — icon, gradient, depth, light — instead of pretending to a
 * photograph. It is built so that dropping real photography in later means
 * rendering an <img> where the icon sits, and nothing around it changes.
 *
 * ── Composition ─────────────────────────────────────────────────────────────
 * One large centre plate with two smaller satellites behind it, offset, tilted
 * and dimmed. Depth comes from scale, rotation, blur and shadow rather than
 * from borders. The satellites are the neighbouring products in the list, so
 * the composition is also a preview of what swiping gets you.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 * The centre transitions on scale and opacity; satellites drift a few pixels
 * on a long loop so the group feels suspended rather than parked. Auto-advance
 * is 7s and stops permanently the moment the user touches anything — an
 * auto-rotating hero that keeps moving under your finger is the failure mode
 * this is written to avoid. useReducedMotion drops the drift, the auto-advance
 * and the transitions, leaving a static composition that still reads.
 */

const AUTO_MS = 7000;

export default function HeroStage({ products }: { products: Product[] }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [dir, setDir] = useState(1);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const count = products.length;

  /* Clamp when the collection changes under us — a category switch can shorten
     the list while a later index is selected. */
  useEffect(() => {
    setIndex((i) => (count === 0 ? 0 : Math.min(i, count - 1)));
  }, [count]);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setDir(delta);
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  /* Auto-advance. Stops for good once engaged, and never starts under reduced
     motion or with a single product. */
  useEffect(() => {
    if (reduced || engaged || count < 2) return;
    let t: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (t === null) t = setInterval(() => { setDir(1); setIndex((i) => (i + 1) % count); }, AUTO_MS);
    };
    const stop = () => {
      if (t !== null) { clearInterval(t); t = null; }
    };
    // Don't advance in a hidden tab: nobody is watching, and a returning user
    // would find the hero on a product they never chose.
    const onVis = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [reduced, engaged, count]);

  function engage() {
    setEngaged(true);
  }

  if (count === 0) {
    return (
      <div className="hero-stage hero-stage-empty">
        <p>No products in this category yet.</p>
      </div>
    );
  }

  const product = products[index];
  const prev = products[(index - 1 + count) % count];
  const next = products[(index + 1) % count];
  const vendor = getVendorById(product.vendor_id);
  const Icon = getProductIcon(product);
  const PrevIcon = getProductIcon(prev);
  const NextIcon = getProductIcon(next);

  const drift = (range: number, secs: number) =>
    reduced ? {} : { y: [0, -range, 0], transition: { duration: secs, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div className="hero-stage">
      {/* Ambient light behind the plate, tinted by the product's own gradient so
          the glow belongs to the thing it lights rather than being generic. */}
      <div
        className="hero-stage-glow"
        aria-hidden="true"
        style={{ background: `radial-gradient(closest-side, ${product.gradientFrom}, transparent 72%)` }}
      />

      <div className="hero-plates">
        {/* Satellites. aria-hidden: they are a preview of the neighbours, and
            the swipe and the counter already expose that relationship. */}
        <motion.div className="hero-plate hero-plate-side hero-plate-left" aria-hidden="true" animate={drift(7, 6.5)}>
          <div
            className="hero-plate-face"
            style={{ background: `linear-gradient(155deg, ${prev.gradientFrom}, ${prev.gradientTo})` }}
          >
            <PrevIcon size="54%" strokeWidth={ICON_STROKE.lg} />
          </div>
        </motion.div>

        <motion.div className="hero-plate hero-plate-side hero-plate-right" aria-hidden="true" animate={drift(10, 8)}>
          <div
            className="hero-plate-face"
            style={{ background: `linear-gradient(155deg, ${next.gradientFrom}, ${next.gradientTo})` }}
          >
            <NextIcon size="54%" strokeWidth={ICON_STROKE.lg} />
          </div>
        </motion.div>

        {/* The centre. Draggable on x; the threshold is deliberately generous
            so a vertical page scroll that wanders sideways does not count. */}
        <motion.div
          className="hero-plate hero-plate-main"
          drag={count > 1 && !reduced ? "x" : false}
          dragSnapToOrigin
          dragElastic={0.14}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={engage}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.button
              key={product.id}
              type="button"
              custom={dir}
              onClick={() => router.push(`/products/${product.id}`)}
              aria-label={`${product.name}, ${formatTZS(product.price)} per ${product.unit}. Open product`}
              className="hero-plate-face hero-plate-button cursor-pointer"
              style={{ background: `linear-gradient(155deg, ${product.gradientFrom}, ${product.gradientTo})` }}
              initial={reduced ? false : { opacity: 0, scale: 0.9, x: dir * 34 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.94, x: dir * -26 }}
              transition={{ duration: 0.42, ease: [0, 0, 0.2, 1] }}
            >
              <Icon size="56%" strokeWidth={ICON_STROKE.lg} />
              {product.featured && (
                <span className="hero-plate-flag">
                  <i className="dot" aria-hidden="true" />
                  Featured
                </span>
              )}
            </motion.button>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Metadata. Minimal by design — name, price, vendor. Everything else
          lives on the product page. */}
      <div className="hero-meta">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={product.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          >
            <p className="hero-meta-name">{product.name}</p>
            <p className="hero-meta-price">
              {formatTZS(product.price)}
              <span> / {product.unit}</span>
            </p>
            {vendor && <p className="hero-meta-vendor">{vendor.name}</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination. The counter is the live region — one short announcement per
          change rather than a screen reader re-reading the whole stage. */}
      {count > 1 && (
        <div className="hero-pager">
          <button
            type="button"
            className={"hero-pager-btn cursor-pointer"}
            onClick={() => { engage(); go(-1); }}
            aria-label="Previous product"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 5 8 12 15 19" /></svg>
          </button>

          <p className="hero-pager-count" ref={liveRef} aria-live={engaged ? "polite" : "off"}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <span> / {String(count).padStart(2, "0")}</span>
          </p>

          <button
            type="button"
            className={"hero-pager-btn cursor-pointer"}
            onClick={() => { engage(); go(1); }}
            aria-label="Next product"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
