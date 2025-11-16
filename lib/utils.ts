import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(input?: Date | string | null) {
  if (!input) return "Never";
  try {
    return formatDistanceToNowStrict(new Date(input), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}
