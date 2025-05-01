// Theme configuration for the entire application
export const theme = {
  colors: {
    primary: '#228B22',
    primaryLight: 'rgba(34, 139, 34, 0.1)',
    primaryDark: '#006400',
    secondary: '#007BFF',
    secondaryLight: 'rgba(0, 123, 255, 0.1)',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    gray: '#6c757d',
    grayLight: '#e9ecef'
  },
  gradients: {
    primary: 'linear-gradient(135deg, rgba(34, 139, 34, 0.15) 0%, rgba(0, 123, 255, 0.15) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 255, 240, 0.9) 100%)',
    button: 'linear-gradient(135deg, #228B22 0%, #006400 100%)'
  },
  shadows: {
    small: '0 2px 10px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 20px rgba(0, 0, 0, 0.1)',
    large: '0 8px 30px rgba(0, 0, 0, 0.15)'
  },
  borderRadius: {
    small: '8px',
    medium: '15px',
    large: '25px',
    circle: '50%'
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease'
  }
};

// Common styles for components
export const commonStyles = {
  container: {
    background: theme.gradients.primary,
    minHeight: '100vh',
    padding: '2rem 0'
  },
  card: {
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    boxShadow: theme.shadows.medium,
    transition: theme.transitions.default,
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  button: {
    borderRadius: theme.borderRadius.large,
    padding: '10px 20px',
    transition: theme.transitions.default,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.medium
    }
  },
  buttonPrimary: {
    background: theme.gradients.button,
    border: 'none',
    color: theme.colors.white
  },
  buttonOutline: {
    border: `2px solid ${theme.colors.primary}`,
    color: theme.colors.primary,
    '&:hover': {
      background: theme.colors.primaryLight
    }
  },
  sectionTitle: {
    color: theme.colors.primary,
    borderBottom: `2px solid ${theme.colors.primaryLight}`,
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  infoItem: {
    padding: '15px',
    borderRadius: theme.borderRadius.small,
    background: 'rgba(255, 255, 255, 0.5)',
    marginBottom: '15px',
    transition: theme.transitions.default,
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.8)',
      transform: 'translateX(5px)'
    }
  },
  icon: {
    color: theme.colors.primary,
    marginRight: '10px',
    width: '20px'
  },
  input: {
    borderRadius: theme.borderRadius.large,
    border: `1px solid ${theme.colors.primaryLight}`,
    padding: '10px 15px',
    transition: theme.transitions.default,
    '&:focus': {
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primaryLight}`,
      outline: 'none'
    }
  },
  label: {
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: '5px'
  },
  alert: {
    borderRadius: theme.borderRadius.medium,
    padding: '15px 20px',
    marginBottom: '20px'
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    color: theme.colors.primary
  },
  image: {
    borderRadius: theme.borderRadius.medium,
    objectFit: 'cover'
  },
  navLink: {
    color: theme.colors.primary,
    textDecoration: 'none',
    transition: theme.transitions.default,
    '&:hover': {
      color: theme.colors.primaryDark
    }
  },
  badge: {
    borderRadius: theme.borderRadius.large,
    padding: '5px 10px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  divider: {
    borderColor: theme.colors.primaryLight,
    margin: '1.5rem 0'
  }
};

// Animation keyframes
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 }
  },
  slideIn: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 }
  },
  scale: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 }
  }
};

// Media queries
export const breakpoints = {
  xs: '576px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
  xl: '1400px'
};

// Responsive styles
export const responsive = {
  container: {
    padding: {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem'
    }
  },
  grid: {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    }
  }
};

// Typography
export const typography = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: theme.colors.primary
  },
  h2: {
    fontSize: '2rem',
    fontWeight: '600',
    color: theme.colors.primary
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: theme.colors.primary
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: '500',
    color: theme.colors.primary
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: theme.colors.primary
  },
  h6: {
    fontSize: '1rem',
    fontWeight: '500',
    color: theme.colors.primary
  },
  body: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: theme.colors.dark
  },
  small: {
    fontSize: '0.875rem',
    color: theme.colors.gray
  }
}; 