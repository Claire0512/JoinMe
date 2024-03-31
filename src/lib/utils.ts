import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getAvatar(username?: string | null) {

  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}`;
}



export function validateHandle(handle?: string | null) {
  if (!handle) return false;
  return /^[a-z0-9\\._-]{1,25}$/.test(handle);
}

export function validateUsername(username?: string | null) {
  if (!username) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(username);
}

export function datesBetween(start: Date, end: Date) {
  const days = [];
  const startDate = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const msecPerDay = 1000 * 60 * 60 * 24;
  let curDate = startDate;

  while (curDate.getTime() < end.getTime()) {
    const weekOfDay = curDate.toLocaleString("en", { weekday: "short" });
    days.push(`${curDate.getMonth() + 1}/${curDate.getDate()} (${weekOfDay})`);
    curDate = new Date(curDate.getTime() + msecPerDay);
  }
  return days;
}

export function valid(index: number, start: Date, end: Date) {
  const startDate = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const msecPerHour = 1000 * 60 * 60;
  const indexTime = startDate.getTime() + index * msecPerHour;
  if (indexTime < start.getTime()) return false;
  if (indexTime >= end.getTime()) return false;
  return true;
}
