/**
 * Custom Design Tokens
 * Project-specific tokens that don't exist in the Figma DS
 */

export const customTokens = {
  colors: {
    // Add custom colors here if needed
    // Example: brand: '#...'
  },
  spacing: {
    // Add custom spacing if needed
  },
  // Add other custom token categories
} as const

export type CustomTokens = typeof customTokens
