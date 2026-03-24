# 11 Ui Ux Spec

<!-- Add your content here -->
### **UI/UX Component & Design Specification.md**

```markdown
# UI/UX Component & Design Specification

## 1. Design System Overview

**Component Library:** **shadcn/ui** (built on Radix UI + Tailwind CSS)

**Rationale:**
- Accessible out of the box
- Fully customizable via Tailwind
- Minimal bundle size
- No external runtime dependencies

**CSS Framework:** **Tailwind CSS v3.x**

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#3B82F6` (blue-500) | Buttons, links, focus states, primary actions |
| **Primary Dark** | `#2563EB` (blue-600) | Hover states |
| **Secondary** | `#10B981` (emerald-500) | Success states, completed badges |
| **Danger** | `#EF4444` (red-500) | Errors, delete actions, failed badges |
| **Warning** | `#F59E0B` (amber-500) | Pending states, cautionary actions |
| **Background** | `#F9FAFB` (gray-50) | Page background |
| **Card Background** | `#FFFFFF` (white) | Card components |
| **Text Primary** | `#111827` (gray-900) | Main body text |
| **Text Secondary** | `#6B7280` (gray-500) | Helper text, labels |
| **Border** | `#E5E7EB` (gray-200) | Dividers, input borders |

## 3. Typography Scale

| Element | Font Family | Size | Weight | Line Height |
|---------|-------------|------|--------|-------------|
| **Heading 1** | Inter (sans) | 2rem (32px) | 700 | 1.2 |
| **Heading 2** | Inter (sans) | 1.5rem (24px) | 600 | 1.3 |
| **Heading 3** | Inter (sans) | 1.25rem (20px) | 600 | 1.4 |
| **Body Large** | Inter (sans) | 1rem (16px) | 400 | 1.5 |
| **Body** | Inter (sans) | 0.875rem (14px) | 400 | 1.5 |
| **Small** | Inter (sans) | 0.75rem (12px) | 400 | 1.5 |
| **Label** | Inter (sans) | 0.875rem (14px) | 500 | 1.4 |

**Tailwind Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['2rem', { lineHeight: '1.2' }],
      },
    },
  },
};
```

## 4. Spacing & Layout System

**Base Unit:** 4px (Tailwind spacing scale)

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | No spacing |
| `1` | 4px | Tight spacing (icons next to text) |
| `2` | 8px | Internal component spacing |
| `3` | 12px | Small gaps between elements |
| `4` | 16px | Standard gap (default) |
| `6` | 24px | Section spacing |
| `8` | 32px | Large section spacing |

**Container Max Widths:**
| Breakpoint | Width | Container Max Width |
|------------|-------|---------------------|
| Mobile | < 640px | 100% (padding 16px) |
| Tablet | 640px - 1024px | 640px (centered) |
| Desktop | > 1024px | 1024px (centered) |

**Layout Grid:** CSS Grid + Flexbox

## 5. Breakpoints

| Breakpoint | Tailwind Prefix | Min Width | Description |
|------------|-----------------|-----------|-------------|
| Mobile | `sm` | 640px | Small tablets |
| Tablet | `md` | 768px | Tablets landscape |
| Desktop | `lg` | 1024px | Desktop |
| Wide | `xl` | 1280px | Large desktop |

## 6. Component Inventory

| Component | Variants | Props | Description |
|-----------|----------|-------|-------------|
| **Button** | primary, secondary, ghost, destructive, outline | `variant`, `size`, `disabled`, `loading`, `onClick` | Action trigger |
| **Input** | default, error, disabled | `placeholder`, `value`, `onChange`, `error` | Text input field |
| **Textarea** | default, error, disabled | `placeholder`, `rows`, `value`, `onChange` | Multi-line text input |
| **Card** | default, interactive | `children` | Container for grouped content |
| **Table** | default, striped | `columns`, `data` | Data display |
| **Badge** | default, success, warning, error, info | `variant` | Status indicators |
| **Alert** | default, success, error, warning | `title`, `description`, `variant` | Notification messages |
| **Progress** | default, indeterminate | `value`, `max` | Processing status indicator |
| **FileUpload** | single, multiple | `onUpload`, `accept`, `maxSize` | PDF upload area |
| **Spinner** | sm, md, lg | `size` | Loading indicator |

## 7. Page/Screen Inventory

| Page | Route | Layout Components | Description |
|------|-------|-------------------|-------------|
| **Landing/Upload** | `/` | Card, FileUpload, Textarea, Button | User pastes JD and uploads PDFs |
| **Results Dashboard** | `/results/[sessionId]` | Card, Table, Badge, Progress, Button | Displays ranked candidates with scores |
| **Processing Status** | (embedded in Results) | Progress, Spinner | Shows real-time processing progress |

## 8. Interaction States

| Component | Hover | Focus | Disabled | Loading |
|-----------|-------|-------|----------|---------|
| **Button** | Darker background | Ring (blue-500) | 50% opacity, cursor not-allowed | Show spinner, disable clicks |
| **Input** | Border darkens | Ring (blue-500), border blue | Gray background, cursor not-allowed | - |
| **Card (interactive)** | Slight shadow increase | Ring | - | - |
| **Table Row** | Gray background | - | - | - |
| **FileUpload** | Border becomes primary | Ring | 50% opacity | Show spinner overlay |

**Error State:**
- Red border on input
- Error message below input (small text, red)
- Button disabled if form invalid

## 9. Accessibility Requirements

**WCAG Compliance Level:** **WCAG 2.1 AA**

**Mandatory Requirements:**
| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Navigation** | All interactive elements reachable via Tab, actionable with Enter/Space |
| **Focus Indicators** | Visible focus ring on all interactive elements |
| **Color Contrast** | Minimum 4.5:1 for normal text, 3:1 for large text |
| **Semantic HTML** | Use `button`, `input`, `form` with proper attributes |
| **ARIA Labels** | Add `aria-label` for icon-only buttons, `aria-describedby` for errors |
| **Screen Reader** | Announce status changes (e.g., "Processing started") via `aria-live` regions |
| **Heading Structure** | Proper h1 → h2 → h3 hierarchy |
| **Alt Text** | All images have descriptive alt text |

**Specific Accessibility Features:**
```tsx
// Loading announcement
<div aria-live="polite" className="sr-only">
  {isProcessing ? 'Processing 3 of 10 resumes' : ''}
</div>

// Error association
<input
  aria-invalid={!!error}
  aria-describedby={error ? "input-error" : undefined}
/>
{error && <span id="input-error" role="alert">{error}</span>}
```

## 10. Component Example (Button)

```tsx
// shadcn/ui Button with Tailwind overrides
import { Button } from '@/components/ui/button';

// Usage
<Button
  variant="primary"
  size="lg"
  disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? <Spinner size="sm" /> : 'Process Resumes'}
</Button>
```

**Button Variants via Tailwind:**
```css
/* Applied via className composition */
.btn-primary: "bg-blue-600 text-white hover:bg-blue-700"
.btn-secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300"
.btn-ghost: "bg-transparent hover:bg-gray-100"
.btn-destructive: "bg-red-600 text-white hover:bg-red-700"
```

## 11. Loading & Skeleton States

| Component | Loading State |
|-----------|---------------|
| **Results Table** | Skeleton rows (3-5 shimmering placeholders) |
| **Score Badge** | Gray pill with shimmer |
| **File Upload** | Disabled button + spinner |
| **Processing Progress** | Progress bar with percentage |

**Skeleton Pattern:**
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```
