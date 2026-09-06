import { listReports } from "@/lib/data/reports";
import { setReportStatusAction } from "@/app/admin/(protected)/reports/actions";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { ReportStatus } from "@/lib/types";

const statusTone: Record<ReportStatus, "warning" | "success" | "neutral"> = {
  open: "warning",
  resolved: "success",
  ignored: "neutral",
};

export default async function AdminReportsPage({ searchParams }: PageProps<"/admin/reports">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? (query.status as ReportStatus) : undefined;

  const reports = await listReports(status);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">דיווחים על קישורים</h1>
        <p className="text-sm text-neutral-500">דיווחים שהתלמידים שלחו על חומרים עם קישור שלא עובד.</p>
      </div>

      <div className="flex gap-2 text-sm">
        {(["open", "resolved", "ignored"] as const).map((s) => (
          <a
            key={s}
            href={`/admin/reports?status=${s}`}
            className={`rounded-lg px-3 py-1.5 ${status === s ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}
          >
            {REPORT_STATUS_LABELS[s]}
          </a>
        ))}
        <a href="/admin/reports" className={`rounded-lg px-3 py-1.5 ${!status ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>
          הכול
        </a>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-neutral-400">אין דיווחים להצגה.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <Card key={report.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={statusTone[report.status]}>{REPORT_STATUS_LABELS[report.status]}</Badge>
                    <span className="font-semibold text-neutral-900">{report.resource.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {report.resource.subject.name} · {REPORT_REASON_LABELS[report.reason]} ·{" "}
                    {formatDateTime(report.created_at)}
                  </p>
                  {report.note && <p className="mt-1 text-sm text-neutral-600">&ldquo;{report.note}&rdquo;</p>}
                  <p className="mt-1 truncate text-xs text-neutral-400 ltr-nums">{report.resource.external_url}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={report.resource.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100"
                >
                  בדוק קישור ↗
                </a>
                <LinkButton href={`/admin/resources/${report.resource.id}/edit`} variant="secondary" size="sm">
                  ערוך חומר
                </LinkButton>
                {report.status !== "resolved" && (
                  <form action={setReportStatusAction}>
                    <input type="hidden" name="id" value={report.id} />
                    <input type="hidden" name="status" value="resolved" />
                    <button type="submit" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                      סמן כטופל
                    </button>
                  </form>
                )}
                {report.status !== "ignored" && (
                  <form action={setReportStatusAction}>
                    <input type="hidden" name="id" value={report.id} />
                    <input type="hidden" name="status" value="ignored" />
                    <button type="submit" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                      התעלם
                    </button>
                  </form>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
