"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDirectoryStore, canRemoveVendor } from "@/lib/directoryStore";
import { formatTZS } from "@/lib/utils";
import VendorMark from "@/app/_components/VendorMark";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  PlusIcon,
  StarIcon,
  TruckIcon,
  XIcon,
} from "@/app/_components/icons/StatusIcons";
import type { Transporter, Vendor } from "@/lib/types";
import { getProductIcon } from "@/lib/productIcon";

/* ── shared styling, all from the existing token set ───────────────────────── */

const card: React.CSSProperties = {
  background: "#1A1A1A",
  border: "1px solid #2A2A2A",
  borderRadius: "var(--radius-card)",
  padding: "16px",
};

const label: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#B0B0B0",
  display: "block",
  marginBottom: "6px",
};

const input: React.CSSProperties = {
  width: "100%",
  minHeight: "44px",
  background: "#0C0C0C",
  border: "1px solid #2A2A2A",
  borderRadius: "var(--radius-input)",
  padding: "0 12px",
  color: "#F0F0F0",
  fontSize: "16px",
};

const STATUS_PILL: Record<Vendor["status"], string> = {
  active: "pill pill-ok",
  pending: "pill pill-low",
  suspended: "pill pill-out",
};

function StatusPill({ status }: { status: Vendor["status"] }) {
  return (
    <span className={STATUS_PILL[status]}>
      {status === "active" ? <CheckIcon size={12} /> : status === "pending" ? <ClockIcon size={12} /> : <XIcon size={12} />}
      {status}
    </span>
  );
}

function nextStatus(s: Vendor["status"]): Vendor["status"] {
  if (s === "active") return "suspended";
  return "active";
}

const VEHICLES: Transporter["vehicle"][] = ["pickup", "canter", "lorry", "tipper", "boda"];

