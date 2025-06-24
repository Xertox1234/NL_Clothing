import React from 'react';
import type { ReactNode } from 'react';

export interface ContainerProps {
  /**
   * Container content
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Container component for consistent layout wrapping
 */
export const Container = ({
  children,
  className = '',
}: ContainerProps) => {
  return (
    <div className={`max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
