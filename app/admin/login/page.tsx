import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">🔐</div>
          <h1 className="text-2xl font-bold text-neutral-900">כניסת מנהל</h1>
          <p className="mt-1 text-sm text-neutral-500">ClassHub — ניהול הכיתה</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
