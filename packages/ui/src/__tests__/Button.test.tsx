import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // Default primary style
  });
  
  it('renders outline variant correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole('button', { name: /Outline Button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border-2');
    expect(button).not.toHaveClass('bg-blue-600');
  });
  
  it('renders disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /Disabled Button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = screen.getByRole('button', { name: /Clickable Button/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /Disabled Button/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('renders full width button when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button', { name: /Full Width Button/i });
    expect(button).toHaveClass('w-full');
  });
  
  it('applies additional className when provided', () => {
    render(<Button className="test-class">Custom Class Button</Button>);
    
    const button = screen.getByRole('button', { name: /Custom Class Button/i });
    expect(button).toHaveClass('test-class');
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
