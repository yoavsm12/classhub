import { requireClassAccess } from "@/lib/auth/session";
import { getClassSettings } from "@/lib/data/settings";
import { ClassHeader } from "@/components/class/header";
import { BackButton } from "@/components/class/back-button";

export default async function ClassLayout({ children }: LayoutProps<"/class">) {
  const access = await requireClassAccess();
  const settings = await getClassSettings();

  return (
    <div className="flex min-h-dvh flex-col">
      <ClassHeader settings={settings} access={access} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <BackButton />
        {children}
      </main>
    </div>
  );
}
