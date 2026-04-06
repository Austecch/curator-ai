import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface BadgeProps extends ButtonHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "primary", size = "md", className, ...props }, ref) => {
    const variants = {
      primary: "bg-[#d7e2ff] text-[#0050a3]",
      success: "bg-emerald-100 text-emerald-700",
      warning: "bg-amber-100 text-amber-700",
      error: "bg-red-100 text-red-700",
      neutral: "bg-[#e6e7f4] text-[#5b5f6b]",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-3 py-1 text-xs",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
