import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  it('renders correctly with default props', () => {
    render(<Alert>This is an alert message</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveTextContent('This is an alert message');
    expect(alertElement).toHaveClass('bg-blue-50'); // Default info style
  });
  
  it('renders warning variant correctly', () => {
    render(<Alert variant="warning">Warning message</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('bg-yellow-50');
    expect(alertElement).toHaveTextContent('Warning message');
  });
  
  it('renders error variant correctly', () => {
    render(<Alert variant="error">Error message</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('bg-red-50');
    expect(alertElement).toHaveTextContent('Error message');
  });
  
  it('renders success variant correctly', () => {
    render(<Alert variant="success">Success message</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveClass('bg-green-50');
    expect(alertElement).toHaveTextContent('Success message');
  });
  
  it('shows dismiss button when dismissable is true', () => {
    render(<Alert dismissable={true}>Dismissable alert</Alert>);
    
    const dismissButton = screen.getByRole('button', { name: /close/i });
    expect(dismissButton).toBeInTheDocument();
  });
  
  it('does not show dismiss button when dismissable is false', () => {
    render(<Alert dismissable={false}>Non-dismissable alert</Alert>);
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
  
  it('calls onDismiss handler when dismiss button is clicked', () => {
    const handleDismiss = jest.fn();
    render(
      <Alert dismissable={true} onDismiss={handleDismiss}>
        Dismissable alert
      </Alert>
    );
    
    const dismissButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(dismissButton);
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
  
  it('applies additional className when provided', () => {
    render(<Alert className="test-class">Custom class alert</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('test-class');
  });
  
  it('has no accessibility violations', async () => {
    const { container } = render(<Alert>Accessible alert</Alert>);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
  
  it('renders with an icon when showIcon is true', () => {
    render(<Alert showIcon>Alert with icon</Alert>);
    
    // Check for the icon element - adjust the selector as needed
    const iconElement = screen.getByTestId('alert-icon');
    expect(iconElement).toBeInTheDocument();
  });
  
  it('does not render an icon when showIcon is false', () => {
    render(<Alert showIcon={false}>Alert without icon</Alert>);
    
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
  });
});
