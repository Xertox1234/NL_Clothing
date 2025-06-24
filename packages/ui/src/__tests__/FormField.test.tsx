import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { FormField } from '../FormField';

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Field',
    id: 'test-field',
    name: 'testField',
    type: 'text' as const,
    value: '',
    onChange: jest.fn(),
  };
  
  it('renders with label and input correctly', () => {
    render(<FormField {...defaultProps} />);
    
    const labelElement = screen.getByText('Test Field');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'test-field');
    
    const inputElement = screen.getByLabelText('Test Field');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('name', 'testField');
    expect(inputElement).toHaveAttribute('type', 'text');
  });
  
  it('handles input value changes', () => {
    render(<FormField {...defaultProps} />);
    
    const input = screen.getByLabelText('Test Field');
    fireEvent.change(input, { target: { value: 'New Value' } });
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });
  
  it('shows error message when provided', () => {
    render(<FormField {...defaultProps} error="This field is required" />);
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
    
    // Input should have error styling
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveClass('border-red-500');
  });
  
  it('applies className to wrapper element', () => {
    render(<FormField {...defaultProps} className="custom-class" />);
    
    // Look for the div wrapping the entire form field
    const formFieldWrapper = screen.getByLabelText('Test Field').closest('div');
    expect(formFieldWrapper).toHaveClass('custom-class');
  });
  
  it('renders as required when required prop is true', () => {
    render(<FormField {...defaultProps} required />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('required');
    
    // Label should have required indicator
    const label = screen.getByText(/Test Field/);
    expect(label).toHaveTextContent(/\*/); // Contains asterisk
  });
  
  it('disables input when disabled prop is true', () => {
    render(<FormField {...defaultProps} disabled />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toBeDisabled();
  });
  
  it('renders different input types correctly', () => {
    // Test email type
    render(<FormField {...defaultProps} type="email" />);
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'email');
    
    // Cleanup and test password type
    screen.unmount();
    render(<FormField {...defaultProps} type="password" />);
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'password');
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<FormField {...defaultProps} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
  
  it('passes additional props to input element', () => {
    render(<FormField {...defaultProps} placeholder="Enter value" maxLength={50} />);
    
    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
    expect(input).toHaveAttribute('maxLength', '50');
  });
});
