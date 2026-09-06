"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerEnv } from "@/lib/env";
import { guestLoginSchema } from "@/lib/validation/settings";
import {
  createGuestSessionToken,
  GUEST_SESSION_COOKIE,
  GUEST_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/guest-session";
import { logGuestEntry } from "@/lib/data/access-log";

export interface GuestLoginState {
  error?: string;
}

export async function guestLoginAction(_prevState: GuestLoginState, formData: FormData): Promise<GuestLoginState> {
  const parsed = guestLoginSchema.safeParse({ code: formData.get("code") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "קוד גישה לא תקין" };
  }

  const env = getServerEnv();
  const isValid = await bcrypt.compare(parsed.data.code, env.GUEST_ACCESS_CODE_HASH);
  if (!isValid) {
    return { error: "קוד הגישה שגוי. בדקו את הקוד ונסו שוב." };
  }

  await logGuestEntry();

  const token = await createGuestSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(GUEST_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: GUEST_SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/class");
}

export async function guestLogoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_SESSION_COOKIE);
  redirect("/");
}
