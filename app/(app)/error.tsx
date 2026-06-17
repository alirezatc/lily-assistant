"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="space-y-4 p-6 text-center">
      <h1 className="pt-6 text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-gray-500">
        This screen hit an unexpected error. Your data is safe — try again.
      </p>
      <button onClick={() => reset()} className="rounded-xl bg-brand px-5 py-3 font-semibold text-brand-fg">
        Try again
      </button>
    </main>
  );
}
