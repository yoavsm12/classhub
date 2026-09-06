import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { ScheduleSlot, ScheduleSlotWithSubject } from "@/lib/types";
import type { ScheduleSlotInput } from "@/lib/validation/schedule";

export async function listScheduleSlots(): Promise<ScheduleSlotWithSubject[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("schedule_slots")
    .select("*, subject:subjects(id, name, slug, icon)")
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(`שגיאה בטעינת מערכת השעות: ${error.message}`);
  return (data ?? []) as unknown as ScheduleSlotWithSubject[];
}

export async function getScheduleSlotById(id: string): Promise<ScheduleSlot | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("schedule_slots").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`שגיאה בטעינת שיעור: ${error.message}`);
  return data as ScheduleSlot | null;
}

function normalizeTime(value: string): string {
  // input type="time" נותן "HH:MM" — משלימים שניות לעמידה בטיפוס time של Postgres.
  return value.length === 5 ? `${value}:00` : value;
}

export async function createScheduleSlot(input: ScheduleSlotInput): Promise<ScheduleSlot> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("schedule_slots")
    .insert({
      subject_id: input.subject_id,
      day_of_week: input.day_of_week,
      start_time: normalizeTime(input.start_time),
      end_time: normalizeTime(input.end_time),
      teacher: input.teacher || null,
      room: input.room || null,
      group_label: input.group_label || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(`שגיאה ביצירת שיעור: ${error.message}`);
  return data as ScheduleSlot;
}

export async function updateScheduleSlot(id: string, input: ScheduleSlotInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("schedule_slots")
    .update({
      subject_id: input.subject_id,
      day_of_week: input.day_of_week,
      start_time: normalizeTime(input.start_time),
      end_time: normalizeTime(input.end_time),
      teacher: input.teacher || null,
      room: input.room || null,
      group_label: input.group_label || null,
    })
    .eq("id", id);

  if (error) throw new Error(`שגיאה בעדכון שיעור: ${error.message}`);
}

export async function deleteScheduleSlot(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("schedule_slots").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת שיעור: ${error.message}`);
}
