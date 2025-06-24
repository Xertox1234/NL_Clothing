import React from 'react';
import type { ReactNode } from 'react';

export interface LinkProps {
  /**
   * Link contents
   */
  children: ReactNode;
  /**
   * URL for the link
   */
  href: string;
  /**
   * Target for the link (e.g. _blank)
   */
  target?: string;
  /**
   * Optional icon to show with the link text
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
   * Accessibility properties
   */
  ariaLabel?: string;
}

export const Link = ({
  children,
  href,
  target,
  icon,
  className = '',
  ariaLabel,
}: LinkProps) => {
  const baseStyles = "flex items-center gap-2 hover:underline hover:underline-offset-4";
  
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={`${baseStyles} ${className}`}
      aria-label={ariaLabel}
    >
      {icon && (
        <img
          src={icon.src}
          alt={icon.alt}
          width={icon.width}
          height={icon.height}
          className={icon.className || ''}
          aria-hidden={!!children ? 'true' : undefined}
        />
      )}
      {children}
    </a>
  );
};

export default Link;
