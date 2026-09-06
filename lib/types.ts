/** טיפוסי דומיין המשקפים את סכמת מסד הנתונים ב-Supabase (ראו supabase/migrations). */

export type ResourceType =
  | "summary" // סיכום
  | "presentation" // מצגת
  | "worksheet" // דף תרגול
  | "homework" // שיעורי בית
  | "exam_material" // חומר למבחן
  | "submission_material" // חומר להגשה
  | "important_link" // קישור חשוב
  | "other"; // אחר

export type SourceType =
  | "google_drive"
  | "google_classroom"
  | "mega"
  | "youtube"
  | "whatsapp"
  | "website"
  | "other";

export type EventType = "exam" | "assignment";

export type ReportReason = "broken_link" | "wrong_content" | "other";
export type ReportStatus = "open" | "resolved" | "ignored";

export interface ClassSettings {
  id: number;
  name: string;
  academic_year: string;
  subtitle: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  topic: string | null;
  resource_type: ResourceType;
  source_type: SourceType;
  external_url: string;
  resource_date: string | null;
  is_important: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassEvent {
  id: string;
  subject_id: string;
  title: string;
  event_type: EventType;
  event_date: string;
  description: string | null;
  topics: string[];
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  resource_id: string;
  reason: ReportReason;
  note: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

/** ישויות עם יחסים (joins) שנטענים לצורך תצוגה. */
export interface ResourceWithSubject extends Resource {
  subject: Pick<Subject, "id" | "name" | "slug" | "icon">;
}

export interface ResourceWithEvents extends Resource {
  events: ClassEvent[];
}

export interface EventWithSubject extends ClassEvent {
  subject: Pick<Subject, "id" | "name" | "slug" | "icon">;
}

export interface EventWithResources extends EventWithSubject {
  resources: Resource[];
}

export interface ReportWithResource extends Report {
  resource: Pick<Resource, "id" | "title" | "external_url" | "subject_id"> & {
    subject: Pick<Subject, "id" | "name">;
  };
}

export interface SubjectWithCount extends Subject {
  resource_count: number;
}

export interface ScheduleSlot {
  id: string;
  subject_id: string;
  day_of_week: number; // 0=ראשון ... 6=שבת
  start_time: string; // "HH:MM:SS"
  end_time: string;
  teacher: string | null;
  room: string | null;
  group_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleSlotWithSubject extends ScheduleSlot {
  subject: Pick<Subject, "id" | "name" | "slug" | "icon">;
}

export interface Holiday {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
