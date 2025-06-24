import { renderHook, act } from '@testing-library/react';
// Jest-dom is imported in the setup file
import { useLocalStorage } from '../useLocalStorage';

// @jest-environment jsdom
describe('useLocalStorage Hook', () => {
  // Mock localStorage
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  // Set up localStorage mock before tests
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with initialValue when localStorage is empty', () => {
    const initialValue = { test: 'initialValue' };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    expect(result.current[0]).toEqual(initialValue);
  });

  it('should use value from localStorage if available', () => {
    const storedValue = { test: 'storedValue' };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedValue));
    
    const initialValue = { test: 'initialValue' };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    expect(result.current[0]).toEqual(storedValue);
  });

  it('should update state and localStorage when setValue is called with a value', () => {
    const initialValue = { test: 'initialValue' };
    const newValue = { test: 'newValue' };
    
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    act(() => {
      result.current[1](newValue);
    });
    
    expect(result.current[0]).toEqual(newValue);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(newValue));
  });

  it('should update state and localStorage when setValue is called with a function', () => {
    const initialValue = { count: 0 };
    
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    act(() => {
      result.current[1]((prev) => ({ count: prev.count + 1 }));
    });
    
    const expectedValue = { count: 1 };
    expect(result.current[0]).toEqual(expectedValue);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(expectedValue));
  });

  it('should handle localStorage errors when reading', () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Make getItem throw an error
    mockLocalStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    const initialValue = { test: 'initialValue' };
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    expect(result.current[0]).toEqual(initialValue);
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should handle localStorage errors when writing', () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Make setItem throw an error
    mockLocalStorage.setItem.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    const initialValue = { test: 'initialValue' };
    const newValue = { test: 'newValue' };
    
    const { result } = renderHook(() => useLocalStorage('testKey', initialValue));
    
    act(() => {
      result.current[1](newValue);
    });
    
    // State should still update even if localStorage fails
    expect(result.current[0]).toEqual(newValue);
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  // Skip this test in the browser environment
  // Use a separate file with proper Node environment for SSR testing
  it.skip('should be compatible with SSR (no window object)', () => {
    // In a real SSR environment, we would expect the hook to 
    // safely return the initial value without errors
    // This test is skipped because it requires a special environment setup
  });
});
