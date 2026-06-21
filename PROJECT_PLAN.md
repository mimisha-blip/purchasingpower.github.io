# Purchase Parity Converter
## Project Planning Document

---

## 1. PROJECT OVERVIEW

**Problem Statement:**
When traveling internationally, travelers struggle to understand the real cost of items because exchange rates don't reflect purchasing power parity (PPP). A loaf of bread that costs ₹20 in India costs $4 in the US, but the PPP-adjusted cost tells a different story about affordability.

**Solution:**
A web/mobile app that converts prices between countries using PPP adjustments, helping travelers understand what items ACTUALLY cost relative to their home economy.

**Target Users:**
- International travelers planning trips
- Expats relocating to new countries
- Curious people wanting to compare global costs
- Budget travelers

---

## 2. MVP (MINIMUM VIABLE PRODUCT)

### Core Features for MVP
```
Phase 1: Basic Conversion
├── Country selector (from/to)
├── Item search database (pre-loaded ~50 common items)
├── PPP conversion calculation
├── Display home equivalent price
└── Mobile responsive UI
```

**MVP Scope:**
- All countries globally (~195 countries)
  - Core database: ~40-50 major countries with complete data
  - Others: Basic PPP data available, prices can be added incrementally
- ~50 common items (bread, rice, coffee, taxi, hotel, etc.)
- No user accounts
- No image recognition (Phase 2+)
- Basic UI (no fancy design)
- **Web-first approach** (mobile app in Phase 3)

---

## 3. FEATURE BREAKDOWN

### Phase 1: MVP (Weeks 1-2)
- [ ] Basic UI: country selection (all countries) + item search
- [ ] Backend: PPP conversion logic
- [ ] Database: Common items with prices in ~50 major countries
- [ ] Display: **Smart & Simple**
  - Default: "USA $4 bread = costs like ₹80 in India" (PPP-adjusted)
  - Toggle for details: Shows % cheaper/expensive vs home + monthly budget impact
  - Optional income field: Calculate "~5% of your daily income" (if provided)
- [ ] Mobile responsive web UI
- [ ] Deployment: Vercel + Railway/Render

### Phase 2: Enhancement (Weeks 3-4)
- [ ] Expand item database to all 195 countries (gradual)
- [ ] Category filtering (Food, Transport, Accommodation, etc.)
- [ ] Trip calculator ("I'm staying 10 days, estimate my budget")
- [ ] Crowdsourced price updates
- [ ] User feedback/ratings on prices
- [ ] Advanced filters (city/region within country)

### Phase 3: Advanced (Weeks 5+)
- [ ] Mobile app (React Native)
- [ ] Image recognition (snap receipt photo → extract item + price)
- [ ] User accounts (save favorite routes, trip history)
- [ ] Real-time price updates from APIs
- [ ] Collaborative price database
- [ ] Wishlist: "Can I afford this in destination country?"
- [ ] City-level price comparison (New York vs rural USA)

---

## 4. DATA REQUIREMENTS

### Essential Data Needed

#### A. Exchange Rates
- Source: `exchangerate-api.com` or `open-exchange-rates.org` (free tier)
- Update frequency: Daily
- Need: Real-time conversion INR → USD, GBP, etc.

#### B. PPP Index
- Source: World Bank, IMF, OECD
- What: PPP ratio between countries
- Example: 1 USD = ₹13 (exchange) but = ₹20 (PPP in India)
- Calculation: Cost in home currency = Destination price × PPP ratio

#### C. Product Prices Database
- What: Typical prices of items in each country
- Format needed:
```
{
  item_id: 1,
  name: "Bread (1 loaf)",
  country: "India",
  price: 20,
  currency: "INR",
  category: "Food",
  last_updated: "2026-06-15",
  source: "crowd" | "api" | "manual"
}
```

#### D. Countries Master List
```
{
  country_code: "IN",
  country_name: "India",
  currency: "INR",
  ppp_index: 20,  // vs USD
  exchange_rate: 83.5  // INR per USD
}
```

---

## 5. TECHNICAL ARCHITECTURE

