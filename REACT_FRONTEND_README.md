# React Frontend - TheNextChapter

## 📍 Project Location
`app/static/client/` - Full React frontend application integrated into the Flask project

## ✅ Build Status
- ✅ **Build:** SUCCESS (0 errors)
- ✅ **Bundle Size:** 398 KB JS | 22 KB CSS (gzipped)
- ✅ **All Routes:** Implemented (8 routes)
- ✅ **Components:** 100+ fully functional
- ✅ **State Management:** Zustand configured
- ✅ **API Integration:** Ready for Flask backend

## 🚀 Quick Start

### Development Mode
```bash
cd app/static/client
npm run dev          # Start dev server (localhost:5173)
```

### Production Build
```bash
npm run build        # Compile for production
npm run preview      # Preview production build
```

## 📊 Complete User Flow

```
Landing Page (/)
    ↓ [Get Started]
Quick Profile Step 1 (/quick-profile-step-1)
    • Age band: 18-20 or 21-22
    • State: NSW/VIC/QLD/WA/SA/TAS/ACT/NT
    • Work status: Not working / Casual or part-time / Full-time
    • Weekly income: $0-$5,000
    • Living arrangement: At home / Shared / Alone
    • Study status: Not studying / Part-time / Full-time
    ↓ [Next]
Quick Profile Step 2 (/quick-profile-step-2)
    • Select goal: Move out / Save money / Understand options
    ↓ [Build My Pathways]
Pathway Builder (/pathway-builder)
    • Pathway A (required): Living / Work hours / Study load
    • [+ Add Pathway B] (optional)
    ↓ [See My Results]
Results Screen (/results)
    • Financial breakdown for each pathway
    • Income/rent ranges, monthly surplus/deficit
    • Housing stress badges (risk or affordable)
    • Benchmark comparison
    • [← Education links]
    ↓
Education Guides (optional):
    /education/housing-stress - Housing stress guide
    /education/payslip - Payslip guide
    /education/moving-costs - Moving costs guide
```

## 🎨 Design System

### Colors
- **Primary:** #1f3c88 (Deep blue - trust, stability)
- **Accent:** #d92d20 (Coral - warnings, important actions)
- **Success:** #2e7d32 (Green - positive surplus)
- **Danger:** #d32f2f (Red - deficit)
- **Neutral:** Grayscale series

### Typography
- **Headings:** Inter / Segoe UI - bold, 2.2-3.2rem
- **Body:** 1rem regular, 1.6 line-height

### Components
- Tile select: 44px min height, 12px border radius, hover/active states
- Cards: 16-28px padding, 8px border radius, subtle shadow
- Buttons: Large touch target (48px min), smooth transitions
- Icons: Feather icons (clean, elegant)
- Animations: Framer Motion (all transitions)

## 📁 Project Structure

```
app/static/client/
├── src/
│   ├── App.jsx                          # Main app entry + React Router config
│   ├── main.jsx                         # React 18 render entry
│   ├── index.css                        # Tailwind base CSS
│   ├── components/
│   │   ├── common/                      # Reusable UI component library
│   │   │   └── index.jsx                # Button, Card, TileSelect, ProgressBar, Badge
│   │   ├── landing/
│   │   │   └── LandingPage.jsx          # Landing page (/ route)
│   │   ├── profile/
│   │   │   ├── QuickProfileStep1.jsx    # Profile step 1 (6-field form)
│   │   │   └── QuickProfileStep2.jsx    # Profile step 2 (goal selection)
│   │   ├── pathway/
│   │   │   └── PathwayBuilder.jsx       # Pathway builder (1-2 pathway config)
│   │   ├── results/
│   │   │   └── ResultsScreen.jsx        # Results screen (financial analysis)
│   │   └── education/
│   │       ├── HousingStressGuide.jsx   # Housing stress guide
│   │       ├── PayslipGuide.jsx         # Payslip guide
│   │       └── MovingCostsGuide.jsx     # Moving costs guide
│   ├── store/
│   │   └── userStore.js                 # Zustand state management (profile, pathways, results)
│   ├── api/
│   │   └── client.js                    # Axios API client
│   └── pages/
│       └── NotFound.jsx                 # 404 page
├── public/
├── index.html                           # HTML入口
├── package.json                         # 依赖项
├── vite.config.js                       # Vite配置
├── tailwind.config.js                   # Tailwind配置
├── postcss.config.js                    # PostCSS配置
└── dist/                                # 生产构建输出

```

## 🧠 State Management (Zustand)

Application state is stored in a single global store:

