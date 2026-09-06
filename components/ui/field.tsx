import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10";

export function FieldWrapper({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClass, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, "cursor-pointer", className)} {...props} />;
}

export function CheckboxField({
  id,
  name,
  defaultChecked,
  label,
}: {
  id: string;
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-neutral-800">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20"
      />
      {label}
    </label>
  );
}
