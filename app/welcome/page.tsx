import Link from "next/link";

export default function Welcome() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 text-center">
      {/* Abstract floral line-art */}
      <svg viewBox="0 0 200 200" className="mb-6 h-40 w-40" fill="none" aria-hidden>
        <defs>
          <linearGradient id="stem" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ff9ec7" />
            <stop offset="1" stopColor="#c81e6a" />
          </linearGradient>
        </defs>
        <g stroke="url(#stem)" strokeWidth="1.6" strokeLinecap="round">
          {/* center stem */}
          <path d="M100 185 C 100 150, 96 120, 100 96" />
          {/* leaves */}
          <path d="M100 150 C 80 146, 70 134, 72 120 C 88 124, 98 134, 100 150 Z" />
          <path d="M100 140 C 120 138, 132 128, 132 114 C 116 116, 104 126, 100 140 Z" />
          {/* main bloom — abstract petals as overlapping arcs */}
          <g transform="translate(100 70)">
            <circle cx="0" cy="0" r="9" />
            <path d="M0 -10 C 12 -22, 26 -16, 22 -2 C 12 -6, 4 -6, 0 -10 Z" />
            <path d="M9 -4 C 24 -2, 28 14, 16 20 C 12 9, 8 3, 9 -4 Z" />
            <path d="M4 8 C 10 22, 0 32, -10 26 C -4 16, -2 12, 4 8 Z" />
            <path d="M-9 2 C -24 6, -30 -8, -19 -16 C -12 -7, -10 -2, -9 2 Z" />
            <path d="M-6 -8 C -16 -20, -8 -32, 4 -28 C -2 -18, -4 -13, -6 -8 Z" />
          </g>
          {/* side buds */}
          <g transform="translate(150 96)">
            <path d="M0 40 C -4 22, -8 8, 0 -2" />
            <path d="M0 6 C 12 0, 18 8, 14 18 C 6 14, 2 12, 0 6 Z" />
          </g>
          <g transform="translate(50 104)">
            <path d="M0 38 C 4 22, 8 10, 0 0" />
            <path d="M0 8 C -12 2, -18 10, -14 20 C -6 16, -2 14, 0 8 Z" />
          </g>
        </g>
        {/* sparkle accents */}
        <circle cx="158" cy="44" r="2" fill="#e84a8a" />
        <circle cx="44" cy="60" r="1.6" fill="#ff9ec7" />
        <circle cx="120" cy="30" r="1.4" fill="#e84a8a" />
      </svg>

      <h1 className="bg-gradient-to-r from-brand to-brand-deep bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
        Nilou
      </h1>
      <p className="mt-2 text-gray-500">Your money, in one pretty place.</p>

      <div className="glass mt-8 w-full max-w-xs space-y-3 rounded-3xl p-5">
        <Link href="/sign-in"
          className="block w-full rounded-2xl bg-brand p-3.5 font-bold text-brand-fg shadow-soft transition active:scale-[.99]">
          Sign in
        </Link>
        <Link href="/sign-up"
          className="block w-full rounded-2xl border border-white/70 bg-white/70 p-3.5 font-bold text-brand backdrop-blur transition active:scale-[.99]">
          Create account
        </Link>
        <p className="pt-1 text-xs text-gray-400">Private &amp; secure · two-factor coming soon</p>
      </div>
    </main>
  );
}
