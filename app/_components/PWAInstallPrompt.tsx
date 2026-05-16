"use client";
import { useEffect, useState } from "react";

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
      className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 flex items-center gap-3 border shadow-2xl"
      style={{ background: "#161616", borderColor: "rgba(255,187,28,0.3)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
        style={{ background: "#FFBB1C", color: "#0A0A0A" }}
      >
        F
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">Install Freedom Select</p>
        <p className="text-xs" style={{ color: "#A3A3A3" }}>Add to Home Screen for fast access</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ color: "#555" }}
        >
          Later
        </button>
        <button
          onClick={install}
          className="text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: "#FFBB1C", color: "#0A0A0A" }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
