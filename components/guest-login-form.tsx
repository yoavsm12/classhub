"use client";

import { useActionState } from "react";
import { guestLoginAction, type GuestLoginState } from "@/app/actions/guest";
import { TextInput } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-message";

const initialState: GuestLoginState = {};

export function GuestLoginForm() {
  const [state, formAction] = useActionState(guestLoginAction, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-neutral-800">
          קוד גישה לכיתה
        </label>
        <TextInput
          id="code"
          name="code"
          type="password"
          inputMode="text"
          autoComplete="off"
          placeholder="הזינו את קוד הגישה שקיבלתם"
          required
          autoFocus
          className="text-center text-lg tracking-wide"
        />
      </div>
      <FormError message={state.error} />
      <SubmitButton pendingLabel="בודק…" className="w-full">
        כניסה לחומרים
      </SubmitButton>
    </form>
  );
}
