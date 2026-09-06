import { SubjectForm } from "@/components/admin/subject-form";
import { createSubjectAction } from "@/app/admin/(protected)/subjects/actions";

export default function NewSubjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">מקצוע חדש</h1>
      </div>
      <SubjectForm action={createSubjectAction} />
    </div>
  );
}
