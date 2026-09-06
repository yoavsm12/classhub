-- ClassHub — סכמת מסד נתונים ראשונית (MVP)
-- כל הגישה לטבלאות אלו מתבצעת אך ורק משרת Next.js דרך SUPABASE_SECRET_KEY
-- (ראה lib/supabase/service.ts). לכן RLS מופעל על כל הטבלאות ללא אף policy —
-- "deny all" כהגנת עומק, וה-service role עוקף RLS כרגיל.

create extension if not exists pgcrypto;

-- פונקציית עזר לעדכון updated_at אוטומטית
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- פרטי הכיתה (שורה יחידה)
-- ---------------------------------------------------------------------------
create table if not exists class_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null default 'הכיתה שלנו',
  academic_year text not null default '',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);

alter table class_settings enable row level security;

create trigger class_settings_set_updated_at
  before update on class_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- מקצועות
-- ---------------------------------------------------------------------------
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subjects enable row level security;

create index if not exists subjects_display_order_idx on subjects (display_order);

create trigger subjects_set_updated_at
  before update on subjects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- חומרים
-- ---------------------------------------------------------------------------
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  title text not null,
  description text,
  topic text,
  resource_type text not null check (
    resource_type in (
      'summary', 'presentation', 'worksheet', 'homework',
      'exam_material', 'submission_material', 'important_link', 'other'
    )
  ),
  source_type text not null check (
    source_type in (
      'google_drive', 'google_classroom', 'mega', 'youtube', 'whatsapp', 'website', 'other'
    )
  ),
  external_url text not null check (external_url ~* '^https?://'),
  resource_date date,
  is_important boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table resources enable row level security;

create index if not exists resources_subject_id_idx on resources (subject_id);
create index if not exists resources_is_active_idx on resources (is_active);
create index if not exists resources_created_at_idx on resources (created_at desc);

create trigger resources_set_updated_at
  before update on resources
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- מבחנים והגשות
-- ---------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  title text not null,
  event_type text not null check (event_type in ('exam', 'assignment')),
  event_date date not null,
  description text,
  topics text[] not null default '{}',
  is_important boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table events enable row level security;

create index if not exists events_subject_id_idx on events (subject_id);
create index if not exists events_event_date_idx on events (event_date);

create trigger events_set_updated_at
  before update on events
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- קישור בין חומרים לאירועים (many-to-many)
-- ---------------------------------------------------------------------------
create table if not exists resource_events (
  resource_id uuid not null references resources (id) on delete cascade,
  event_id uuid not null references events (id) on delete cascade,
  primary key (resource_id, event_id)
);

alter table resource_events enable row level security;

-- ---------------------------------------------------------------------------
-- הודעות
-- ---------------------------------------------------------------------------
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table announcements enable row level security;

create index if not exists announcements_is_active_idx on announcements (is_active);

create trigger announcements_set_updated_at
  before update on announcements
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- דיווחים על קישורים שבורים
-- ---------------------------------------------------------------------------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references resources (id) on delete cascade,
  reason text not null check (reason in ('broken_link', 'wrong_content', 'other')),
  note text,
  status text not null default 'open' check (status in ('open', 'resolved', 'ignored')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table reports enable row level security;

create index if not exists reports_status_idx on reports (status);
create index if not exists reports_resource_id_idx on reports (resource_id);

create trigger reports_set_updated_at
  before update on reports
  for each row execute function set_updated_at();
