"use client";
import { useEffect, useState } from "react";
import { XIcon } from "@/app/_components/icons/StatusIcons";

/* Visible focus ring on every interactive element (MASTER.md checklist).
   #FFBB1C is the existing --color-accent — no new colours introduced. */
const FOCUS_RING = "focus-visible:[outline:2px_solid_#FFBB1C] focus-visible:[outline-offset:2px]";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * The install banner.
 *
 * The old one was a 14px line of text, a letter "F" in a square, and two
 * shrunken buttons — an alert bar, not an offer. This is rebuilt on the
 * structure the reference UI uses for its order summary: a glass panel, a
 * hairline rule, a three-column strip of tracked micro-labels over heavier
 * values, then one full-width primary action with the quiet decline beneath it
 * rather than beside it. Asking someone to install software is the single
 * biggest thing this app ever asks of them, so it gets the panel treatment the
 * reference reserves for its checkout.
 *
 * Type is taken straight off the reference's own ladder: 10px tracked labels,
 * 13px secondary copy, 15px values, 17px title, 15px on the button. Nothing
 * here is below 12px except the label strip, which is uppercase and tracked at
 * 0.12em — the one place a smaller size stays legible.
 *
 * The three facts in the strip are all verifiable rather than marketing:
 *   Offline     — sw.js precaches /, /products/, /cart/, /checkout/, /orders/
 *   Full screen — manifest.json sets display: standalone
 *   No store    — installing a PWA does not involve Play or the App Store
 *
 * iOS is handled separately because Safari never fires beforeinstallprompt.
 * Without the branch below this banner simply never appeared on an iPhone,
 * which is half the reason to have it at all; there we show the actual Share →
 * Add to Home Screen steps instead of a button that cannot work.
 */

type Mode = "prompt" | "ios" | null;

const DISMISS_KEY = "freedom-select-install-dismissed";

export default function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<Mode>(null);

  useEffect(() => {
    // Already installed and running standalone — never ask again.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // A dismissal should outlive the page. It was component state before, so
    // "Not now" lasted until the next navigation and then asked again.
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* private mode — fall through and just show it */
    }

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    if (isIOS) {
      setMode("ios");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setMode("prompt");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setMode(null);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* nothing to do — it just asks again next visit */
    }
  }

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setMode(null);
    else dismiss();
  }

  /* Tell the document a fixed overlay is present so layouts can reserve room
     for it. Cleaned up on dismiss and on unmount. */
  useEffect(() => {
    if (!mode) return;
    document.body.classList.add("has-install-panel");
    return () => document.body.classList.remove("has-install-panel");
  }, [mode]);

  if (!mode) return null;

  return (
    <div
      role="region"
      aria-label="Install Freedom Select"
      className="install-panel glass"
    >
      {/* Close, top-right. The reference keeps its decline quiet and out of the
          reading path rather than making it compete with the action. */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className={"install-close cursor-pointer " + FOCUS_RING}
      >
        <XIcon size={16} />
      </button>

      <div className="install-head">
        {/* The real mark, not a letter in a box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" aria-hidden="true" className="install-mark" />
        <div style={{ minWidth: 0 }}>
          <p className="install-title">Install Freedom Select</p>
          <p className="install-sub">
            {mode === "ios"
              ? "Two taps in Safari — no App Store."
              : "Add it to your home screen."}
          </p>
        </div>
      </div>

      <div className="install-rule" aria-hidden="true" />

      {mode === "prompt" ? (
        <>
          {/* Tracked micro-label over a heavier value — the reference's
              SECTION / ROW / SEATS strip, carrying facts instead of a pitch. */}
          <dl className="install-facts">
            <div>
              <dt>Works</dt>
              <dd>Offline</dd>
            </div>
            <div>
              <dt>Opens</dt>
              <dd>Full screen</dd>
            </div>
            <div>
              <dt>Needs</dt>
              <dd>No store</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={install}
            className={"install-cta cursor-pointer " + FOCUS_RING}
          >
            Install app
          </button>
        </>
      ) : (
        /* iOS: the steps, numbered, because there is no button we can offer. */
        <ol className="install-steps">
          <li>
            <span aria-hidden="true">1</span>
            Tap <strong>Share</strong> in the Safari toolbar
          </li>
          <li>
            <span aria-hidden="true">2</span>
            Choose <strong>Add to Home Screen</strong>
          </li>
        </ol>
      )}

      <p className="install-fine">
        Nothing is downloaded from an app store. You can remove it like any app.
      </p>
    </div>
  );
}
