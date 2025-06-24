import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface AccessibleModalProps {
  /**
   * Modal content
   */
  children: ReactNode;
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when modal is closed
   */
  onClose: () => void;
  /**
   * ID of the element that labels the modal
   */
  titleId: string;
  /**
   * Additional CSS classes for the modal
   */
  className?: string;
  /**
   * Additional CSS classes for the backdrop
   */
  backdropClassName?: string;
  /**
   * Whether to close the modal when the backdrop is clicked
   */
  closeOnBackdropClick?: boolean;
}

/**
 * An accessible modal dialog component with proper focus management,
 * keyboard interactions, and ARIA attributes conforming to WCAG 2.1 AA
 */
export const AccessibleModal = ({
  children,
  isOpen,
  onClose,
  titleId,
  className = '',
  backdropClassName = '',
  closeOnBackdropClick = true,
}: AccessibleModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Save the previously focused element before opening modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element in modal
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (focusableElements?.length) {
          focusableElements[0].focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 10);
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling
      document.body.style.overflow = '';
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // Trap focus within modal when open
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || !modalRef.current || e.key !== 'Tab') return;
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If Shift+Tab on first element, focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If Tab on last element, focus first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };
  
  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${backdropClassName}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 m-4 max-w-md w-full max-h-[90vh] overflow-y-auto focus:outline-none ${className}`}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

export default AccessibleModal;
