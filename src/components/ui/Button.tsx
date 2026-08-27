"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          {
            "bg-[#22c55e] text-white hover:bg-[#16a34a] focus:ring-[#22c55e] shadow-sm":
              variant === "primary",
            "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500":
              variant === "secondary",
            "border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#f0fdf4] dark:hover:bg-[#22c55e]/10 focus:ring-[#22c55e]":
              variant === "outline",
            "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500":
              variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-base": size === "md",
            "px-8 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
