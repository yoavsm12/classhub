import { notFound } from "next/navigation";
import { getAnnouncementById } from "@/lib/data/announcements";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { updateAnnouncementAction } from "@/app/admin/(protected)/announcements/actions";

export default async function EditAnnouncementPage({ params }: PageProps<"/admin/announcements/[id]/edit">) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);
  if (!announcement) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">עריכת הודעה</h1>
      <AnnouncementForm announcement={announcement} action={updateAnnouncementAction.bind(null, id)} />
    </div>
  );
}
