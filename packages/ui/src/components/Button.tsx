import React from 'react';
import type { ReactNode, ImgHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps {
  /**
   * Button contents
   */
  children: ReactNode;
  /**
   * Optional icon to show with the button text
   */
  icon?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
  };
  /**
   * Button style variant
   */
  variant?: ButtonVariant;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * URL for link buttons - converts button to an <a> tag
   */
  href?: string;
  /**
   * Target for link buttons (e.g. _blank)
   */
  target?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessibility properties
   */
  ariaLabel?: string;
  /**
   * Full width button
   */
  fullWidth?: boolean;
}

export const Button = ({
  children,
  icon,
  variant = 'primary',
  onClick,
  href,
  target,
  className = '',
  ariaLabel,
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles = "rounded-full border border-solid transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5";
  
  const variantStyles = {
    primary: "border-transparent bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]",
    secondary: "border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent",
    outline: "border-current hover:bg-black/5 dark:hover:bg-white/10"
  };
  
  const widthStyles = fullWidth ? "w-full" : "sm:w-auto";
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`;
  
  const content = (
    <>
      {icon && (
        <img
          className={`${icon.className || ''} ${!!children ? 'dark:invert' : ''}`}
          src={icon.src}
          alt={icon.alt}
          width={icon.width}
          height={icon.height}
          aria-hidden={!!children ? 'true' : undefined}
        />
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={combinedClassName}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }
  
  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

export default Button;
