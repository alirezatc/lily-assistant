import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Nilou Assistant",
  description: "Personal income, expenses, and credit-due tracker.",
  manifest: "/manifest.webmanifest",
};

// Mobile-first: lock to device width, allow safe-area insets.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="mx-auto max-w-md min-h-screen">{children}</body>
      </html>
    </ClerkProvider>
  );
}
