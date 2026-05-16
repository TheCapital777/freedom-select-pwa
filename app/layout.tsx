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
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw">
      <body className={inter.className}>
        <PWARegister />
        <Navbar />
        <main style={{ paddingBottom: "calc(74px + env(safe-area-inset-bottom, 0px))" }}>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
