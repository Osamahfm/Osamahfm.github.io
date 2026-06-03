// API base URL
// Using local network IP for Expo Go physical device testing
export const API_BASE_URL = "http://192.168.172.30:8000"; 
export const WS_BASE_URL = "ws://192.168.172.30:8000";

// For iOS simulator, use http://localhost:8000
// For Expo Go on physical device, use your machine's LAN IP

export const COLORS = {
  // Primary palette
  primary: "#6C63FF",
  primaryLight: "#8B83FF",
  primaryDark: "#4B44CC",

  // Accent
  accent: "#00D9A6",
  accentLight: "#33E4BC",

  // Backgrounds
  background: "#0F0F1A",
  surface: "#1A1A2E",
  surfaceLight: "#252542",
  card: "#1E1E36",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0C0",
  textMuted: "#6B6B8D",

  // Status
  online: "#00D97E",
  offline: "#6B6B8D",
  error: "#FF6B6B",
  warning: "#FFB347",
  success: "#00D97E",

  // Chat bubbles
  sentBubble: "#6C63FF",
  sentText: "#FFFFFF",
  receivedBubble: "#252542",
  receivedText: "#E0E0F0",

  // Borders & Dividers
  border: "#2A2A4A",
  divider: "#1F1F3A",

  // Input
  inputBackground: "#1A1A2E",
  inputBorder: "#2A2A4A",
  inputText: "#FFFFFF",
  placeholder: "#6B6B8D",
};

export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 28,
  radiusFull: 999,

  // Font sizes
  fontXs: 11,
  fontSm: 13,
  fontMd: 15,
  fontLg: 18,
  fontXl: 22,
  fontXxl: 28,
  fontTitle: 34,
};
