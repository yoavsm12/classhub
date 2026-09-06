import { AnnouncementForm } from "@/components/admin/announcement-form";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { createAnnouncementAction } from "@/app/admin/(protected)/announcements/actions";

export default async function NewAnnouncementPage({ searchParams }: PageProps<"/admin/announcements/new">) {
  const params = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <h1 className="text-xl font-bold text-neutral-900">הודעה חדשה</h1>
      <AnnouncementForm action={createAnnouncementAction} />
    </div>
  );
}
