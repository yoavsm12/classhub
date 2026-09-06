import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "warning" | "success" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  accent: "bg-blue-100 text-blue-800",
  warning: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  danger: "bg-red-100 text-red-800",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
