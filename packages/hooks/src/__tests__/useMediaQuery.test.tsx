import { renderHook, act } from '@testing-library/react';
// Jest-dom is imported in the setup file
import { useMediaQuery } from '../useMediaQuery';

// @jest-environment jsdom
/**
 * Test suite for useMediaQuery hook
 * 
 * Coverage includes:
 * - Initial media query matches (true/false cases)
 * - Adding/removing event listeners correctly
 * - Dynamic media query state changes
 * - SSR compatibility
 * - Multi-query support
 */
describe('useMediaQuery Hook', () => {
  // Mock matchMedia
  const mockMatchMedia = (matches: boolean) => {
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQueryList);
    
    return {
      mediaQueryList: mockMediaQueryList,
      dispatchMediaQueryListEvent(matches: boolean) {
        const event = { matches } as MediaQueryListEvent;
        // @ts-ignore - we're mocking the event handler call
        mockMediaQueryList.addEventListener.mock.calls.forEach(([, listener]) => {
          listener(event);
        });
      }
    };
  };

  it('should return true when media query matches', () => {
    // Setup media query to match
    mockMatchMedia(true);
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(true);
  });

  it('should return false when media query does not match', () => {
    // Setup media query to not match
    mockMatchMedia(false);
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(result.current).toBe(false);
  });

  it('should add and remove event listeners correctly', () => {
    const { mediaQueryList } = mockMatchMedia(true);
    
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    unmount();
    
    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update when media query match status changes', () => {
    // Setup media query with initial match
    const { dispatchMediaQueryListEvent, mediaQueryList } = mockMatchMedia(true);
    
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    // Initial state should be true
    expect(result.current).toBe(true);
    
    // We need to properly simulate how matchMedia actually works by setting
    // the matches property and then triggering the event
    act(() => {
      // @ts-ignore - Modifying the mock
      mediaQueryList.matches = false;
      dispatchMediaQueryListEvent(false);
    });
    
    // Result should be updated
    expect(result.current).toBe(false);
    
    // Simulate media query change back to true
    act(() => {
      // @ts-ignore - Modifying the mock
      mediaQueryList.matches = true;
      dispatchMediaQueryListEvent(true);
    });
    
    // Result should be updated again
    expect(result.current).toBe(true);
  });

  it('should be resilient in SSR context', () => {
    // Save original window.matchMedia
    const originalMatchMedia = window.matchMedia;
    
    // Setup media query to return false in SSR mode
    mockMatchMedia(false);
    
    // Delete window.matchMedia to simulate SSR
    // @ts-ignore - Deliberately setting undefined to simulate SSR
    delete window.matchMedia;
    
    // Hook should not throw in SSR context
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    
    // Default to false in SSR
    expect(result.current).toBe(false);
    
    // Restore window.matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('should work with different media query strings', () => {
    // Use different queries to ensure flexible implementation
    
    // Mock small screen
    mockMatchMedia(false);
    
    const { result: smallScreenResult } = renderHook(() => 
      useMediaQuery('(min-width: 768px)')
    );
    expect(smallScreenResult.current).toBe(false);
    
    // Mock dark mode preference
    mockMatchMedia(true);
    
    const { result: darkModeResult } = renderHook(() => 
      useMediaQuery('(prefers-color-scheme: dark)')
    );
    expect(darkModeResult.current).toBe(true);
    
    // Mock print media
    mockMatchMedia(false);
    
    const { result: printResult } = renderHook(() => 
      useMediaQuery('print')
    );
    expect(printResult.current).toBe(false);
  });
});
