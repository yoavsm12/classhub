import Link from "next/link";
import { redirect } from "next/navigation";
import { getGuestSession } from "@/lib/auth/session";
import { getAdminUser } from "@/lib/auth/admin";
import { GuestLoginForm } from "@/components/guest-login-form";

export default async function HomePage() {
  const [guestSession, admin] = await Promise.all([getGuestSession(), getAdminUser()]);

  if (guestSession || admin) {
    redirect("/class");
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm text-center">
        <div className="mb-2 text-5xl">📚</div>
        <h1 className="text-3xl font-bold text-neutral-900">ClassHub</h1>
        <p className="mt-2 text-neutral-500">כל החומר של הכיתה במקום אחד</p>

        <div className="mt-8">
          <GuestLoginForm />
        </div>

        <Link
          href="/admin/login"
          className="mt-8 inline-block text-sm text-neutral-400 underline-offset-4 hover:text-neutral-600 hover:underline"
        >
          כניסת מנהל
        </Link>
      </div>
    </main>
  );
}
