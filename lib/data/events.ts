import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { ClassEvent, EventType, EventWithResources, EventWithSubject, Resource } from "@/lib/types";
import type { EventInput } from "@/lib/validation/event";

function parseTopics(topics: string | undefined): string[] {
  if (!topics) return [];
  return topics
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function listEventsWithSubject(): Promise<EventWithSubject[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, subject:subjects(id, name, slug, icon)")
    .order("event_date", { ascending: true });

  if (error) throw new Error(`שגיאה בטעינת אירועים: ${error.message}`);
  return (data ?? []) as unknown as EventWithSubject[];
}

export async function listUpcomingEvents(limit?: number, eventType?: EventType): Promise<EventWithSubject[]> {
  const supabase = getSupabaseServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  let query = supabase
    .from("events")
    .select("*, subject:subjects(id, name, slug, icon)")
    .gte("event_date", today)
    .order("event_date", { ascending: true });

  if (eventType) query = query.eq("event_type", eventType);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת אירועים קרובים: ${error.message}`);
  return (data ?? []) as unknown as EventWithSubject[];
}

export async function getEventById(id: string): Promise<ClassEvent | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`שגיאה בטעינת אירוע: ${error.message}`);
  return data as ClassEvent | null;
}

export async function getEventLinkedResourceIds(eventId: string): Promise<string[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("resource_events").select("resource_id").eq("event_id", eventId);
  if (error) throw new Error(`שגיאה בטעינת חומרים מקושרים: ${error.message}`);
  return (data ?? []).map((row) => row.resource_id as string);
}

export async function listEventsWithLinkedResources(eventType?: EventType): Promise<EventWithResources[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("events")
    .select("*, subject:subjects(id, name, slug, icon), resource_events(resource:resources(*))")
    .order("event_date", { ascending: true });

  if (eventType) query = query.eq("event_type", eventType);

  const { data, error } = await query;

  if (error) throw new Error(`שגיאה בטעינת אירועים: ${error.message}`);

  return (data ?? []).map((row) => {
    const { resource_events, ...event } = row as EventWithSubject & {
      resource_events: { resource: Resource }[];
    };
    return { ...event, resources: (resource_events ?? []).map((re) => re.resource).filter(Boolean) };
  });
}

async function syncEventResources(eventId: string, resourceIds: string[]): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error: deleteError } = await supabase.from("resource_events").delete().eq("event_id", eventId);
  if (deleteError) throw new Error(`שגיאה בעדכון קישורי חומרים: ${deleteError.message}`);

  if (resourceIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("resource_events")
    .insert(resourceIds.map((resource_id) => ({ event_id: eventId, resource_id })));
  if (insertError) throw new Error(`שגיאה בעדכון קישורי חומרים: ${insertError.message}`);
}

export async function createEvent(input: EventInput): Promise<ClassEvent> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      subject_id: input.subject_id,
      title: input.title,
      event_type: input.event_type,
      event_date: input.event_date,
      description: input.description || null,
      topics: parseTopics(input.topics),
      is_important: input.is_important,
    })
    .select("*")
    .single();

  if (error) throw new Error(`שגיאה ביצירת אירוע: ${error.message}`);

  const event = data as ClassEvent;
  await syncEventResources(event.id, input.linked_resource_ids);
  return event;
}

export async function updateEvent(id: string, input: EventInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("events")
    .update({
      subject_id: input.subject_id,
      title: input.title,
      event_type: input.event_type,
      event_date: input.event_date,
      description: input.description || null,
      topics: parseTopics(input.topics),
      is_important: input.is_important,
    })
    .eq("id", id);

  if (error) throw new Error(`שגיאה בעדכון אירוע: ${error.message}`);
  await syncEventResources(id, input.linked_resource_ids);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת אירוע: ${error.message}`);
}

export async function countUpcomingEvents(): Promise<number> {
  const supabase = getSupabaseServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .gte("event_date", today);
  if (error) throw new Error(`שגיאה בספירת אירועים: ${error.message}`);
  return count ?? 0;
}
