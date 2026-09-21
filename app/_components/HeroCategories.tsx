"use client";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/mockData";

/**
 * The hero's category rail.
 *
 * Built on lib/mockData's CATEGORIES, which is the marketplace's real plan:
 * All and Building Materials are live, while Modern Furniture, Fashion &
 * Lifestyle and Essential Products carry comingSoon: true. Those three are
 * shown rather than hidden — a marketplace that says what is coming reads as
 * one with ambition, and hiding them would mean inventing categories to fill
 * the rail instead.
 *
 * A coming-soon category is not selectable. It is dimmed, marked, and
 * aria-disabled rather than removed, so the promise is visible but cannot lead
 * to an empty shelf.
 *
 * The indicator is a shared layoutId, so Framer Motion slides one pill between
 * tabs instead of cross-fading two. That single moving element is most of what
 * separates this from a row of buttons.
 */
export default function HeroCategories({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      className="hero-cats"
      role="tablist"
      aria-label="Product categories"
    >
      {CATEGORIES.map((c) => {
        const selected = c.id === value;
        const locked = c.comingSoon;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-disabled={locked || undefined}
            disabled={locked}
            onClick={() => !locked && onChange(c.id)}
            className={
              "hero-cat cursor-pointer" +
              (selected ? " is-active" : "") +
              (locked ? " is-locked" : "")
            }
          >
            {/* The moving indicator. One element, shared across tabs. */}
            {selected && (
              <motion.span
                layoutId="hero-cat-indicator"
                className="hero-cat-pill"
                aria-hidden="true"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="hero-cat-label">{c.label}</span>
            {locked && <span className="hero-cat-soon">Soon</span>}
          </button>
        );
      })}
    </div>
  );
}