export default function AdminDirectoryPage() {
  const {
    vendors,
    transporters,
    addVendor,
    addTransporter,
    removeVendor,
    removeTransporter,
    setVendorStatus,
    setTransporterStatus,
    resetDirectory,
    products,
    addProduct,
    removeProduct,
    setProductStock,
  } = useDirectoryStore();

  const [tab, setTab] = useState<"vendors" | "transporters" | "products">("vendors");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // vendor form
  const [vName, setVName] = useState("");
  const [vLocation, setVLocation] = useState("");
  const [vCommission, setVCommission] = useState("8");

  // transporter form
  const [tName, setTName] = useState("");
  const [tPhone, setTPhone] = useState("");
  const [tVehicle, setTVehicle] = useState<Transporter["vehicle"]>("canter");
  const [tPlate, setTPlate] = useState("");
  const [tCapacity, setTCapacity] = useState("");
  const [tRegion, setTRegion] = useState("");

  // product form
  const [pName, setPName] = useState("");
  const [pVendor, setPVendor] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pUnit, setPUnit] = useState("bag");
  const [pStock, setPStock] = useState("100");

  function submitVendor(e: React.FormEvent) {
    e.preventDefault();
    if (!vName.trim() || !vLocation.trim()) return;
    const rate = Number(vCommission) / 100;
    addVendor({
      name: vName.trim(),
      location: vLocation.trim(),
      rating: 0,
      total_sales: 0,
      commission_rate: Number.isFinite(rate) && rate > 0 ? rate : 0.08,
      wallet_balance: 0,
      products_count: 0,
      // A vendor an admin just typed in has not been verified in the yard yet.
      status: "pending",
    });
    setVName(""); setVLocation(""); setVCommission("8");
    setShowForm(false);
    setNotice(`${vName.trim()} added as pending. Activate once you have seen the shop.`);
  }

  function submitTransporter(e: React.FormEvent) {
    e.preventDefault();
    if (!tName.trim() || !tPhone.trim()) return;
    addTransporter({
      name: tName.trim(),
      phone: tPhone.trim(),
      vehicle: tVehicle,
      plate: tPlate.trim() || "—",
      capacity: tCapacity.trim() || "Not stated",
      region: tRegion.trim() || "Arusha",
      status: "pending",
      trips_completed: 0,
    });
    setTName(""); setTPhone(""); setTPlate(""); setTCapacity(""); setTRegion("");
    setShowForm(false);
    setNotice(`${tName.trim()} added as pending.`);
  }

  function submitProduct(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(pPrice);
    if (!pName.trim() || !Number.isFinite(price) || price <= 0) return;
    const vendorId = pVendor || vendors[0]?.id || "vendor-1";
    addProduct({
      name: pName.trim(),
      category: "building-materials",
      vendor_id: vendorId,
      price,
      unit: pUnit.trim() || "unit",
      stock: Number(pStock) || 0,
      description: "",
      specs: {},
      // Matches the seeded products' framing so a new tile does not look foreign.
      gradientFrom: "#2a2118",
      gradientTo: "#15110c",
      in_stock: true,
      featured: false,
    });
    setPName(""); setPPrice(""); setPUnit("bag"); setPStock("100");
    setShowForm(false);
    setNotice(`${pName.trim()} listed. It appears in the catalogue straight away.`);
  }

  function tryRemoveVendor(v: Vendor) {
    const check = canRemoveVendor(v.id);
    if (!check.ok) {
      setVendorStatus(v.id, "suspended");
      setNotice(`${v.name} suspended rather than deleted. ${check.reason}`);
      return;
    }
    removeVendor(v.id);
    setNotice(`${v.name} removed.`);
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    minHeight: "44px",
    background: active ? "#FFBB1C" : "transparent",
    color: active ? "#0C0C0C" : "#B0B0B0",
    border: `1px solid ${active ? "#FFBB1C" : "#2A2A2A"}`,
    borderRadius: "var(--radius-input)",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: active ? "var(--bloom-md)" : "none",
    transition: "background-color 200ms var(--ease-out), border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
  });

  return (
    <div style={{ background: "#0C0C0C", minHeight: "100vh", padding: "24px 16px 104px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <Link
          href="/dashboard/admin"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            minHeight: "44px", color: "#B0B0B0", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
          }}
        >
          <ArrowLeftIcon size={14} />
          Admin
        </Link>

        <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.02em", margin: "8px 0 4px" }}>
          Directory
        </h1>
        <p style={{ fontSize: "13px", color: "#B0B0B0", marginBottom: "8px" }}>
          Add and remove the vendors who sell, the products they list, and the transporters who deliver.
        </p>

        {/* The honest caveat, on the screen rather than only in the code. */}
        <p style={{
          fontSize: "12px", color: "#B0B0B0", background: "rgba(255,187,28,0.07)",
          border: "1px solid rgba(255,187,28,0.25)", borderRadius: "var(--radius-input)",
          padding: "12px 14px", marginBottom: "24px", lineHeight: 1.55,
        }}>
          Changes are saved in this browser only. There is no server behind this
          build yet, so nothing here is shared with other devices or other people.
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button type="button" style={tabStyle(tab === "vendors")}
            onClick={() => { setTab("vendors"); setShowForm(false); setNotice(null); }}>
            Vendors · {vendors.length}
          </button>
          <button type="button" style={tabStyle(tab === "transporters")}
            onClick={() => { setTab("transporters"); setShowForm(false); setNotice(null); }}>
            Transporters · {transporters.length}
          </button>
          <button type="button" style={tabStyle(tab === "products")}
            onClick={() => { setTab("products"); setShowForm(false); setNotice(null); }}>
            Products · {products.length}
          </button>
        </div>

        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                fontSize: "12px", color: "#F0F0F0", background: "#1E1E1E",
                border: "1px solid #383838", borderLeft: "3px solid #FFBB1C",
                borderRadius: "var(--radius-plate)", padding: "10px 12px", marginBottom: "14px", lineHeight: 1.5,
              }}
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => { setShowForm((v) => !v); setNotice(null); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            minHeight: "44px", padding: "0 18px", marginBottom: "20px",
            background: showForm ? "transparent" : "#FFBB1C",
            color: showForm ? "#B0B0B0" : "#0C0C0C",
            border: `1px solid ${showForm ? "#2A2A2A" : "#FFBB1C"}`,
            borderRadius: "var(--radius-input)", fontSize: "12px", fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
          }}
        >
          {showForm ? <XIcon size={13} /> : <PlusIcon size={13} />}
          {showForm
            ? "Cancel"
            : tab === "vendors" ? "Add vendor"
            : tab === "transporters" ? "Add transporter"
            : "Add product"}
        </button>

        {/* ── forms ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showForm && tab === "vendors" && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} onSubmit={submitVendor}
              style={{ ...card, marginBottom: "18px", overflow: "hidden" }}
            >
              <label style={label} htmlFor="v-name">Business name</label>
              <input id="v-name" style={input} value={vName} required
                onChange={(e) => setVName(e.target.value)} placeholder="e.g. Meru Hardware" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="v-loc">Location</label>
              <input id="v-loc" style={input} value={vLocation} required
                onChange={(e) => setVLocation(e.target.value)} placeholder="e.g. Sakina — Nairobi Rd" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="v-comm">Commission %</label>
              <input id="v-comm" style={input} value={vCommission} type="number" min="0" max="100"
                onChange={(e) => setVCommission(e.target.value)} />

              <button type="submit" style={{
                marginTop: "16px", width: "100%", minHeight: "44px", background: "#FFBB1C",
                color: "#0C0C0C", border: "none", borderRadius: "var(--radius-input)", fontSize: "12px",
                fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}>
                Add vendor
              </button>
            </motion.form>
          )}

          {showForm && tab === "transporters" && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} onSubmit={submitTransporter}
              style={{ ...card, marginBottom: "18px", overflow: "hidden" }}
            >
              <label style={label} htmlFor="t-name">Driver name</label>
              <input id="t-name" style={input} value={tName} required
                onChange={(e) => setTName(e.target.value)} placeholder="e.g. Emmanuel Laizer" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="t-phone">Phone</label>
              <input id="t-phone" style={input} value={tPhone} required type="tel"
                onChange={(e) => setTPhone(e.target.value)} placeholder="e.g. 0754 210 880" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="t-veh">Vehicle</label>
              <select id="t-veh" style={input} value={tVehicle}
                onChange={(e) => setTVehicle(e.target.value as Transporter["vehicle"])}>
                {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>

              <label style={{ ...label, marginTop: "12px" }} htmlFor="t-plate">Plate</label>
              <input id="t-plate" style={input} value={tPlate}
                onChange={(e) => setTPlate(e.target.value)} placeholder="e.g. T 412 DGK" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="t-cap">Capacity</label>
              <input id="t-cap" style={input} value={tCapacity}
                onChange={(e) => setTCapacity(e.target.value)} placeholder="e.g. Up to 3 tonnes, covered bed" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="t-region">Region</label>
              <input id="t-region" style={input} value={tRegion}
                onChange={(e) => setTRegion(e.target.value)} placeholder="e.g. Njiro" />

              <button type="submit" style={{
                marginTop: "16px", width: "100%", minHeight: "44px", background: "#FFBB1C",
                color: "#0C0C0C", border: "none", borderRadius: "var(--radius-input)", fontSize: "12px",
                fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}>
                Add transporter
              </button>
            </motion.form>
          )}
          {showForm && tab === "products" && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} onSubmit={submitProduct}
              style={{ ...card, marginBottom: "18px", overflow: "hidden" }}
            >
              <label style={label} htmlFor="p-name">Product name</label>
              <input id="p-name" style={input} value={pName} required
                onChange={(e) => setPName(e.target.value)} placeholder="e.g. Tembo Cement 50kg" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="p-vendor">Vendor</label>
              <select id="p-vendor" style={input} value={pVendor}
                onChange={(e) => setPVendor(e.target.value)}>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>

              <label style={{ ...label, marginTop: "12px" }} htmlFor="p-price">Price (TZS)</label>
              <input id="p-price" style={input} value={pPrice} required type="number" min="1" step="100"
                onChange={(e) => setPPrice(e.target.value)} placeholder="e.g. 18500" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="p-unit">Unit</label>
              <input id="p-unit" style={input} value={pUnit}
                onChange={(e) => setPUnit(e.target.value)} placeholder="bag, sheet, tonne, piece, m²" />

              <label style={{ ...label, marginTop: "12px" }} htmlFor="p-stock">Stock</label>
              <input id="p-stock" style={input} value={pStock} type="number" min="0"
                onChange={(e) => setPStock(e.target.value)} />

              <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "12px", lineHeight: 1.5 }}>
                The icon is chosen from the product name — cement, rod, sheet, brick,
                sand, ballast, paint, pipe, tile or mesh. Anything else gets a
                neutral crate rather than a guess.
              </p>

              <button type="submit" style={{
                marginTop: "16px", width: "100%", minHeight: "44px", background: "#FFBB1C",
                color: "#0C0C0C", border: "none", borderRadius: "var(--radius-input)", fontSize: "12px",
                fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}>
                Add product
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── product list ──────────────────────────────────────────────── */}
        {tab === "products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {products.map((p) => {
              const Icon = getProductIcon(p);
              const vendor = vendors.find((v) => v.id === p.vendor_id);
              return (
                <div key={p.id} style={{ ...card, opacity: p.in_stock ? 1 : 0.62 }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "44px", height: "44px", minWidth: "44px", borderRadius: "var(--radius-input)",
                      border: "1px solid #2A2A2A", background: "#0C0C0C", color: "#B0B0B0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "2px" }}>{p.name}</p>
                      <p style={{ fontSize: "12px", color: "#B0B0B0" }}>
                        {formatTZS(p.price)} / {p.unit} · {p.stock} in stock
                      </p>
                      <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "2px" }}>
                        {vendor ? vendor.name : "vendor no longer listed"}
                      </p>
                    </div>
                    <span style={{
                      padding: "3px 9px", borderRadius: "var(--radius-stamp)", fontSize: "12px", fontWeight: 800,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: p.in_stock ? "#22c55e" : "#B0B0B0",
                      background: p.in_stock ? "rgba(34,197,94,0.10)" : "rgba(176,176,176,0.08)",
                      border: `1px solid ${p.in_stock ? "#22c55e33" : "#2A2A2A"}`,
                    }}>
                      {p.in_stock ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: "1px solid #2A2A2A", paddingTop: "12px" }}>
                    <button type="button" onClick={() => setProductStock(p.id, !p.in_stock)}
                      style={{
                        minHeight: "44px", padding: "0 14px", background: "transparent",
                        border: "1px solid #383838", borderRadius: "var(--radius-input)", color: "#F0F0F0",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}>
                      {p.in_stock ? "Mark out of stock" : "Mark in stock"}
                    </button>
                    <button type="button"
                      onClick={() => { removeProduct(p.id); setNotice(`${p.name} removed from the catalogue.`); }}
                      style={{
                        minHeight: "44px", padding: "0 14px", background: "transparent",
                        border: "1px solid #ef4444", borderRadius: "var(--radius-input)", color: "#ef4444",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── vendor list ───────────────────────────────────────────────── */}
        {tab === "vendors" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {vendors.map((v) => {
              const check = canRemoveVendor(v.id);
              return (
                <div key={v.id} style={card}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <VendorMark name={v.name} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "2px" }}>{v.name}</p>
                      <p style={{ fontSize: "12px", color: "#B0B0B0" }}>{v.location}</p>
                      <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                        <StarIcon size={11} style={{ color: "#FFBB1C" }} />
                        {v.rating || "new"} · {formatTZS(v.total_sales)} · {Math.round(v.commission_rate * 100)}% commission
                      </p>
                    </div>
                    <StatusPill status={v.status} />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: "1px solid #2A2A2A", paddingTop: "12px" }}>
                    <button type="button" onClick={() => setVendorStatus(v.id, nextStatus(v.status))}
                      style={{
                        minHeight: "44px", padding: "0 14px", background: "transparent",
                        border: "1px solid #383838", borderRadius: "var(--radius-input)", color: "#F0F0F0",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}>
                      {v.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button type="button" onClick={() => tryRemoveVendor(v)}
                      title={check.ok ? "Remove this vendor" : check.reason}
                      style={{
                        minHeight: "44px", padding: "0 14px", background: "transparent",
                        border: `1px solid ${check.ok ? "#ef4444" : "#2A2A2A"}`,
                        borderRadius: "var(--radius-input)", color: check.ok ? "#ef4444" : "#B0B0B0",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}>
                      {check.ok ? "Remove" : `Has ${check.products} listings`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── transporter list ──────────────────────────────────────────── */}
        {tab === "transporters" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {transporters.map((t) => (
              <div key={t.id} style={card}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "44px", height: "44px", minWidth: "44px", borderRadius: "var(--radius-input)",
                    border: "1px solid #2A2A2A", background: "#1E1E1E", color: "#FFBB1C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <TruckIcon size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "2px" }}>{t.name}</p>
                    <p style={{ fontSize: "12px", color: "#B0B0B0" }}>
                      {t.vehicle} · {t.plate} · {t.region}
                    </p>
                    <a href={`tel:${t.phone.replace(/\s+/g, "")}`}
                      style={{ fontSize: "12px", color: "#25D366", textDecoration: "none", display: "inline-block", minHeight: "24px" }}>
                      {t.phone}
                    </a>
                    <p style={{ fontSize: "12px", color: "#B0B0B0", marginTop: "2px" }}>
                      {t.capacity} · {t.trips_completed} trips
                    </p>
                  </div>
                  <StatusPill status={t.status} />
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: "1px solid #2A2A2A", paddingTop: "12px" }}>
                  <button type="button" onClick={() => setTransporterStatus(t.id, nextStatus(t.status))}
                    style={{
                      minHeight: "44px", padding: "0 14px", background: "transparent",
                      border: "1px solid #383838", borderRadius: "var(--radius-input)", color: "#F0F0F0",
                      fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", cursor: "pointer",
                    }}>
                    {t.status === "active" ? "Suspend" : "Activate"}
                  </button>
                  <button type="button"
                    onClick={() => { removeTransporter(t.id); setNotice(`${t.name} removed.`); }}
                    style={{
                      minHeight: "44px", padding: "0 14px", background: "transparent",
                      border: "1px solid #ef4444", borderRadius: "var(--radius-input)", color: "#ef4444",
                      fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", cursor: "pointer",
                    }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button"
          onClick={() => { resetDirectory(); setNotice("Directory reset to the seeded vendors and transporters."); }}
          style={{
            marginTop: "24px", minHeight: "44px", padding: "0 14px", background: "transparent",
            border: "1px solid #2A2A2A", borderRadius: "var(--radius-input)", color: "#B0B0B0",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer",
          }}>
          Reset to seed data
        </button>
      </div>
    </div>
  );
}
