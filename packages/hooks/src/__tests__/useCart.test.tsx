import { renderHook, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCart } from '../useCart';

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
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useCart Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
    });
    
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].id).toBe('1');
    expect(result.current.totalItems).toBe(1);
    expect(result.current.subtotal).toBe(29.99);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
    });
    
    act(() => {
      result.current.updateItem('1', { quantity: 3 });
    });
    
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.subtotal).toBe(89.97);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
    });
    
    act(() => {
      result.current.removeItem('1');
    });
    
    expect(result.current.items.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
      
      result.current.addItem({
        id: '2',
        name: 'Another Product',
        price: 19.99,
        quantity: 2,
      });
    });
    
    expect(result.current.items.length).toBe(2);
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.items.length).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should update item properties', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
    });
    
    act(() => {
      result.current.updateItem('1', { price: 39.99 });
    });
    
    expect(result.current.items[0].price).toBe(39.99);
    expect(result.current.subtotal).toBe(39.99);
  });

  it('should increment item quantity', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      });
    });
    
    act(() => {
      result.current.incrementItem('1');
    });
    
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('should decrement item quantity and remove if quantity becomes 0', () => {
    const { result } = renderHook(() => useCart());
    
    act(() => {
      result.current.addItem({
        id: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 2,
      });
    });
    
    act(() => {
      result.current.decrementItem('1');
    });
    
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    
    act(() => {
      result.current.decrementItem('1');
    });
    
    // Item should be removed when quantity reaches 0
    expect(result.current.items.length).toBe(0);
  });

  it('should hydrate cart from localStorage on init', () => {
    // Setup localStorage with existing cart data
    mockLocalStorage.getItem.mockImplementationOnce(() => JSON.stringify({
      items: [
        {
          id: '1',
          name: 'Test Product',
          price: 29.99,
          quantity: 3,
        }
      ]
    }));
    
    const { result } = renderHook(() => useCart());
    
    // Check if cart was hydrated correctly
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].id).toBe('1');
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
    expect(result.current.subtotal).toBe(89.97);
  });
});
