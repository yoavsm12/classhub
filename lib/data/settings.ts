import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { ClassSettings } from "@/lib/types";
import type { ClassSettingsInput } from "@/lib/validation/settings";

const DEFAULTS: ClassSettings = {
  id: 1,
  name: "הכיתה שלנו",
  academic_year: "תשפ״ו",
  subtitle: "מרכז החומרים הכיתתי",
  updated_at: new Date(0).toISOString(),
};

export async function getClassSettings(): Promise<ClassSettings> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("class_settings").select("*").eq("id", 1).maybeSingle();

  if (error) throw new Error(`שגיאה בטעינת פרטי הכיתה: ${error.message}`);
  return (data as ClassSettings | null) ?? DEFAULTS;
}

export async function updateClassSettings(input: ClassSettingsInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("class_settings").upsert({
    id: 1,
    name: input.name,
    academic_year: input.academic_year,
    subtitle: input.subtitle || "",
  });

  if (error) throw new Error(`שגיאה בעדכון פרטי הכיתה: ${error.message}`);
}
