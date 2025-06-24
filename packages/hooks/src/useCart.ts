import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

export interface UseCartReturn {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalItems: number;
  subtotal: number;
}

/**
 * Hook for managing shopping cart functionality
 * @returns Cart state and methods for manipulation
 */
export function useCart(): UseCartReturn {
  const [items, setItems] = useLocalStorage<CartItem[]>('next-level-clothing-cart', []);
  
  const addItem = useCallback((item: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return currentItems.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Add new item
        return [...currentItems, item];
      }
    });
  }, [setItems]);
  
  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems((currentItems) => 
      currentItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, [setItems]);
  
  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter(item => item.id !== id));
  }, [setItems]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);
  
  const isInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);
  
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isInCart,
    totalItems,
    subtotal
  };
}
