import { listSubjects, countSubjectDependents } from "@/lib/data/subjects";
import { toggleSubjectActiveAction, deleteSubjectAction, moveSubjectAction } from "@/app/admin/(protected)/subjects/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { DEFAULT_SUBJECT_ICON } from "@/lib/constants";

export default async function AdminSubjectsPage() {
  const subjects = await listSubjects();
  const dependents = await Promise.all(subjects.map((s) => countSubjectDependents(s.id)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">מקצועות</h1>
        <LinkButton href="/admin/subjects/new" size="sm">
          + מקצוע חדש
        </LinkButton>
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm text-neutral-400">עדיין לא נוספו מקצועות.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {subjects.map((subject, index) => {
            const dep = dependents[index];
            const hasDependents = dep.resources > 0 || dep.events > 0;
            const confirmMessage = hasDependents
              ? `למקצוע "${subject.name}" יש ${dep.resources} חומרים ו-${dep.events} אירועים. מחיקתו תמחק גם אותם. להמשיך?`
              : `למחוק את המקצוע "${subject.name}"?`;

            return (
              <Card key={subject.id} className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">{subject.icon || DEFAULT_SUBJECT_ICON}</span>
                <div className="min-w-40 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{subject.name}</span>
                    {!subject.is_active && <Badge tone="neutral">מוסתר</Badge>}
                  </div>
                  <div className="text-xs text-neutral-400">
                    /{subject.slug} · {dep.resources} חומרים · {dep.events} אירועים
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <form action={moveSubjectAction}>
                    <input type="hidden" name="id" value={subject.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="rounded-lg px-2 py-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                      aria-label="הזז למעלה"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveSubjectAction}>
                    <input type="hidden" name="id" value={subject.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === subjects.length - 1}
                      className="rounded-lg px-2 py-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
                      aria-label="הזז למטה"
                    >
                      ↓
                    </button>
                  </form>
                </div>

                <LinkButton href={`/admin/subjects/${subject.id}/edit`} variant="secondary" size="sm">
                  עריכה
                </LinkButton>

                <form action={toggleSubjectActiveAction}>
                  <input type="hidden" name="id" value={subject.id} />
                  <input type="hidden" name="next_active" value={(!subject.is_active).toString()} />
                  <button type="submit" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                    {subject.is_active ? "הסתר" : "הצג"}
                  </button>
                </form>

                <form action={deleteSubjectAction}>
                  <input type="hidden" name="id" value={subject.id} />
                  <ConfirmSubmitButton confirmMessage={confirmMessage} size="sm">
                    מחיקה
                  </ConfirmSubmitButton>
                </form>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
