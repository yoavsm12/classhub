"use client";

import { useActionState } from "react";
import type { ScheduleFormState } from "@/app/admin/(protected)/schedule/actions";
import { FieldWrapper, TextInput, Select } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-message";
import { DAY_OF_WEEK_OPTIONS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import type { ScheduleSlot, Subject } from "@/lib/types";

const initialState: ScheduleFormState = {};

export function ScheduleForm({
  slot,
  subjects,
  action,
}: {
  slot?: ScheduleSlot;
  subjects: Subject[];
  action: (state: ScheduleFormState, formData: FormData) => Promise<ScheduleFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FieldWrapper label="מקצוע" htmlFor="subject_id" required>
        <Select id="subject_id" name="subject_id" defaultValue={slot?.subject_id} required>
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

      <FieldWrapper label="יום" htmlFor="day_of_week" required>
        <Select id="day_of_week" name="day_of_week" defaultValue={slot?.day_of_week ?? 0} required>
          {DAY_OF_WEEK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              יום {option.label}
            </option>
          ))}
        </Select>
      </FieldWrapper>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="שעת התחלה" htmlFor="start_time" required>
          <TextInput
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={slot ? formatTime(slot.start_time) : ""}
            required
          />
        </FieldWrapper>
        <FieldWrapper label="שעת סיום" htmlFor="end_time" required>
          <TextInput
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={slot ? formatTime(slot.end_time) : ""}
            required
          />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper label="מרצה/מורה" htmlFor="teacher">
          <TextInput id="teacher" name="teacher" defaultValue={slot?.teacher ?? ""} />
        </FieldWrapper>
        <FieldWrapper label="חדר" htmlFor="room">
          <TextInput id="room" name="room" defaultValue={slot?.room ?? ""} />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="קבוצה"
        htmlFor="group_label"
        hint="למעבדות מתחלפות במקביל (למשל A4/B4/C4). השאירו ריק אם זה לכל הכיתה יחד"
      >
        <TextInput id="group_label" name="group_label" defaultValue={slot?.group_label ?? ""} className="w-32" />
      </FieldWrapper>

      <FormError message={state.error} />
      <SubmitButton className="self-start">{slot ? "שמירת שינויים" : "הוספת שיעור"}</SubmitButton>
    </form>
  );
}
