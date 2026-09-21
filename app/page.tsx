"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRoleStore } from "@/lib/roleStore";
import { useDirectoryStore } from "@/lib/directoryStore";
import HeroCategories from "./_components/HeroCategories";
import HeroStage from "./_components/HeroStage";
import PWAInstallPrompt from "./_components/PWAInstallPrompt";

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

/**
 * The home screen.
 *
 * It used to be a brand poster: FREEDOM / SELECT at 112px, a tagline, two
 * buttons. Handsome, and it told you nothing — you could not tell from it that
 * anything was for sale. The wordmark is now a small lockup at the top and the
 * products carry the screen, which is the whole point of the change.
 *
 * Order, on a phone: identity, headline, one line of copy, category rail,
 * product stage, price, Shop Now, pager, trust strip. On a desktop the same
 * pieces split into an editorial two-column layout — copy left, stage right —
 * rather than the mobile column stretched wide. That split is in globals.css
 * under HERO, because it is a layout change at 1024px, not a scale.
 *
 * Products come from useDirectoryStore, the same store the admin directory
 * writes to. There is no second fetch path and no hero-specific product list:
 * something an admin adds appears here.
 */
export default function HomePage() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  const products = useDirectoryStore((s) => s.products);
  const vendors = useDirectoryStore((s) => s.vendors);
  const [category, setCategory] = useState("all");

  /* The stage shows what is actually buyable. Featured first — `featured` is a
     real field on five of the fifteen products, so "Featured" on the plate is
     reporting data rather than decorating. Out-of-stock lines are excluded:
     leading with something that cannot be bought is the one thing a hero
     carousel must not do. */
  const stageProducts = useMemo(() => {
    const live = products.filter((p) => p.in_stock);
    const inCat = category === "all" ? live : live.filter((p) => p.category === category);
    return [...inCat].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products, category]);

  function shopNow() {
    setRole("customer");
    router.push("/products");
  }

  const liveVendors = vendors.filter((v) => v.status === "active").length;
  const inStock = products.filter((p) => p.in_stock).length;

  return (
    <div className="hero-root">
      <section className="hero-section">

        {/* ── Identity. Small, and first — "ah, this is Freedom Select" — but
               no longer the thing that owns the screen. */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="hero-brand"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Freedom Select" />
          <span className="hero-brand-place">Arusha · Tanzania</span>
        </motion.div>

        <div className="hero-grid">
          {/* ── Column one: the pitch ── */}
          <div className="hero-copy">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
              className="hero-kicker"
            >
              <i className="dot" aria-hidden="true" />
              Featured now
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              className="hero-title"
            >
              Find your<br />
              <span>next.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
              className="hero-lede"
            >
              Building materials from trusted vendors, delivered across Arusha.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24, ease: EASE }}
            >
              <HeroCategories value={category} onChange={setCategory} />
            </motion.div>

            {/* On desktop the actions belong with the copy; on mobile they sit
                below the stage, which is why they are rendered twice and each
                copy is hidden at the other breakpoint. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
              className="hero-cta-row hero-cta-desktop"
            >
              <button onClick={shopNow} className="hero-cta-primary cursor-pointer">
                Shop now
              </button>
              <Link href="/login" className="hero-cta-ghost cursor-pointer">
                Login
              </Link>
            </motion.div>
          </div>

          {/* ── Column two: the goods ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
            className="hero-showcase"
          >
            <HeroStage products={stageProducts} />
          </motion.div>
        </div>

        <div className="hero-cta-row hero-cta-mobile">
          <button onClick={shopNow} className="hero-cta-primary cursor-pointer">
            Shop now
          </button>
          <Link href="/login" className="hero-cta-ghost cursor-pointer">
            Login
          </Link>
        </div>

        {/* ── Trust strip. Deliberately quiet now: it supports the marketplace
               story instead of competing with the products for the screen. */}
        <motion.dl
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.42, ease: EASE }}
          className="hero-trust"
        >
          <div><dt>{inStock}</dt><dd>Products</dd></div>
          <div><dt>{liveVendors}</dt><dd>Vendors</dd></div>
          <div><dt>Arusha</dt><dd>Delivery</dd></div>
        </motion.dl>
      </section>

      <PWAInstallPrompt />
    </div>
  );
}
