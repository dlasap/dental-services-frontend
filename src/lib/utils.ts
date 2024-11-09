import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";
import { DAYS_OF_WEEK } from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedDate(dateString) {
  if (!dateString) return;
  // Create a Date object from the date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date as unknown as number)) {
    throw new Error("Invalid date string");
  }

  // Format the date to "Day, Month Date, Year"
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

export function getFormattedTime(timeString) {
  if (!timeString) return;
  // Create a Date object with today's date and the given time
  const [hours, minutes] = timeString?.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  // Format the time to "h:mm AM/PM"
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
}

export const getDayName = (date) => DAYS_OF_WEEK[date.getDay()];

export const isSameDate = (date1, date2) => {
  // Ensure both inputs are Date objects
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error("Both arguments must be Date objects.");
  }

  // Compare the year, month, and date
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);

    return decoded.exp ? decoded.exp * 1000 : null; // Convert to ms
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isTokenExpired = ({ token }) => {
  const expiration = getTokenExpiration(token);
  return expiration ? Date.now() > expiration : true;
};
