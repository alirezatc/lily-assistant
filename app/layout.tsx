import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });

export const metadata: Metadata = {
  title: "Nilou ✨",
  description: "Nilou's money, in one pretty place.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#e84a8a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const html = (
    <html lang="en" className={quicksand.variable}>
      <body className="mx-auto max-w-md min-h-screen font-sans">{children}</body>
    </html>
  );
  return clerkEnabled ? <ClerkProvider>{html}</ClerkProvider> : html;
}
