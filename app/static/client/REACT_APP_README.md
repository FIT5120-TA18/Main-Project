# React Frontend Application - Life Move Comparison Tool

## Overview
Complete React frontend application for comparing life moves using Australian financial data. Built with modern tools and best practices.

## Architecture

### Core Structure
- **App.jsx** - Main router with 8 routes
- **main.jsx** - React entry point with Tailwind CSS
- **store/useAppStore.js** - Zustand state management
- **api/client.js** - Axios API client

### Pages & Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | LandingPage | Hero section with 3-step process, features, CTAs |
| `/quick-profile-step-1` | QuickProfileStep1 | Collect age, state, income, living arrangement, study status |
| `/quick-profile-step-2` | QuickProfileStep2 | Select goals (Move out, Save money, Understand options) |
| `/pathway-builder` | PathwayBuilder | Build 1-2 pathways with living/work/study details |
| `/results` | ResultsScreen | Compare pathway financial outcomes |
| `/education/housing-stress` | HousingStressGuide | Housing stress education (>30% income on rent) |
| `/education/payslip` | PayslipGuide | Understanding payslips (gross, tax, super, net) |
| `/education/moving-costs` | MovingCostsGuide | Initial moving costs breakdown ($2,500-$5,000) |
| `*` | NotFound | 404 error page |

## Components

### Common Components (components/common/)
- **Button.jsx** - Reusable button with variants (primary, secondary, danger, ghost) and sizes (sm, md, lg)
- **InputField.jsx** - Form input with error handling and validation display
- **TileSelect.jsx** - Multi-option selector using tile buttons with hover animations

### Landing (components/landing/)
- **LandingPage.jsx** - Animated hero with:
  - Main headline with gradient animation
  - 3-step process visualization
  - 4 feature cards (Data-driven, Private, Instant, Practical)
  - Call-to-action buttons
  - Responsive grid layouts

### Profile (components/profile/)
- **QuickProfileStep1.jsx** - Form with:
  - 6 input fields using TileSelect
  - Form validation with error messages
  - Progress bar (50%)
  - Next/Back navigation

- **QuickProfileStep2.jsx** - Goal selection with:
  - 3 interactive goal cards
  - Checkbox system with icons
  - Multi-selection support
  - Build My Pathways CTA

### Pathway (components/pathway/)
- **PathwayBuilder.jsx** - Scenario builder with:
  - Required Pathway A form
  - Optional Pathway B with add/remove toggle
  - Form fields: name, living arrangement, work hours, study load
  - Full validation
  - See Results navigation

### Results (components/results/)
- **ResultsScreen.jsx** - Financial comparison showing:
  - Weekly income ranges
  - Weekly rent ranges
  - Monthly living costs
  - Monthly surplus/deficit (color-coded)
  - Housing stress ratio calculation
  - Affordability badges (green/red)
  - Information disclaimer
  - Adjust/Start Over buttons

### Education (components/education/)
- **HousingStressGuide.jsx** - Educational content about:
  - Why housing stress matters (4 reasons)
  - What you can do (4 solutions)
  - Links and resource suggestions

- **PayslipGuide.jsx** - Payslip breakdown showing:
  - Gross income explanation
  - Tax withheld (13% example)
  - Superannuation (11.5%)
  - Net pay (take-home)
  - Full calculation example

- **MovingCostsGuide.jsx** - Moving cost guide with:
  - 8 cost categories (bond, rent, utilities, furniture, etc.)
  - Cost ranges and descriptions
  - Total cost calculation ($2,500-$5,000)
  - Money-saving tips (6 items)
  - Planning advice

## State Management (Zustand)

### useAppStore Structure
```javascript
{
  profile: {
    ageBand, state, workStatus, weeklyIncome,
    livingArrangement, studyStatus
  },
  selectedGoals: string[],
  pathways: {
    pathwayA: { name, living, workHours, studyLoad },
    pathwayB: null | { name, living, workHours, studyLoad }
  },
  results: null | { monthlyIncome, pathwayA: {}, pathwayB: {} }
}
```

### Available Actions
- `setProfile(data)` - Update profile
- `setSelectedGoals(goals)` - Set goals array
- `setPathwayA(data)` - Update pathway A
- `setPathwayB(data)` - Create pathway B
- `removePathwayB()` - Delete pathway B
- `setResults(results)` - Store results
- `reset()` - Clear all state

## Styling

### Colors
- **Primary (Navy):** #1f3c88
- **Accent (Red):** #d92d20
- **Success (Green):** #2e7d32
- **Neutral Grays:** Full range from 50-900

### Design System
- Tailwind CSS v4 with PostCSS integration
- Mobile-first responsive design
- Framer Motion animations on all transitions
- Shadow and border utilities
- Gradient backgrounds

## Animations

### Framer Motion Effects
- Container variants with staggered children (0.1-0.2s delays)
- Initial animations on page load (opacity, y-translate)
- Hover effects on buttons/cards (scale: 1.02-1.1)
- Exit animations on pathway B removal
- Progress bar animations
- Page transitions (opacity fade)

## Form Validation

All forms include:
- Field-level validation
- Error message display below inputs
- Error state styling (red borders, red-50 background)
- Disable submit button until valid
- Real-time validation feedback

## API Integration

### Axios Client (api/client.js)
- Base URL: `http://localhost:3333/api`
- Methods:
  - `submitProfile(data)` - POST /profile
  - `submitPathways(data)` - POST /pathways
  - `getResults(params)` - POST /results

## Dependencies

### Production
- react, react-dom ^19.2.4
- react-router-dom - Navigation
- framer-motion ^12.38.0 - Animations
- zustand ^5.0.12 - State management
- axios ^1.15.0 - HTTP client
- react-icons ^5.6.0 - Icon library (fi)

### Dev
- vite ^8.0.4 - Build tool
- tailwindcss ^4.2.2 - Styling
- @tailwindcss/postcss - PostCSS plugin
- autoprefixer ^10.5.0
- eslint + plugins - Linting

## Development

### Available Scripts
```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build for production (dist/)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### File Structure
```
src/
 App.jsx                      # Router + Routes
 main.jsx                     # Entry point
 index.css                    # Tailwind imports
 api/
 client.js               # Axios setup   
 components/
 common/                 # Reusable UI   
 Button.jsx      
 InputField.jsx      
 TileSelect.jsx      
 landing/   
 LandingPage.jsx      
 profile/   
 QuickProfileStep1.jsx      
 QuickProfileStep2.jsx      
 pathway/   
 PathwayBuilder.jsx      
 results/   
 ResultsScreen.jsx      
 education/   
 HousingStressGuide.jsx       
 PayslipGuide.jsx       
 MovingCostsGuide.jsx       
 pages/
 NotFound.jsx   
 store/
 useAppStore.js          # Zustand store    
```

## Key Features

 **Complete form-to-results workflow**
 **State persistence across navigation**
 **Responsive mobile-first design**
 **Smooth animations and transitions**
 **Comprehensive validation**
 **Educational content pages**
 **Financial calculation mockups**
 **Pathway comparison UI**
 **Back/Forward navigation**
 **Clean error handling**

## Build Status
 **Builds successfully** - No errors or warnings
 **Development ready** - Vite dev server working
 **Production ready** - Optimized build output

## Notes
- All components are functional with proper error handling
- Mock API client ready for backend integration
- Results calculations are simulated based on profile data
- Housing stress ratio: rent as % of monthly income
- All text content uses simple, accessible language
