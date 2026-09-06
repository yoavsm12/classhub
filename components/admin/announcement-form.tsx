"use client";

import { useActionState } from "react";
import type { AnnouncementFormState } from "@/app/admin/(protected)/announcements/actions";
import { FieldWrapper, TextInput, TextArea, CheckboxField } from "@/components/ui/field";
import { FormActions } from "@/components/admin/form-actions";
import { FormError } from "@/components/ui/form-message";
import type { Announcement } from "@/lib/types";

const initialState: AnnouncementFormState = {};

export function AnnouncementForm({
  announcement,
  action,
}: {
  announcement?: Announcement;
  action: (state: AnnouncementFormState, formData: FormData) => Promise<AnnouncementFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="כותרת" htmlFor="title" required>
        <TextInput id="title" name="title" defaultValue={announcement?.title} required />
      </FieldWrapper>
      <FieldWrapper label="תוכן ההודעה" htmlFor="content" required>
        <TextArea id="content" name="content" defaultValue={announcement?.content} required className="min-h-32" />
      </FieldWrapper>
      <div className="flex flex-col gap-2">
        <CheckboxField id="is_pinned" name="is_pinned" defaultChecked={announcement?.is_pinned} label="נעץ הודעה זו למעלה" />
        <CheckboxField
          id="is_active"
          name="is_active"
          defaultChecked={announcement?.is_active ?? true}
          label="הודעה פעילה (מוצגת לתלמידים)"
        />
      </div>
      <FormError message={state.error} />
      <FormActions isEdit={!!announcement} createLabel="פרסום הודעה" />
    </form>
  );
}
