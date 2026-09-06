-- ClassHub — מערכת שעות שבועית קבועה
-- אותה לוגיקת הרשאות כמו שאר הטבלאות: RLS מופעל, ללא policies (deny all),
-- גישה רק דרך שרת Next.js עם SUPABASE_SECRET_KEY.

create table if not exists schedule_slots (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=ראשון ... 6=שבת
  start_time time not null,
  end_time time not null check (end_time > start_time),
  teacher text,
  room text,
  group_label text, -- לקבוצות מקבילות (מעבדות מתחלפות), למשל "A4"/"B4"/"C4". null = כל הקבוצה יחד
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table schedule_slots enable row level security;

create index if not exists schedule_slots_day_idx on schedule_slots (day_of_week, start_time);
create index if not exists schedule_slots_subject_id_idx on schedule_slots (subject_id);

create trigger schedule_slots_set_updated_at
  before update on schedule_slots
  for each row execute function set_updated_at();
