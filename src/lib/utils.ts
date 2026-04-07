import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge Tailwind classes with proper precedence
 * Later classes override earlier ones
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
