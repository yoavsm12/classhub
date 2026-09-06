import type { EventType, ReportReason, ReportStatus, ResourceType, SourceType } from "@/lib/types";

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  summary: "סיכום",
  presentation: "מצגת",
  worksheet: "דף תרגול",
  homework: "שיעורי בית",
  exam_material: "חומר למבחן",
  submission_material: "חומר להגשה",
  important_link: "קישור חשוב",
  other: "אחר",
};

export const RESOURCE_TYPE_OPTIONS = Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({
  value: value as ResourceType,
  label,
}));

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  google_drive: "Google Drive",
  google_classroom: "Google Classroom",
  mega: "MEGA",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  website: "אתר חיצוני",
  other: "אחר",
};

export const SOURCE_TYPE_OPTIONS = Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => ({
  value: value as SourceType,
  label,
}));

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  exam: "מבחן",
  assignment: "הגשה",
};

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => ({
  value: value as EventType,
  label,
}));

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  broken_link: "הקישור לא נפתח",
  wrong_content: "הקישור מוביל לתוכן שגוי",
  other: "אחר",
};

export const REPORT_REASON_OPTIONS = Object.entries(REPORT_REASON_LABELS).map(([value, label]) => ({
  value: value as ReportReason,
  label,
}));

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  open: "פתוח",
  resolved: "טופל",
  ignored: "התעלמות",
};

export const DEFAULT_SUBJECT_ICON = "📚";

export const DAY_OF_WEEK_LABELS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] as const;

export const DAY_OF_WEEK_OPTIONS = DAY_OF_WEEK_LABELS.map((label, value) => ({ value, label }));

/** ימי הלימוד הרלוונטיים לתצוגת ברירת המחדל (א'-ו', בלי שבת). */
export const SCHOOL_WEEK_DAYS = [0, 1, 2, 3, 4, 5] as const;

/** טווח לוח השנה של שנת הלימודים — מ-1 בספטמבר 2026 עד סוף אוגוסט 2027 (כולל ט׳ באב). */
export const CALENDAR_START_MONTH = { year: 2026, month: 9 }; // ספטמבר 2026 (month: 1-12)
export const CALENDAR_END_MONTH = { year: 2027, month: 8 }; // אוגוסט 2027

export const MONTH_NAMES_HE = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;
