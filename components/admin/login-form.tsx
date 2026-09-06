"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-message";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("אימייל או סיסמה שגויים.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-neutral-800">
          אימייל
        </label>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          dir="ltr"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-neutral-800">
          סיסמה
        </label>
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          dir="ltr"
        />
      </div>
      <FormError message={error} />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "מתחבר…" : "התחברות"}
      </Button>
    </form>
  );
}
