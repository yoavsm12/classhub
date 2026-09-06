import { SubjectForm } from "@/components/admin/subject-form";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { createSubjectAction } from "@/app/admin/(protected)/subjects/actions";

export default async function NewSubjectPage({ searchParams }: PageProps<"/admin/subjects/new">) {
  const params = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(params)} message="נשמר בהצלחה ✓ אפשר להוסיף עוד" />
      <div>
        <h1 className="text-xl font-bold text-neutral-900">מקצוע חדש</h1>
      </div>
      <SubjectForm action={createSubjectAction} />
    </div>
  );
}
