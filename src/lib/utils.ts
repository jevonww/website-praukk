import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Color utility functions using CSS custom properties
export const colors = {
  primary: "var(--color-primary)",
  primaryHover: "var(--color-primary-hover)",
  success: "var(--color-success)",
  danger: "var(--color-danger)",
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
} as const;
