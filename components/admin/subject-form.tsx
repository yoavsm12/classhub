"use client";

import { useActionState } from "react";
import type { SubjectFormState } from "@/app/admin/(protected)/subjects/actions";
import { FieldWrapper, TextInput, TextArea, CheckboxField } from "@/components/ui/field";
import { FormActions } from "@/components/admin/form-actions";
import { FormError } from "@/components/ui/form-message";
import type { Subject } from "@/lib/types";

const initialState: SubjectFormState = {};

export function SubjectForm({
  subject,
  action,
}: {
  subject?: Subject;
  action: (state: SubjectFormState, formData: FormData) => Promise<SubjectFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="שם המקצוע" htmlFor="name" required>
        <TextInput id="name" name="name" defaultValue={subject?.name} required />
      </FieldWrapper>
      <FieldWrapper label="כתובת (slug)" htmlFor="slug" hint="ריק = ייווצר אוטומטית מהשם">
        <TextInput id="slug" name="slug" defaultValue={subject?.slug} dir="ltr" placeholder="לדוגמה: מתמטיקה" />
      </FieldWrapper>
      <FieldWrapper label="אייקון / אמוג'י" htmlFor="icon">
        <TextInput id="icon" name="icon" defaultValue={subject?.icon ?? ""} placeholder="📐" className="w-24" />
      </FieldWrapper>
      <FieldWrapper label="תיאור קצר" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={subject?.description ?? ""} />
      </FieldWrapper>
      <input type="hidden" name="display_order" value={subject?.display_order ?? 0} />
      <CheckboxField id="is_active" name="is_active" defaultChecked={subject?.is_active ?? true} label="מקצוע פעיל (מוצג לתלמידים)" />
      <FormError message={state.error} />
      <FormActions isEdit={!!subject} createLabel="יצירת מקצוע" />
    </form>
  );
}
