import { HolidayForm } from "@/components/admin/holiday-form";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { createHolidayAction } from "@/app/admin/(protected)/holidays/actions";

export default async function NewHolidayPage({ searchParams }: PageProps<"/admin/holidays/new">) {
  const params = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <h1 className="text-xl font-bold text-neutral-900">חופשה/חג חדשים</h1>
      <HolidayForm action={createHolidayAction} />
    </div>
  );
}
