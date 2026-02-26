# KodNest Premium Build System

A premium SaaS design system for serious B2C products.

## Design Philosophy

- **Calm, Intentional, Coherent, Confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | `#F7F6F3` | Page background (off-white) |
| `--color-text-primary` | `#111111` | Primary text |
| `--color-accent` | `#8B0000` | Deep red accent |
| `--color-success` | `#4A7C59` | Muted green |
| `--color-warning` | `#B8860B` | Muted amber |

## Typography

- **Headings**: Serif font, large, confident, generous spacing
- **Body**: Clean sans-serif, 16-18px, line-height 1.6-1.8, max 720px for text blocks

## Spacing System

Consistent scale: `8px`, `16px`, `24px`, `40px`, `64px`

## Global Layout Structure

Every page follows: **Top Bar → Context Header → Primary Workspace + Secondary Panel → Proof Footer**

### Top Bar
- Left: Project name
- Center: Progress indicator (Step X / Y)
- Right: Status badge (Not Started / In Progress / Shipped)

### Context Header
- Large serif headline, 1-line subtext, clear purpose, no hype language

### Primary Workspace (70% width)
- Where the main product interaction happens
- Clean cards, predictable components, no crowding

### Secondary Panel (30% width)
- Step explanation (short)
- Copyable prompt box
- Buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot

### Proof Footer
- Checklist style: UI Built / Logic Working / Test Passed / Deployed
- Each checkbox requires user proof input

## Component Rules

- **Primary button**: solid deep red
- **Secondary button**: outlined
- Same hover effect and border radius everywhere
- **Inputs**: clean borders, no heavy shadows, clear focus state
- **Cards**: subtle border, no drop shadows, balanced padding

## Interaction Rules

- Transitions: 150-200ms, ease-in-out
- No bounce, no parallax

## File Structure

```
design-system/
├── tokens.css           # Design tokens (colors, typography, spacing)
├── global.css           # Global styles and layout
├── components/
│   ├── index.css        # Import all components
│   ├── buttons.css      # Button components
│   ├── inputs.css       # Input components
│   ├── cards.css        # Card components
│   ├── badges.css       # Badge and progress components
│   ├── states.css       # Error and empty states
│   └── proof-footer.css # Proof footer component
└── example.html         # Demo page
```

## Usage

Include the design system in your HTML:

```html
<link rel="stylesheet" href="design-system/components/index.css">
```

Or import specific components:

```css
@import 'design-system/tokens.css';
@import 'design-system/components/buttons.css';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
