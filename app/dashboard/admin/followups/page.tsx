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

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  high:   { label: "High",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",   dot: "#ef4444" },
  medium: { label: "Medium", color: "#FFBB1C", bg: "rgba(255,187,28,0.1)",  dot: "#FFBB1C" },
  low:    { label: "Low",    color: "#555",    bg: "rgba(85,85,85,0.1)",     dot: "#555"    },
};

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

  const fileRef   = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, isCamera = false) {
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ width: "3px", height: "26px", background: "#a78bfa", borderRadius: "2px", flexShrink: 0 }} />
          <h1 style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.02em" }}>Follow Ups</h1>
          {openCount > 0 && (
            <span style={{ padding: "3px 10px", background: highCount > 0 ? "rgba(239,68,68,0.15)" : "rgba(255,187,28,0.12)", color: highCount > 0 ? "#ef4444" : "#FFBB1C", borderRadius: "6px", fontSize: "12px", fontWeight: 800 }}>
              {openCount} open{highCount > 0 ? ` · ${highCount} urgent` : ""}
            </span>
          )}
        </div>
        <p style={{ fontSize: "13px", color: "#555", paddingLeft: "15px" }}>Track what needs your attention</p>
      </div>

      {/* ── Compose box ── */}
      <div style={{
        background: "#161616", border: "1px solid #2A2A2A",
        borderRadius: "16px", padding: "20px", marginBottom: "24px",
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
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
                  <img src={a.url} alt={a.name}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid #333" }} />
                ) : (
                  <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#222", border: "1px solid #333", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    <span style={{ fontSize: "22px" }}>📄</span>
                    <span style={{ fontSize: "9px", color: "#555", textAlign: "center", padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{a.name}</span>
                  </div>
                )}
                <button onClick={() => removeAttachment(i)}
                  style={{ position: "absolute", top: "-5px", right: "-5px", width: "18px", height: "18px", borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", fontSize: "11px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
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
                  style={{
                    padding: "7px 12px", borderRadius: "8px",
                    background: active ? cfg.bg : "transparent",
                    border: `1px solid ${active ? cfg.color + "66" : "#2A2A2A"}`,
                    color: active ? cfg.color : "#444",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.18s",
                  }}>
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Attach file */}
          <button onClick={() => fileRef.current?.click()}
            title="Attach file"
            style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #2A2A2A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "16px" }}>
            📎
          </button>
          <input ref={fileRef} type="file" multiple accept="*/*" onChange={(e) => handleFileChange(e)} style={{ display: "none" }} />

          {/* Camera capture */}
          <button onClick={() => cameraRef.current?.click()}
            title="Capture photo"
            style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#1A1A1A", border: "1px solid #2A2A2A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "16px" }}>
            📷
          </button>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleFileChange(e, true)} style={{ display: "none" }} />

          <div style={{ flex: 1 }} />

          {/* Add button */}
          <button onClick={addItem} disabled={!text.trim()}
            style={{
              padding: "10px 22px", borderRadius: "10px",
              background: text.trim() ? "#FFBB1C" : "#1E1E1E",
              color: text.trim() ? "#0C0C0C" : "#3A3A3A",
              fontWeight: 800, fontSize: "13px", letterSpacing: "0.06em", textTransform: "uppercase",
              border: "none", cursor: text.trim() ? "pointer" : "default",
              transition: "all 0.2s",
            }}>
            Add
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["open", "all", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "9px 18px", borderRadius: "8px",
              background: filter === f ? "rgba(167,139,250,0.12)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(167,139,250,0.4)" : "#2A2A2A"}`,
              color: filter === f ? "#a78bfa" : "#444",
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.18s",
            }}>
            {f === "open" ? `Open${openCount > 0 ? ` (${openCount})` : ""}` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Follow-up list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#3A3A3A" }}>
          <p style={{ fontSize: "36px", marginBottom: "12px" }}>✅</p>
          <p style={{ fontSize: "15px", fontWeight: 600 }}>All clear</p>
          <p style={{ fontSize: "13px", marginTop: "6px" }}>No {filter === "done" ? "completed" : "open"} follow-ups</p>
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
                    opacity: item.done ? 0.55 : 1,
                  }}>
                  {/* Priority accent line */}
                  {!item.done && <div style={{ height: "3px", background: cfg.color, opacity: 0.7 }} />}

                  <div style={{ padding: "18px 20px" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: item.attachments.length > 0 ? "14px" : "12px" }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleDone(item.id)}
                        style={{
                          width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                          border: `2px solid ${item.done ? "#22c55e" : cfg.color + "88"}`,
                          background: item.done ? "rgba(34,197,94,0.15)" : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          marginTop: "1px",
                        }}>
                        {item.done && <span style={{ color: "#22c55e", fontSize: "13px", lineHeight: 1 }}>✓</span>}
                      </button>

                      {/* Text */}
                      <p style={{
                        flex: 1, fontSize: "15px", fontWeight: 600, lineHeight: 1.5, color: item.done ? "#555" : "#D0D0D0",
                        textDecoration: item.done ? "line-through" : "none",
                      }}>{item.text}</p>

                      {/* Delete */}
                      <button onClick={() => deleteItem(item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#2A2A2A", fontSize: "18px", lineHeight: 1, padding: "0", flexShrink: 0 }}>
                        ×
                      </button>
                    </div>

                    {/* Attachments */}
                    {item.attachments.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px", paddingLeft: "36px" }}>
                        {item.attachments.map((a, i) => (
                          a.type === "image" ? (
                            <img key={i} src={a.url} alt={a.name}
                              style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid #2A2A2A" }} />
                          ) : (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", background: "#1E1E1E", borderRadius: "8px", border: "1px solid #2A2A2A" }}>
                              <span style={{ fontSize: "14px" }}>📄</span>
                              <span style={{ fontSize: "12px", color: "#666" }}>{a.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "36px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "6px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700 }}>
                        ● {cfg.label}
                      </span>
                      <span style={{ fontSize: "12px", color: "#3A3A3A" }}>{date}</span>
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
