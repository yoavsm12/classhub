# ClassHub

**כל החומר של הכיתה במקום אחד.**

אתר פרטי לכיתה אחת: התלמידים נכנסים עם קוד גישה משותף ורואים את כל חומרי הלימוד (סיכומים, מצגות, דפי תרגול, מבחנים והגשות) מסודרים לפי מקצוע — כל חומר הוא קישור חיצוני (בעיקר ל-Google Drive). המורה/מנהל מנהל הכל דרך פאנל ניהול מאובטח.

**זהו MVP.** אין באתר העלאת קבצים — הקבצים עצמם נשארים ב-Google Drive (או כל שירות אחר), והאתר רק מארגן קישורים אליהם.

## תוכן עניינים

- [סטאק טכנולוגי](#סטאק-טכנולוגי)
- [איך זה עובד](#איך-זה-עובד)
- [התקנה מאפס](#התקנה-מאפס)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [מודל הרשאות ואבטחה](#מודל-הרשאות-ואבטחה)
- [סקריפטים שימושיים](#סקריפטים-שימושיים)
- [פריסה ל-Vercel](#פריסה-ל-vercel)
- [שיפורים עתידיים](#שיפורים-עתידיים-לא-ב-mvp)

## סטאק טכנולוגי

- **Next.js 16** (App Router, Turbopack, `proxy.ts` להגנת נתיבים)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — מסד נתונים (Postgres) + Auth למנהל
- **Zod** — ולידציה של כל הטפסים והקלט
- עברית מלאה, `dir="rtl"`, פונט [Rubik](https://fonts.google.com/specimen/Rubik) דרך `next/font`
- מובייל־ראשון (mobile-first)

## איך זה עובד

- **תלמיד**: נכנס לדף הבית, מזין קוד גישה משותף לכיתה → מקבל session (עוגייה חתומה, ללא חשבון אישי) → רואה מקצועות, חומרים, מבחנים והגשות → פותח קישורים חיצוניים בטאב חדש.
- **מנהל (המורה)**: מתחבר עם אימייל+סיסמה (Supabase Auth) → מנהל מקצועות, חומרים, אירועים, הודעות ודיווחים דרך `/admin`.
- **קבצים**: אף קובץ לא מועלה ל-ClassHub. המנהל מעלה קבצים ל-Google Drive (או כל שירות אחר), משתף כ-Viewer, ומדביק את הקישור בטופס "חומר חדש".

## התקנה מאפס

### 1. דרישות מוקדמות

- Node.js, npm ו-git מותקנים (לא צריך להתקין כלום נוסף).
- חשבון [Supabase](https://supabase.com) (חינמי מספיק) — אפשר ליצור פרויקט מאוחר יותר, זה לא חוסם את הפיתוח המקומי.

### 2. התקנת תלויות

```bash
npm install
```

### 3. יצירת פרויקט Supabase

1. צרו פרויקט חדש ב-[supabase.com](https://supabase.com/dashboard).
2. בתפריט **Project Settings → API** תמצאו:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** → `SUPABASE_SECRET_KEY` (⚠️ סודי לגמרי, לא לחשוף)

### 4. הרצת המיגרציות

ב-**SQL Editor** של הפרויקט ב-Supabase, הריצו לפי הסדר:

1. את התוכן של `supabase/migrations/0001_init.sql` (יוצר את כל הטבלאות).
2. (אופציונלי, לדוגמאות) את התוכן של `supabase/seed.sql`.

אם אתם עובדים עם [Supabase CLI](https://supabase.com/docs/guides/local-development) ופרויקט מקושר, אפשר גם:

```bash
supabase db push
```

### 5. יצירת משתמש Admin

באין עמוד הרשמה ציבורי בכוונה. ביצירת המשתמש:

1. ב-Supabase: **Authentication → Users → Add user** — הזינו את האימייל והסיסמה של המורה.
2. ודאו ש-**Auto Confirm User** מסומן (או אשרו את המייל ידנית).

### 6. משתני סביבה

```bash
cp .env.example .env.local
```

מלאו את `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` מהשלב הקודם, ואת:

- `ADMIN_EMAIL` — בדיוק אותו אימייל שיצרתם ב-Supabase Auth.
- `GUEST_SESSION_SECRET` — מחרוזת אקראית ארוכה. ליצירה מהירה:
  ```bash
  openssl rand -hex 32
  ```
- `GUEST_ACCESS_CODE_HASH` — ראו סעיף הבא.

### 7. יצירת קוד הגישה לתלמידים

בחרו קוד גישה משותף לכיתה (למשל `"כיתה-יד-2026"`) והריצו:

```bash
npm run generate-access-code-hash -- "כיתה-יד-2026"
```

הפקודה תדפיס שורה כמו:

```
GUEST_ACCESS_CODE_HASH=$2b$12$...
```

העתיקו אותה ל-`.env.local` **בדיוק כפי שהודפסה, כולל ה-`\$`** (קו נטוי לפני כל `$`). **הקוד הגולמי עצמו לא נשמר בשום מקום** — רק ה-hash.

> ⚠️ **גוצ'ה נפוץ**: Next.js מבצע "הרחבת משתנים" בקבצי `.env` — כל `$` ואחריו תווים נחשב כהפניה למשתנה סביבה (`$VAR`) ומוחלף בשקט (בד"כ במחרוזת ריקה אם המשתנה לא קיים). מכיוון שה-hash של bcrypt תמיד נראה כמו `$2b$12$...`, אם תדביקו אותו בלי לברוח מה-`$` הוא ייקטע וההתחברות תיכשל תמיד עם "קוד הגישה שגוי" — בלי שום שגיאה שמסבירה למה. הפקודה `generate-access-code-hash` כבר פותרת את זה ומדפיסה את השורה עם ה-`\$` הנכון.

### 8. הרצה מקומית

```bash
npm run dev
```

פתחו את http://localhost:3000 — דף הכניסה לתלמידים. כניסת מנהל דרך `/admin/login`.

## מבנה הפרויקט

```
app/
  page.tsx                     # דף כניסה לתלמידים (קוד גישה)
  class/                       # אזור התלמידים (מוגן ב-guest/admin session)
    page.tsx                   # דף בית: הודעות, אירועים קרובים, מקצועות, חומרים אחרונים
    search/                    # חיפוש חומר בכל הכיתה
    subjects/[slug]/           # עמוד מקצוע עם חיפוש ופילטרים
    events/                    # מבחנים והגשות
  admin/
    login/                     # התחברות מנהל (Supabase Auth)
    (protected)/                # כל השאר — מוגן ע"י requireAdmin()
      page.tsx                 # לוח בקרה
      subjects/ resources/ events/ announcements/ reports/ settings/
  actions/                     # Server Actions ציבוריים (guest login/logout, דיווחים)

lib/
  auth/                        # guest session (HMAC) + admin auth (Supabase + ADMIN_EMAIL)
  data/                        # שכבת גישה לנתונים (Data Access Layer) — קורא ל-Supabase בלבד
  supabase/                    # לקוחות Supabase (browser / server-auth / service)
  validation/                  # סכמות Zod לכל טופס
  types.ts constants.ts utils.ts env.ts

proxy.ts                       # הגנת נתיבים ברמת Next.js (Next 16: proxy.ts, לא middleware.ts)
supabase/
  migrations/0001_init.sql     # סכמת מסד הנתונים המלאה
  seed.sql                     # נתוני דוגמה
scripts/generate-access-code-hash.ts
```

## מודל הרשאות ואבטחה

- **שתי שכבות הגנה** על כל נתיב מוגן:
  1. `proxy.ts` (Next 16, מריץ ב-Node.js runtime) — מפנה מהר משתמשים לא מחוברים, ומרענן את ה-session של Supabase.
  2. בדיקה סמכותית בצד השרת בכל עמוד/פעולה: `requireAdmin()` ל-`/admin/*`, `requireClassAccess()` ל-`/class/*`. **אין הסתמכות על מצב ה-UI בלבד.**
- **הרשאת Admin** נקבעת אך ורק לפי השוואת `user.email` (מ-Supabase Auth) מול `ADMIN_EMAIL` — לא לפי role כלשהו במסד הנתונים.
- **Guest session** הוא עוגיית `httpOnly` חתומה ב-HMAC-SHA256 (`GUEST_SESSION_SECRET`), לא JWT ספריה חיצונית ולא Supabase user. הקוד הגולמי (`GUEST_ACCESS_CODE_HASH`) מאוחסן כ-bcrypt hash בלבד.
- **כל הגישה לנתונים** (מקצועות/חומרים/אירועים/הודעות/דיווחים) עוברת אך ורק דרך `lib/data/*` בצד שרת, עם `SUPABASE_SECRET_KEY`. הדפדפן — כולל תלמידים — **לא** מדבר עם Supabase ישירות לצורך נתונים (המפתח הפומבי משמש רק להתחברות המנהל). לכן כל הטבלאות מוגדרות עם RLS מופעל ללא policies (`deny all`) כהגנת עומק.
- **קישורים חיצוניים**: נבדקים בזמן שמירה (Zod, פרוטוקול http/https בלבד) וגם מוצגים עם `target="_blank" rel="noopener noreferrer"`.

## סקריפטים שימושיים

```bash
npm run dev                          # שרת פיתוח
npm run build                        # build לפרודקשן
npm run start                        # הרצת ה-build
npm run lint                         # ESLint
npm run typecheck                    # בדיקת טיפוסים בלבד
npm run generate-access-code-hash -- "קוד"   # יצירת hash לקוד גישה
```

## הרצת SQL/migrations בלי SQL Editor (אופציונלי)

הפרויקט הזה כולל פונקציית עזר ב-Postgres בשם `exec_sql` (נוצרה ידנית פעם אחת ב-SQL Editor — ראו היסטוריית הסטאפ) שמאפשרת להריץ SQL ישירות דרך ה-API של Supabase (HTTPS), בלי חיבור Postgres ישיר (`psql`) שחסום ברשתות רבות (פורט 5432/6543).

```bash
npx tsx scripts/run-sql.ts supabase/seed.sql       # מקובץ
npx tsx scripts/run-sql.ts --sql "select 1;"        # שורת SQL ישירה
```

הפונקציה מוגדרת עם הרשאה ל-`service_role` בלבד (לא נגישה ל-anon/authenticated), כך שהיא לא חושפת שום דבר לתלמידים — רק למי שמחזיק את `SUPABASE_SECRET_KEY`.

## פריסה ל-Vercel

1. `vercel link` / חברו את הריפו ב-Vercel Dashboard.
2. הגדירו את כל משתני הסביבה מ-`.env.example` תחת **Project Settings → Environment Variables** (כולל Production).
3. `vercel --prod` (או פשוט push לענף הראשי אם מחובר ל-Git).

ודאו ש-`ADMIN_EMAIL` בפרודקשן זהה בדיוק לאימייל שיצרתם ב-Supabase Auth, ושה-`GUEST_ACCESS_CODE_HASH` ו-`GUEST_SESSION_SECRET` שונים מאלה שבפיתוח המקומי (מומלץ קוד גישה אחר לפרודקשן).

## שיפורים עתידיים (לא ב-MVP)

- העלאת קבצים ישירה לאתר (Supabase Storage) במקום קישורים חיצוניים בלבד.
- תמיכה במספר כיתות באותה מערכת.
- חשבונות אישיים לתלמידים (במקום קוד גישה משותף).
- פורום / תגובות / צ'אט בין תלמידים.
- התראות Push על הודעות ואירועים קרובים.
- לוח שנה מלא (תצוגת חודש) לאירועים.
- AI לסיכום חומרים או המלצות למידה.