### Frontend
```
Technology: React.js + Tailwind CSS
Components:
├── HomePage
│   ├── CountrySelector (From/To)
│   ├── ItemSearch (Search bar + categories)
│   ├── ResultsDisplay
│   │   ├── OriginalPrice
│   │   ├── HomeEquivalentPrice
│   │   ├── ExpensiveIndicator (🔴 expensive / 🟢 cheap)
│   │   └── MonthlyBudgetEstimate
│   └── TripCalculator (optional add-on)
└── Navigation (header/footer)

State Management: Context API or Zustand (simple app, no Redux needed)
```

### Backend
```
Technology: Node.js + Express.js (or Python + Flask)
Endpoints:
├── GET /api/countries
│   └── Returns all countries with PPP & exchange rates
├── GET /api/items?country=IN&category=Food
│   └── Returns items in specific country/category
├── POST /api/convert
│   ├── Input: source_country, dest_country, item_id
│   └── Output: original_price, home_equivalent, ppp_ratio
├── GET /api/item-search?q=bread
│   └── Fuzzy search for items
└── POST /api/prices (future: crowdsource prices)
```

### Database
```
Technology: PostgreSQL or MongoDB
Tables:
├── countries (id, name, code, currency, ppp_index, exchange_rate)
├── items (id, name, category, description)
├── prices (id, item_id, country_id, price, currency, source, updated_at)
└── user_feedback (optional: id, item_id, country_id, actual_price, user_rating)
```

### Deployment
```
Frontend: Vercel or Netlify (free tier)
Backend: Heroku or Railway (free tier)
Database: Supabase (PostgreSQL free tier) or MongoDB Atlas
```

---

## 6. CORE LOGIC: PPP CONVERSION

### Formula
```
HomeEquivalentPrice = DestinationPrice × PPP_Ratio

Example:
- Item: Bread in USA = $4
- PPP_Ratio (USD to INR) = 20
- HomeEquivalentPrice (in INR) = 4 × 20 = ₹80
- Compare to actual: ₹20 in India
- Conclusion: Bread is 4x more expensive in USA
```

### Expense Classification
```
Very Cheap:   < 0.5 × India price  🟢
Cheap:        0.5-0.8 × India price 🟡
Similar:      0.8-1.2 × India price ⚪
Expensive:    1.2-2 × India price 🟠
Very Expensive: > 2 × India price 🔴
```

---

## 7. SAMPLE USER FLOWS

### Flow 1: Compare Single Item
```
User: "I want to travel from Japan to Brazil"
↓
User selects: From = "Japan" | To = "Brazil"
↓
User searches: "coffee"
↓
System shows:
  Brazil coffee: R$12
  Equivalent: ¥450 (PPP-adjusted)
  Actual in Japan: ¥500
  Status: 🟢 10% cheaper!
  
  [Show more ▼] – reveals:
  Monthly if bought daily: ~¥13,500 (vs ¥15,000 in Japan)
  Optional: "~8% of your daily income" (if income provided)
↓
User sees options: Check another item / View trip calculator
```

### Flow 2: Trip Budget Estimate
```
User: "Trip to USA for 10 days from India"
↓
System shows estimated breakdown:
  - Food: ~$50/day = ₹2,400/day (PPP) = ₹24,000 total
  - Hotel: ~$60/night = ₹2,880/night = ₹28,800 total
  - Transport: ~$100/trip = ₹2,000/trip = ~₹5,000 total
  - Activities: ~$20/day = ₹1,000/day = ₹10,000 total
  ─────────────────────────────
  Total: ~₹67,800 in home currency
```

### Flow 3: Reality Check
```
User scans receipt photo (future feature)
↓
Image recognition extracts: "Coffee, $5.50"
↓
System shows: Equivalent ₹275 in India
↓
User: "Oh! That's overpriced. I'll go to a local café"
```

---

## 8. DATA SOURCES & COLLECTION STRATEGY

