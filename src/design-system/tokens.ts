/**
 * Design Tokens - Auto-generated from Figma DS
 * Source: https://www.figma.com/design/Q2p5d5mIahsEPxXYMOA16V/Dom-DS-Core-Web
 * Last sync: 2026-04-07T14:29:37.456Z
 *
 * ⚠️ DO NOT EDIT MANUALLY - Changes will be overwritten
 * To add custom tokens, use tokens-custom.ts
 */

export const tokens = {
  "colors": {
    "primary": {
      "DEFAULT": "rgba(214, 64, 0, 1)",
      "foreground": "rgba(255, 255, 255, 1)",
      "hover": "rgba(191, 57, 0, 1)",
      "active": "rgba(171, 51, 0, 1)"
    },
    "secondary": {
      "DEFAULT": "rgba(0, 0, 0, 0)",
      "foreground": "rgba(214, 64, 0, 1)"
    },
    "neutral": {
      "50": "rgba(255, 255, 255, 1)",
      "100": "rgba(250, 250, 250, 1)",
      "200": "rgba(242, 242, 242, 1)",
      "300": "rgba(230, 230, 230, 1)",
      "400": "rgba(153, 153, 153, 1)",
      "500": "rgba(77, 77, 77, 1)",
      "600": "rgba(45, 45, 45, 1)",
      "700": "rgba(31, 31, 31, 1)"
    },
    "feedback": {
      "success": "rgba(56, 124, 43, 1)",
      "error": "rgba(220, 10, 10, 1)",
      "warning": "rgba(254, 166, 1, 1)",
      "info": "rgba(21, 115, 211, 1)"
    },
    "background": "rgba(255, 255, 255, 1)",
    "foreground": "rgba(31, 31, 31, 1)",
    "card": "rgba(255, 255, 255, 1)",
    "border": "rgba(242, 242, 242, 1)",
    "input": "rgba(250, 250, 250, 1)",
    "ring": "rgba(214, 64, 0, 1)",
    "muted": "rgba(230, 230, 230, 1)",
    "muted-foreground": "rgba(153, 153, 153, 1)",
    "accent": "rgba(214, 64, 0, 1)",
    "accent-foreground": "rgba(255, 255, 255, 1)",
    "destructive": "rgba(220, 10, 10, 1)",
    "destructive-foreground": "rgba(255, 255, 255, 1)",
    "popover": "rgba(255, 255, 255, 1)",
    "popover-foreground": "rgba(31, 31, 31, 1)"
  },
  "typography": {
    "fontFamily": {
      "sans": [
        "Source Sans 3",
        "sans-serif"
      ]
    },
    "fontSize": {
      "h1": [
        "48px",
        {
          "lineHeight": "1.2",
          "fontWeight": "600"
        }
      ],
      "h2": [
        "32px",
        {
          "lineHeight": "1.25",
          "fontWeight": "600"
        }
      ],
      "h3": [
        "24px",
        {
          "lineHeight": "1.3",
          "fontWeight": "600"
        }
      ],
      "h4": [
        "16px",
        {
          "lineHeight": "1.4",
          "fontWeight": "600"
        }
      ],
      "base": [
        "16px",
        {
          "lineHeight": "1.5",
          "fontWeight": "400"
        }
      ],
      "label": [
        "14px",
        {
          "lineHeight": "1.4",
          "fontWeight": "400"
        }
      ],
      "caption": [
        "12px",
        {
          "lineHeight": "1.3",
          "fontWeight": "400"
        }
      ],
      "badge": [
        "9px",
        {
          "lineHeight": "1.2",
          "fontWeight": "600"
        }
      ]
    },
    "fontWeight": {
      "regular": 400,
      "semibold": 600
    }
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "none": "0px",
    "sm": "4px",
    "DEFAULT": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  },
  "elevation": {
    "sm": "2px 4px 4px 0px rgba(0, 0, 0, 0.12)",
    "md": "4px 8px 12px 0px rgba(0, 0, 0, 0.15)",
    "lg": "8px 16px 24px 0px rgba(0, 0, 0, 0.18)"
  }
} as const

export type Tokens = typeof tokens

