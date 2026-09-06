"use client";

import { useActionState } from "react";
import type { EventFormState } from "@/app/admin/(protected)/events/actions";
import { FieldWrapper, TextInput, TextArea, Select, CheckboxField } from "@/components/ui/field";
import { FormActions } from "@/components/admin/form-actions";
import { FormError } from "@/components/ui/form-message";
import { EVENT_TYPE_OPTIONS } from "@/lib/constants";
import type { ClassEvent, Resource, Subject } from "@/lib/types";

const initialState: EventFormState = {};

export function EventForm({
  event,
  subjects,
  resources,
  linkedResourceIds = [],
  action,
}: {
  event?: ClassEvent;
  subjects: Subject[];
  resources: Resource[];
  linkedResourceIds?: string[];
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="מקצוע" htmlFor="subject_id" required>
        <Select id="subject_id" name="subject_id" defaultValue={event?.subject_id} required>
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
        <TextInput id="title" name="title" defaultValue={event?.title} required />
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="סוג אירוע" htmlFor="event_type" required>
          <Select id="event_type" name="event_type" defaultValue={event?.event_type} required>
            {EVENT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FieldWrapper>

        <FieldWrapper label="תאריך" htmlFor="event_date" required>
          <TextInput id="event_date" name="event_date" type="date" defaultValue={event?.event_date} required />
        </FieldWrapper>
      </div>

      <FieldWrapper label="תיאור" htmlFor="description">
        <TextArea id="description" name="description" defaultValue={event?.description ?? ""} />
      </FieldWrapper>

      <FieldWrapper label="נושאים" htmlFor="topics" hint="מופרדים בפסיקים">
        <TextInput id="topics" name="topics" defaultValue={event?.topics.join(", ") ?? ""} />
      </FieldWrapper>

      {resources.length > 0 && (
        <FieldWrapper label="חומרים מקושרים" htmlFor="linked_resource_ids" hint="ניתן לבחור כמה (Ctrl/Cmd+קליק)">
          <Select
            id="linked_resource_ids"
            name="linked_resource_ids"
            multiple
            defaultValue={linkedResourceIds}
            className="min-h-28"
          >
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.title}
              </option>
            ))}
          </Select>
        </FieldWrapper>
      )}

      <CheckboxField id="is_important" name="is_important" defaultChecked={event?.is_important} label="סמן כחשוב ⭐" />

      <FormError message={state.error} />
      <FormActions isEdit={!!event} createLabel="יצירת אירוע" />
    </form>
  );
}
