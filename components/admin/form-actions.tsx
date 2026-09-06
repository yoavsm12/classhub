"use client";

import { SubmitButton } from "@/components/ui/submit-button";

/**
 * שורת הכפתורים התחתונה של טופסי הניהול.
 * ב-מצב יצירה מוצג גם "שמור והוסף עוד" — מאפשר להזין הרבה רשומות ברצף
 * בלי לחזור לרשימה ולהיכנס שוב לטופס בכל פעם.
 */
export function FormActions({ isEdit, createLabel }: { isEdit: boolean; createLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SubmitButton>{isEdit ? "שמירת שינויים" : createLabel}</SubmitButton>
      {!isEdit && (
        <SubmitButton name="_action" value="save_and_new" variant="secondary" pendingLabel="שומר…">
          שמור והוסף עוד
        </SubmitButton>
      )}
    </div>
  );
}
