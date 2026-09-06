"use client";

import { useActionState } from "react";
import type { ResourceFormState } from "@/app/admin/(protected)/resources/actions";
import { FieldWrapper, TextInput, TextArea, Select, CheckboxField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-message";
import { RESOURCE_TYPE_OPTIONS, SOURCE_TYPE_OPTIONS, EVENT_TYPE_LABELS } from "@/lib/constants";
import type { ClassEvent, Resource, Subject } from "@/lib/types";

const initialState: ResourceFormState = {};

export function ResourceForm({
  resource,
  subjects,
  events,
  linkedEventIds = [],
  action,
}: {
  resource?: Resource;
  subjects: Subject[];
  events: ClassEvent[];
  linkedEventIds?: string[];
  action: (state: ResourceFormState, formData: FormData) => Promise<ResourceFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="מקצוע" htmlFor="subject_id" required>
        <Select id="subject_id" name="subject_id" defaultValue={resource?.subject_id} required>
          <option value="" disabled>
            בחרו מקצוע
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.icon} {subject.name}
            </option>
          ))}
        </Select>
      </FieldWrapper>

      <FieldWrapper label="כותרת" htmlFor="title" required>
        <TextInput id="title" name="title" defaultValue={resource?.title} required />
      </FieldWrapper>

      <FieldWrapper label="תיאור קצר" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={resource?.description ?? ""} />
      </FieldWrapper>

      <FieldWrapper label="נושא" htmlFor="topic">
        <TextInput id="topic" name="topic" defaultValue={resource?.topic ?? ""} />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="סוג חומר" htmlFor="resource_type" required>
          <Select id="resource_type" name="resource_type" defaultValue={resource?.resource_type} required>
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper label="מקור החומר" htmlFor="source_type" required>
          <Select id="source_type" name="source_type" defaultValue={resource?.source_type} required>
            {SOURCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="קישור חיצוני" htmlFor="external_url" required hint="לינק ל-Google Drive / YouTube / כל מקור אחר">
        <TextInput
          id="external_url"
          name="external_url"
          type="url"
          dir="ltr"
          placeholder="https://"
          defaultValue={resource?.external_url}
          required
        />
      </FieldWrapper>

      <FieldWrapper label="תאריך החומר" htmlFor="resource_date" hint="אופציונלי">
        <TextInput id="resource_date" name="resource_date" type="date" defaultValue={resource?.resource_date ?? ""} />
      </FieldWrapper>

      {events.length > 0 && (
        <FieldWrapper label="קישור למבחן/הגשה" htmlFor="linked_event_ids" hint="ניתן לבחור כמה (Ctrl/Cmd+קליק)">
          <Select
            id="linked_event_ids"
            name="linked_event_ids"
            multiple
            defaultValue={linkedEventIds}
            className="min-h-28"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {EVENT_TYPE_LABELS[event.event_type]}: {event.title}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      )}

      <div className="flex flex-col gap-2">
        <CheckboxField id="is_important" name="is_important" defaultChecked={resource?.is_important} label="סמן כחשוב ⭐" />
        <CheckboxField
          id="is_active"
          name="is_active"
          defaultChecked={resource?.is_active ?? true}
          label="חומר פעיל (מוצג לתלמידים)"
        />
      </div>

      <FormError message={state.error} />
      <SubmitButton className="self-start">{resource ? "שמירת שינויים" : "יצירת חומר"}</SubmitButton>
    </form>
  );
}