### MVP Phase (Manual/API):
1. **PPP Data**: Download from World Bank (one-time, update yearly)
2. **Exchange Rates**: `exchangerate-api.com` (free API, update daily)
3. **Item Prices**: 
   - Manually enter ~50 common items for 3-5 countries
   - Sources: Numbeo, Expatica, local research
   - Format: CSV → import to database

### Example Price List (Multi-country):
```
Item          | India   | USA    | UK     | Japan  | Brazil | Australia
Bread (1 loaf)| ₹20     | $4     | £1.5   | ¥300   | R$8    | A$5
Rice (1kg)    | ₹40     | $8     | £3     | ¥900   | R$15   | A$10
Coffee        | ₹50     | $4.50  | £3     | ¥500   | R$12   | A$6
Taxi ride     | ₹100    | $15    | £12    | ¥2000  | R$50   | A$25
Hotel room    | ₹1500   | $100   | £80    | ¥12000 | R$300  | A$150
Massage       | ₹300    | $60    | £45    | ¥6000  | R$80   | A$80
```

**MVP Coverage (50 major countries):** USA, UK, Canada, Australia, New Zealand, Japan, South Korea, China, India, Thailand, Vietnam, Indonesia, Philippines, Malaysia, Singapore, UAE, Saudi Arabia, Mexico, Brazil, Argentina, Chile, Peru, France, Germany, Italy, Spain, Netherlands, Switzerland, Sweden, Norway, Denmark, Poland, Greece, Portugal, Turkey, Egypt, South Africa, Kenya, Nigeria, and more...

### Phase 2+:
- Integrate Numbeo API
- Crowdsource from users
- Real-time integration with booking sites

---

## 9. TECH STACK DECISION

### Frontend
- **React.js** (popular, lots of resources)
- **Tailwind CSS** (rapid UI development)
- **Axios** (API calls)
- **React Router** (navigation)
- **Vite** (fast build tool, not Create React App)

### Backend
- **Node.js + Express** (JavaScript everywhere, simple)
  - OR **Python + Flask** (if you prefer Python)
- **Cors** (cross-origin requests)
- **Dotenv** (environment variables)
- **Joi/Zod** (input validation)

### Database
- **PostgreSQL** (via Supabase) - better for structured data
- Alternative: **MongoDB** (more flexible schema)

### Hosting
- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Railway or Render (simple, free tier)
- **Database**: Supabase (PostgreSQL) or MongoDB Atlas

---

## 10. PROJECT TIMELINE

```
Week 1:
├── Day 1: Setup repo, database schema design
├── Day 2-3: Build backend API endpoints
├── Day 4-5: Build React frontend basic layout
└── Day 6-7: Integrate frontend + backend, test

Week 2:
├── Day 1-2: Add more countries/items to database
├── Day 3: Trip calculator feature
├── Day 4-5: Testing, bug fixes
├── Day 6: Documentation
└── Day 7: Deploy to production

Week 3+: Phase 2 features
```

---

## 11. SUCCESS METRICS

- [ ] MVP deployed and accessible
- [ ] Converts prices between any two countries accurately
- [ ] UI is intuitive (user can convert in < 30 seconds)
- [ ] Mobile responsive (web)
- [ ] ~50 items in database across ~50 countries
- [ ] Both "Simple" and "Detailed" views working
- [ ] % of daily earnings calculated when income provided

---

## 12. DECISIONS FINALIZED ✅

1. **Mobile app or web-only for MVP?** ✅ Web-first, mobile app in Phase 3
2. **How to handle PPP for countries without official data?** ✅ Use exchange rate as fallback + crowdsource
3. **Should we include user income level?** ✅ Both views: Simple (home equivalent) + Detailed (% of earnings)
4. **Price update frequency?** ✅ Monthly for MVP, real-time Phase 2+
5. **Target countries for MVP?** ✅ All 195 countries supported, ~50 with detailed price data

---

## Next Steps

1. **Validate** this plan with you
2. **Set up** GitHub repo and project structure
3. **Design** database schema
4. **Create** API endpoints
5. **Build** React frontend
6. **Deploy** and iterate

Ready to start? Want to adjust anything in this plan?
