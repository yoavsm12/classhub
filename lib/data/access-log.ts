import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { startOfTodayInTimeZone } from "@/lib/utils";

/**
 * רושם כניסה מוצלחת ללוג (ל-"כניסות היום" בדשבורד).
 * לא זורק — כשל ברישום לא אמור לחסום כניסה של תלמיד לאתר.
 */
export async function logGuestEntry(): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.from("access_log").insert({ kind: "guest" });
    if (error) console.error("שגיאה ברישום כניסה ל-access_log:", error.message);
  } catch (err) {
    console.error("שגיאה ברישום כניסה ל-access_log:", err);
  }
}

export async function countTodayEntries(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const since = startOfTodayInTimeZone().toISOString();
  const { count, error } = await supabase
    .from("access_log")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);
  if (error) throw new Error(`שגיאה בספירת כניסות: ${error.message}`);
  return count ?? 0;
}
