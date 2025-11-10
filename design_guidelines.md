# Snehasetu Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Drawing from social impact platforms (GoFundMe, DonorsChoose) for emotional connection and trust-building, combined with productivity tools (Linear, Notion) for clean information hierarchy and efficient need browsing.

## Core Design Principles
1. **Warmth & Trust**: Elderly care demands empathy - use authentic imagery and warm color palette
2. **Clarity First**: Color-coded need types ensure instant recognition and efficient browsing
3. **Actionable Design**: Every page should guide users toward helping - clear CTAs, minimal friction

## Typography System
**Font Family**: Inter (Google Fonts, weights: 400, 500, 600, 700)

- **Hero Headings**: text-5xl/text-6xl, font-bold, leading-tight
- **Section Headings**: text-3xl/text-4xl, font-semibold
- **Card Titles**: text-xl, font-semibold
- **Body Text**: text-base, font-normal, leading-relaxed
- **Metadata/Labels**: text-sm, font-medium, text-muted-foreground
- **Need Type Badges**: text-xs, font-semibold, uppercase tracking-wide

## Color System
**Primary**: Warm Orange (#ea580c / hsl(17 88% 48%)) - conveys warmth, care, action

**Need Type Colors** (consistently applied across badges, icons, progress indicators):
- Urgent: Red (#dc2626) with AlertCircle icon
- Material: Blue (#2563eb) with Package icon
- Volunteer: Green (#16a34a) with Users icon
- Campaign: Purple (#9333ea) with TrendingUp icon

**Neutrals**: Use Shadcn UI default slate scale for backgrounds, borders, text hierarchy

## Layout System
**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy**:
- Full-width sections with inner max-w-7xl px-4/px-6 containers
- Content sections: max-w-6xl for forms, dashboards
- Text content: max-w-prose for readability

**Grid Systems**:
- Need cards: 1 column mobile, 2 columns desktop (gap-6)
- OAH cards: 1/2/3 column responsive (gap-6)
- Impact stats: 1/2/4 column responsive (gap-4)

## Component Library

### Navigation
- Fixed top navbar with logo left, nav links center, auth buttons right
- Transparent bg with backdrop-blur on scroll
- Footer: 4-column grid (mobile stacks) with brand, quick links, for orgs, contact

### Hero Section
- Full-width with authentic elderly care image background
- Dark gradient overlay (from-black/60 to-black/40) for text contrast
- Centered content: large heading, subtitle, single "Find Ways to Help" CTA button with blurred background (backdrop-blur-md bg-white/20)
- Height: min-h-[600px] to balance impact with content visibility

### Need Cards
- White cards with rounded-xl borders, subtle shadow, hover lift effect (hover:-translate-y-1 transition-transform)
- Header: Need type badge (colored, with icon), image with aspect-video
- Body: Title (text-xl font-semibold), description (text-muted-foreground, line-clamp-2), OAH name + location (text-sm)
- Campaign cards: Add linear progress bar showing raised/target (colored by type)
- Footer: "Respond" button (primary color)

### Need Type Filter (Homepage)
- Rounded pill buttons in horizontal scroll container
- Positioned BELOW "Active Needs" heading
- 5 options: All Needs, Urgent, Material, Volunteer, Campaign
- Active state: filled with need type color, white text
- Inactive: border-2, transparent bg, colored text

### OAH Cards
- Image with aspect-[4/3], rounded-t-xl
- Content: Name (text-xl font-semibold), location badge (with MapPin icon), description (line-clamp-3)
- Stats row: Active needs count, years established (text-sm, muted)
- "View Profile" button (outline variant)

### Dashboard Components
- Sidebar navigation: fixed left, icons + labels, active state highlighting
- Stat cards: Icon (in colored circle), large number (text-3xl font-bold), label, description
- Data tables: Shadcn Table with sortable headers, need type badges, status badges, action buttons
- Forms/Dialogs: Clean label-above-input layout, required field indicators, toast confirmations

### Badges & Icons
- Need type badges: Small pill with icon + label, colored background with white text
- Status badges: Muted backgrounds (fulfilled: green, active: blue)
- Use Lucide React icons consistently (AlertCircle, Package, Users, TrendingUp, MapPin, Calendar, Heart)

## Images
**Critical Imagery**:
1. **Hero Section**: Warm, authentic photo of elderly residents in comfortable OAH setting - smiling, engaged, dignified (not clinical)
2. **Need Cards**: Contextual images - blankets/supplies for material needs, volunteers reading/interacting for volunteer needs, fundraising campaign imagery, urgent medical supplies
3. **OAH Cards**: Exterior/facility photos showing welcoming, well-maintained homes
4. **Testimonials**: Portrait photos of volunteers/donors (circular avatars)

All images should feel genuine, not stock-photo sterile. Prioritize warmth and human connection.

## Interaction Design
- Minimal animations: subtle hover lifts, smooth transitions (transition-all duration-200)
- Toast notifications for all form submissions (3-5 business days vetting message for OAH registration)
- All interactive elements require data-testid attributes
- Loading states for async operations
- Disabled states with reduced opacity + cursor-not-allowed

## Page-Specific Guidelines

**Homepage**: Hero → 4 impact stats → Active Needs (filter + 6 cards grid) → How It Works (3 steps, icons) → Testimonials (2 cards) → Footer

**Discover Needs (/needs)**: Left sidebar filters (sticky) + 2-column need cards grid with infinite scroll

**OAH Homes (/homes)**: "Register Your Home" button in page header → Search bar (full-width) → 3-column OAH cards grid

**Dashboards**: Sidebar nav + main content area with stats row at top, then primary content (table/feed/calendar)

## Accessibility
- Maintain WCAG AA contrast ratios (especially on colored badges)
- Focus visible states on all interactive elements
- Semantic HTML throughout
- Alt text for all images
- Form labels properly associated