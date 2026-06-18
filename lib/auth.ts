// Login turns on automatically once Clerk keys are present in the environment.
// Until then the app runs open (single-user) so nothing breaks.
export const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
