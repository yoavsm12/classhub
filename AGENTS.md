<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# הנחיות פרויקט — ClassHub

הפרויקט הוא **ClassHub**: אתר פרטי לכיתה אחת (MVP). קרא/י את `HANDOFF_TO_CODEX.md` **לפני** כל שינוי — הוא מכיל תמונת מצב מדויקת (מה נבנה, מה עובד, החלטות, TODO, בעיות ידועות).

## גבולות scope — קריטי

- **אין להוסיף פיצ'רים מחוץ ל-MVP** בלי בקשה מפורשת מהמשתמש. במפורש **אסור** להוסיף (ראו גם `HANDOFF_TO_CODEX.md` סעיף 17):
  - העלאת קבצים לאתר, Supabase Storage, כל אחסון קבצים.
  - פורום, צ'אט, תגובות.
  - AI (סיכומים אוטומטיים, המלצות וכו').
  - חשבונות אישיים לתלמידים (המודל הוא קוד גישה משותף בלבד).
  - תמיכה במספר כיתות באותה מערכת.
  - Push notifications.
- הממשק **בעברית מלאה ו-RTL** — כל טקסט משתמש, `lang="he"` `dir="rtl"`. אל תוסיפו טקסט באנגלית בממשק (חוץ משמות פרטיים כמו "Machine Learning" שכבר קיימים כנתונים).

## אבטחה — לא לשבור

- **כל admin mutation (Server Action תחת `/admin`) חייב לקרוא ל-`requireAdmin()` בשורה הראשונה שלו** — גם אם `proxy.ts` כבר סינן. proxy הוא הגנה מהירה בלבד, לא סמכותית.
- **כל גישת Guest חייבת לעבור דרך ה-session cookie המאומת** (`requireClassAccess()` / `getGuestSession()` ב-`lib/auth/session.ts`) — לעולם לא לסמוך על מצב UI בלבד.
- **אין לחשוף secrets.** `SUPABASE_SECRET_KEY` נטען רק דרך `lib/supabase/service.ts` (מוגן ב-`import "server-only"`). אסור לייבא את הקובץ הזה (או כל דבר שתלוי בו) מקומפוננטה עם `"use client"`.
- שימוש **רק** במשתני הסביבה הבאים (שמות מדויקים):
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SECRET_KEY
  ADMIN_EMAIL
  GUEST_ACCESS_CODE_HASH
  GUEST_SESSION_SECRET
  ```
  **אין** להשתמש בשמות legacy: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- אם מוסיפים route דינמי חדש (`[param]`) שעלול לקבל טקסט לא-ASCII (עברית) — **חובה** `decodeURIComponent(param)` לפני שימוש. ראו `HANDOFF_TO_CODEX.md` סעיף 7 לבאג אמיתי שקרה בגלל זה.
- קובצי `.env`: כל `$` בערך (למשל bcrypt hash) חייב `\$` escaped, אחרת Next.js "מרחיב" אותו כמשתנה ומוחק אותו בשקט.

## תהליך עבודה

- **לפני שינוי קוד**: לקרוא את הקבצים הרלוונטיים במלואם (לא לנחש מבנה).
- **אחרי כל שינוי קוד**, להריץ (בסדר הזה) ולוודא שהכול נקי לפני שממשיכים:
  ```bash
  npm run lint
  npm run typecheck
  npm run build
  ```
- **לא לבצע `git commit` אלא אם המשתמש ביקש זאת במפורש.**
- **לא למחוק קבצים בלי סיבה ברורה** — ואם מוחקים, לתעד למה ב-commit message / בתשובה למשתמש.
- לעדכן את `HANDOFF_TO_CODEX.md` אם משהו מהותי משתנה (route חדש, טבלה חדשה, החלטת ארכיטקטורה) — הוא אמור להישאר מקור אמת עדכני, לא תמונת מצב קפואה.
