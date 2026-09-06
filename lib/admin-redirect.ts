/**
 * לאן לחזור אחרי שמירה מוצלחת בטופס ניהול.
 * אם המשתמש לחץ "שמור והוסף עוד" — חוזרים לטופס ריק חדש כדי להמשיך להזין ברצף.
 * אחרת — חוזרים לרשימה. בשני המקרים מוסיפים ?saved=1 להצגת אישור.
 */
export function savedRedirectPath(formData: FormData, listPath: string): string {
  const saveAndNew = formData.get("_action") === "save_and_new";
  return saveAndNew ? `${listPath}/new?saved=1` : `${listPath}?saved=1`;
}
