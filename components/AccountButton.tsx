"use client";
import { UserButton } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";
export default function AccountButton() {
  if (!clerkEnabled) return null;
  return <UserButton afterSignOutUrl="/welcome" />;
}
