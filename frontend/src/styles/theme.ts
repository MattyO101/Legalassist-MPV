export const theme = {
  colors: {
    primary: '#3498db',       // Blue for primary actions
    secondary: '#2c3e50',     // Dark slate for headers
    success: '#2ecc71',       // Green for success states
    error: '#e74c3c',         // Red for errors
    warning: '#f39c12',       // Orange for warnings
    background: '#f5f7fa',    // Light gray for backgrounds
    card: '#ffffff',          // White for cards
    text: {
      primary: '#2c3e50',     // Dark slate for primary text
      secondary: '#7f8c8d',   // Medium gray for secondary text
      light: '#ecf0f1'        // Light gray for text on dark backgrounds
    }
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif"
  },
  fontSizes: {
    small: '0.875rem',
    body: '1rem',
    large: '1.125rem',
    h1: '2rem',
    h2: '1.5rem',
    h3: '1.25rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    small: '4px',
    medium: '6px',
    large: '8px',
    round: '50%'
  },
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevated: '0 4px 6px rgba(0, 0, 0, 0.12)'
  }
};

export type Theme = typeof theme; 