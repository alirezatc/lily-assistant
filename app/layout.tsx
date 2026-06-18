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

// Pink, friendly, and mobile-first Clerk UI (bigger avatar + responsive modal).
const clerkAppearance = {
  variables: {
    colorPrimary: "#e84a8a",
    borderRadius: "1rem",
    fontFamily: "var(--font-quicksand)",
  },
  elements: {
    userButtonAvatarBox: "h-11 w-11",
    avatarBox: "h-11 w-11",
    // make the account modal fit small screens
    modalContent: "mx-3 w-[calc(100vw-1.5rem)] max-w-md",
    modalCard: "max-h-[88vh] overflow-y-auto",
    card: "shadow-soft",
    userButtonPopoverCard: "shadow-soft",
    formButtonPrimary: "bg-brand hover:bg-brand-deep",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const html = (
    <html lang="en" className={quicksand.variable}>
      <body className="mx-auto max-w-md min-h-screen font-sans">{children}</body>
    </html>
  );
  return clerkEnabled
    ? <ClerkProvider appearance={clerkAppearance}>{html}</ClerkProvider>
    : html;
}
