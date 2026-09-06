import { listResources } from "@/lib/data/resources";
import { ResourceCard } from "@/components/class/resource-card";
import { TextInput } from "@/components/ui/field";

export default async function SearchPage({ searchParams }: PageProps<"/class/search">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const results = query ? await listResources({ search: query, onlyActive: true }) : [];

  return (
    <div className="flex flex-col gap-5">
      <form action="/class/search" method="GET">
        <TextInput name="q" type="search" defaultValue={query} placeholder="חיפוש חומר בכל הכיתה…" autoFocus />
      </form>

      {!query ? (
        <p className="text-sm text-neutral-400">הקלידו מילת חיפוש כדי למצוא חומרים.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-neutral-400">לא נמצאו חומרים התואמים ל-״{query}״.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-neutral-500">{results.length} תוצאות עבור ״{query}״</p>
          {results.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              subjectLabel={`${resource.subject.icon ?? ""} ${resource.subject.name}`.trim()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
