import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-GB").format(new Date(date));
};

export const daysToGo = (date: Date): number => {
  const today = new Date();
  const tripDate = new Date(date);
  const diff = tripDate.getTime() - today.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
