import { notFound } from "next/navigation";
import { getSubjectById } from "@/lib/data/subjects";
import { updateSubjectAction } from "@/app/admin/(protected)/subjects/actions";
import { SubjectForm } from "@/components/admin/subject-form";

export default async function EditSubjectPage({ params }: PageProps<"/admin/subjects/[id]/edit">) {
  const { id } = await params;
  const subject = await getSubjectById(id);
  if (!subject) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">עריכת מקצוע</h1>
      </div>
      <SubjectForm subject={subject} action={updateSubjectAction.bind(null, id)} />
    </div>
  );
}
