import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ProductCard } from '../ProductCard';

// Mock Next.js router and Image component
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt || ''} />;
  },
}));

describe('ProductCard Component', () => {
  const defaultProps = {
    id: 'product-1',
    name: 'Test Product',
    price: 29.99,
    imageUrl: '/test-image.jpg',
    category: 'shirts',
    onAddToCart: jest.fn(),
  };
  
  it('renders product information correctly', () => {
    render(<ProductCard {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/test-image.jpg');
  });
  
  it('shows sale price when provided', () => {
    render(<ProductCard {...defaultProps} salePrice={19.99} />);
    
    expect(screen.getByText('$29.99')).toHaveClass('line-through');
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });
  
  it('calls onAddToCart when add to cart button is clicked', () => {
    render(<ProductCard {...defaultProps} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(defaultProps.onAddToCart).toHaveBeenCalledWith({
      id: 'product-1',
      name: 'Test Product',
      price: 29.99,
      imageUrl: '/test-image.jpg',
      quantity: 1,
    });
  });
  
  it('navigates to product detail page when card is clicked', () => {
    const mockRouter = { push: jest.fn() };
    jest.mock('next/router', () => ({
      useRouter: () => mockRouter,
    }));
    
    render(<ProductCard {...defaultProps} />);
    
    const card = screen.getByTestId('product-card');
    fireEvent.click(card);
    
    // Check if the router would push to the detail page
    expect(mockRouter.push).toHaveBeenCalledWith(`/products/${defaultProps.id}`);
  });
  
  it('displays out of stock badge when product is out of stock', () => {
    render(<ProductCard {...defaultProps} inStock={false} />);
    
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    
    // Add to cart button should be disabled
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeDisabled();
  });
  
  it('displays appropriate badge for new products', () => {
    render(<ProductCard {...defaultProps} isNew={true} />);
    
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<ProductCard {...defaultProps} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
