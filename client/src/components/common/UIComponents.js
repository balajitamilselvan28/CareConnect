import React from 'react';
import { commonStyles, theme, typography } from '../../styles/theme';

// Card Component
export const Card = ({ children, className = '', style = {}, onClick }) => (
  <div 
    className={`card ${className}`} 
    style={{ ...commonStyles.card, ...style }}
    onClick={onClick}
  >
    {children}
  </div>
);

// Button Components
export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  style = {}, 
  onClick,
  icon,
  ...props 
}) => {
  const buttonStyles = {
    ...commonStyles.button,
    ...(variant === 'primary' ? commonStyles.buttonPrimary : commonStyles.buttonOutline),
    ...style
  };

  return (
    <button 
      className={`btn ${className}`} 
      style={buttonStyles}
      onClick={onClick}
      {...props}
    >
      {icon && <i className={`${icon} me-2`}></i>}
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  className = '', 
  style = {}, 
  ...props 
}) => (
  <div className="mb-3">
    {label && (
      <label className="form-label" style={commonStyles.label}>
        {label}
      </label>
    )}
    <input 
      className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
      style={{ ...commonStyles.input, ...style }}
      {...props}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

// Section Title Component
export const SectionTitle = ({ children, icon, className = '', style = {} }) => (
  <h4 className={className} style={{ ...commonStyles.sectionTitle, ...style }}>
    {icon && <i className={`${icon} me-2`}></i>}
    {children}
  </h4>
);

// Info Item Component
export const InfoItem = ({ 
  icon, 
  label, 
  value, 
  className = '', 
  style = {} 
}) => (
  <div style={{ ...commonStyles.infoItem, ...style }} className={className}>
    <p className="mb-2">
      <i className={icon} style={commonStyles.icon}></i>
      <strong className="text-success">{label}</strong>
    </p>
    <p className="ms-4 mb-0">{value}</p>
  </div>
);

// Loading Spinner Component
export const Spinner = ({ size = 'medium', className = '' }) => {
  const spinnerSize = {
    small: { width: '1.5rem', height: '1.5rem' },
    medium: { width: '3rem', height: '3rem' },
    large: { width: '4rem', height: '4rem' }
  };

  return (
    <div className="text-center">
      <div 
        className={`spinner-border text-success ${className}`} 
        role="status"
        style={{ ...commonStyles.spinner, ...spinnerSize[size] }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

// Alert Component
export const Alert = ({ 
  type = 'info', 
  message, 
  className = '', 
  style = {} 
}) => (
  <div 
    className={`alert alert-${type} ${className}`}
    style={{ ...commonStyles.alert, ...style }}
    role="alert"
  >
    {message}
  </div>
);

// Badge Component
export const Badge = ({ 
  text, 
  variant = 'primary', 
  className = '', 
  style = {} 
}) => (
  <span 
    className={`badge bg-${variant} ${className}`}
    style={{ ...commonStyles.badge, ...style }}
  >
    {text}
  </span>
);

// Image Component
export const Image = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  onError 
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    style={{ ...commonStyles.image, ...style }}
    onError={onError}
  />
);

// Divider Component
export const Divider = ({ className = '', style = {} }) => (
  <hr 
    className={className}
    style={{ ...commonStyles.divider, ...style }}
  />
);

// Typography Components
export const H1 = ({ children, className = '', style = {} }) => (
  <h1 className={className} style={{ ...typography.h1, ...style }}>
    {children}
  </h1>
);

export const H2 = ({ children, className = '', style = {} }) => (
  <h2 className={className} style={{ ...typography.h2, ...style }}>
    {children}
  </h2>
);

export const H3 = ({ children, className = '', style = {} }) => (
  <h3 className={className} style={{ ...typography.h3, ...style }}>
    {children}
  </h3>
);

export const H4 = ({ children, className = '', style = {} }) => (
  <h4 className={className} style={{ ...typography.h4, ...style }}>
    {children}
  </h4>
);

export const H5 = ({ children, className = '', style = {} }) => (
  <h5 className={className} style={{ ...typography.h5, ...style }}>
    {children}
  </h5>
);

export const H6 = ({ children, className = '', style = {} }) => (
  <h6 className={className} style={{ ...typography.h6, ...style }}>
    {children}
  </h6>
);

export const Text = ({ children, className = '', style = {} }) => (
  <p className={className} style={{ ...typography.body, ...style }}>
    {children}
  </p>
);

export const SmallText = ({ children, className = '', style = {} }) => (
  <small className={className} style={{ ...typography.small, ...style }}>
    {children}
  </small>
); 