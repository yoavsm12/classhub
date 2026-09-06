-- ClassHub — לוג כניסות תלמידים, לצורך מונה "כניסות היום" בדשבורד הניהול.
-- אותה לוגיקת הרשאות כמו שאר הטבלאות: RLS מופעל, ללא policies (deny all),
-- גישה רק דרך שרת Next.js עם SUPABASE_SECRET_KEY. אין כאן מידע מזהה — רק
-- חותמת זמן וסוג הכניסה, לצורך ספירה בלבד.

create table if not exists access_log (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'guest' check (kind in ('guest', 'admin')),
  created_at timestamptz not null default now()
);

alter table access_log enable row level security;

create index if not exists access_log_created_at_idx on access_log (created_at desc);
