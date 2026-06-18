import Link from "next/link";

export default function Welcome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="text-6xl">🌷</div>
      <div>
        <h1 className="bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-4xl font-extrabold text-transparent">
          Nilou
        </h1>
        <p className="mt-2 text-gray-500">Your money, in one pretty place.</p>
      </div>
      <div className="w-full max-w-xs space-y-3 pt-4">
        <Link href="/sign-in"
          className="block w-full rounded-2xl bg-brand p-3.5 font-bold text-brand-fg shadow-soft active:scale-[.99]">
          Sign in
        </Link>
        <Link href="/sign-up"
          className="block w-full rounded-2xl border border-pink-200 bg-white p-3.5 font-bold text-brand active:scale-[.99]">
          Create account
        </Link>
      </div>
      <p className="pt-6 text-xs text-gray-400">Private &amp; secure · two-factor coming soon</p>
    </main>
  );
}