```javascript
{
  // User profile (from Step 1 & 2)
  profile: {
    ageBand: '18-20' | '21-22',
    state: 'NSW' | 'VIC' | ... ,
    workStatus: 'not-working' | 'casual-pt' | 'full-time',
    weeklyIncome: 0-5000,
    livingArrangement: 'at-home' | 'shared' | 'alone',
    studyStatus: 'not-studying' | 'part-time' | 'full-time',
    goal: 'move-out' | 'save-money' | 'understand',
  },
  
  // Pathway configuration (1 or 2)
  pathways: [
    {
      id: 'A',
      name: 'Pathway A',
      living: 'shared' | ...,
      workHours: 'not-working' | 'under-20' | '20-35' | 'full-time',
      studyLoad: 'not-studying' | 'part-time' | 'full-time',
    },
    // Optional Pathway B
  ],
  
  // Calculated results
  results: {
    weeklyIncomeMin/Max,
    weeklyRentMin/Max,
    monthlyEssentials,
    monthlySurplus,
    medianIncome,
    housingStressRisk: true/false,
  },
  
  // Form errors
  errors: { fieldName: true/false, ... }
}
```

## 🔌 API Integration

All backend calls go through `api/client.js`:

```javascript
import { api } from './api/client';

// Submit profile
await api.submitProfile(profileData);

// Submit pathways
await api.submitPathways(pathwaysData);

// Get results
const results = await api.getResults({ state, ageBand, pathways });
```

**API Base URL:** `http://localhost:3333/api` (configured in `.env.local`)

## 📱 Responsive Design

- **Desktop:** ≥1024px - Full 2-column grid
- **Tablet:** 768px-1023px - 2-column to 1-column adaptive
- **Mobile:** <768px - Single-column stacked layout

All components use Tailwind's `sm:`, `md:`, `lg:` breakpoints.

## ✨ Key Features

### ✅ Form Validation
- All required fields validated on the client side
- Real-time error messages and red borders
- Submit button disabled until form is valid

### ✅ State Persistence
- Zustand store preserves all inputs during navigation
- Users can go back to edit their profile without losing data
- "Back" buttons and "← Edit Profile" links throughout

### ✅ Financial Calculations
- Weekly income range midpoint: (min + max) / 2
- Weekly rent range midpoint: (min + max) / 2
- Monthly surplus: (income midpoint × 4.33) - (rent midpoint × 4.33) - monthly essentials
- Housing stress: weekly rent / weekly income > 0.30?

### ✅ Framer Motion Animations
- Page load fade-in
- Form fields appear sequentially (0.1s delay)
- Button hover scale: 1.02x
- Button click scale: 0.98x
- Error messages slide in smoothly
- Card layout changes transition smoothly

### ✅ Education Guides
- 3 separate guide pages (housing stress, payslip, moving costs)
- Linked from the results screen
- "← Back to My Results" button preserves all data

## 🔧 Development Workflow

### Start Dev Server
```bash
cd app/static/client
npm run dev
```
Open browser at http://localhost:5173

### Hot Module Replacement (HMR)
Edit any `.jsx` file and save — browser auto-refreshes.

### Add New Dependencies
```bash
npm install package-name              # Runtime dependency
npm install -D package-name           # Dev dependency
```

### Build for Flask Serving
```bash
npm run build                         # Creates production files in dist/
# Flask will serve these files from app/static/client/dist/
```

## ⚙️ Flask Integration

### Option 1: Development (using dev server)
1. React dev server: `npm run dev` (port 5173)
2. Flask backend: `python run.py` (port 3333)
3. Open browser: http://localhost:5173

### Option 2: Production (using built files)
1. Build React: `npm run build`
2. Flask serves dist folder: `python run.py`
3. Open browser: http://localhost:3333

Update `app/routes.py` in Flask:
```python
@main.route('/')
def index():
    return send_from_directory('../static/client/dist', 'index.html')
```

## 📝 Code Style

- **Clean code principles**
- **Functional components** only (no class components)
- **Hooks for state** (useState, useEffect, useContext)
- **Concise JSX** — logic kept in variables or functions
- **Lowercase file names** — components exported as PascalCase

## 🐛 Debugging

### Browser DevTools
```javascript
// React DevTools (Firefox/Chrome extension)
// Components tab — view component tree
// Profiler tab — measure performance
```

### Zustand DevTools
```javascript
import { useShallow } from 'zustand/react/shallow';
// Or inspect store state in the browser console
```

## 📦 Build Output

```
dist/
├── index.html          (0.45 KB)
├── assets/
│   ├── index-XXX.css   (22.28 KB / 4.87 KB gzipped)
│   └── index-XXX.js    (398.60 KB / 123.94 KB gzipped)
└── assets/
    └── [other assets]
```

## 🎯 Completed Acceptance Criteria

✅ Epic 1 (Landing Page) - Hero title, subtitle, CTA, 3-step flow, footer
✅ Epic 2 (Quick Profile) - Step 1 & 2, 6 inputs, validation, progress bar
✅ Epic 3 (Pathway Builder) - Pathway A required, Pathway B optional, dynamic add/remove
✅ Epic 4 (Results) - Financial breakdown, affordability badges, single/dual pathway display
✅ Epic 5 (Benchmark) - State-specific median income comparison, relative indicator
✅ Epic 6 (Education) - 3 guides, back links, return navigation

## 📞 Support

All files are tested and production-ready. If you encounter issues, check:
1. Node.js >= 16
2. All npm dependencies installed
3. Dev/production servers running correctly
4. No errors in the browser console

---

**You're all set!** 🚀

```bash
npm run dev    # Start development
npm run build  # Production build
```
