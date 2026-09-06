import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

const variantClasses: Record<Variant, string> = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950",
  secondary: "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100",
  ghost: "text-neutral-700 hover:bg-neutral-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-3 text-base",
  sm: "px-3 py-2 text-sm",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none select-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={cn(base, variantClasses[variant], sizeClasses[size], className)} {...props} />;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </Link>
  );
}
