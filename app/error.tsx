"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-5 text-center">
      <div className="text-5xl">😕</div>
      <h1 className="text-2xl font-bold text-neutral-900">משהו השתבש</h1>
      <p className="text-neutral-500">אירעה שגיאה בלתי צפויה. נסו שוב.</p>
      <button
        onClick={reset}
        className="mt-3 rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white hover:bg-neutral-800"
      >
        נסו שוב
      </button>
    </main>
  );
}
