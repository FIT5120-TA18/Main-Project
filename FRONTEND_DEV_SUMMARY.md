# TheNextChapter - Frontend Development Summary (Iteration 1)

##  Completed Frontend Pages

### 1. **Landing Page** (`landing.html`)
- **Status Enhanced existing**: 
- **Features**:
  - Clear headline: "Compare your next life move using real Australian data"
  - Subheadline: "No login. No bank details. Just your situation and ABS benchmarks."
  - "Get Started" CTA button
  - 3-step flow summary
  - Data privacy footer note
- **Acceptance Criteria**: All items visible without scrolling 

### 2. **Quick Profile - Step 1** (`quick_profile.html`)
- **Status Enhanced existing**: 
- **Features**:
  - Progress indicator (Step 1 of 2)
  - 6-step form covering:
    - Age band (tile select)
    - State (tile select, 8 options)
    - Work status (tile select)
    - Weekly income (numeric input, $0-$5000)
    - Living arrangement (tile select)
    - Study status (tile select)
  - Client-side validation with error messages
  - Red borders + warning icons for incomplete fields
  - Back/Next navigation
- **Acceptance Criteria**: All fields, validation, error handling 

### 3. **Quick Profile - Step 2** (`quick_profile_step_2.html`) 
- **Status New - FULLY IMPLEMENTED**: 
- **Features**:
  - Progress indicator (Step 2 of 2)
  - Goal selection (3 tile options):
 "Am I ready financially to leave home?"
 "How can I improve my monthly surplus?"
 "What does each life path look like?"
  - Each tile displays goal title + description
  - "Build My Pathways" CTA button
 Edit profile" back navigation  - "
  - Form validation (goal required)
- **Acceptance Criteria**: All elements present, validation working 

### 4. **Pathway Builder** (`pathway_builder.html`)
- **Status New - FULLY IMPLEMENTED**: 
- **Features**:
  - Title: "Build the pathways you want to compare"
  - **Pathway A** (always present):
    - Editable name field (pre-filled "Pathway A")
    - Living arrangement tile select (3 options)
    - Work hours tile select (4 options)
    - Study load tile select (3 options)
  - **"Add Pathway B"** button (toggles optional Pathway B)
  - **Pathway B** (optional):
    - Identical structure to Pathway A
    - Remove button to delete Pathway B
  - "See My Results" button
  - Validation ensures all selected fields are completed
  - Side-by-side layout (2 columns desktop, 1 column mobile)
- **Acceptance Criteria**: All fields, optional Pathway B, validation 

### 5. **Results Screen** (`results.html`)
- **Status New - FULLY IMPLEMENTED (with mock data)**: 
- **Features**:
  - Page title: "Your financial breakdown"
  - For each pathway (Pathway A + optional Pathway B):
    - Pathway name
    - Estimated weekly income range (e.g., "$$680")520
    - Estimated weekly rent (e.g., "$$220")140
    - Monthly essentials estimate
    - **Monthly surplus/deficit** (bold, color-coded: green positive/red negative)
    - **Affordability badge**:
      - Green "Affordable" if  30% of incomerent 
      - Coral "Housing Stress Risk" if rent > 30% of income
    - **Affordability note** with plain-language explanation
    - **"How does this compare?" section** with:
      - User's estimated income
      - Median income for cohort in state
      - Relative indicator (Below / Typical / Above average)
  - Side-by-side layout (2 columns desktop, stacked 768px)mobile 
  - Data sources footer
  -  Edit profile", "Learn more about budgeting"Navigation: "
- **Acceptance Criteria**: All data displays, color coding, benchmarking 

### 6. **Education - Housing Stress** (`education_housing_stress.html`)
- **Status New - FULLY IMPLEMENTED**: 
- **Features**:
  - Title: "What is housing stress?"
  - Definition: "Housing stress = spending > 30% of income on rent"
  - "Why it matters" section with 4 bullet points:
    - Less money for basics
    - No emergency buffer
    - Harder to save
    - Mental health impact
  - "What you can do" section with 4 actionable bullet points:
    - Share housing
    - Move to lower-cost area
    - Increase income
    - Seek support
  - Encouragement box with reminder
  - Source citation: "ABS Housing Occupancy and Costs 20"2019
 Back to My Results" button  - "
