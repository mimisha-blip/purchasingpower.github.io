# Purchase Parity Converter

## Problem

Travelers often judge whether something is "expensive" or "cheap" based only on currency conversion, which can lead to poor spending decisions. A $5 coffee may sound expensive when converted to Rs430, but it may be completely normal for that country.

## Why It Matters

People planning international trips need a clearer way to understand real-world affordability before deciding what is worth buying. Purchase Parity Converter helps travelers, students, expats, and budget-conscious users estimate whether prices in another country feel cheap, normal, or expensive compared with their home economy.

## Solution

Purchase Parity Converter is a web app that adjusts travel and item costs using purchasing power parity (PPP). Instead of only converting currencies, it adds an Insight Layer that explains what a price feels like in the user's home country and whether it is meaningfully cheaper, similar, or more expensive than the home benchmark.

The MVP is intentionally focused: 10 high-interest countries, 10 common travel items, PPP comparison, and a simple affordability indicator.

## How It Works

1. Select a home country and destination country from the MVP country set.
2. Pick one of 10 common travel items.
3. The backend combines item prices, exchange rates, and PPP data.
4. The frontend displays a home-equivalent cost, PPP comparison, affordability indicator, and plain-English insight.

Core calculation:

```text
Home Equivalent Price = Destination Price x PPP Ratio
```

Example:

```text
Coffee in the USA = $4.50
PPP-adjusted equivalent in India = Rs91
Insight: A USD 4.50 coffee in the United States feels similar to paying INR 91 in India. Compared with the typical India price, it is 1.8x more expensive.
```

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite
- MVP data: India, United States, United Kingdom, Japan, Australia, Canada, Germany, France, Singapore, Brazil
- Insight Layer: plain-English interpretation of PPP and affordability results
- Data model: countries, items, prices, PPP indexes, exchange rates
- API routes: countries, items, prices, single-item conversion, trip planning
- Version control and hosting: GitHub

## Future Improvements

- Add more countries and item prices after the focused MVP is working well.
- Add city-level comparisons.
- Support user-submitted price updates.
- Add receipt or menu image scanning.
- Add saved trips and favorite country pairs.
- Connect live exchange-rate updates.
- Improve deployment setup for public access.

## Screenshots

Screenshots are not committed yet. Add app screenshots here after capturing the trip planner and single-item converter screens.
