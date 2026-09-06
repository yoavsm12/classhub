-- ClassHub — חופשות/חגים לתצוגה בלוח השנה
-- אותה לוגיקת הרשאות כמו שאר הטבלאות: RLS מופעל, ללא policies (deny all),
-- גישה רק דרך שרת Next.js עם SUPABASE_SECRET_KEY.

create table if not exists holidays (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table holidays enable row level security;

create index if not exists holidays_date_range_idx on holidays (start_date, end_date);

create trigger holidays_set_updated_at
  before update on holidays
  for each row execute function set_updated_at();
