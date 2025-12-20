# UI Design Guide — Fashion Ecommerce (Inspired by Sølve / Minimal Nordic Style)

> Goal: Build a consistent, elegant, minimal UI system for a fashion ecommerce product across Web + Mobile.
> Style direction: "Elegant & minimal ecommerce shop" with strong whitespace, refined typography, calm visuals, and modular reusable components. (Sølve template style direction)  
> Reference: Sølve Ecommerce & Shop template pages include Home, Shop, Product, Lookbook, Contact, FAQ, Journal, Checkout, Order Confirmation, and a Styleguide.  
> (Use this guide as the single source of truth for UI decisions.)

---

## 1) Design Principles

### 1.1 Minimal, editorial, fashion-first
- Prioritize product photography and typography over heavy UI chrome.
- Use whitespace as a primary layout tool.
- Keep UI labels short and neutral.

### 1.2 Strong hierarchy, calm rhythm
- Clear typographic hierarchy (H1–H6, body, captions).
- Consistent spacing scale (don't eyeball).
- One primary action per screen.

### 1.3 Modular components
- Design as a component library: header, footer, cards, filters, product gallery, forms.
- Reuse components across pages and app screens.

### 1.4 Speed + usability
- Fast scanning: grid, filters, sticky actions on mobile.
- Avoid excessive interactions/animations that harm performance.

---

## 2) Foundations (Design Tokens)

> If exact tokens exist in the Figma kit, mirror them exactly. If not, adopt the following as defaults and keep them consistent.

### 2.1 Color system (Minimal Nordic)
- **Neutral base**: near-white backgrounds, charcoal text.
- **One accent**: used sparingly for primary actions, selected states, links.
- **Functional colors**: success/warning/error, subtle and accessible.

**Token naming**
- `bg/default`, `bg/subtle`, `text/primary`, `text/secondary`, `border/default`, `accent/primary`, `accent/hover`
- `state/success`, `state/warning`, `state/error`

**Color values**
- `bg/default`: `#ffffff` (white)
- `bg/subtle`: `#fafafa` (near-white)
- `text/primary`: `#1a1a1a` (charcoal)
- `text/secondary`: `#6b7280` (gray-500)
- `text/tertiary`: `#9ca3af` (gray-400)
- `border/default`: `#e5e7eb` (gray-200)
- `accent/primary`: `#000000` (black - used sparingly)
- `accent/hover`: `#1a1a1a` (charcoal)
- `state/success`: `#10b981` (green-500)
- `state/warning`: `#f59e0b` (amber-500)
- `state/error`: `#ef4444` (red-500)

**Rules**
- Never use more than 1 accent color per view.
- Borders should be subtle; rely on spacing before borders.

### 2.2 Typography (Editorial feel)
- Use **2-font system** maximum:
  - Display (serif or refined sans) for headings/hero.
  - UI sans for body, labels, buttons.
- Avoid mixing too many weights; use size + spacing instead.

**Font stack**
- Display: `'Playfair Display', serif` (headings, hero)
- UI Sans: `'Inter', system-ui, -apple-system, sans-serif` (body, labels, buttons)

**Type scale**
- H1: `40px` (desktop), `28px` (mobile) - Display font
- H2: `32px` (desktop), `24px` (mobile) - Display font
- H3: `24px` (desktop), `20px` (mobile) - Display font
- H4: `20px` - UI Sans, semibold
- Body: `16px` - UI Sans, regular
- Small: `14px` - UI Sans, regular
- Caption: `12px` - UI Sans, regular
- Button/Label: `14px` - UI Sans, medium

**Rules**
- Line height: 120–140% for headings; 150–170% for body.
- Use sentence case for buttons and labels (fashion editorial tone).

### 2.3 Spacing & layout
- Use an 8pt scale: `4px` / `8px` / `12px` / `16px` / `24px` / `32px` / `48px` / `64px`.
- Desktop container max-width: `1280px`, with generous side padding (`32px`).
- Mobile: `16px–20px` padding, big tap targets (`44px` minimum).

**Spacing tokens**
- `space-xs`: `4px`
- `space-sm`: `8px`
- `space-md`: `16px`
- `space-lg`: `24px`
- `space-xl`: `32px`
- `space-2xl`: `48px`
- `space-3xl`: `64px`

### 2.4 Radius & elevation
- Minimal radius: `8px` (keep consistent).
- Shadows: very subtle; prefer border + whitespace.
- Elevation: `0 1px 3px rgba(0, 0, 0, 0.05)` (subtle only)

### 2.5 Iconography
- Simple, thin-line or lightly rounded icons.
- Use icons as secondary guidance, not decoration.
- Maintain consistent stroke width (`1.5px`).
- Icon size: `20px` default, `24px` for larger contexts.

---

## 3) Core Components (Web + App)

### 3.1 Header / Navigation
**Must have**
- Logo (left), primary nav (center/left), search + account + cart (right).
- Sticky header optional; reduce height on scroll.
- Mobile: bottom sheet menu or full-screen menu.

**Behavior**
- Search: typeahead suggestions (products/categories).
- Cart: mini-cart drawer, quick edit quantity.

**Styling**
- Height: `80px` (desktop), `64px` (mobile)
- Background: `bg/default` with subtle border-bottom
- Navigation links: `text/primary`, hover: `accent/primary`

### 3.2 Footer
- Editorial minimal footer with:
  - Newsletter signup
  - Customer service links (shipping, returns, FAQ)
  - Social links
  - Legal links

**Styling**
- Background: `bg/subtle`
- Border-top: `border/default`
- Padding: `space-3xl` vertical, `space-xl` horizontal

### 3.3 Buttons
**Variants**
- Primary (accent): `bg/accent/primary`, `text/white`
- Secondary (outline): `border/accent/primary`, `text/accent/primary`, transparent bg
- Tertiary (text): `text/accent/primary`, no border
- Icon button: square, minimal padding

**Rules**
- One primary action per section.
- Disabled state: reduce contrast, keep border.
- Padding: `12px 24px` (desktop), `14px 28px` (mobile)
- Border radius: `8px`

### 3.4 Form fields
**Must have**
- Input, textarea, select, radio, checkbox, toggle.
- Inline validation + helper text.

**Rules**
- Labels always visible (avoid placeholder-only).
- Error message short and actionable.
- Border: `border/default`, focus: `accent/primary`
- Padding: `12px 16px`
- Border radius: `8px`

### 3.5 Product Card (PLP grid)
**Elements**
- Image (with hover alternate image on desktop)
- Brand / product name
- Price (and sale price)
- Color count or swatches (optional)
- "Quick add" (optional)

**Rules**
- Keep text to 2 lines max.
- Preserve consistent image aspect ratio (4:5 for fashion).
- Hover: subtle scale or image swap
- Border: `border/default` or none (rely on spacing)

### 3.6 Filters & Sorting (Fashion ecommerce critical)
**Desktop**
- Left sidebar filters (sticky) OR top filter bar with chips.
**Mobile**
- Bottom sheet filter + sort
- Persistent "Apply" button

**Filter types**
- Category, size, color, price range, material, availability, fit.

**Styling**
- Filter panel: `bg/default`, `border/default`
- Active filter: `accent/primary` background or border
- Chip style: rounded, minimal padding

### 3.7 PDP — Product Detail
**Must have blocks**
- Image gallery (zoom, swipe on mobile)
- Name, price, color selection, size selection
- Size guide link
- Delivery/returns summary
- Add to cart (sticky on mobile)
- Description + details + materials + care
- Reviews (optional)
- Recommendations (similar products)

**States**
- Out of stock size: disabled + "Notify me"
- Low stock: subtle warning

### 3.8 Cart / Checkout UI
**Cart drawer**
- Items list, quantity stepper, remove, subtotal
- "Checkout" primary button

**Checkout**
- Stepper or sections: shipping → payment → review
- Address autofill / validation
- Clear error states

### 3.9 Editorial modules (Lookbook / Journal)
Sølve includes Lookbook & Journal-style pages (editorial content). Keep:
- Large images, minimal overlays
- Strong typography
- Simple next/prev navigation

---

## 4) Page Templates & What Each Must Contain

> Align with standard ecommerce pages found in the Sølve template set (Home, Shop, Product, Lookbook, FAQ, Journal, Checkout, Order confirmation, 404, Styleguide).

### 4.1 Home
- Hero (editorial image + short headline)
- Featured categories / new arrivals
- Highlight collection (lookbook-style)
- Value props (shipping/returns)
- Newsletter

### 4.2 Shop (PLP)
- Category heading + short description
- Filters + sorting
- Product grid
- Pagination or infinite scroll (pick one)
- Empty results state (suggest removing filters)

### 4.3 Product (PDP)
- Gallery + sticky purchase module
- Size guide
- Shipping/returns
- Recommendations

### 4.4 Lookbook
- Storytelling + shoppable items
- Image-led, minimal UI

### 4.5 FAQ / Help Center
- Accordion structure
- Quick links to shipping/returns/size guide

### 4.6 Journal / Blog
- Grid of posts
- Post template: hero image, readable body width, related posts

### 4.7 Checkout + Order confirmation
- Clean forms, strong error states, clear totals
- Confirmation: order summary + delivery info + CTA to continue shopping

### 4.8 404 / Empty states
- Friendly message + CTA back to Shop
- Keep same typography tone

---

## 5) Mobile App Mapping (iOS/Android)

### 5.1 Navigation model
- Bottom tabs (recommended for commerce):
  - Home, Shop, Search, Wishlist, Account
- Cart as floating icon or top-right.

### 5.2 Mobile-first patterns
- Sticky "Add to cart" on PDP
- Swipe gallery
- Bottom sheet filters
- One-hand reach: primary CTA near bottom

### 5.3 Voice/AI features (optional)
- If adding AI stylist or size assistant:
  - Keep it as a non-blocking assistant (drawer), not a full-page takeover.
  - Provide quick suggestions + "Add to cart" shortcuts.

---

## 6) Content & Microcopy

### 6.1 Tone
- Minimal, calm, helpful.
- Avoid overly casual slang; fashion brand tone = editorial.

### 6.2 Standard labels
- "New arrivals", "Best sellers", "Add to cart", "Size guide", "Shipping & returns"
- Error messages: "Please enter a valid email."

---

## 7) Accessibility (non-negotiable)
- Color contrast meets WCAG for text and CTAs.
- Focus states visible.
- Tap targets ≥ 44px on mobile.
- Form errors announced (if implemented).

---

## 8) UI States Checklist (build these early)
- Loading (skeleton cards)
- Empty (no products, empty cart, no wishlist)
- Error (network, payment failure)
- Success (added to cart, order placed)
- Disabled (out of stock, invalid form)

---

## 9) Asset & Image Guidelines (Fashion critical)
- Consistent aspect ratios (define 1–2 ratios).
- Use web-optimized images (AVIF/WebP where possible).
- Avoid heavy overlays; keep photos clean.
- Product images: 4:5 aspect ratio (portrait)

---

## 10) Consistency Rules (Team Enforcement)
- Never introduce a new radius/spacing/font size without adding to tokens.
- Any new component must specify:
  - variants, states, responsive behavior
- Keep a single "Styleguide" page/screen that lists:
  - colors, type, buttons, forms, cards, modals, toasts, icons.

---

## 11) Future Extensions (build within the same system)
- Wishlist + "Save for later"
- Product comparison
- Size recommender (AI/logic)
- Returns portal UI
- Loyalty points UI
- Store locator (if needed)

---

## Appendix A — Suggested Component Inventory (for Cursor tasks)
- [ ] Header (desktop/mobile)
- [ ] Footer
- [ ] Button (4 variants + states)
- [ ] Input / Select / Checkbox / Radio / Toggle
- [ ] Product card (grid + list)
- [ ] Filter panel (desktop) + bottom sheet (mobile)
- [ ] Sort control
- [ ] Price badge (sale)
- [ ] Mini-cart drawer
- [ ] Cart page
- [ ] Checkout form
- [ ] PDP gallery + sticky CTA
- [ ] Modal (size guide)
- [ ] Toast notifications
- [ ] Empty/error/loading states

---

## Implementation Notes

### CSS Variables
```css
:root {
  /* Colors */
  --color-bg-default: #ffffff;
  --color-bg-subtle: #fafafa;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-border-default: #e5e7eb;
  --color-accent-primary: #000000;
  --color-accent-hover: #1a1a1a;
  --color-state-success: #10b981;
  --color-state-warning: #f59e0b;
  --color-state-error: #ef4444;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-ui: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Layout */
  --container-max-width: 1280px;
  --border-radius: 8px;
}
```

### Tailwind Config Extensions
- Extend theme with custom colors, spacing, fonts
- Use CSS variables for dynamic theming
- Custom utilities for editorial typography
