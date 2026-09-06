import { AnnouncementForm } from "@/components/admin/announcement-form";
import { createAnnouncementAction } from "@/app/admin/(protected)/announcements/actions";

export default function NewAnnouncementPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">הודעה חדשה</h1>
      <AnnouncementForm action={createAnnouncementAction} />
    </div>
  );
}
