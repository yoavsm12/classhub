# מסמך העברה — ClassHub

**תאריך כתיבה:** 2026-09-06
**נכתב על ידי:** Claude (Sonnet 5), לצורך המשך עבודה בכלי אחר (Codex).
**מטרת המסמך:** לתת לכלי הבא (או למפתח הבא) תמונת מצב מדויקת ומלאה, בלי שיצטרך לנחש או לגלות מחדש דברים שכבר ידועים.

---

## 1. סקירה קצרה

**ClassHub** — אתר פרטי לכיתה אחת (כרגע: "הנדסת תוכנה יד4"). תלמידים נכנסים עם קוד גישה משותף ורואים חומרי לימוד (קישורים חיצוניים בלבד, בעיקר ל-Google Drive), מערכת שעות, מבחנים/הגשות, מאורגנים לפי מקצוע. מנהל (המורה) מנהל הכול דרך פאנל אדמין מאובטח.

## 2. מטרת ה-MVP

MVP קטן ויציב לכיתה אחת. **לא** מערכת כללית רב-כיתתית, **לא** פלטפורמת קבצים. הקבצים עצמם תמיד חיצוניים (Google Drive וכד') — האתר רק מארגן קישורים אליהם.

## 3. מה נבנה בפועל (הכול קיים ועובד, לא רק מתוכנן)

### תשתית ואבטחה
- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4, RTL מלא, פונט Rubik.
- **הגנת נתיבים דו-שכבתית**: `proxy.ts` (המוסכמה החדשה של Next 16 — לא `middleware.ts`) + בדיקה סמכותית בצד שרת (`requireAdmin()` / `requireClassAccess()`) בכל page/action.
- Guest session: HMAC-SHA256 חתום, cookie `httpOnly`, ללא Supabase user (`lib/auth/guest-session.ts`).
- Admin auth: Supabase Auth + השוואת `ADMIN_EMAIL` מדויקת (`lib/auth/admin.ts`).
- כל גישת הנתונים עוברת רק דרך `lib/data/*.ts` בצד שרת עם `SUPABASE_SECRET_KEY`. RLS מופעל על כל הטבלאות ללא policies (deny-all) — הגנת עומק.

### תכונות מוצר (הכול CRUD מלא ב-admin + תצוגה לתלמידים)
- מקצועות (subjects) — כולל שינוי סדר, הסתרה, מחיקה עם אזהרה.
- חומרים (resources) — קישור חיצוני בלבד, סוג/מקור/תאריך/חשוב, סינון וחיפוש.
- מבחנים והגשות (events) — **מפוצל בצד תלמיד** ל-`/class/exams` ו-`/class/assignments` (שני עמודים נפרדים), מאוחד בצד admin (`/admin/events`).
- **מערכת שעות שבועית** (`schedule_slots`) — תכונה מורכבת: ניהול מלא ב-`/admin/schedule`, ותצוגת ציר-זמן חי ב-`/class/schedule` עם:
  - קו "עכשיו" אדום שזז בזמן אמת.
  - תיבות שעת התחלה/סיום בתוך כל בלוק שיעור.
  - בחירת קבוצה מקבילה (A4/B4/C4 וכד', נגזר דינמית מהנתונים) הנשמרת ב-`localStorage` של התלמיד ומסננת את מה שהוא רואה.
- לוח שנה שנתי (`/class/calendar`) — ספטמבר 2026 עד יוני 2027, מבחנים/הגשות כנקודות צבע על התאריך, חופשות כרקע צהוב, ולחיצה על יום פותחת פירוט.
- חופשות/חגים (`holidays`) — ניהול מלא ב-`/admin/holidays`, מוצג בלוח השנה.
- הודעות (announcements) — ניהול מלא ב-admin, **אך כרגע לא מוצגות לתלמיד באף עמוד** (ראו סעיף 6, החלטה מכוונת).

### חוויית הזנת נתונים ב-admin (שופרה 2026-09-06)
- **"שמור והוסף עוד"** בכל טופסי היצירה — נשאר באותו טופס ריק במקום לחזור לרשימה, מיועד להזנה של הרבה פריטים ברצף (למשל לוח חופשות שלם). מימוש: כפתור submit עם `name="_action" value="save_and_new"`, ו-`savedRedirectPath()` ב-`lib/admin-redirect.ts`.
- **אישור שמירה** (`?saved=1` + `components/admin/saved-banner.tsx`) בכל עמודי הרשימה והיצירה.
- **דשבורד "הוספה מהירה"** — 6 כרטיסים גדולים ונוחים ללחיצה לכל סוגי התוכן.
- דיווחי קישור שבור (reports) — תלמיד מדווח, admin מסמן טופל/התעלם.
- חיפוש כללי (`/class/search`) — קיים ועובד, אך **לא מקושר משום מקום** כרגע (ראו סעיף 6).

### כלי תפעול
- `scripts/generate-access-code-hash.ts` — יצירת bcrypt hash לקוד גישה (עם escaping נכון ל-`\$` בשביל קבצי `.env`).
- `scripts/run-sql.ts` — מריץ SQL ישירות מול Supabase דרך RPC בשם `exec_sql` (ראו סעיף 11) — עוקף את הצורך בחיבור Postgres ישיר, שחסום ברשתות רבות.

### פריסה
- פרוס ופעיל ב-Vercel: **https://classhub-nine.vercel.app**
- כל 6 משתני הסביבה מוגדרים ב-Vercel (production + preview + development).

## 4. מה עדיין לא נבנה

- שום מקום שמציג הודעות (announcements) לתלמיד (הוסר לפי בקשה מפורשת של המשתמש — ראו סעיף 6).
- שום קישור/ניווט לעמוד החיפוש הכללי (`/class/search`) — העמוד קיים ותקין אבל "יתום" ניווטית.
- אין בדיקות אוטומטיות (unit/E2E) בפרויקט עצמו — כל האימות שנעשה היה ידני/חד-פעמי דרך Playwright חיצוני (לא נשמר בריפו).
- אין CI/CD מוגדר (GitHub Actions וכד') — אין אפילו remote git מוגדר (ראו סעיף 15).
- שום דבר מרשימת "Future Improvements" ב-README (העלאת קבצים, ריבוי כיתות, חשבונות אישיים, פורום, AI) — לא ב-scope של ה-MVP, ואסור להתחיל לבנות בלי הנחיה מפורשת.

## 5. מה עובד (מאומת בפועל, לא רק "אמור לעבוד")

- Build+lint+typecheck ירוקים (תוצאות מדויקות בסעיף 14).
- כניסת Guest עם קוד גישה אמיתי — נבדק חי בפרודקשן.
- כל 9 עמודי המקצועות (`/class/subjects/[slug]`), כולל slugים בעברית — נבדק חי בפרודקשן אחרי תיקון הבאג (סעיף 7).
- מערכת השעות: תצוגה, בחירת קבוצה, סינון, קו "עכשיו" — נבדק חי בפרודקשן עם אמולציית iPhone 13 (Playwright).
- `/class/exams`, `/class/assignments` — נבדק חי, מחזירים תוכן נכון ו-404 נכון על הנתיב הישן שהוסר.
- דף הבית (`/class`) — עודכן לאחרונה להציג **רק** מקצועות, לפי בקשה מפורשת. נבדק חי.
- אין שגיאות קונסול/JS בדפדפן בכל הדפים שנבדקו, אין גלישה אופקית (horizontal overflow) במובייל.

## 6. החלטות חשובות שצריך להכיר (לא לבטל בלי לשאול!)

1. **דף הבית = רק מקצועות.** המשתמש ביקש זאת מפורשות. זה הסיר מדף הבית: חיפוש, הודעות ("חשוב עכשיו"), מבחנים/הגשות קרובים, "נוסף לאחרונה". **תוצאת לוואי לא-מתוקנת**: הודעות לא מוצגות לתלמיד באף מקום, וחיפוש כללי לא נגיש מניווט. המשתמש יודע על זה ולא ביקש תיקון עדיין.
2. **אירועים מפוצלים אצל תלמיד, מאוחדים אצל admin.** אל תמזג אותם מחדש בלי לשאול.
3. **מערכת השעות** מבוססת על מערכת שעות אמיתית שחולצה מ-PDF סרוק (ראו `supabase/seed.sql`... בעצם הנתונים לא ב-seed.sql, הם הוזנו ידנית ב-production DB דרך `scripts/run-sql.ts` — **ה-seed.sql הקיים בריפו הוא seed ישן/גנרי ולא תואם לנתונים האמיתיים כרגע ב-production!** ראו סעיף 12.
4. **"קבוצה" (`group_label`) במערכת השעות** היא טקסט חופשי (לא enum), נגזר דינמית מהדאטה בפועל — לא לקודד קשיח שמות קבוצות בקוד.
5. **exec_sql RPC** (סעיף 11) הוא כלי תפעולי-בלבד, לא חלק מהאפליקציה. אל תחשוף אותו ל-anon/authenticated, ואל תשלב אותו בקוד ה-app עצמו.

## 7. באג שנמצא ותוקן (לתשומת לב מיוחדת)

**בעיה**: `/class/subjects/[slug]` עם slug בעברית החזיר 404 עבור **8 מתוך 9** מקצועות. הסיבה: ב-Next.js 16, `params.slug` בדף דינמי מגיע **עדיין percent-encoded** (למשל `%D7%94%D7%A0...`) ולא מפוענח אוטומטית בחזרה ל-UTF-8, כשה-slug מכיל תווים שאינם ASCII. ההשוואה מול מסד הנתונים (שמכיל את הטקסט העברי הרגיל) נכשלה בשקט.

**תיקון**: `const slug = decodeURIComponent(rawSlug);` לפני כל שימוש — ראו `app/class/subjects/[slug]/page.tsx`.

**⚠️ אם תוסיפו route דינמי חדש עם פרמטר שעלול להכיל עברית (או כל UTF-8 שאינו ASCII), חובה `decodeURIComponent` על ה-param.** `searchParams` (query string) **לא** סובלים מהבעיה הזו — נבדק ואומת בנפרד.

## 8. מבנה קבצים מרכזי

```
app/
  page.tsx                        # כניסת תלמידים (קוד גישה) — "/"
  actions/                        # Server Actions כלליים (guest login/logout, admin logout, דיווחים)
  class/                          # אזור תלמידים — מוגן ע"י requireClassAccess() ב-layout.tsx
    layout.tsx
    page.tsx                      # דף בית: רק מקצועות (ראו סעיף 6)
    subjects/[slug]/page.tsx      # עמוד מקצוע — ⚠️ ראו סעיף 7 לגבי decodeURIComponent
    schedule/page.tsx             # מערכת שעות (תלמיד)
    exams/page.tsx                # מבחנים ובחנים (תלמיד)
    assignments/page.tsx          # משימות והגשות (תלמיד)
    search/page.tsx               # חיפוש כללי — קיים אך לא מקושר (ראו סעיף 6)
  admin/
    login/page.tsx                # התחברות מנהל (Supabase Auth, browser client)
    (protected)/                  # route group — כל מה שדורש requireAdmin()
      page.tsx                    # לוח בקרה
      subjects/ resources/ events/ announcements/ reports/ settings/ schedule/
        page.tsx (רשימה) + new/page.tsx + [id]/edit/page.tsx + actions.ts (בכל תיקייה)

lib/
  auth/
    admin.ts                      # getAdminUser() / requireAdmin()
    guest-session.ts              # HMAC sign/verify, cookie constants
    session.ts                    # requireClassAccess() (guest OR admin)
  data/                           # שכבת גישה לנתונים — היחידה שמדברת עם Supabase (service client)
    subjects.ts resources.ts events.ts announcements.ts reports.ts settings.ts schedule.ts
  supabase/
    browser.ts                    # publishable key, admin login בלבד
    server.ts                     # auth session (cookies), Supabase Auth בלבד
    service.ts                    # SUPABASE_SECRET_KEY, "server-only", כל נתוני האפליקציה
  validation/                     # סכמות Zod, אחת לכל entity
  types.ts constants.ts utils.ts env.ts time-grid.ts

components/
  admin/                          # טפסי ניהול (client components, useActionState)
  class/                          # header, כרטיסי מקצוע/חומר/אירוע, schedule-view + schedule-time-grid
  ui/                              # button, card, badge, field, form-message, submit-button, confirm-submit-button

proxy.ts                          # הגנת נתיבים (Next 16). matcher: /admin/:path*, /class/:path*
supabase/
  migrations/0001_init.sql        # כל הטבלאות המקוריות
  migrations/0002_schedule.sql    # schedule_slots
  seed.sql                        # ⚠️ לא תואם ל-production הנוכחי, ראו סעיף 12
scripts/
  generate-access-code-hash.ts
  run-sql.ts                      # מריץ SQL מול exec_sql RPC (סעיף 11)
```

## 9. מבנה Routes מלא

**תלמיד** (מוגן ע"י `requireClassAccess` — guest session תקף או admin):
- `/` — כניסה (אם כבר מחובר → redirect ל-`/class`)
- `/class` — בית (רק מקצועות)
- `/class/subjects/[slug]`
- `/class/schedule`
- `/class/exams`
- `/class/assignments`
- `/class/search` — קיים, לא מקושר

**Admin** (מוגן ע"י `requireAdmin`, מלבד login):
- `/admin/login`
- `/admin` — דשבורד
- `/admin/subjects` (+ `/new`, `/[id]/edit`)
- `/admin/resources` (+ `/new`, `/[id]/edit`)
- `/admin/events` (+ `/new`, `/[id]/edit`)
- `/admin/schedule` (+ `/new`, `/[id]/edit`)
- `/admin/announcements` (+ `/new`, `/[id]/edit`)
- `/admin/reports`
- `/admin/settings`

## 10. מבנה Database (Supabase / Postgres)

כל הטבלאות: RLS מופעל, **ללא policies** (deny-all לכל מי שאינו service_role). ראו קבצי המיגרציה המלאים ב-`supabase/migrations/`.

| טבלה | תיאור | שדות עיקריים |
|---|---|---|
| `class_settings` | שורה יחידה (id=1) | name, academic_year, subtitle |
| `subjects` | מקצועות | name, slug (unique), icon, description, display_order, is_active |
| `resources` | חומרים | subject_id (FK), title, description, topic, resource_type (enum), source_type (enum), external_url (חייב http/https), resource_date, is_important, is_active |
| `events` | מבחנים/הגשות | subject_id (FK), title, event_type ('exam'\|'assignment'), event_date, description, topics (text[]), is_important |
| `resource_events` | קישור many-to-many | resource_id, event_id |
| `announcements` | הודעות | title, content, is_pinned, is_active |
| `reports` | דיווחי קישור שבור | resource_id (FK), reason (enum), note, status ('open'\|'resolved'\|'ignored') |
| `schedule_slots` | מערכת שעות | subject_id (FK), day_of_week (0-6, 0=ראשון), start_time, end_time (time), teacher, room, group_label (טקסט חופשי, nullable) |

כל טבלה עם `updated_at` יש לה trigger שמעדכן אותו אוטומטית (`set_updated_at()`).

## 11. exec_sql RPC — כלי תפעולי חשוב

נוצר ידנית ב-SQL Editor (**לא** בקובץ מיגרציה בריפו!):

```sql
create or replace function exec_sql(query text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare result jsonb;
begin
  execute query;
  return jsonb_build_object('status', 'ok');
exception when others then
  return jsonb_build_object('status', 'error', 'message', SQLERRM);
end;
$$;
revoke all on function exec_sql(text) from public, anon, authenticated;
grant execute on function exec_sql(text) to service_role;
```

**חשוב לכלי הבא**: אם תרצה להריץ migration/SQL חדש ואין לך גישה ל-`psql` (חסום ברשתות רבות בפורט 5432/6543), תוכל להשתמש ב-`npx tsx scripts/run-sql.ts <קובץ.sql>` — זה עובד דרך HTTPS רגיל. **שים לב**: הפונקציה מבצעת `execute query` בלבד ולא מחזירה rows — טובה ל-DDL/DML, לא לקריאת נתונים (לזה יש להשתמש ב-Supabase client הרגיל).

## 12. Migrations ו-Seed — מצב מדויק

- `0001_init.sql` — הורץ ב-production. ✅
- `0002_schedule.sql` — הורץ ב-production. ✅
- `seed.sql` — **קובץ ישן שנוצר בתחילת הפרויקט עם 4 מקצועות דמו (מתמטיקה, מדעי המחשב, אנגלית, היסטוריה). הוא לא הורץ בגרסה הנוכחית של production ולא תואם למקצועות האמיתיים שם.** ה-production הנוכחי מכיל 9 מקצועות אמיתיים (עקרונות מערכות הפעלה, סייבר ואבטחת מידע, אלגברה לינארית, Machine Learning, תקשורת נתונים ורשתות, תכנות מונחה עצמים, מערכות אוטונומיות, טכנולוגיות הנדסת תוכנה, הנדסת תוכנה DB) שהוזנו ידנית דרך `scripts/run-sql.ts`, וכן חומרים/מבחנים/הגשות/הודעות לדוגמה, וכן 20 שורות `schedule_slots` אמיתיות שחולצו ממערכת שעות סרוקה.
- **המלצה לכלי הבא**: אם תרצה לשחזר סביבה חדשה (dev/staging), אל תסתמך על `seed.sql` הקיים — הוא לא משקף את המצב האמיתי. שקול לעדכן אותו או ליצור dump חדש מה-production הנוכחי.

## 13. איך עובדים המנגנונים המרכזיים

### Guest login
1. Admin בוחר קוד גישה, מריץ `npm run generate-access-code-hash -- "הקוד"`.
2. הפלט (bcrypt hash, **עם `\$` escaped בקובץ `.env` — ראו אזהרת אבטחה #3**) נשמר ב-`GUEST_ACCESS_CODE_HASH`.
3. תלמיד מזין קוד ב-`/` → Server Action `guestLoginAction` (ב-`app/actions/guest.ts`) עושה `bcrypt.compare` מול ה-hash.
4. אם תואם: נוצר טוקן חתום HMAC-SHA256 (`createGuestSessionToken`, ב-`lib/auth/guest-session.ts`) בפורמט `base64url(payload).base64url(signature)`, נשמר ב-cookie `classhub_guest_session` (httpOnly, sameSite=lax, secure בפרודקשן, 30 יום).
5. כל בקשה ל-`/class/*`: `proxy.ts` מוודא guest cookie תקף (מהיר, ללא I/O ל-DB) **או** admin session תקף; `requireClassAccess()` (ב-server component) הוא הבדיקה הסמכותית.

### Admin login
1. `/admin/login` הוא client component שמשתמש ב-`createSupabaseBrowserClient()` (publishable key בלבד) עם `supabase.auth.signInWithPassword()`.
2. משתמש ה-Admin נוצר **ידנית** דרך Supabase Auth Admin API (לא UI ציבורי) — ראו README.
3. `getAdminUser()` (ב-`lib/auth/admin.ts`) קורא ל-`supabase.auth.getUser()` (עם cookies דרך `lib/supabase/server.ts`), ומשווה `user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()`.
4. `requireAdmin()` מפנה ל-`/admin/login` אם אין הרשאה. **כל action/page תחת `/admin/(protected)` קורא ל-`requireAdmin()` בשורה הראשונה שלו** — לא להסתמך רק על ה-layout.

### הרשאות — מודל כללי
- אין roles במסד הנתונים. הרשאת Admin = אימייל תואם בלבד.
- שכבת `lib/data/*` היא הדרך **היחידה** לגעת בנתונים. היא לא בודקת הרשאות בעצמה — האחריות היא על הקורא (page/action) לקרוא ל-`requireAdmin()`/`requireClassAccess()` **לפני** קריאה לפונקציית data שמבצעת mutation או חושפת מידע רגיש.
- Guest לעולם לא מדבר עם Supabase ישירות מהדפדפן — רק admin login עושה זאת (עם publishable key, לא secret).

## 14. תוצאות אחרונות של בדיקות (הורצו ממש לפני כתיבת מסמך זה)

```
npm run lint       → נקי, 0 שגיאות/אזהרות
npm run typecheck  → נקי (npx tsc --noEmit ללא פלט)
npm run build      → הצליח. 22 routes, כולן ƒ (dynamic) חוץ מ-/admin/login ו-/_not-found שהן ○ (static)
```

**לא הורץ**: אין `npm test` בפרויקט (אין test suite כלל).

## 15. TODO לפי סדר עדיפות

1. **להחליט מה לעשות עם הודעות** — אין להן תצוגה לתלמיד כרגע. אפשרויות: להחזיר סקשן קטן לדף הבית, או עמוד `/class/announcements` נפרד, או להשאיר כך אם זו הכוונה הסופית. **לשאול את המשתמש, לא להחליט לבד.**
2. **להחליט מה לעשות עם חיפוש** — `/class/search` יתום. להוסיף קישור בניווט? לשאול את המשתמש.
3. **לעדכן את `supabase/seed.sql`** כך שישקף את המצב האמיתי (או למחוק אותו ולתעד את זה ב-README אם אין בו יותר צורך).
4. **להגדיר git remote + push** — אין remote מוגדר כרגע (`git remote -v` ריק). כל ה-git history מקומי בלבד.
5. **לשקול תשתית בדיקות** — אין אף test אוטומטי בריפו. כל האימות שנעשה עד כה היה ידני/חד-פעמי.
6. **git identity** — commits נעשו עם זהות אוטומטית (`user@users-MacBook-Pro-2.local`), לא שם/אימייל אמיתיים. לא קריטי אך שווה לתקן אם ה-remote יהיה GitHub אמיתי.
7. פיצ'רים מ-"Future Improvements" ב-README — **לא לגעת בלי בקשה מפורשת**.

## 16. בעיות ידועות / דברים שלא אומתו במלואם

- ~~טפסי ה-admin מעולם לא נבדקו end-to-end~~ — **נבדק ואומת (2026-09-06)**: התחברות אדמין אמיתית + יצירה בפועל של מקצוע, חומר, אירוע, שיעור במערכת, חופשה והודעה, כולל "שמור והוסף עוד" ואישורי שמירה. הכל עבד ללא שגיאות, גם מקומית וגם בפרודקשן. נתוני הבדיקה נמחקו.
  - ⚠️ **מלכודת לבודקים אוטומטיים**: בכל עמוד אדמין, כפתור ה-submit הראשון ב-DOM הוא **"התנתקות"** שבכותרת. סלקטור גנרי כמו `button[type="submit"]` יילחץ עליו ויתנתק במקום לשמור. יש להשתמש ב-`main form button[type="submit"]` או בטקסט הכפתור.
- כל בדיקות המובייל שנעשו היו על אמולציית iPhone 13 (Playwright) בלבד — לא נבדק על מכשיר Android אמיתי, לא נבדק Safari אמיתי (רק Chromium).
- אין ניטור/לוגים מובנים בפרודקשן מעבר למה ש-Vercel נותן כברירת מחדל.
- כתובת ה-Vercel project (`classhub`) הייתה קיימת מראש עם env vars ישנים בני 104 יום משריד של ניסיון קודם לפני הכתיבה-מחדש — נמחקו והוחלפו, אבל ייתכן שיש עוד שאריות בהגדרות הפרויקט ב-Vercel (domains, integrations) שלא נבדקו.
- לא הוגדר custom domain — האתר חי רק תחת `classhub-nine.vercel.app`.

## 17. דברים שאסור לבנות כרגע (ללא בקשה מפורשת של המשתמש)

- פורום / צ'אט / תגובות.
- העלאת קבצים לאתר, Supabase Storage, כל אחסון קבצים.
- AI (סיכומים אוטומטיים, המלצות וכו').
- חשבונות אישיים לתלמידים (המודל הוא קוד גישה משותף בלבד).
- תמיכה במספר כיתות באותה מערכת.
- Push notifications.
- כל דבר אחר תחת "Future Improvements" ב-README.

## 18. Environment Variables

ראו `.env.example` לרשימה המלאה עם הערות. **שמות מדויקים, אין להשתמש בשמות legacy**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
ADMIN_EMAIL
GUEST_ACCESS_CODE_HASH
GUEST_SESSION_SECRET
```

**⚠️ אזהרת אבטחה קריטית**: כל 6 המשתנים מוגדרים כרגע ב-Vercel (production/preview/development) עם ערכים אמיתיים. `.env.local` המקומי גם מכיל אותם בפועל (לא ב-git, מוגן ע"י `.gitignore`). **אל תדפיס/תרשום את הערכים האמיתיים בשום קובץ שנכנס ל-git, כולל מסמך זה.**

## 19. אזהרות אבטחה נוספות

1. **`SUPABASE_SECRET_KEY` עוקף RLS לגמרי.** נטען רק ב-`lib/supabase/service.ts` שמוגן ב-`import "server-only"`. אסור בשום אופן לייבא את הקובץ הזה (או כל דבר שמייבא אותו) מקומפוננטה עם `"use client"`.
2. **כל admin mutation (Server Action תחת `/admin`) חייב לקרוא ל-`requireAdmin()` כשורה הראשונה שלו**, גם אם ה-proxy כבר סינן — proxy.ts הוא הגנה מהירה, לא הגנה סמכותית (התיעוד הרשמי של Next.js על proxy מזהיר מפורשות מהסתמכות בלעדית עליו).
3. **קובצי `.env` וברחת ה-`$`**: Next.js מבצע env variable expansion — כל `$` ב-`.env.local` נחשב תחילת הפניה למשתנה ונמחק בשקט אם לא escaped. bcrypt hashes (מתחילים תמיד ב-`$2b$...`) **חייבים** `\$` לפני כל `$`. הסקריפט `generate-access-code-hash.ts` כבר מטפל בזה אוטומטית — **אל תדביקו hash ידנית בלי לברוח מה-`$`**.
4. **`exec_sql` RPC** (סעיף 11) נגיש רק ל-`service_role` — ודאו שזה נשאר כך אם תיצרו מחדש את הפונקציה בסביבה אחרת.
5. קישורים חיצוניים (`external_url`) מאומתים ב-DB (CHECK constraint על `^https?://`) וגם ב-Zod (`isSafeExternalUrl`) וגם מוצגים עם `target="_blank" rel="noopener noreferrer"` — שלוש שכבות, אל תסירו אף אחת.
6. Guest session secret ו-guest access code hash **שונים בין local/preview/production** — ודאו שלא מבלבלים ביניהם בטעות בזמן debug.

## 20. פקודות התקנה, הרצה ובדיקה

```bash
npm install                                   # התקנת תלויות
cp .env.example .env.local                    # ואז למלא ערכים אמיתיים
npm run generate-access-code-hash -- "קוד"    # יצירת hash לקוד גישה (מטפל אוטומטית ב-escaping)
npm run dev                                   # שרת פיתוח, http://localhost:3000
npm run build                                 # build לפרודקשן
npm run start                                 # הרצת ה-build
npm run lint                                  # ESLint
npm run typecheck                             # tsc --noEmit בלבד
npx tsx scripts/run-sql.ts <קובץ.sql>          # הרצת SQL מול production דרך exec_sql RPC
vercel --prod                                 # פריסה לפרודקשן (הפרויקט כבר מקושר עם vercel link)
```

אין `npm test` — אין test suite.