- **Acceptance Criteria**: All content, links, back navigation 

### 7. **Education - How to Read Your Payslip** (`education_payslip.html`)
- **Status New - FULLY IMPLEMENTED**: 
- **Features**:
  - Title: "How to read your payslip"
  - **Key terms** (4 sections):
    - Gross income (before deductions)
    - Tax withheld (ATO payment)
    - Superannuation (11.5% example)
    - Net / take-home pay
  - **Quick worked example** table:
    - Gross: $800/week
    - $104Tax: 
    - $92Super: 
    - Take-home: $604
  - Source citation: "ATO Pay as you go withholding, 26"2025  - 
 Back to My Results" button  - "
- **Acceptance Criteria**: All definitions, worked example, back navigation 

### 8. **Education - Hidden Costs of Moving Out** (`education_moving_costs.html`)
- **Status New - FULLY IMPLEMENTED**: 
- **Features**:
  - Title: "Hidden costs of moving out"
  - **Upfront costs** (before moving in):
    - Bond: $1,$1,600000
    - Advance rent: $$800500
    - Utility connection: $$150 per service50
    - Rental application fee: $$2000
  - **Ongoing costs** (monthly):
    - Contents insurance: $$30/month15
    - Utilities: $$250/month150
    - Groceries: $$130/week80
  - **Furniture/appliances**: $$2,500 one-off800
 **Total move-in cost**: $2,$5,000 budget500  - 
  - **Money-saving tips** (5 bullet points):
    - Share housing
    - Buy secondhand
    - Start minimal
    - Compare utilities
    - Plan ahead
  - Source citations: "ABS Household Expenditure 23, Tenants Victoria"2022
 Back to My Results" button  - "
- **Acceptance Criteria**: All 6+ costs, ranges, tips, back navigation 

---

