import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-5 text-center">
      <div className="text-5xl">🔍</div>
      <h1 className="text-2xl font-bold text-neutral-900">הדף לא נמצא</h1>
      <p className="text-neutral-500">ייתכן שהקישור שגוי או שהתוכן הוסר.</p>
      <Link href="/" className="mt-3 rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white hover:bg-neutral-800">
        חזרה לדף הבית
      </Link>
    </main>
  );
}
