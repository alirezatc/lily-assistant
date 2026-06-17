// Auth disabled in v1 (no login). Pass-through middleware.
import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next();
}
export const config = { matcher: [] };
