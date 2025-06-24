/**
 * @jest-environment jsdom
 */

// @ts-nocheck - We use this directive to bypass TypeScript issues with mocks
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
// NOTE: jest-dom is imported globally in jest.setup.js

import { createTrpcClient, setAuthToken, clearAuthToken, hasValidAuthToken } from '../client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Mock @trpc/client's httpBatchLink
jest.mock('@trpc/client', () => ({
  ...jest.requireActual('@trpc/client'),
  httpBatchLink: jest.fn(() => ({ type: 'httpBatchLink' })),
  createTRPCProxyClient: jest.fn(() => ({
    query: jest.fn(),
    mutation: jest.fn()
  }))
}));

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

// Mock httpBatchLink and createTRPCProxyClient
jest.mock('@trpc/client', () => {
  const originalModule = jest.requireActual('@trpc/client');
  return {
    ...originalModule,
    httpBatchLink: jest.fn(() => ({ type: 'httpBatchLink' })),
    createTRPCProxyClient: jest.fn(() => ({
      query: jest.fn(),
      mutation: jest.fn()
    }))
  };
});

describe('tRPC Client', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('Auth Token Functions', () => {
    const testToken = 'test-jwt-token';
    const expiresInSeconds = 3600; // 1 hour in seconds

    it('should set auth token correctly', () => {
      setAuthToken(testToken, expiresInSeconds);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'auth-token',
        testToken
      );
      
      // Should also set expiration
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'auth-token-expires',
        expect.any(String)
      );
    });
    
    it('should not set token in server-side environment', () => {
      // Save original window object
      const originalWindow = global.window;
      
      // Mock running in a server environment by removing window
      delete global.window;
      
      // Should not throw errors when running server-side
      setAuthToken(testToken, expiresInSeconds);
      
      // localStorage should not be called
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      
      // Restore the window object
      global.window = originalWindow;
    });

    it('should clear auth token', () => {
      clearAuthToken();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth-token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth-token-expires');
    });
    
    it('should not attempt to clear token in server-side environment', () => {
      // Save original window object
      const originalWindow = global.window;
      
      // Mock running in a server environment by removing window
      delete global.window;
      
      // Should not throw errors when running server-side
      clearAuthToken();
      
      // localStorage should not be called
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
      
      // Restore the window object
      global.window = originalWindow;
    });

    it('should check if token exists correctly', () => {
      // No token case
      mockLocalStorage.getItem.mockReturnValueOnce(null);
      expect(hasValidAuthToken()).toBe(false);
      
      // Valid token case with future expiration
      const futureTime = Date.now() + 1000 * 60 * 60; // 1 hour in the future
      mockLocalStorage.getItem.mockReturnValueOnce('valid-token');
      mockLocalStorage.getItem.mockReturnValueOnce(futureTime.toString());
      expect(hasValidAuthToken()).toBe(true);
    });

    it('should handle expired tokens', () => {
      // Expired token case
      const pastTime = Date.now() - 1000 * 60 * 60; // 1 hour ago
      mockLocalStorage.getItem.mockReturnValueOnce('expired-token');
      mockLocalStorage.getItem.mockReturnValueOnce(pastTime.toString());
      
      expect(hasValidAuthToken()).toBe(false);
    });
    
    it('should return false for hasValidAuthToken in server-side environment', () => {
      // Save original window object
      const originalWindow = global.window;
      
      // Mock running in a server environment by removing window
      delete global.window;
      
      // Should return false in server environment
      expect(hasValidAuthToken()).toBe(false);
      
      // Restore the window object
      global.window = originalWindow;
    });
  });

  describe('createTrpcClient', () => {
    it('should create client with correct configuration', () => {
      const client = createTrpcClient('http://localhost:3001/trpc');
      
      expect(client).toBeDefined();
      expect(httpBatchLink).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:3001/trpc',
        })
      );
    });
    
    it('should use default baseUrl if none provided', () => {
      createTrpcClient();
      
      expect(httpBatchLink).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'http://localhost:3001/trpc',
        })
      );
    });

    it('should add authorization header when token exists', () => {
      // Set up a mock token
      mockLocalStorage.getItem.mockReturnValueOnce('test-jwt-token');
      
      createTrpcClient('http://localhost:3001/trpc');
      
      // The headers function should be called by the httpBatchLink
      // Let's extract and call it to test
      const headersFn = httpBatchLink.mock.calls[0][0].headers;
      const headers = headersFn();
      
      // Check if headers contain authorization
      expect(headers).toEqual(expect.objectContaining({
        authorization: 'Bearer test-jwt-token',
      }));
    });

    it('should not add authorization header when no token exists', () => {
      // Mock no token
      mockLocalStorage.getItem.mockReturnValueOnce(null);
      
      createTrpcClient('http://localhost:3001/trpc');
      
      // The headers function should be called by the httpBatchLink
      // Let's extract and call it to test
      const headersFn = httpBatchLink.mock.calls[0][0].headers;
      const headers = headersFn();
      
      // Check if headers do not contain authorization
      expect(headers).not.toHaveProperty('authorization');
    });
    
    it('should handle server-side rendering environment', () => {
      // Save original window object
      const originalWindow = global.window;
      
      // Mock running in a server environment by removing window
      delete global.window;
      
      createTrpcClient('http://localhost:3001/trpc');
      
      // The headers function should be called by the httpBatchLink
      const headersFn = httpBatchLink.mock.calls[0][0].headers;
      const headers = headersFn();
      
      // Headers should be an empty object in SSR context
      expect(headers).toEqual({});
      
      // Restore the window object
      global.window = originalWindow;
    });
  });
});
