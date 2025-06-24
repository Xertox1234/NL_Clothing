/**
 * Cart related type definitions
 */

/**
 * Represents an item in the shopping cart
 */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sku?: string;
  size?: string;
  color?: string;
};

/**
 * Updates that can be applied to a cart item
 */
export type CartItemUpdate = Partial<Omit<CartItem, 'id'>>;

/**
 * Shopping cart state
 */
export type Cart = {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
};

/**
 * Cart actions that can be performed
 */
export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: CartItemUpdate } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };
