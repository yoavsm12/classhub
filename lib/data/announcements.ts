import "server-only";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { Announcement } from "@/lib/types";
import type { AnnouncementInput } from "@/lib/validation/announcement";

export async function listAnnouncements(): Promise<Announcement[]> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`שגיאה בטעינת הודעות: ${error.message}`);
  return (data ?? []) as Announcement[];
}

export async function listActiveAnnouncements(limit?: number): Promise<Announcement[]> {
  const supabase = getSupabaseServiceClient();
  let query = supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`שגיאה בטעינת הודעות: ${error.message}`);
  return (data ?? []) as Announcement[];
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("announcements").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`שגיאה בטעינת הודעה: ${error.message}`);
  return data as Announcement | null;
}

export async function createAnnouncement(input: AnnouncementInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("announcements").insert({
    title: input.title,
    content: input.content,
    is_pinned: input.is_pinned,
    is_active: input.is_active,
  });
  if (error) throw new Error(`שגיאה בפרסום הודעה: ${error.message}`);
}

export async function updateAnnouncement(id: string, input: AnnouncementInput): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase
    .from("announcements")
    .update({
      title: input.title,
      content: input.content,
      is_pinned: input.is_pinned,
      is_active: input.is_active,
    })
    .eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון הודעה: ${error.message}`);
}

export async function setAnnouncementPinned(id: string, isPinned: boolean): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("announcements").update({ is_pinned: isPinned }).eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון נעיצה: ${error.message}`);
}

export async function setAnnouncementActive(id: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("announcements").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(`שגיאה בעדכון סטטוס הודעה: ${error.message}`);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(`שגיאה במחיקת הודעה: ${error.message}`);
}
