# Purchase Parity Converter
## Project Planning Document

---

## 1. PROJECT OVERVIEW

**Problem Statement:**
Travelers often judge whether something is "expensive" or "cheap" based only on currency conversion, which can lead to poor spending decisions. A $5 coffee may sound expensive when converted to ₹430, but it may be completely normal for that country.

**Solution:**
A web/mobile app that converts prices between countries and adds a Travel Affordability Score, helping travelers understand what items actually feel like relative to their home economy.

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
├── Country selector for 10 high-interest countries
├── Item selector for 10 common travel items
├── Travel Affordability Score calculation
├── Affordability indicator
├── Insight Layer with plain-English interpretation
├── Travel Price Advisor for simple question-based explanations
├── Display currency conversion and affordability score
└── Mobile responsive UI
```

**MVP Scope:**
- Top 10 countries: India, United States, United Kingdom, Japan, Australia, Canada, Germany, France, Singapore, Brazil
- 10 common travel items: coffee/tea, bottled water, snack, sit-down meal, fast food, groceries, public transit, taxi/rideshare, local SIM card, budget hotel
- Travel Affordability Score between home and destination country
- Affordability indicator: cheap, similar, expensive, or very expensive
- Insight Layer: explain what the converted price means in human terms, not just numbers
- Travel Price Advisor: answer whether a specific travel price is cheap, normal, or expensive using local and home-country context
- Single-item converter removed from the UI; the app should prioritize advice and trip planning over raw conversion.
- Metric guide: clearly explain Price, Currency Conversion, Travel Affordability Score, Local Price Range, Home Price Range, and Verdict.
- No user accounts
- No image recognition (Phase 2+)
- Basic UI (no fancy design)
- **Web-first approach** (mobile app in Phase 3)

---

## 3. FEATURE BREAKDOWN

### Phase 1: MVP (Weeks 1-2)
- [ ] Basic UI: country selection from top 10 countries + item selection
- [ ] Backend: Travel Affordability Score logic
- [ ] Database: 10 common items with prices anchored for the MVP country set
- [ ] Display: **Smart & Simple**
  - Default: "$5 coffee in the US converts to ₹430, but the Travel Affordability Score feels like spending ₹90 in India"
  - Shows % cheaper/expensive vs home
  - Shows affordability indicator
  - Shows insight sentence: "A $5 coffee in the US converts to ₹430, but its Travel Affordability Score feels like spending ₹90 in India. Verdict: Normal local pricing."
  - Shows advisor answer: "$25 is normal for lunch in New York, but for someone from India it may feel like spending around ₹500."
- [ ] Mobile responsive web UI
- [ ] Deployment: Vercel + Railway/Render

### Phase 2: Enhancement (Weeks 3-4)
- [ ] Expand item database beyond the top 10 countries
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

#### B. Affordability Index
- Source: World Bank, IMF, OECD purchasing-power datasets
- What: Affordability ratio between countries
- Example: $4.50 converts to about ₹372, but the Travel Affordability Score can feel closer to ₹91 in India
- Calculation: Travel Affordability Score = Destination price × local affordability ratio

#### C. Product Prices Database
- What: Typical prices of items in each country
- Format needed:
```
{
  item_id: 1,
  name: "Coffee or tea (1 cup)",
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
  affordability_index: 20,  // vs USD baseline
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
│   └── Returns the 10 MVP countries with affordability & exchange rate data
├── GET /api/items?country=IN&category=Food
│   └── Returns items in specific country/category
├── POST /api/advisor/price
│   ├── Input: home_country_id, destination_country_id, item price, local ranges
│   └── Output: currency conversion, Travel Affordability Score, verdict, explanation
├── GET /api/item-search?q=coffee
│   └── Fuzzy search for items
└── POST /api/prices (future: crowdsource prices)
```

### Database
```
Technology: PostgreSQL or MongoDB
Tables:
├── countries (id, name, code, currency, affordability_index, exchange_rate)
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

## 6. CORE LOGIC: TRAVEL AFFORDABILITY SCORE

### Formula
```
TravelAffordabilityScore = DestinationPrice × LocalAffordabilityRatio

Example:
- Item: Coffee in USA = $4.50
- LocalAffordabilityRatio (USD to INR) = 20
- TravelAffordabilityScore (in INR) = 4.5 × 20 = ₹90
- Compare to actual: ₹50 in India
- Conclusion: Coffee is more expensive in the USA, but the indicator explains whether it is cheap, similar, or expensive relative to home.
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
  Travel Affordability Score: feels like ¥450
  Actual in Japan: ¥500
  Status: 🟢 10% cheaper!
  
  [Show more ▼] – reveals:
  Monthly if bought daily: ~¥13,500 (vs ¥15,000 in Japan)
↓
User sees options: Check another item / View trip calculator
```

### Flow 2: Trip Budget Estimate
```
User: "Trip to USA for 10 days from India"
↓
System shows estimated breakdown:
  - Food: ~$50/day = ₹2,400/day score = ₹24,000 total
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
1. **Affordability Data**: Download purchasing-power data from World Bank (one-time, update yearly)
2. **Exchange Rates**: `exchangerate-api.com` (free API, update daily)
3. **Item Prices**: 
   - Manually enter 10 common travel items for the focused MVP country set
   - Sources: Numbeo, Expatica, local research
   - Format: CSV → import to database

### Example Price List (MVP items):
```
Item          | India   | USA    | UK     | Japan  | Brazil | Australia
Coffee        | ₹50     | $4.50  | £3     | ¥500   | R$12   | A$6
Bottled water | ₹20     | $1.50  | £1     | ¥120   | R$4    | A$3
Snack         | ₹40     | $4     | £3     | ¥300   | R$8    | A$5
Casual meal   | ₹300    | $18    | £14    | ¥1500  | R$40   | A$25
Fast food     | ₹250    | $9     | £7     | ¥900   | R$30   | A$14
Groceries     | ₹600    | $35    | £28    | ¥5000  | R$120  | A$60
Transit ride  | ₹20     | $2.75  | £2.80  | ¥220   | R$5    | A$5
Taxi ride     | ₹100    | $15    | £12    | ¥2000  | R$50   | A$25
Local SIM     | ₹50     | $10    | £5     | ¥1500  | R$20   | A$10
Budget hotel  | ₹1000   | $70    | £55    | ¥8000  | R$180  | A$120
```

**MVP Coverage (10 countries):** India, United States, United Kingdom, Japan, Australia, Canada, Germany, France, Singapore, Brazil.

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
- [ ] Converts prices across the 10 MVP countries accurately
- [ ] UI is intuitive (user can convert in < 30 seconds)
- [ ] Mobile responsive (web)
- [ ] 10 common items in database across the MVP country set
- [ ] Both "Simple" and "Detailed" views working
- [ ] Affordability indicator clearly labels cheap, similar, expensive, or very expensive

---

## 12. DECISIONS FINALIZED ✅

1. **Mobile app or web-only for MVP?** ✅ Web-first, mobile app in Phase 3
2. **How to handle countries without official affordability data?** ✅ Keep the MVP to countries with usable data
3. **Should we include user income level?** ✅ Not needed for the MVP
4. **Price update frequency?** ✅ Monthly for MVP, real-time Phase 2+
5. **Target countries for MVP?** ✅ 10 countries: India, US, UK, Japan, Australia, Canada, Germany, France, Singapore, Brazil

---

## Next Steps

1. **Validate** this plan with you
2. **Set up** GitHub repo and project structure
3. **Design** database schema
4. **Create** API endpoints
5. **Build** React frontend
6. **Deploy** and iterate

Ready to start? Want to adjust anything in this plan?
