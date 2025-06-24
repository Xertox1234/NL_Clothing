# 📖 accessibility.md

## 🎯 Overview

This document provides detailed and comprehensive guidelines for achieving and maintaining full WCAG 2.1 AA compliance specifically tailored for AI coding agents. Accessibility is the highest priority, embedding compliance deeply into the project's lifecycle.

## 🌟 Key Principles

* **Perceivable**: Information and UI components must be perceivable to all users.
* **Operable**: All functionality must support diverse inputs (keyboard, assistive tech).
* **Understandable**: Content and operations must be intuitively understandable.
* **Robust**: Functionality must reliably perform across diverse technologies and assistive tools.

## 🔐 Authentication Flow

### Accessible Authentication

* Use clear error messages with `aria-live="assertive"`.
* Example:

```jsx
<div aria-live="assertive">
  {errorMessage}
</div>
```

### Keyboard-friendly Login Form

```jsx
<form>
  <label htmlFor="username">Username:</label>
  <input id="username" type="text" aria-required="true" />
  
  <label htmlFor="password">Password:</label>
  <input id="password" type="password" aria-required="true" />

  <button type="submit">Login</button>
</form>
```

## 📦 Modals

### ARIA Implementation

```jsx
<div role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDescription">
  <h2 id="modalTitle">Modal Title</h2>
  <p id="modalDescription">Modal description.</p>
  <button>Close</button>
</div>
```

### Keyboard Navigation for Modals

* Ensure focus is trapped within the modal until it's closed.

```jsx
// Example using react-focus-lock
import FocusLock from 'react-focus-lock';

<FocusLock>
  {/* Modal Content */}
</FocusLock>
```

## ⚛️ React Components

### Accessible Components Example

```jsx
export const Button = ({ onClick, label }) => (
  <button onClick={onClick} aria-label={label}>
    {label}
  </button>
);
```

## 🔗 Skip Links

* Provide skip links for keyboard users to quickly navigate to main content.

```jsx
<a href="#mainContent" className="sr-only focus:not-sr-only">Skip to main content</a>

<main id="mainContent">
  {/* Main content here */}
</main>
```

## ⌨️ Keyboard Navigation

* Ensure logical tab order:

```css
:focus-visible {
  outline: 2px solid #005fcc;
}
```

## 🔊 Screen Reader Support

* ARIA Live regions for dynamic content:

```jsx
<div aria-live="polite">{dynamicContent}</div>
```

* ARIA attributes:

  * `aria-expanded`, `aria-haspopup`, `aria-controls`

## 🛒 E-commerce Accessibility Essentials

### Product Listings

```jsx
<ul>
  {products.map(product => (
    <li key={product.id}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
    </li>
  ))}
</ul>
```

### Shopping Cart Accessibility

```jsx
<div role="region" aria-label="Shopping Cart">
  <h2>Shopping Cart</h2>
  <ul>
    {cartItems.map(item => (
      <li key={item.id}>{item.name} - {item.quantity}</li>
    ))}
  </ul>
  <button>Checkout</button>
</div>
```

## 🧪 Accessibility Testing

### Common Cypress + Axe Test Example

```javascript
describe('Accessibility tests', () => {
  it('Should have no detectable accessibility violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
});
```

## 📈 Maintaining Compliance

* Continuously update accessibility tests.
* Conduct frequent manual and automated accessibility audits.

## 🔄 Continuous Improvement

* Utilize user feedback and regular accessibility audits for iterative improvements.
* Stay updated on WCAG 2.1 evolving standards to continuously adapt compliance practices.
