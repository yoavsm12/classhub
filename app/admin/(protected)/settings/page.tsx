import { getClassSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getClassSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">הגדרות הכיתה</h1>
        <p className="text-sm text-neutral-500">פרטים כלליים המוצגים לתלמידים.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
