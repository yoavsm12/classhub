import { notFound } from "next/navigation";
import { getHolidayById } from "@/lib/data/holidays";
import { HolidayForm } from "@/components/admin/holiday-form";
import { updateHolidayAction } from "@/app/admin/(protected)/holidays/actions";

export default async function EditHolidayPage({ params }: PageProps<"/admin/holidays/[id]/edit">) {
  const { id } = await params;
  const holiday = await getHolidayById(id);
  if (!holiday) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-neutral-900">עריכת חופשה</h1>
      <HolidayForm holiday={holiday} action={updateHolidayAction.bind(null, id)} />
    </div>
  );
}
