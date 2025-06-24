import { useState, useEffect } from 'react';

/**
 * Hook for detecting whether a media query is matched
 * 
 * @param query - The media query to check
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQueryList.matches);
    
    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    mediaQueryList.addEventListener('change', listener);
    
    // Clean up
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
}
