import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { Report, ReportStatus, ReportWithResource } from "@/lib/types";
import type { ReportInput } from "@/lib/validation/report";

export async function listReports(status?: ReportStatus): Promise<ReportWithResource[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("reports")
    .select("*, resource:resources(id, title, external_url, subject_id, subject:subjects(id, name))")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת דיווחים: ${error.message}`);
  return (data ?? []) as unknown as ReportWithResource[];
}

export async function countOpenReports(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");
  if (error) throw new Error(`שגיאה בספירת דיווחים: ${error.message}`);
  return count ?? 0;
}

export async function createReport(input: ReportInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("reports").insert({
    resource_id: input.resource_id,
    reason: input.reason,
    note: input.note || null,
    status: "open",
  });
  if (error) throw new Error(`שגיאה בשליחת דיווח: ${error.message}`);
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("reports").update({ status }).eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון דיווח: ${error.message}`);
}

export type { Report };
