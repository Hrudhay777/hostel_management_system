# HostelHub - UI/UX Design Guide

## 🎨 Visual Design System

### Color Palette

#### Primary Colors
```
Primary Blue: #667eea
Dark Purple: #764ba2
```
**Usage**: Headers, main buttons, primary actions, important information

#### Secondary Colors
```
Pink: #f093fb
Red: #f5576c
```
**Usage**: Danger actions, delete buttons, error states, avatars

#### Success Colors
```
Cyan: #4facfe
Turquoise: #00f2fe
```
**Usage**: Available slots, success messages, completion status

#### Warning Colors
```
Light Red: #fa709a
Yellow: #fee140
```
**Usage**: Warnings, medium priority, pending status

#### Neutral Colors
```
Dark Gray: #333
Light Gray: #666
Border Gray: #e0e0e0
Background: #f9f9f9
White: #ffffff
```

### Gradients

**Primary Gradient**
```css
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

**Secondary Gradient**
```css
linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
```

**Success Gradient**
```css
linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

**Warning Gradient**
```css
linear-gradient(135deg, #fa709a 0%, #fee140 100%)
```

**Danger Gradient**
```css
linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)
```

**Light Gradient (Background)**
```css
linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
```

## 🔤 Typography System

### Font Stack
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Type Scale

| Use Case | Size | Weight | Line Height | Example |
|----------|------|--------|-------------|---------|
| Page Heading | 2.5rem | Bold (700) | 100% | Dashboard title |
| Section Heading | 2rem | Bold (700) | 120% | Card headers |
| Sub Heading | 1.3rem | Bold (700) | 130% | Component titles |
| Body Text | 0.95rem | Regular (400) | 150% | Descriptions |
| Small Text | 0.9rem | Regular (400) | 140% | Captions |
| Tiny Text | 0.85rem | Regular (400) | 130% | Labels |
| Extra Small | 0.8rem | Regular (400) | 120% | Badges, tags |

### Text Colors

**Primary Text**: #333 (Dark Gray)
- Main content, headings, important information

**Secondary Text**: #666 (Medium Gray)
- Descriptions, meta information, labels

**Tertiary Text**: #999 (Light Gray)
- Disabled text, subtle information

**Action Text**: #667eea (Primary Blue)
- Links, clickable elements

### Font Weights Used
- **Regular (400)**: Body text, normal content
- **Semi-bold (600)**: Labels, emphasis
- **Bold (700)**: Headings, strong emphasis

## 🎯 Component Design

### Card Component
```
Padding: 1.5rem
Border Radius: 0.75rem
Background: #ffffff
Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
Hover Shadow: 0 8px 16px rgba(0, 0, 0, 0.12)
Border: 1px solid #e0e0e0
Transition: all 0.3s ease
Transform on Hover: translateY(-5px)
```

### Button Styles

**Primary Button**
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Color: #ffffff
Padding: 0.75rem 1.5rem
Border Radius: 0.5rem
Font Weight: 600
Font Size: 0.95rem
Cursor: pointer
Transition: all 0.3s ease
Hover: Scale 1.05, Box Shadow
Active: Scale 0.98
```

**Secondary Button**
```
Background: #f0f0f0
Color: #333
Padding: 0.75rem 1.5rem
Border Radius: 0.5rem
Font Weight: 600
Transition: all 0.3s ease
Hover: Background #e0e0e0
```

**Icon Button**
```
Padding: 0.4rem 0.6rem
Border: none
Background: #f0f0f0
Border Radius: 0.25rem
Font Size: 1rem
Cursor: pointer
Transition: all 0.3s ease
Hover: Background #667eea
```

### Input Components

**Text Input / Select**
```
Padding: 0.75rem 1rem
Border: 1px solid #e0e0e0
Border Radius: 0.5rem
Font Size: 1rem
Transition: all 0.3s ease
Focus: Border #667eea, Box Shadow 0 0 0 3px rgba(102, 126, 234, 0.1)
```

**Label**
```
Font Size: 0.9rem
Font Weight: 600
Color: #333
Margin Bottom: 0.5rem
Display: block
```

### Badge Component

**Standard Badge**
```
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Color: #ffffff
Padding: 0.35rem 0.75rem
Border Radius: 20px
Font Size: 0.85rem
Font Weight: 500
Display: inline-block
```

**Status Badges**
```
Success: Background #e0ffe0, Color #27ae60
Warning: Background #fff8e0, Color #f39c12
Error: Background #ffe0e0, Color #c0392b
Info: Background #e0f2fe, Color #0284c7
```

## 📐 Spacing System

### Spacing Scale (in rem)
```
Tiny: 0.25rem (4px)
Small: 0.5rem (8px)
Base: 1rem (16px)
Medium: 1.5rem (24px)
Large: 2rem (32px)
XL: 3rem (48px)
```

### Margin & Padding Usage

**Components Internal Spacing**
- Card Padding: 1.5rem
- Button Padding: 0.75rem 1.5rem
- Input Padding: 0.75rem 1rem
- Section Padding: 2rem

**Component Spacing**
- Card Gap: 1.5rem
- Grid Gap: 1.5rem
- List Item Gap: 1rem
- Section Gap: 2rem

## 🎬 Animation & Transitions

### Global Animations

**Fade In**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
Duration: 0.5s
Timing: ease-in-out
```

