import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { ClassEvent, Resource, ResourceWithEvents, ResourceWithSubject } from "@/lib/types";
import type { ResourceInput } from "@/lib/validation/resource";

export interface ResourceFilters {
  subjectId?: string;
  sourceType?: string;
  resourceType?: string;
  onlyImportant?: boolean;
  onlyActive?: boolean;
  search?: string;
}

export async function listResources(filters: ResourceFilters = {}): Promise<ResourceWithSubject[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("resources")
    .select("*, subject:subjects(id, name, slug, icon)")
    .order("is_important", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.subjectId) query = query.eq("subject_id", filters.subjectId);
  if (filters.sourceType) query = query.eq("source_type", filters.sourceType);
  if (filters.resourceType) query = query.eq("resource_type", filters.resourceType);
  if (filters.onlyImportant) query = query.eq("is_important", true);
  if (filters.onlyActive !== undefined) query = query.eq("is_active", filters.onlyActive);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת חומרים: ${error.message}`);
  return (data ?? []) as unknown as ResourceWithSubject[];
}

export async function listRecentResources(limit = 8): Promise<ResourceWithSubject[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*, subject:subjects(id, name, slug, icon)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`שגיאה בטעינת חומרים אחרונים: ${error.message}`);
  return (data ?? []) as unknown as ResourceWithSubject[];
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("resources").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`שגיאה בטעינת חומר: ${error.message}`);
  return data as Resource | null;
}

export async function getResourceLinkedEventIds(resourceId: string): Promise<string[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("resource_events").select("event_id").eq("resource_id", resourceId);
  if (error) throw new Error(`שגיאה בטעינת אירועים מקושרים: ${error.message}`);
  return (data ?? []).map((row) => row.event_id as string);
}

export async function getResourceLinkedEvents(resourceId: string): Promise<ClassEvent[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("resource_events")
    .select("event:events(*)")
    .eq("resource_id", resourceId);
  if (error) throw new Error(`שגיאה בטעינת אירועים מקושרים: ${error.message}`);
  return (data ?? []).map((row) => row.event as unknown as ClassEvent).filter(Boolean);
}

export async function getResourcesForSubject(subjectId: string, onlyActive = true): Promise<ResourceWithEvents[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("resources")
    .select("*, resource_events(event:events(*))")
    .eq("subject_id", subjectId)
    .order("is_important", { ascending: false })
    .order("created_at", { ascending: false });

  if (onlyActive) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת חומרי מקצוע: ${error.message}`);

  return (data ?? []).map((row) => {
    const { resource_events, ...resource } = row as Resource & {
      resource_events: { event: ClassEvent }[];
    };
    return { ...resource, events: (resource_events ?? []).map((re) => re.event).filter(Boolean) };
  });
}

async function syncResourceEvents(resourceId: string, eventIds: string[]): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error: deleteError } = await supabase.from("resource_events").delete().eq("resource_id", resourceId);
  if (deleteError) throw new Error(`שגיאה בעדכון קישורי אירועים: ${deleteError.message}`);

  if (eventIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("resource_events")
    .insert(eventIds.map((event_id) => ({ resource_id: resourceId, event_id })));
  if (insertError) throw new Error(`שגיאה בעדכון קישורי אירועים: ${insertError.message}`);
}

export async function createResource(input: ResourceInput): Promise<Resource> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("resources")
    .insert({
      subject_id: input.subject_id,
      title: input.title,
      description: input.description || null,
      topic: input.topic || null,
      resource_type: input.resource_type,
      source_type: input.source_type,
      external_url: input.external_url,
      resource_date: input.resource_date || null,
      is_important: input.is_important,
      is_active: input.is_active,
    })
    .select("*")
    .single();

  if (error) throw new Error(`שגיאה ביצירת חומר: ${error.message}`);

  const resource = data as Resource;
  await syncResourceEvents(resource.id, input.linked_event_ids);
  return resource;
}

export async function updateResource(id: string, input: ResourceInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("resources")
    .update({
      subject_id: input.subject_id,
      title: input.title,
      description: input.description || null,
      topic: input.topic || null,
      resource_type: input.resource_type,
      source_type: input.source_type,
      external_url: input.external_url,
      resource_date: input.resource_date || null,
      is_important: input.is_important,
      is_active: input.is_active,
    })
    .eq("id", id);

  if (error) throw new Error(`שגיאה בעדכון חומר: ${error.message}`);
  await syncResourceEvents(id, input.linked_event_ids);
}

export async function setResourceActive(id: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("resources").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון סטטוס חומר: ${error.message}`);
}

export async function deleteResource(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת חומר: ${error.message}`);
}

export async function countActiveResources(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const { count, error } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  if (error) throw new Error(`שגיאה בספירת חומרים: ${error.message}`);
  return count ?? 0;
}
