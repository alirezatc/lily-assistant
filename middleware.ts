import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isPublic = createRouteMatcher(["/welcome", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublic(req)) {
        const { userId } = await auth();
        if (!userId) {
          const url = req.nextUrl.clone();
          url.pathname = "/welcome";
          return NextResponse.redirect(url);
        }
      }
    })
  : () => NextResponse.next();

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };
