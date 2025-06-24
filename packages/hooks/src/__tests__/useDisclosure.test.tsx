import { renderHook, act } from '@testing-library/react';
// Jest-dom is imported in the setup file
import { useDisclosure } from '../useDisclosure';

// @jest-environment jsdom
describe('useDisclosure Hook', () => {
  it('should initialize with default closed state', () => {
    const { result } = renderHook(() => useDisclosure());
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with provided initial state', () => {
    const { result } = renderHook(() => useDisclosure(true));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should open disclosure when onOpen is called', () => {
    const { result } = renderHook(() => useDisclosure(false));
    
    act(() => {
      result.current.onOpen();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close disclosure when onClose is called', () => {
    const { result } = renderHook(() => useDisclosure(true));
    
    act(() => {
      result.current.onClose();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle disclosure when onToggle is called', () => {
    const { result } = renderHook(() => useDisclosure(false));
    
    // Toggle from false to true
    act(() => {
      result.current.onToggle();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    // Toggle from true to false
    act(() => {
      result.current.onToggle();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should preserve callback identity between renders', () => {
    const { result, rerender } = renderHook(() => useDisclosure());
    
    // Capture references to the callbacks
    const initialOnOpen = result.current.onOpen;
    const initialOnClose = result.current.onClose;
    const initialOnToggle = result.current.onToggle;
    
    // Force rerender
    rerender();
    
    // Check if callbacks maintained their identity (references)
    expect(result.current.onOpen).toBe(initialOnOpen);
    expect(result.current.onClose).toBe(initialOnClose);
    expect(result.current.onToggle).toBe(initialOnToggle);
  });
  
  it('should have proper function types for callbacks', () => {
    const { result } = renderHook(() => useDisclosure());
    
    expect(typeof result.current.onOpen).toBe('function');
    expect(typeof result.current.onClose).toBe('function');
    expect(typeof result.current.onToggle).toBe('function');
  });
});
