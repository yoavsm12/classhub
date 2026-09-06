"use client";

import { useActionState, useState } from "react";
import { reportResourceAction, type ReportActionState } from "@/app/actions/report";
import { REPORT_REASON_OPTIONS } from "@/lib/constants";
import { Select, TextArea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError, FormSuccess } from "@/components/ui/form-message";

const initialState: ReportActionState = {};

export function ReportButton({ resourceId }: { resourceId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(reportResourceAction, initialState);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-neutral-400 underline-offset-2 hover:text-neutral-600 hover:underline"
      >
        הקישור לא עובד?
      </button>
    );
  }

  if (state.success) {
    return <FormSuccess message="תודה! הדיווח נשלח למנהל הכיתה." />;
  }

  return (
    <form action={formAction} className="mt-2 flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <input type="hidden" name="resource_id" value={resourceId} />
      <Select name="reason" defaultValue={REPORT_REASON_OPTIONS[0].value} required>
        {REPORT_REASON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <TextArea name="note" placeholder="פרטים נוספים (לא חובה)" className="min-h-16" />
      <FormError message={state.error} />
      <div className="flex gap-2">
        <SubmitButton size="sm" pendingLabel="שולח…">
          שליחת דיווח
        </SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
        >
          ביטול
        </button>
      </div>
    </form>
  );
}
