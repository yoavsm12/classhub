import "server-only";
import { getServerEnv } from "@/lib/env";

/**
 * Session חתום לתלמידים ("Guest"), ללא משתמש אישי ב-Supabase.
 * מבנה בסגנון JWT מינימלי: base64url(payload) + "." + base64url(HMAC-SHA256).
 * נחתם ומאומת עם GUEST_SESSION_SECRET, כך שלא ניתן לזייף session בצד הלקוח.
 *
 * משתמש ב-Web Crypto (crypto.subtle) כדי לעבוד הן ב-Node.js והן ב-Edge runtime (proxy.ts).
 */

export interface GuestSessionPayload {
  sid: string; // session id אקראי
  iat: number; // הונפק ב- (unix seconds)
  exp: number; // תפוגה (unix seconds)
}

const GUEST_COOKIE_NAME = "classhub_guest_session";
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const b of arr) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getHmacKey(secret: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

async function signPayload(payloadB64: string, secret: string): Promise<string> {
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return toBase64Url(signature);
}

/** יוצר טוקן session חתום עבור אורח חדש. */
export async function createGuestSessionToken(): Promise<string> {
  const env = getServerEnv();
  const now = Math.floor(Date.now() / 1000);
  const payload: GuestSessionPayload = {
    sid: crypto.randomUUID(),
    iat: now,
    exp: now + THIRTY_DAYS_SECONDS,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signPayload(payloadB64, env.GUEST_SESSION_SECRET);
  return `${payloadB64}.${signature}`;
}

/** מאמת טוקן session ומחזיר את ה-payload אם תקין ולא פג תוקף, אחרת null. */
export async function verifyGuestSessionToken(token: string | undefined | null): Promise<GuestSessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  try {
    const env = getServerEnv();
    const expectedSignature = await signPayload(payloadB64, env.GUEST_SESSION_SECRET);

    if (!timingSafeEqual(signature, expectedSignature)) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as GuestSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    if (typeof payload.sid !== "string" || !payload.sid) return null;

    return payload;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const GUEST_SESSION_COOKIE = GUEST_COOKIE_NAME;
export const GUEST_SESSION_MAX_AGE_SECONDS = THIRTY_DAYS_SECONDS;
