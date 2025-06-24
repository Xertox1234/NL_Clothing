import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from './types';

/**
 * Creates a tRPC client instance
 * @param baseUrl - The base URL of the API server
 * @returns A configured tRPC client
 */
export function createTrpcClient(baseUrl: string = 'http://localhost:3001/trpc') {
  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: baseUrl,
        // Configure request headers with auth token if available
        headers() {
          const headers: Record<string, string> = {};
          
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth-token');
            if (token) {
              headers.authorization = `Bearer ${token}`;
            }
          }
          
          return headers;
        },
      }),
    ],
  });
}

/**
 * Default tRPC client instance using environment variables for configuration
 */
export const trpc = createTrpcClient(
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL 
    : undefined
);

/**
 * Stores an authentication token in localStorage
 * @param token - The authentication token
 * @param expiresIn - Token expiration in seconds
 */
export function setAuthToken(token: string, expiresIn: number): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('auth-token', token);
  localStorage.setItem('auth-token-expires', 
    (Date.now() + expiresIn * 1000).toString()
  );
}

/**
 * Clears the authentication token from localStorage
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-token-expires');
}

/**
 * Checks if the current auth token is valid
 * @returns Boolean indicating if token exists and is valid
 */
export function hasValidAuthToken(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth-token');
  const expiresAt = localStorage.getItem('auth-token-expires');
  
  if (!token || !expiresAt) return false;
  
  return Date.now() < parseInt(expiresAt, 10);
}
