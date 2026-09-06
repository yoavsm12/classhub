import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GUEST_SESSION_COOKIE, verifyGuestSessionToken } from "@/lib/auth/guest-session";
import { getAdminUser } from "@/lib/auth/admin";

export type ClassAccess = { kind: "guest" } | { kind: "admin"; email: string };

/** בודק האם קיים guest session תקף (ללא הפניה). */
export async function getGuestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_SESSION_COOKIE)?.value;
  return verifyGuestSessionToken(token);
}

/**
 * שומר עמודי /class/*: מאפשר גישה גם לאורח עם session תקף וגם למנהל מחובר.
 * אם אין אף אחד מהשניים — מפנה לעמוד הכניסה הראשי.
 */
export async function requireClassAccess(): Promise<ClassAccess> {
  const guestSession = await getGuestSession();
  if (guestSession) return { kind: "guest" };

  const admin = await getAdminUser();
  if (admin) return { kind: "admin", email: admin.email };

  redirect("/");
}
