"use client";

import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * כפתור submit בתוך <form action={serverAction}> שמציג אישור דפדפן לפני שליחה.
 * מיועד לפעולות הרסניות (מחיקה) כדי למנוע לחיצה בטעות.
 */
export function ConfirmSubmitButton({
  confirmMessage,
  children,
  variant = "danger",
  size,
  className,
}: {
  confirmMessage: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
  className?: string;
}) {
  function handleClick(event: FormEvent<HTMLButtonElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <Button type="submit" variant={variant} size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
