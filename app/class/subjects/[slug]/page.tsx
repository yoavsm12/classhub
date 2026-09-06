import { notFound } from "next/navigation";
import { getSubjectBySlug } from "@/lib/data/subjects";
import { getResourcesForSubject } from "@/lib/data/resources";
import { requireClassAccess } from "@/lib/auth/session";
import { RESOURCE_TYPE_OPTIONS, SOURCE_TYPE_OPTIONS, DEFAULT_SUBJECT_ICON } from "@/lib/constants";
import { ResourceCard } from "@/components/class/resource-card";
import { TextInput, Select } from "@/components/ui/field";

export default async function SubjectPage({ params, searchParams }: PageProps<"/class/subjects/[slug]">) {
  const { slug: rawSlug } = await params;
  // slugים שאינם ASCII (עברית) מגיעים מ-Next.js עדיין percent-encoded
  // (למשל "%D7%94..." במקום "הנדסת...") — יש לפענח לפני שמשווים למסד הנתונים.
  const slug = decodeURIComponent(rawSlug);
  const query = await searchParams;

  const access = await requireClassAccess();
  const subject = await getSubjectBySlug(slug);

  if (!subject || (!subject.is_active && access.kind !== "admin")) {
    notFound();
  }

  const allResources = await getResourcesForSubject(subject.id, access.kind !== "admin");

  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const resourceType = typeof query.type === "string" ? query.type : "";
  const sourceType = typeof query.source === "string" ? query.source : "";

  const filtered = allResources.filter((resource) => {
    if (q && !resource.title.toLowerCase().includes(q) && !(resource.topic ?? "").toLowerCase().includes(q)) {
      return false;
    }
    if (resourceType && resource.resource_type !== resourceType) return false;
    if (sourceType && resource.source_type !== sourceType) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{subject.icon || DEFAULT_SUBJECT_ICON}</span>
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{subject.name}</h1>
          {subject.description && <p className="text-sm text-neutral-500">{subject.description}</p>}
          <p className="text-xs text-neutral-400">{allResources.length} חומרים</p>
        </div>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row" method="GET">
        <TextInput name="q" defaultValue={q} placeholder="חיפוש בתוך המקצוע…" className="sm:flex-1" />
        <Select name="type" defaultValue={resourceType} className="sm:w-44">
          <option value="">כל סוגי החומר</option>
          {RESOURCE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select name="source" defaultValue={sourceType} className="sm:w-44">
          <option value="">כל המקורות</option>
          {SOURCE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </form>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400">לא נמצאו חומרים תואמים.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
