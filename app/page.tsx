"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRoleStore } from "@/lib/roleStore";
import PWAInstallPrompt from "./_components/PWAInstallPrompt";

const EASE: [number, number, number, number] = [0, 0, 0.2, 1];

export default function HomePage() {
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  function shopNow() {
    setRole("customer");
    router.push("/products");
  }

  return (
    <div style={{
      background: "#0C0C0C", color: "#F0F0F0",
      minHeight: "100svh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <section style={{
        width: "100%",
        maxWidth: "480px",
        padding: "4rem 2rem 3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: "#3A3A3A", marginBottom: "2rem" }}
        >
          Arusha · Tanzania
        </motion.p>

        {/* Logo mark — cropped from logo.png, sits just above the headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          style={{ overflow: "hidden", height: "72px", marginBottom: "1.2rem" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Freedom Select"
            style={{
              height: "228px",
              width: "auto",
              marginTop: "-74px",
              display: "block",
              filter: "drop-shadow(0 4px 20px rgba(255,187,28,0.18))",
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
          style={{
            fontWeight: 900, lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontSize: "clamp(3.2rem, 18vw, 5.5rem)",
            marginBottom: "1.4rem",
          }}
        >
          FREEDOM<br />
          <span style={{ color: "#FFBB1C" }}>SELECT</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32, ease: EASE }}
          style={{ fontSize: "11px", color: "#3A3A3A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2.8rem" }}
        >
          Build · Source · Deliver
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42, ease: EASE }}
          style={{ display: "flex", gap: "12px", width: "100%" }}
        >
          <button onClick={shopNow} style={{
            flex: 1, padding: "18px 0",
            background: "#FFBB1C", color: "#0C0C0C",
            fontWeight: 800, fontSize: "11px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            border: "none", borderRadius: "6px", cursor: "pointer",
          }}>
            Shop Now
          </button>
          <Link href="/login" style={{
            padding: "18px 28px",
            border: "1px solid rgba(255,255,255,0.1)", color: "#555",
            fontWeight: 600, fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "6px",
            display: "flex", alignItems: "center", whiteSpace: "nowrap",
          }}>
            Login
          </Link>
        </motion.div>
      </section>

      <PWAInstallPrompt />
    </div>
  );
}
