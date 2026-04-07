import type { Config } from 'tailwindcss'
import { tokens } from './tokens'
import { customTokens } from './tokens-custom'

const preset = {
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        ...customTokens.colors,
      },
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      boxShadow: {
        sm: tokens.elevation.sm,
        DEFAULT: tokens.elevation.md,
        md: tokens.elevation.md,
        lg: tokens.elevation.lg,
      },
    },
  },
} satisfies Config

export default preset
