# 🖼️ Home Page Wireframe (Markdown‑ASCII)

> **Purpose:** Provide a screen‑reader‑friendly, text‑based blueprint of the Home (landing) view. AI agents should follow this structure when generating React components.

```
┌───────────────────────────────────────────────────────────────┐
│ Skip‑Link: "Skip to main content" (sr‑only → focus:not‑sr‑only)│
├───────────────────────────────────────────────────────────────┤
│ Header (role="banner")                                        │
│  ├─ Logo (h1)                                                 │
│  ├─ Primary Nav (ul role="menubar")                          │
│  │    • Home • Products • About • Contact                    │
│  └─ Cart Button (role="button" aria-label="View cart")       │
├───────────────────────────────────────────────────────────────┤
│ Hero Section (role="region" aria-label="Featured offers")    │
│  ├─ h2: "Summer Sale"                                         │
│  └─ Call‑to‑action Button                                     │
├───────────────────────────────────────────────────────────────┤
│ Main (id="main")                                             │
│  ├─ Search Bar (input type="search" aria-label="Search")      │
│  ├─ Filter Sidebar (checkboxes, min‑max price)                │
│  └─ Product Grid (ul role="list")                            │
│      • li → Product Card component                            │
│         – img alt="{Product Name}"                           │
│         – h3 product name                                     │
│         – price + "Add to cart" button                       │
├───────────────────────────────────────────────────────────────┤
│ Footer (role="contentinfo")                                  │
│  ├─ Link list                                                 │
│  └─ Small print                                               │
└───────────────────────────────────────────────────────────────┘
```
