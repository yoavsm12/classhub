import Link from "next/link";
import { DEFAULT_SUBJECT_ICON } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import type { SubjectWithCount } from "@/lib/types";

export function SubjectCard({ subject }: { subject: SubjectWithCount }) {
  return (
    <Link href={`/class/subjects/${subject.slug}`}>
      <Card className="flex h-full flex-col items-center gap-2 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <span className="text-4xl">{subject.icon || DEFAULT_SUBJECT_ICON}</span>
        <h3 className="font-semibold text-neutral-900">{subject.name}</h3>
        {subject.description && <p className="line-clamp-2 text-xs text-neutral-500">{subject.description}</p>}
        <span className="mt-auto text-xs text-neutral-400">{subject.resource_count} חומרים</span>
      </Card>
    </Link>
  );
}
