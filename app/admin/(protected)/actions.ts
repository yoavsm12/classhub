"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { countTodayEntries } from "@/lib/data/access-log";

/** נקרא מהדפדפן (polling) כדי לרענן את מונה "כניסות היום" בלוח הבקרה בלי לרענן את העמוד. */
export async function getTodayEntryCountAction(): Promise<number> {
  await requireAdmin();
  return countTodayEntries();
}
