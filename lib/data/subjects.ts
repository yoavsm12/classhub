import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { Subject, SubjectWithCount } from "@/lib/types";
import type { SubjectInput } from "@/lib/validation/subject";

export async function listSubjects(options?: { onlyActive?: boolean }): Promise<Subject[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase.from("subjects").select("*").order("display_order", { ascending: true });

  if (options?.onlyActive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת מקצועות: ${error.message}`);
  return (data ?? []) as Subject[];
}

export async function listSubjectsWithResourceCounts(): Promise<SubjectWithCount[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("*, resources(count)")
    .order("display_order", { ascending: true });

  if (error) throw new Error(`שגיאה בטעינת מקצועות: ${error.message}`);

  return (data ?? []).map((row) => {
    const { resources, ...subject } = row as Subject & { resources: { count: number }[] };
    return { ...subject, resource_count: resources?.[0]?.count ?? 0 };
  });
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("subjects").select("*").eq("slug", slug).maybeSingle();

  if (error) throw new Error(`שגיאה בטעינת מקצוע: ${error.message}`);
  return data as Subject | null;
}

export async function getSubjectById(id: string): Promise<Subject | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("subjects").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`שגיאה בטעינת מקצוע: ${error.message}`);
  return data as Subject | null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = getSupabaseServiceClient();
  let query = supabase.from("subjects").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`שגיאה בבדיקת כתובת מקצוע: ${error.message}`);
  return !!data;
}

export async function createSubject(input: SubjectInput): Promise<Subject> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("subjects")
    .insert({
      name: input.name,
      slug: input.slug,
      icon: input.icon || null,
      description: input.description || null,
      display_order: input.display_order,
      is_active: input.is_active,
    })
    .select("*")
    .single();

  if (error) throw new Error(`שגיאה ביצירת מקצוע: ${error.message}`);
  return data as Subject;
}

export async function updateSubject(id: string, input: SubjectInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("subjects")
    .update({
      name: input.name,
      slug: input.slug,
      icon: input.icon || null,
      description: input.description || null,
      display_order: input.display_order,
      is_active: input.is_active,
    })
    .eq("id", id);

  if (error) throw new Error(`שגיאה בעדכון מקצוע: ${error.message}`);
}

export async function setSubjectActive(id: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("subjects").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון סטטוס מקצוע: ${error.message}`);
}

export async function deleteSubject(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת מקצוע: ${error.message}`);
}

export async function countSubjectDependents(id: string): Promise<{ resources: number; events: number }> {
  const supabase = getSupabaseServiceClient();
  const [{ count: resources }, { count: events }] = await Promise.all([
    supabase.from("resources").select("id", { count: "exact", head: true }).eq("subject_id", id),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("subject_id", id),
  ]);
  return { resources: resources ?? 0, events: events ?? 0 };
}

export async function reorderSubjects(orderedIds: string[]): Promise<void> {
  const supabase = getSupabaseServiceClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("subjects").update({ display_order: index }).eq("id", id))
  );
}
