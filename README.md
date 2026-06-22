# Global Cost Advisor

A travel and relocation affordability tool that helps people understand what prices really mean across countries.

The core problem it solves: travelers often judge something as "cheap" or "expensive" using currency conversion alone. A $5 coffee may convert to around Rs430, but that does not explain whether it is normal in the destination country or how it compares with the user's home spending power. Global Cost Advisor adds context through a Travel Affordability Score, item benchmarks, relocation estimates, and a built-in advisor chat.

---

## Features

- **Travel Price Advisor** - select a preset item, enter the price seen abroad, and get currency conversion, affordability score, and a clear verdict
- **Travel Affordability Score** - explains what a foreign price feels like in the user's home economy, instead of only showing exchange-rate conversion
- **20 preset comparison items** - covers common travel and lifestyle purchases such as coffee, lunch, iPhone, laptop, movie ticket, amusement park ticket, car rental, sneakers, hotel room, and haircut
- **Item-aware reasoning** - compares electronics with electronics, food with food, and services with services so results do not feel mismatched
- **Relocation Advisor** - estimates monthly spending when moving countries, including housing, food, transportation, utilities, healthcare, and entertainment
- **Cost shock summary** - highlights the biggest increase, most affordable category, and equivalent lifestyle at home
- **Floating chat assistant** - lets users ask follow-up questions without opening another tab

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm v8 or later

Verify your versions before starting:

```bash
node -v
npm -v
```

### Step 1 - Clone the repo

```bash
git clone https://github.com/mimisha-blip/purchasingpower.github.io.git
cd purchasingpower.github.io
```

### Step 2 - Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 - Seed the local database

```bash
npm run seed
```

This creates and fills the SQLite database with countries, exchange rates, affordability data, and benchmark prices.

### Step 4 - Start the backend

```bash
PORT=5050 npm run dev
```

The API runs at `http://localhost:5050/api`.

### Step 5 - Install frontend dependencies

Open a second terminal:

```bash
cd frontend
npm install
```

### Step 6 - Start the frontend

```bash
npm run dev
```

The app opens at the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Step 7 - First run

1. Open the app in your browser
2. Go to **Advisor**
3. Select your home country and destination country
4. Pick one of the preset items
5. Enter the price you saw abroad
6. Read the summary, Travel Affordability Score, and verdict

---

## Travel Price Advisor

The Advisor is designed for quick travel decisions.

Example question:

```text
Is $25 for lunch in New York expensive for someone from India?
```

Example output:

```text
Currency conversion: about Rs2,075
Travel Affordability Score: feels closer to Rs500 in India
Verdict: normal local pricing, but expensive compared with everyday Indian lunch costs
```

The goal is not just to convert money. The goal is to explain whether a price is normal, high, or unusually low in real spending context.

### Preset items

The MVP uses a fixed list of 20 varied items:

| Category | Items |
|---|---|
| Food & drink | Coffee, lunch, fast food meal, bottled water, groceries |
| Electronics | iPhone, smartphone, laptop |
| Entertainment | Movie ticket, amusement park ticket, museum ticket |
| Transport | Taxi ride, public transit ride, car rental |
| Stay | Hotel room, hostel bed |
| Products & services | Local SIM card, sneakers, T-shirt, haircut |

Using preset items keeps the comparison focused and avoids confusing results, such as comparing an iPhone with food benchmarks.

---

## Travel Affordability Score

Travel Affordability Score is the app's plain-language affordability metric.

It answers:

```text
What would this foreign price feel like in my home country?
```

For daily spending categories such as food, transport, stay, and services, the score adjusts the price using affordability and local benchmark data. For products such as phones and laptops, the app gives more weight to actual item prices and exchange-rate reality, because electronics often follow global pricing more closely than meals or rent.

### Verdict levels

| Verdict | Meaning |
|---|---|
| Cheap | Lower than the normal destination benchmark |
| Normal local pricing | Within the expected medium range for that country |
| Expensive | Higher than the usual local range |
| Very expensive | Much higher than typical local pricing |

---

## Relocation Advisor

The Relocation Advisor helps users estimate what life may cost after moving.

Example:

```text
I'm moving from India to San Francisco.
```

Example output:

```text
Expected monthly spending: $4,500
Equivalent lifestyle in India: Rs95,000/month
Most surprising cost increase: Rent
Most affordable category: Electronics
```

Category comparison:

| Category | Example change |
|---|---:|
| Housing | +280% |
| Food | +140% |
| Transportation | +60% |
| Utilities | +45% |

This makes the app useful for travelers, international students, digital nomads, expats, and people planning a move.

---

## Chat Assistant

The floating chat assistant acts like a travel price advisor, not a general chatbot.

Example questions:

- What does Travel Affordability Score mean?
- Is $25 lunch in New York expensive for someone from India?
- Why is rent the biggest shock in San Francisco?
- What is cheaper in the US than India?
- How much should I budget if I move from India to San Francisco?

The assistant gives short, practical answers using the same affordability logic as the app.

---

## Data & Assumptions

The MVP uses seeded benchmark data instead of live internet prices.

### What the data includes

- Country affordability indexes
- Exchange rates
- Medium-range item prices
- Typical destination price ranges
- Relocation category estimates

### Why medium-range prices

The app intentionally uses medium-range prices, not the cheapest prices. The goal is to show what a user is likely to experience in normal travel or relocation scenarios, not the best possible bargain.

### Important note

All outputs are directional estimates. They are meant to support better decisions, not replace live market research for major purchases or relocation planning.

---

## Demo Scenarios

Try these examples after running the app:

| Scenario | What to test |
|---|---|
| India to USA, coffee, $5 | Shows conversion, affordability score, and normal local pricing |
| India to USA, iPhone, $999 | Compares against electronics pricing, not food affordability |
| India to USA, lunch, $25 | Explains that the price is normal locally but still feels expensive from India |
| India to San Francisco relocation | Shows monthly spending and category cost shock |

---

## Screenshots

Screenshots are not committed yet. Add screenshots for:

- Travel Price Advisor
- Relocation Advisor
- Floating Chat Assistant

---

## Roadmap

### V0 - Current MVP

React + Express + SQLite app with seeded data, preset advisor items, relocation estimates, and rule-based chat guidance.

### V1 - Better data coverage

Add more countries, more cities, richer item benchmarks, and scheduled exchange-rate updates.

### V2 - Smarter advisor

Connect the chat assistant to a real LLM with structured app data, add city-level price intelligence, and support more nuanced user questions.

### V3 - Personalization

Add saved comparisons, user-submitted prices, custom lifestyle profiles, and relocation budget reports.

---

## Tech Stack

- [React](https://react.dev) - frontend UI
- [Vite](https://vitejs.dev) - frontend dev server and build tooling
- [Node.js](https://nodejs.org) - backend runtime
- [Express](https://expressjs.com) - API server
- [SQLite](https://www.sqlite.org) - local database
- CSS - responsive styling
