"use client";
import { useEffect, useState } from "react";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt || dismissed) return null;

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setPrompt(null);
    else setDismissed(true);
  }

  return (
    <div
      role="region"
      aria-label="Install Freedom Select"
      className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 flex items-center gap-3 border shadow-2xl"
      style={{ background: "#161616", borderColor: "rgba(255,187,28,0.3)" }}
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
        style={{ background: "#FFBB1C", color: "#0A0A0A" }}
      >
        F
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">Install Freedom Select</p>
        <p className="text-xs" style={{ color: "#B0B0B0" }}>Add to Home Screen for fast access</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          /* Was px-3 py-1.5 — a 30px tall target, and #555 text at 2.6:1. */
          className={"text-xs px-3 min-h-11 min-w-11 rounded-lg cursor-pointer " + FOCUS_RING}
          style={{ color: "#B0B0B0", transition: "color 200ms cubic-bezier(0.4,0,0.2,1)" }}
        >
          Later
        </button>
        <button
          type="button"
          onClick={install}
          className={"text-xs font-bold px-4 min-h-11 min-w-11 rounded-lg cursor-pointer " + FOCUS_RING}
          style={{ background: "#FFBB1C", color: "#0A0A0A", transition: "background 200ms cubic-bezier(0.4,0,0.2,1)" }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
