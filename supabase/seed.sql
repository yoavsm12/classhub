-- ClassHub — נתוני דוגמה להרצה מקומית / הדגמה ראשונית.
-- להריץ אחרי המיגרציות: supabase db reset (מריץ אוטומטית) או ידנית ב-SQL editor.

insert into class_settings (id, name, academic_year, subtitle)
values (1, 'י״ד תוכנה', '2025/2026', 'מרכז החומרים הכיתתי')
on conflict (id) do update set
  name = excluded.name,
  academic_year = excluded.academic_year,
  subtitle = excluded.subtitle;

insert into subjects (id, name, slug, icon, description, display_order, is_active) values
  ('11111111-1111-1111-1111-111111111111', 'מתמטיקה', 'מתמטיקה', '📐', 'סיכומים, תרגילים ומבחנים בכל נושאי המתמטיקה.', 0, true),
  ('22222222-2222-2222-2222-222222222222', 'מדעי המחשב', 'מדעי-המחשב', '💻', 'חומרי לימוד בתכנות, מבני נתונים ואלגוריתמים.', 1, true),
  ('33333333-3333-3333-3333-333333333333', 'אנגלית', 'אנגלית', '🇬🇧', 'חומרי קריאה, אוצר מילים ותרגול דקדוק.', 2, true),
  ('44444444-4444-4444-4444-444444444444', 'היסטוריה', 'היסטוריה', '📜', 'סיכומים ומצגות לפי תקופות.', 3, true)
on conflict (id) do nothing;

insert into resources (
  id, subject_id, title, description, topic, resource_type, source_type, external_url, resource_date, is_important, is_active
) values
  (
    'a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
    'סיכום פרק הטריגונומטריה', 'סיכום מסודר עם דוגמאות פתורות.', 'טריגונומטריה',
    'summary', 'google_drive', 'https://drive.google.com/drive/folders/example-trig', '2026-01-15', true, true
  ),
  (
    'a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
    'דף תרגול משוואות ריבועיות', 'עשרים תרגילים ברמות קושי עולות.', 'משוואות ריבועיות',
    'worksheet', 'google_drive', 'https://drive.google.com/drive/folders/example-quad', '2026-01-20', false, true
  ),
  (
    'a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
    'מצגת מבוא לרקורסיה', 'מצגת השיעור עם דוגמאות קוד.', 'רקורסיה',
    'presentation', 'google_classroom', 'https://classroom.google.com/example-recursion', '2026-01-10', false, true
  ),
  (
    'a4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222',
    'סרטון הסבר על מבני נתונים', 'הסבר ויזואלי על מחסניות ותורים.', 'מבני נתונים',
    'summary', 'youtube', 'https://www.youtube.com/watch?v=example', null, false, true
  ),
  (
    'a5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333',
    'רשימת אוצר מילים ליחידה 3', 'כל המילים הנדרשות למבחן הקרוב.', 'Unit 3 Vocabulary',
    'exam_material', 'google_drive', 'https://drive.google.com/drive/folders/example-vocab', '2026-01-25', true, true
  )
on conflict (id) do nothing;

insert into events (
  id, subject_id, title, event_type, event_date, description, topics, is_important
) values
  (
    'e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
    'מבחן טריגונומטריה', 'exam', '2026-02-01', 'מבחן מסכם על כל נושאי הטריגונומטריה שנלמדו.',
    array['טריגונומטריה', 'משוואות ריבועיות'], true
  ),
  (
    'e2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333',
    'מבחן אוצר מילים - יחידה 3', 'exam', '2026-02-05', 'מבחן על כל המילים ביחידה 3.',
    array['Unit 3 Vocabulary'], true
  ),
  (
    'e3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
    'הגשת תרגיל רקורסיה', 'assignment', '2026-01-30', 'הגשת פתרון תרגיל הבית על רקורסיה דרך Classroom.',
    array['רקורסיה'], false
  )
on conflict (id) do nothing;

insert into resource_events (resource_id, event_id) values
  ('a1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111'),
  ('a5555555-5555-5555-5555-555555555555', 'e2222222-2222-2222-2222-222222222222'),
  ('a3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333')
on conflict do nothing;

insert into announcements (title, content, is_pinned, is_active) values
  ('ברוכים הבאים ל-ClassHub!', 'כאן תמצאו את כל חומרי הלימוד של הכיתה במקום אחד. השתמשו בקוד הגישה שקיבלתם כדי להיכנס.', true, true),
  ('שינוי במועד מבחן הטריגונומטריה', 'המבחן נדחה בשבוע ויתקיים ב-01/02. בהצלחה!', false, true)
on conflict do nothing;
