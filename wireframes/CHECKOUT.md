# 🖼️ Checkout (Multi‑Step) Wireframe (Markdown‑ASCII)

> **Purpose:** Blueprint for the multi‑step checkout flow (Shipping → Billing → Review → Payment → Confirmation). Each step must be keyboard navigable, announce progress, and meet WCAG 2.1 AA.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Skip‑Link → "Skip to main content"                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Header (reuse global)                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Main (id="main")                                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ h1 "Checkout"                                                         │ │
│  │                                                                      │ │
│  │ Stepper Nav (nav aria-label="Checkout progress" role="tablist")      │ │
│  │   • 1 Shipping ▸ 2 Billing ▸ 3 Review ▸ 4 Payment ▸ 5 Done             │ │
│  │   • Current step has `aria-selected="true"`                           │ │
│  │                                                                      │ │
│  │ ──────────────── STEP 1: Shipping Info ─────────────────────────────── │ │
│  │ Form (role="form" aria-labelledby="shippingHeading")                 │ │
│  │   → Input: Full Name (required)                                        │ │
│  │   → Input: Address 1 (required)                                        │ │
│  │   → Input: Address 2 (optional)                                        │ │
│  │   → City, State, Zip (grid)                                            │ │
│  │   → Country Select (autocomplete)                                      │ │
│  │   → Checkbox "Save address"                                           │ │
│  │   • Inline errors (`role="alert"`)                                     │ │
│  │   • Button "Continue to Billing" (primary)                             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 2: Billing & Shipping Method (same layout)                         │ │
│  │   Radio list: Standard / Express (role="radiogroup") → shipping cost   │ │
│  │   Credit‑card fields ↴                                                   │ │
│  │     → Card Number (aria-describedby="cardHint")                        │ │
│  │     → Expiration, CVC, Name on card                                     │ │
│  │   Live‑region id="cardHint" → "Visa detected"                         │ │
│  │   Button "Review Order"                                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 3: Order Review                                                   │ │
│  │   • Read‑only list of items (role="table")                            │ │
│  │   • Totals, taxes, shipping                                           │ │
│  │   • Button "Pay & Place Order"                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 4: Payment Processing                                             │ │
│  │   • aria-live="polite" spinner                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ STEP 5: Confirmation                                                   │ │
│  │   • h2 "Thank you for your order"                                     │ │
│  │   • Order number announced (role="status")                            │ │
│  │   • Button "Continue Shopping"                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ Footer (contentinfo)                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```
