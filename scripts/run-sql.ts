/**
 * כלי פנימי להרצת SQL ישירות מול Supabase דרך ה-RPC הזמין exec_sql (ראה
 * README / השיחה עם הסוכן) — עוקף את הצורך בחיבור Postgres ישיר (psql),
 * שחסום ברשתות רבות (פורט 5432/6543). משתמש ב-SUPABASE_SECRET_KEY בלבד,
 * דרך HTTPS רגיל.
 *
 * שימוש:
 *   npx tsx scripts/run-sql.ts supabase/seed.sql
 *   npx tsx scripts/run-sql.ts --sql "select 1;"
 *
 * ⚠️ כלי תפעולי בלבד — לא חלק מהאפליקציה, לא נטען בזמן ריצה של המשתמשים.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-require-imports -- @next/env הוא CJS
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

async function main() {
  const args = process.argv.slice(2);
  let sql: string;

  if (args[0] === "--sql") {
    sql = args[1];
  } else if (args[0]) {
    sql = readFileSync(args[0], "utf8");
  } else {
    console.error('שימוש: npx tsx scripts/run-sql.ts <קובץ.sql>  או  --sql "..."');
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("חסרים NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY ב-.env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.rpc("exec_sql", { query: sql });

  if (error) {
    console.error("RPC error:", error.message);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));

  if (data?.status === "error") {
    process.exit(1);
  }
}

main();
