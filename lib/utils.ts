import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Date unavailable"
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date unavailable"
  }
}

export function parseJsonSafely<T>(value: unknown): T | string {
  if (typeof value !== "string") {
    return value as T
  }

  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return value
  }
}

export function formatNumber(value: number, decimalPlaces = 2): string {
  if (isNaN(value)) return "N/A"

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  }).format(value)
}

export function formatCustomDate(dateString: string): string {
  try {
    // Check if the string matches the expected format
    if (!/^\d{8}-\d{6}$/.test(dateString)) {
      console.log("Format mismatch:", dateString)
      return "Date unavailable"
    }

    // Extract date components
    const year = Number.parseInt(dateString.substring(0, 4))
    const month = Number.parseInt(dateString.substring(4, 6)) - 1 // Month is 0-indexed in JavaScript
    const day = Number.parseInt(dateString.substring(6, 8))

    // Extract time components
    const hour = Number.parseInt(dateString.substring(9, 11))
    const minute = Number.parseInt(dateString.substring(11, 13))
    const second = Number.parseInt(dateString.substring(13, 15))

    // Create a date object
    const date = new Date(year, month, day, hour, minute, second)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.log("Invalid date components:", { year, month, day, hour, minute, second })
      return "Date unavailable"
    }

    // Format the date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  } catch (error) {
    console.error("Error formatting custom date:", error)
    return "Date unavailable"
  }
}