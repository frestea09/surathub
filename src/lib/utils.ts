import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundHalfUp(value: number): number {
  return Math.round(value);
}

export function formatDate(date: string | Date): string {
  return format(typeof date === "string" ? new Date(date) : date, "dd-MM-yyyy");
}
