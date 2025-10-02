import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns the role-specific dashboard path. Falls back to student.
export function dashboardPathForRole(role?: string | null): string {
  switch ((role ?? "").toLowerCase()) {
    case "faculty":
      return "/faculty";
    case "industry":
      return "/industry";
    case "student":
    default:
      return "/student";
  }
}
