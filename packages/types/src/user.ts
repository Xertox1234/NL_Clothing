/**
 * User related type definitions
 */

import type { Address } from './order';

/**
 * User role for authorization purposes
 */
export type UserRole = 'customer' | 'admin' | 'manager';

/**
 * User account status
 */
export type UserStatus = 'active' | 'pending' | 'suspended' | 'deleted';

/**
 * User profile information
 */
export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  addresses?: Address[];
  defaultAddressId?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Authentication response
 */
export type AuthResponse = {
  token: string;
  user: UserProfile;
  expiresIn: number;
};
