/**
 * מייצר hash מוצפן (bcrypt) לקוד הגישה של התלמידים.
 *
 * שימוש:
 *   npm run generate-access-code-hash -- "MY_CLASS_CODE"
 *
 * את הפלט יש להעתיק אל GUEST_ACCESS_CODE_HASH ב-.env.local (ובמשתני הסביבה בפרודקשן).
 * הקוד הגולמי עצמו לא נשמר בשום מקום בקוד או במסד הנתונים.
 */
import bcrypt from "bcryptjs";

async function main() {
  const code = process.argv[2];

  if (!code || !code.trim()) {
    console.error('שימוש: npm run generate-access-code-hash -- "הקוד-שלכם"');
    process.exit(1);
  }

  const hash = await bcrypt.hash(code, 12);

  // Next.js מבצע הרחבת משתנים (variable expansion) בקבצי .env: כל "$" ואחריו
  // תווים נחשב כהפניה למשתנה סביבה (למשל $2b) ומוחלף/נמחק בשקט. חייבים לברוח
  // מכל "$" בתוך ה-hash של bcrypt (שמתחיל תמיד ב-$2...$) עם "\$", אחרת הקוד
  // הגולמי ייקטע וההתחברות תיכשל תמיד עם "קוד גישה שגוי" בלי שגיאה ברורה.
  const escapedHash = hash.replace(/\$/g, "\\$");

  console.log("\nהוסיפו את השורה הבאה ל-.env.local (שימו לב ל-\\$ — זה מכוון!):\n");
  console.log(`GUEST_ACCESS_CODE_HASH=${escapedHash}\n`);
}

main();
