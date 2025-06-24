# 🖼️ Cart Page Wireframe (Markdown‑ASCII)

> **Purpose:** Blueprint for the Shopping Cart view, emphasizing WCAG 2.1 AA structures. Use this as a spec for UI components and automated a11y tests.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Skip‑Link → "Skip to main content"                                         │
├────────────────────────────────────────────────────────────────────────────┤
│ Header (reuse global)                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ Main (id="main")                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ h1 "Your Cart"                                                       │ │
│  │ Breadcrumb: Home › Cart                                              │ │
│  │                                                                      │ │
│  │ ⚠️ Empty State (role="status")                                       │ │
│  │   └─ "Your cart is empty" + button "Browse products"                │ │
│  │                                                                      │ │
│  │ 🛒 Cart Table (role="table" aria-label="Cart items")                │ │
│  │   ├─ Header row: Product | Price | Qty | Subtotal | Actions          │ │
│  │   ├─ Row for each item (role="rowgroup")                            │ │
│  │   │   • Checkbox (batch select)                                      │ │
│  │   │   • Prod thumbnail alt="{Name}"                                 │ │
│  │   │   • Name (link)                                                  │ │
│  │   │   • Unit price (data‑label="Price")                             │ │
│  │   │   • Qty spinbutton (aria-valuenow)                               │ │
│  │   │   • Subtotal                                                    │ │
│  │   │   • Remove button (aria-label="Remove {Name}")                  │ │
│  │                                                                      │ │
│  │ 🔄 Update Cart Toast (role="status" aria-live="polite")             │ │
│  │                                                                      │ │
│  │ ──────────────────────────────────────────────────────────────────── │ │
│  │ Cart Summary (aside role="complementary" aria-label="Order summary")│ │
│  │   • Items total                                                     │ │
│  │   • Shipping estimator (select country, zip)                         │ │
│  │   • Discount code input + apply btn                                  │ │
│  │   • Tax estimate                                                    │ │
│  │   • Grand total (h2)                                                │ │
│  │   • Checkout button (primary) aria-describedby="checkoutNote"       │ │
│  │   • Small note id="checkoutNote": "You’ll log in on next step"      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                    │
└────────────────────────────────────────────────────────────────────────────┘
```
