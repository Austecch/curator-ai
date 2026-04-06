import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm transition-all outline-none",
            "focus:ring-2 focus:ring-[#005cbb]/20",
            error && "ring-2 ring-[#9f403d]/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[#9f403d]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