**Slide In**
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
Duration: 0.5s
Timing: ease-in-out
```

**Bounce**
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
Duration: 0.5s
Timing: ease-in-out
```

**Pulse**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
Duration: 2s
Timing: ease-in-out
Loop: infinite
```

### Component Transitions

**Hover Effects**
```css
Smooth color transition: 0.2s ease
Smooth background transition: 0.2s ease
Border color transition: 0.2s ease
Transform on hover: 0.3s ease
```

**Button Hover**
```css
Transform: translateY(-2px)
Box Shadow increase
Color change
```

**Card Hover**
```css
Transform: translateY(-5px)
Box Shadow increase (from 8px to 16px)
Duration: 0.3s
```

## 📱 Responsive Design Breakpoints

### Breakpoint Strategy

| Device | Breakpoint | Characteristics |
|--------|-----------|-----------------|
| Mobile | < 480px | Small screen, touch-friendly |
| Tablet | 480px - 768px | Medium screen, touch + keyboard |
| Desktop | 768px - 1200px | Large screen, mouse + keyboard |
| Large Desktop | > 1200px | Extra large, full layout |

### Responsive Layout Changes

**Grid Layouts**
```css
Desktop (1200px+): 4-column grid
Tablet (768px): 2-3 column grid
Mobile (< 768px): 1 column stack
```

**Typography Scaling**
```css
Desktop: 16px base
Tablet: 14px base
Mobile: 13px base
```

**Spacing Reduction**
```css
Desktop: Full spacing
Tablet: 80% spacing
Mobile: 50% spacing
```

### Navigation Adaptation

**Desktop**
- Horizontal navbar with all links visible
- Dropdown menus for sub-items
- Full sidebar for filters

**Tablet**
- Horizontal navbar with main items
- Some items hidden behind menu
- Smaller dropdowns

**Mobile**
- Hamburger menu
- Full-screen navigation drawer
- Bottom navigation for quick access
- Hidden filters in modal

## 🎨 Component-Specific Designs

### Dashboard Component

**Stat Cards**
```
Background: #ffffff
Border-top: 3px gradient color
Padding: 1.5rem
Display: flex (items centered, gap 1.5rem)
Hover: translateY(-5px), shadow increase
```

**Stats Grid**
```
Grid: repeat(auto-fit, minmax(250px, 1fr))
Gap: 1.5rem
Mobile: minmax(150px, 1fr)
```

**Chart Display**
```
Width: 200px
Height: 200px
Center positioned text with percentage
SVG circles for occupancy
```

### Room Cards

**Card Layout**
```
Header: Gradient background, room number, status badge
Body: Info, capacity bar, amenities, bed list
Footer: Action buttons
```

**Bed List Grid**
```
Desktop: 3-column grid
Tablet: 2-column grid
Mobile: 1-column stack
```

### Table Component

**Table Styling**
```
Header Background: Gradient light color
Row Hover: Light background color
Alternating rows: Optional subtle striping
Cell Padding: 1rem
Border: 1px #e0e0e0 between rows
```

## 🎯 Accessibility Features

### Color Contrast
- Text on background: 4.5:1 ratio (WCAG AA)
- UI components: 3:1 ratio minimum
- Gradients: Sufficient contrast for all text

### Focus States
```css
outline: 2px solid #667eea
outline-offset: 2px
box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2)
```

### Touch Targets
- Minimum size: 44px × 44px
- Spacing between targets: 8px minimum
- Buttons: Full padding for easy clicking

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3...)
- Semantic elements (nav, main, section, article)
- Proper form labels
- ARIA attributes where needed

## 🌙 Dark Mode Consideration

For future dark mode implementation:

**Dark Mode Colors**
```
Background: #1a1a1a
Card: #2d2d2d
Text: #e0e0e0
Secondary Text: #999
Borders: #444
Accent: #667eea (same, high contrast)
```

## 📊 Icon System

**Emoji Icons Used** (Can be replaced with icon font)
```
🏢 Hostel/Building
👥 Students/People
🛏️ Beds/Room
📋 Applications/Forms
🔧 Maintenance
✓ Check/Success
✗ Cancel/Error
📍 Location
🎓 Education
💬 Communication
```

**Icon Sizing**
```
Large: 2rem - 2.5rem
Medium: 1.5rem
Small: 1rem
Tiny: 0.85rem
```

## 🎬 Interaction Patterns

### Click Feedback
```
1. Visual feedback (color change)
2. Scale transform (0.98 - 1.05)
3. Duration: 0.3s
4. Timing: ease
```

### Hover Feedback
```
1. Background change
2. Shadow increase
3. Transform: translateY(-2px to -5px)
4. Duration: 0.3s
```

### Focus Feedback
```
1. Outline: 2px solid primary color
2. Box shadow with color
3. Clear visual distinction
```

## 📦 Design System Components

### Ready-to-Use Components
- Stat Cards
- Room Cards
- Student Cards
- Request Cards
- Application Cards
- Data Tables
- Form Inputs
- Buttons (Primary, Secondary, Icon)
- Badges (Status, Tags)
- Modals
- Dropdowns
- Progress Bars
- Charts

### Component Variants
- Loading states
- Error states
- Success states
- Disabled states
- Active states
- Hover states

---

**UI/UX Design Guide Version**: 1.0
**Last Updated**: February 6, 2026
**Status**: Complete
