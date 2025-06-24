/**
 * Order related type definitions
 */

import type { CartItem } from './cart';

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
};

export type OrderItem = CartItem & {
  priceAtPurchase: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  couponCode?: string;
  notes?: string;
  tracking?: {
    carrier: string;
    number: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};
