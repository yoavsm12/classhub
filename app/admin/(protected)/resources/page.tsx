import { listResources } from "@/lib/data/resources";
import { SavedBanner, isSaved } from "@/components/admin/saved-banner";
import { listSubjects } from "@/lib/data/subjects";
import { toggleResourceActiveAction, deleteResourceAction } from "@/app/admin/(protected)/resources/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, TextInput } from "@/components/ui/field";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { RESOURCE_TYPE_LABELS, RESOURCE_TYPE_OPTIONS, SOURCE_TYPE_LABELS, SOURCE_TYPE_OPTIONS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function AdminResourcesPage({ searchParams }: PageProps<"/admin/resources">) {
  const query = await searchParams;
  const subjectId = typeof query.subject === "string" ? query.subject : "";
  const sourceType = typeof query.source === "string" ? query.source : "";
  const resourceType = typeof query.type === "string" ? query.type : "";
  const status = typeof query.status === "string" ? query.status : "";
  const important = query.important === "1";
  const search = typeof query.q === "string" ? query.q : "";

  const [resources, subjects] = await Promise.all([
    listResources({
      subjectId: subjectId || undefined,
      sourceType: sourceType || undefined,
      resourceType: resourceType || undefined,
      onlyImportant: important || undefined,
      onlyActive: status === "active" ? true : status === "hidden" ? false : undefined,
      search: search || undefined,
    }),
    listSubjects(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <SavedBanner show={isSaved(query)} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">חומרים</h1>
        <LinkButton href="/admin/resources/new" size="sm">
          + חומר חדש
        </LinkButton>
      </div>

      <form className="grid grid-cols-2 gap-2 sm:grid-cols-3" method="GET">
        <TextInput name="q" defaultValue={search} placeholder="חיפוש…" className="col-span-2 sm:col-span-1" />
        <Select name="subject" defaultValue={subjectId}>
          <option value="">כל המקצועות</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select name="type" defaultValue={resourceType}>
          <option value="">כל הסוגים</option>
          {RESOURCE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select name="source" defaultValue={sourceType}>
          <option value="">כל המקורות</option>
          {SOURCE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select name="status" defaultValue={status}>
          <option value="">הכול</option>
          <option value="active">פעילים</option>
          <option value="hidden">מוסתרים</option>
        </Select>
        <label className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          <input type="checkbox" name="important" value="1" defaultChecked={important} className="h-4 w-4" />
          חשובים בלבד
        </label>
        <button type="submit" className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white">
          סינון
        </button>
      </form>

      {resources.length === 0 ? (
        <p className="text-sm text-neutral-400">לא נמצאו חומרים.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-wrap items-center gap-3">
              <div className="min-w-48 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-neutral-900">{resource.title}</span>
                  {resource.is_important && <Badge tone="warning">⭐</Badge>}
                  {!resource.is_active && <Badge tone="neutral">מוסתר</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-neutral-400">
                  <span>
                    {resource.subject.icon} {resource.subject.name}
                  </span>
                  <span>· {RESOURCE_TYPE_LABELS[resource.resource_type]}</span>
                  <span>· {SOURCE_TYPE_LABELS[resource.source_type]}</span>
                  <span>· {formatDate(resource.created_at)}</span>
                </div>
              </div>

              <LinkButton href={`/admin/resources/${resource.id}/edit`} variant="secondary" size="sm">
                עריכה
              </LinkButton>

              <form action={toggleResourceActiveAction}>
                <input type="hidden" name="id" value={resource.id} />
                <input type="hidden" name="next_active" value={(!resource.is_active).toString()} />
                <button type="submit" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                  {resource.is_active ? "הסתר" : "הצג"}
                </button>
              </form>

              <form action={deleteResourceAction}>
                <input type="hidden" name="id" value={resource.id} />
                <ConfirmSubmitButton confirmMessage={`למחוק את החומר "${resource.title}"? לא ניתן לשחזר.`} size="sm">
                  מחיקה
                </ConfirmSubmitButton>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
