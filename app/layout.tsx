import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import BottomNav from "./_components/BottomNav";
import PWARegister from "./_components/PWARegister";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Freedom Select — Construction Materials, Arusha",
  description: "Tanzania's multi-vendor marketplace. Shop construction materials and more, delivered to your door in Arusha.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Freedom Select" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  // maximumScale/userScalable were locking pinch-zoom off. That is a hard
  // accessibility failure — anyone who needs to magnify a price or a spec
  // simply cannot. The usual reason to set it, stopping iOS zooming on focused
  // inputs, is handled properly instead: every input is at least 16px.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PWARegister />
        <div className="ambient-bloom" aria-hidden="true" />
        <Navbar />
        <main style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
