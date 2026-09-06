import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUEST_SESSION_COOKIE, verifyGuestSessionToken } from "@/lib/auth/guest-session";

/**
 * שכבת הגנה ראשונה על הנתיבים (defense in depth). Next.js 16 מריץ proxy.ts
 * במקום middleware.ts הישן, ברירת מחדל ל-Node.js runtime.
 *
 * חשוב: זו רק שכבת הגנה קדמית שמפנה מהר משתמשים לא מחוברים. שכבת ההגנה
 * הסמכותית היא בצד השרת בכל page/action (requireAdmin / requireClassAccess),
 * ולא ניתן להסתמך על ה-proxy בלבד — ראו lib/auth/admin.ts ו-lib/auth/session.ts.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login חייב להישאר נגיש בלי session, אחרת אין דרך להתחבר.
  const isAdminLoginPath = pathname === "/admin/login";
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isClassPath = pathname === "/class" || pathname.startsWith("/class/");

  if (!isAdminPath && !isClassPath) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let adminEmail: string | null = null;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email && process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
      adminEmail = user.email;
    }
  }

  if (isAdminLoginPath) {
    // מנהל שכבר מחובר לא צריך לראות שוב את מסך ההתחברות.
    if (adminEmail) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (isAdminPath) {
    if (!adminEmail) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  if (isClassPath) {
    if (adminEmail) return response;

    const guestToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value;
    const guestSession = await verifyGuestSessionToken(guestToken);
    if (!guestSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/class", "/class/:path*"],
};
