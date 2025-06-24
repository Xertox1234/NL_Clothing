import React from 'react';
import type { ReactNode } from 'react';

export interface FooterProps {
  /**
   * Footer content
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Footer = ({
  children,
  className = '',
}: FooterProps) => {
  return (
    <footer className={`flex gap-[24px] flex-wrap items-center justify-center ${className}`}>
      {children}
    </footer>
  );
};

export default Footer;
