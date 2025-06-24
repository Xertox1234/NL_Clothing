import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Navbar } from '../Navbar';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  const defaultProps = {
    links: [
      { href: '/', label: 'Home' },
      { href: '/products', label: 'Products' },
      { href: '/about', label: 'About' }
    ],
    cartItemCount: 0
  };
  
  it('renders all navigation links', () => {
    render(<Navbar {...defaultProps} />);
    
    defaultProps.links.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.label });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', link.href);
    });
  });
  
  it('displays correct cart item count badge', () => {
    render(<Navbar {...defaultProps} cartItemCount={5} />);
    
    const cartBadge = screen.getByTestId('cart-count');
    expect(cartBadge).toBeInTheDocument();
    expect(cartBadge).toHaveTextContent('5');
  });
  
  it('handles mobile menu toggle correctly', () => {
    render(<Navbar {...defaultProps} />);
    
    // Mobile menu should be hidden initially
    const mobileMenu = screen.queryByTestId('mobile-menu');
    expect(mobileMenu).not.toBeVisible();
    
    // Click toggle button
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByTestId('mobile-menu')).toBeVisible();
    
    // Click again to close
    fireEvent.click(menuButton);
    expect(screen.getByTestId('mobile-menu')).not.toBeVisible();
  });
  
  it('applies active link styles to current path', () => {
    // Mock the router to return a specific path
    jest.mock('next/router', () => ({
      useRouter: () => ({
        pathname: '/products',
        push: jest.fn(),
      }),
    }));
    
    render(<Navbar {...defaultProps} />);
    
    // Check that the Products link has active styling
    const activeLink = screen.getByRole('link', { name: 'Products' });
    expect(activeLink).toHaveClass('text-blue-600'); // Assuming active links get this class
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<Navbar {...defaultProps} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
