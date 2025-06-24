# 🖼️ Product Detail Wireframe (Markdown‑ASCII)

> **Purpose:** Text‑based blueprint for the Product Detail page. AI agents must preserve accessibility landmarks, focus order, and WCAG 2.1 AA considerations when generating components.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Skip‑Link → "Skip to main content"                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Header (reuse from Home)                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumb Nav (nav aria‑label="Breadcrumb")                                │
│   Home › Category › Subcategory › **Product Name**                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ Main (id="main")                                                            │
│  ┌──────────────────────────────┬──────────────────────────────────────────┐ │
│  │ Image Gallery (role="region" aria‑label="Product images")            │ │
│  │  • Thumbs (ul role="listbox") → full img alt="{Product Name}"        │ │
│  ├──────────────────────────────┴──────────────────────────────────────────┤ │
│  │ Product Info (article)                                                │ │
│  │  • h1 Product Name                                                   │ │
│  │  • Star Rating (aria‑label="4.3 out of 5 stars, 120 reviews")        │ │
│  │  • Price (id="price")                                               │ │
│  │  • Short Description (p)                                             │ │
│  │  • Qty Stepper (role="spinbutton" aria‑valuenow="1")               │ │
│  │  • "Add to cart" Button (aria‑label="Add Product Name to cart")     │ │
│  │  • Stock status (role="status")                                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Details Tabs (tablist) ↴                                                      │
│   [Description] [Specs] [Reviews 120]                                         │
│                                                                              │
│  • Tabpanel content changes (aria‑live="polite")                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ Related Products (region aria‑label="You may also like")                     │
│  ‑ Horizontal scroll list                                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Footer (reuse)                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```
