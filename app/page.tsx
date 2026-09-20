"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRoleStore } from "@/lib/roleStore";
import { useDirectoryStore } from "@/lib/directoryStore";
import PWAInstallPrompt from "./_components/PWAInstallPrompt";

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

/**
 * The hero.
 *
 * It was a 480px column centred in whatever space the screen had, which on a
 * laptop left a thousand pixels of black either side and still managed to feel
 * cramped — "FREEDOM" at its 88px ceiling is about 480px wide, so the wordmark
 * filled the column edge to edge with nothing around it.
 *
 * Worse, the install banner is position:fixed at the bottom, and the hero is
 * vertically centred, so on a desktop viewport the banner sat directly on top
 * of Shop Now and Login. The primary action of the entire site was covered.
 * The section now reserves space for it (.hero-section padding-bottom) and the
 * banner docks bottom-right on a wide screen instead of across the middle.
 *
 * Layout and rhythm live in globals.css under "Hero" so the breakpoints can be
 * real media queries rather than clamps standing in for them.
 */
export default function HomePage() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  /* Live counts, not decoration. These come from the same store the admin
     directory writes to, so adding a vendor changes the number on the front
     door. A hard-coded "500+ products" would be the other kind of hero stat. */
  const products = useDirectoryStore((s) => s.products);
  const vendors = useDirectoryStore((s) => s.vendors);
  const transporters = useDirectoryStore((s) => s.transporters);

  function shopNow() {
    setRole("customer");
    router.push("/products");
  }

  const STATS: { value: string; label: string }[] = [
    { value: String(products.filter((p) => p.in_stock).length), label: "In stock" },
    { value: String(vendors.filter((v) => v.status === "active").length), label: "Vendors" },
    { value: String(transporters.filter((t) => t.status === "active").length), label: "Transporters" },
  ];

  return (
    <div className="hero-root">
      <section className="hero-section">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className="hero-eyebrow"
        >
          Arusha · Tanzania
        </motion.p>

        {/* Logo mark — cropped from logo.png, sits just above the headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="hero-mark"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Freedom Select" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
          className="hero-title"
        >
          FREEDOM<br />
          <span>SELECT</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
          className="hero-tagline"
        >
          Build · Source · Deliver
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42, ease: EASE }}
          className="hero-cta-row"
        >
          <button onClick={shopNow} className="hero-cta-primary cursor-pointer">
            Shop Now
          </button>
          <Link href="/login" className="hero-cta-ghost cursor-pointer">
            Login
          </Link>
        </motion.div>

        {/* Stat strip — the reference's tracked-label-over-value pattern, which
            is also what the install panel uses, so the two read as one family. */}
        <motion.dl
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.54, ease: EASE }}
          className="hero-stats"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </section>

      <PWAInstallPrompt />
    </div>
  );
}
