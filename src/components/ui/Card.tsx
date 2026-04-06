import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "glass";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const baseStyles = "rounded-lg transition-all duration-200";

    const variants = {
      default: "bg-white shadow-[0_10px_30px_rgba(46,50,61,0.03)]",
      interactive: "bg-white shadow-[0_10px_30px_rgba(46,50,61,0.03)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,92,187,0.08)] cursor-pointer",
      glass: "bg-white/80 backdrop-blur-[20px]",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
