import { useState, useCallback } from 'react';

/**
 * Interface for the return value of useDisclosure
 */
export interface UseDisclosureReturn {
  /** Whether the disclosure is open */
  isOpen: boolean;
  /** Function to open the disclosure */
  onOpen: () => void;
  /** Function to close the disclosure */
  onClose: () => void;
  /** Function to toggle the disclosure */
  onToggle: () => void;
}

/**
 * Hook for managing disclosure state (open/closed) for components like modals, drawers, etc.
 * 
 * @param initialState - Initial state of the disclosure
 * @returns Object containing isOpen state and handler functions
 */
export function useDisclosure(initialState: boolean = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const onToggle = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);
  
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle
  };
}
