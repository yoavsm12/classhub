"use client";

import { useActionState } from "react";
import type { HolidayFormState } from "@/app/admin/(protected)/holidays/actions";
import { FieldWrapper, TextInput, TextArea } from "@/components/ui/field";
import { FormActions } from "@/components/admin/form-actions";
import { FormError } from "@/components/ui/form-message";
import type { Holiday } from "@/lib/types";

const initialState: HolidayFormState = {};

export function HolidayForm({
  holiday,
  action,
}: {
  holiday?: Holiday;
  action: (state: HolidayFormState, formData: FormData) => Promise<HolidayFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="שם החופשה/חג" htmlFor="title" required>
        <TextInput id="title" name="title" defaultValue={holiday?.title} required placeholder="לדוגמה: חופשת סוכות" />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="תאריך התחלה" htmlFor="start_date" required>
          <TextInput id="start_date" name="start_date" type="date" defaultValue={holiday?.start_date} required />
        </FieldWrapper>
        <FieldWrapper label="תאריך סיום" htmlFor="end_date" required hint="כולל, גם אם יום אחד — אותו תאריך">
          <TextInput id="end_date" name="end_date" type="date" defaultValue={holiday?.end_date} required />
        </FieldWrapper>
      </div>

      <FieldWrapper label="הערה" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={holiday?.description ?? ""} />
      </FieldWrapper>

      <FormError message={state.error} />
      <FormActions isEdit={!!holiday} createLabel="הוספת חופשה" />
    </form>
  );
}
