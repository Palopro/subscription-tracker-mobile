/**
 * Design tokens for the app. Centralizing these means every screen
 * pulls from the same palette instead of hardcoding hex values —
 * change the theme in one place, it propagates everywhere.
 */
export const theme = {
  colors: {
    background: "#FAF9F6",
    surface: "#FFFFFF",
    surfaceMuted: "#F1EFE9",

    textPrimary: "#1A1A1A",
    textSecondary: "#6B6862",
    textMuted: "#A6A39B",

    accent: "#3730A3",
    accentMuted: "#EDECFA",
    upcoming: "#D97706",
    upcomingMuted: "#FDF1E1",

    border: "#E8E5DD",
    danger: "#B91C1C",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  font: {
    mono: "Menlo",
  },
} as const;
