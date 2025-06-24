import React from 'react';
import type { ReactNode } from 'react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  /**
   * Alert content
   */
  children: ReactNode;
  /**
   * Alert style variant
   */
  variant?: AlertVariant;
  /**
   * Optional icon to show with the alert
   */
  icon?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the alert is dismissable
   */
  dismissable?: boolean;
  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * ARIA role (defaults to 'alert')
   */
  role?: string;
  /**
   * Whether the alert should be announced to screen readers
   */
  live?: boolean;
}

/**
 * Alert component for displaying feedback messages to users
 */
export const Alert = ({
  children,
  variant = 'info',
  icon,
  className = '',
  dismissable = false,
  onDismiss,
  role = 'alert',
  live = true,
}: AlertProps) => {
  const baseStyles = "rounded-md p-4 flex items-start gap-3";
  
  const variantStyles = {
    success: "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-900",
    error: "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-900",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-900",
    info: "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-900"
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  return (
    <div 
      className={combinedClassName}
      role={role}
      aria-live={live ? "assertive" : undefined}
    >
      {icon && (
        <img
          src={icon.src}
          alt={icon.alt}
          width={icon.width || 20}
          height={icon.height || 20}
          className={`flex-shrink-0 ${icon.className || ''}`}
          aria-hidden="true"
        />
      )}
      <div className="flex-grow">{children}</div>
      {dismissable && (
        <button
          type="button"
          className="flex-shrink-0 ml-auto -mr-1 -mt-1 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