## 
All pages are **mobile-first** with responsive breakpoints:
- **768px): Full layouts (2-column grids where applicable)Desktop** (
- **768px): Single-column layouts, stacked cardsTablet** (
- **480px): Optimized touch targets, full-width buttonsMobile** (

---

## 
### Color Palette
- **Primary**: Dark blue `#1f3c88` (buttons, links, highlights)
- **Secondary**: Light blue `#5f88ff` (focus states, secondary elements)
- **Success**: Green `#2e7d32` (positive surplus)
- **Warning/Error**: Red `#c62828` (negative surplus, validation)
- **Stress Badge**: Coral `#d92d20` (housing stress risk)
- **Safe Badge**: Green `#155724` (affordable)
- **Background**: Light `#f8f9fa`
- **Text**: Dark `#1f2430`, Medium `#666`

### Typography
- **Font**: Arial/system sans-serif (clean, accessible)
- **Headings**: 2.6rem, weight 7002
- **Body**: 1rem, line-height 1.1.85
- **Labels**: 0.0.95rem, weight 6009

### Components
- **Tiles**: 12px border-radius, 44px min-height, hover lift effect
- **Buttons**: 12px border-radius, shadow on CTA, hover state
- **Cards**: 28px padding, 16px border-radius, subtle shadow16
- **Inputs**: 14px border-radius, blue focus outline

---

## 
```
1. Landing Page (/) 
 "Get Started"   
2. Quick Profile Step 1 (/quick-profile)
 "Next"   
3. Quick Profile Step 2 (/quick-profile-step-2)
 "Build My Pathways"   
4. Pathway Builder (/pathway-builder)
 "See My Results"   
5. Results (/results)
 back to Pathway Builder
 Links to Education pages:   
       - /education/housing-stress
       - /education/payslip
       - /education/moving-costs
```

---

## 
### Templates (8 total)
-  `app/templates/landing.html` (existing, enhanced)
-  `app/templates/quick_profile.html` (existing, enhanced)
-  `app/templates/quick_profile_step_2.html` (NEW)
-  `app/templates/pathway_builder.html` (NEW)
-  `app/templates/results.html` (NEW)
-  `app/templates/education_housing_stress.html` (NEW)
-  `app/templates/education_payslip.html` (NEW)
-  `app/templates/education_moving_costs.html` (NEW)

### Styles
-  `app/static/css/style.css` (extended with 300+ lines)
  - Goal tile styles
  - Pathway builder card styles
  - Results card & display styles
  - Affordability badges
  - Benchmark section styles
  - Mobile responsive breakpoints

### Routes
-  `app/routes.py` (updated with all page routes)
  - `/quick-profile-step-2` (GET/POST)
  - `/pathway-builder` (GET/POST)
  - `/results` (GET)
  - `/education/housing-stress` (GET)
  - `/education/payslip` (GET)
  - `/education/moving-costs` (GET)

---

 Key Features Implemented## 

###  Validation
- Client-side form validation on all inputs
- Tile selection with visual feedback (red borders, warning icons)
- Error messages below fields and in summary box
- "Please complete all fields" messages

###  Accessibility
- Semantic HTML (headings, forms, buttons)
- Clear focus states on all interactive elements
- High contrast color scheme (WCAG AA compliant)
- Plain language (no jargon)
- Responsive touch targets (44px min)

###  User Experience
- Progress indicators (Step X of Y, progress bars)
- Smooth animations (fade-in on page load)
- Clear CTAs with descriptive text
- Back navigation available at all steps
- Visual hierarchy through sizing and weight

###  Data Flow
- Session storage for user inputs (not persisted to DB)
- Form data passed through POST requests
- Pathway A always required, Pathway B optional
- Goal captured as context for results

---

## 
1. **Start Flask server**: `python3 run.py`
2. **Open browser**: `http://localhost:5000`
3. **Navigate through flow**:
 Profile Step 1
 Profile Step 2
 Pathway Builder
 "See My Results"
 Click education links to explore content

---

## 
| Epic | User Story | Feature | Status |
|------|-----------|---------|--------|
| 1    | 1.1        | Landing page with CTA | | 
| 2    | 2.1        | Profile Step 1 (6 fields, validation |) | 
| 2    | 2.2        | Profile Step 2 (goal selection |) | 
| 3    | 3.1        | Pathway A builder | | 
| 3    | 3.2        | Pathway B optional add/remove | | 
| 4    | 4.1        | Results card with financials (mock data) | | 
| 4    | 4.2        | Housing stress badge & warning (mock logic) | | 
| 5    | 5.1        | Benchmark comparison section (mock data) | | 
| 6    | 6.1        | Housing stress education | | 
| 6    | 6.2        | Payslip education | | 
| 6    | 6.3        | Moving costs education | | 

---

## 
1. **Results Screen Data Binding**:
   - Replace mock income/rent ranges with ABS lookup query results
   - Implement monthly surplus calculation with real data
   - Dynamic housing stress badge based on calculated ratio

2. **Session Data Integration**:
   - Pass profile + pathway data to results template
   - Pre-populate pathway names if editing

3. **Backend API**:
   - Create endpoint to query ABS benchmark data by state/age/work status
   - Calculate income range, rent range, affordability scores

4. **Error Handling**:
   - Add error pages for missing session data
   - Validation on backend before processing

5. **Analytics** (optional):
   - Track user progression through flow
   - Log errors and validation failures

---

##  Deployment Checklist

- [x] All templates created and tested
- [x] CSS extended with new component styles
- [x] Routes configured and working
- [x] Mobile responsive design
- [x] Form validation implemented
- [x] Navigation flow complete
- [x] Education content populated
- [ ] Backend data integration (pending Zafri's ABS lookup logic)
- [ ] Session data persistence (working, but backend calc needed)
- [ ] Hosted on team domain (pending infrastructure)

---

**Frontend Development Complete for Iteration 1** 

All 8 pages fully implemented per Epic 6 acceptance criteria.1
Ready for backend integration and final polish before Week 6 build demo.
