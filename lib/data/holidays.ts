import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { Holiday } from "@/lib/types";
import type { HolidayInput } from "@/lib/validation/holiday";

export async function listHolidays(): Promise<Holiday[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("holidays").select("*").order("start_date", { ascending: true });
  if (error) throw new Error(`שגיאה בטעינת חופשות: ${error.message}`);
  return (data ?? []) as Holiday[];
}

export async function getHolidayById(id: string): Promise<Holiday | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("holidays").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`שגיאה בטעינת חופשה: ${error.message}`);
  return data as Holiday | null;
}

export async function createHoliday(input: HolidayInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("holidays").insert({
    title: input.title,
    start_date: input.start_date,
    end_date: input.end_date,
    description: input.description || null,
  });
  if (error) throw new Error(`שגיאה ביצירת חופשה: ${error.message}`);
}

export async function updateHoliday(id: string, input: HolidayInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("holidays")
    .update({
      title: input.title,
      start_date: input.start_date,
      end_date: input.end_date,
      description: input.description || null,
    })
    .eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון חופשה: ${error.message}`);
}

export async function deleteHoliday(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("holidays").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת חופשה: ${error.message}`);
}
