"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsActionState } from "@/app/admin/(protected)/settings/actions";
import { FieldWrapper, TextInput } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError, FormSuccess } from "@/components/ui/form-message";
import type { ClassSettings } from "@/lib/types";

const initialState: SettingsActionState = {};

export function SettingsForm({ settings }: { settings: ClassSettings }) {
  const [state, formAction] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <FieldWrapper label="שם הכיתה" htmlFor="name" required>
        <TextInput id="name" name="name" defaultValue={settings.name} required />
      </FieldWrapper>
      <FieldWrapper label="שנת לימודים" htmlFor="academic_year" required>
        <TextInput id="academic_year" name="academic_year" defaultValue={settings.academic_year} required />
      </FieldWrapper>
      <FieldWrapper label="תת־כותרת" htmlFor="subtitle">
        <TextInput id="subtitle" name="subtitle" defaultValue={settings.subtitle} />
      </FieldWrapper>
      <FormError message={state.error} />
      <FormSuccess message={state.success ? "הפרטים נשמרו בהצלחה." : null} />
      <SubmitButton className="self-start">שמירה</SubmitButton>
    </form>
  );
}
