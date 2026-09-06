import { listSubjectsWithResourceCounts } from "@/lib/data/subjects";
import { SubjectCard } from "@/components/class/subject-card";

export default async function ClassHomePage() {
  const subjects = await listSubjectsWithResourceCounts();
  const activeSubjects = subjects.filter((s) => s.is_active);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-neutral-900">מקצועות</h1>
      {activeSubjects.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא נוספו מקצועות.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {activeSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
