import { requireAdmin } from "@/lib/auth/admin";
import { adminLogoutAction } from "@/app/actions/admin-auth";
import { AdminNav } from "@/components/admin/nav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm">
            <div className="font-bold text-neutral-900">ClassHub — ניהול</div>
            <div className="text-xs text-neutral-400">{admin.email}</div>
          </div>
          <form action={adminLogoutAction}>
            <button type="submit" className="text-sm text-neutral-400 hover:text-neutral-700">
              התנתקות
            </button>
          </form>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
