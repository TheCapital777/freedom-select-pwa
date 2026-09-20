"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Priority = "high" | "medium" | "low";
type Attachment = { type: "image"; url: string; name: string } | { type: "file"; name: string };

interface FollowUp {
  id: string;
  text: string;
  priority: Priority;
  attachments: Attachment[];
  createdAt: string;
  done: boolean;
}

/* "low" was #555 — 2.6:1 on #0C0C0C. Now text-dim at 9.0:1. */
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: "High",   color: "#ef4444", bg: "rgba(239,68,68,0.1)"    },
  medium: { label: "Medium", color: "#FFBB1C", bg: "rgba(255,187,28,0.1)"   },
  low:    { label: "Low",    color: "#B0B0B0", bg: "rgba(176,176,176,0.08)" },
};

const microLabel: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#B0B0B0",
};

/** Inline check — MASTER.md glyph rules: 24-box, currentColor, 1.5 stroke, round joins. */
function CheckMark({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** "quote-march.pdf" → "PDF". Replaces the paperclip/page emoji on file chips. */
function fileKind(name: string): string {
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";
  return ext.length > 0 && ext.length <= 4 ? ext.toUpperCase() : "FILE";
}

const SEED: FollowUp[] = [
  {
    id: "fu-1",
    text: "Call Kilimanjaro Hardware re: delayed payout — wallet shows TZS 7.7M pending",
    priority: "high",
    attachments: [],
    createdAt: "2026-03-27T08:00:00Z",
    done: false,
  },
  {
    id: "fu-2",
    text: "Review transport SLA — 3 deliveries exceeded 2hr ETA this week",
    priority: "medium",
    attachments: [],
    createdAt: "2026-03-28T10:30:00Z",
    done: false,
  },
  {
    id: "fu-3",
    text: "Onboard Safari Building Supplies onto Vendor app — they're still calling in orders",
    priority: "low",
    attachments: [],
    createdAt: "2026-03-29T07:00:00Z",
    done: false,
  },
];

export default function FollowUpsPage() {
  const [items, setItems] = useState<FollowUp[]>(SEED);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "done">("open");
  const [composerFocused, setComposerFocused] = useState(false);

  const fileRef   = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newAttachments: Attachment[] = files.map((f) => {
      if (f.type.startsWith("image/")) {
        return { type: "image", url: URL.createObjectURL(f), name: f.name };
      }
      return { type: "file", name: f.name };
    });
    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  }

  function removeAttachment(idx: number) {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  function addItem() {
    if (!text.trim()) return;
    const item: FollowUp = {
      id: `fu-${Date.now()}`,
      text: text.trim(),
      priority,
      attachments: pendingAttachments,
      createdAt: new Date().toISOString(),
      done: false,
    };
    setItems((prev) => [item, ...prev]);
    setText("");
    setPendingAttachments([]);
    setPriority("medium");
  }

  function toggleDone(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, done: !it.done } : it));
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const filtered = items.filter((it) => {
    if (filter === "open") return !it.done;
    if (filter === "done") return it.done;
    return true;
  });

  const openCount = items.filter(i => !i.done).length;
  const highCount = items.filter(i => !i.done && i.priority === "high").length;

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "28px 20px 100px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
          <div style={{ width: "3px", height: "26px", background: "#a78bfa", borderRadius: "2px", flexShrink: 0 }} />
          <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Follow Ups</h1>
          {openCount > 0 && (
            <span style={{ padding: "4px 10px", background: highCount > 0 ? "rgba(239,68,68,0.15)" : "rgba(255,187,28,0.12)", color: highCount > 0 ? "#ef4444" : "#FFBB1C", borderRadius: "6px", fontSize: "12px", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {openCount} open{highCount > 0 ? ` · ${highCount} urgent` : ""}
            </span>
          )}
        </div>
        <p style={{ fontSize: "13px", color: "#B0B0B0", paddingLeft: "15px" }}>Track what needs your attention</p>
      </div>

      {/* ── Compose box ── */}
      <div style={{
        background: "#161616",
        /* Focus ring lives on the wrapper because the textarea has no border of
           its own — previously `outline: none` left the field with no focus cue. */
        border: `1px solid ${composerFocused ? "rgba(255,187,28,0.55)" : "#2A2A2A"}`,
        boxShadow: composerFocused ? "0 0 0 2px rgba(255,187,28,0.2)" : "none",
        borderRadius: "16px", padding: "20px", marginBottom: "24px",
        transition: "border-color 0.18s, box-shadow 0.18s",
      }}>
        <label htmlFor="followup-text" style={{ ...microLabel, display: "block", marginBottom: "10px" }}>New follow-up</label>
        <textarea
          id="followup-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setComposerFocused(true)}
          onBlur={() => setComposerFocused(false)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addItem(); }}
          placeholder="What needs your follow-up…"
          rows={3}
          style={{
            width: "100%", background: "none", border: "none", outline: "none",
            color: "#F0F0F0", fontSize: "15px", fontWeight: 500, lineHeight: 1.6,
            resize: "none", fontFamily: "inherit",
          }}
        />

        {/* Pending attachment previews */}
        {pendingAttachments.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px", marginBottom: "4px" }}>
            {pendingAttachments.map((a, i) => (
              <div key={i} style={{ position: "relative", display: "inline-block" }}>
                {a.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid #333", display: "block" }} />
                ) : (
                  <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#1E1E1E", border: "1px solid #2A2A2A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px", padding: "0 4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.06em", color: "#FFBB1C" }}>{fileKind(a.name)}</span>
                    <span style={{ fontSize: "9px", color: "#B0B0B0", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{a.name}</span>
                  </div>
                )}
                <button onClick={() => removeAttachment(i)} aria-label={`Remove attachment ${a.name}`}
                  style={{ position: "absolute", top: "-7px", right: "-7px", width: "26px", height: "26px", borderRadius: "50%", background: "#ef4444", border: "2px solid #161616", color: "#fff", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: "1px", background: "#242424", margin: "14px 0" }} />

        {/* Priority + actions row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Priority selector */}
          <div style={{ display: "flex", gap: "6px", marginRight: "4px" }}>
            {(["high", "medium", "low"] as Priority[]).map((p) => {
              const cfg = PRIORITY_CONFIG[p];
              const active = priority === p;
              return (
                <button key={p} onClick={() => setPriority(p)}
                  aria-pressed={active}
                  style={{
                    padding: "7px 14px", minHeight: "44px", borderRadius: "8px",
                    background: active ? cfg.bg : "transparent",
                    border: `1px solid ${active ? cfg.color + "66" : "#2A2A2A"}`,
                    color: active ? cfg.color : "#B0B0B0",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    transition: "color 0.18s, background 0.18s, border-color 0.18s",
                  }}>
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Attach file — a word, not a paperclip emoji */}
          <button onClick={() => fileRef.current?.click()}
            style={{ minHeight: "44px", padding: "0 14px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #2A2A2A", cursor: "pointer", color: "#B0B0B0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Attach
          </button>
          <input ref={fileRef} type="file" multiple accept="*/*" onChange={handleFileChange} style={{ display: "none" }} />

          {/* Camera capture */}
          <button onClick={() => cameraRef.current?.click()}
            style={{ minHeight: "44px", padding: "0 14px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #2A2A2A", cursor: "pointer", color: "#B0B0B0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Photo
          </button>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />

          <div style={{ flex: 1 }} />

          {/* Add button */}
          <button onClick={addItem} disabled={!text.trim()}
            style={{
              padding: "0 24px", minHeight: "44px", borderRadius: "10px",
              background: text.trim() ? "#FFBB1C" : "#1E1E1E",
              color: text.trim() ? "#0C0C0C" : "#6B6B6B",
              fontWeight: 800, fontSize: "13px", letterSpacing: "0.06em", textTransform: "uppercase",
              border: "none", cursor: text.trim() ? "pointer" : "default",
              transition: "background 0.2s, color 0.2s",
            }}>
            Add
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {(["open", "all", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            style={{
              padding: "0 18px", minHeight: "44px", borderRadius: "8px",
              background: filter === f ? "rgba(167,139,250,0.12)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(167,139,250,0.4)" : "#2A2A2A"}`,
              color: filter === f ? "#a78bfa" : "#B0B0B0",
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer", transition: "color 0.18s, background 0.18s, border-color 0.18s",
            }}>
            {f === "open" ? `Open${openCount > 0 ? ` (${openCount})` : ""}` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Follow-up list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "44px 20px", background: "#161616", border: "1px solid #242424", borderRadius: "14px" }}>
          <div aria-hidden style={{ width: "36px", height: "3px", borderRadius: "2px", background: "#22c55e", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#F0F0F0" }}>All clear</p>
          <p style={{ fontSize: "13px", marginTop: "6px", color: "#B0B0B0" }}>No {filter === "done" ? "completed" : "open"} follow-ups</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <AnimatePresence>
            {filtered.map((item) => {
              const cfg = PRIORITY_CONFIG[item.priority];
              const date = new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 32, transition: { duration: 0.22 } }}
                  style={{
                    background: "#161616",
                    border: `1px solid ${item.done ? "#1E1E1E" : "#242424"}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}>
                  {/* Priority accent line */}
                  {!item.done && <div style={{ height: "3px", background: cfg.color, opacity: 0.7 }} />}

                  <div style={{ padding: "14px 16px 16px" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: item.attachments.length > 0 ? "14px" : "12px" }}>
                      {/* Checkbox — 44px hit area, 22px box */}
                      <button onClick={() => toggleDone(item.id)}
                        aria-pressed={item.done}
                        aria-label={item.done ? "Mark as not done" : "Mark as done"}
                        style={{
                          width: "44px", height: "44px", flexShrink: 0, marginLeft: "-11px", marginTop: "-11px",
                          background: "none", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                        <span style={{
                          width: "22px", height: "22px", borderRadius: "6px",
                          border: `2px solid ${item.done ? "#22c55e" : cfg.color + "88"}`,
                          background: item.done ? "rgba(34,197,94,0.15)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#22c55e",
                        }}>
                          {item.done && <CheckMark />}
                        </span>
                      </button>

                      {/* Text */}
                      <p style={{
                        flex: 1, minWidth: 0, fontSize: "15px", fontWeight: 600, lineHeight: 1.5,
                        /* was #555 (2.4:1 on the card) when done — now text-dim */
                        color: item.done ? "#B0B0B0" : "#F0F0F0",
                        textDecoration: item.done ? "line-through" : "none",
                      }}>{item.text}</p>

                      {/* Delete — was #2A2A2A (1.1:1), effectively invisible */}
                      <button onClick={() => deleteItem(item.id)}
                        aria-label="Delete follow-up"
                        style={{ width: "44px", height: "44px", marginTop: "-11px", marginRight: "-11px", background: "none", border: "none", cursor: "pointer", color: "#B0B0B0", fontSize: "20px", lineHeight: 1, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ×
                      </button>
                    </div>

                    {/* Attachments */}
                    {item.attachments.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px", paddingLeft: "34px" }}>
                        {item.attachments.map((a, i) => (
                          a.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={a.url} alt={a.name}
                              style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid #2A2A2A", display: "block" }} />
                          ) : (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "#1E1E1E", borderRadius: "8px", border: "1px solid #2A2A2A", maxWidth: "100%" }}>
                              <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.06em", color: "#FFBB1C", flexShrink: 0 }}>{fileKind(a.name)}</span>
                              <span style={{ fontSize: "12px", color: "#B0B0B0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingLeft: "34px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700 }}>
                        ● {cfg.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "#B0B0B0", fontVariantNumeric: "tabular-nums" }}>{date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
