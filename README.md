# Purchase Parity Converter

## Problem

Travelers often compare prices using exchange rates, but exchange rates do not show how expensive something feels relative to everyday costs at home. A coffee, taxi ride, hotel night, or loaf of bread can look affordable after currency conversion while still being expensive in real purchasing power terms.

## Why It Matters

People planning international trips need a clearer way to understand real-world affordability. Purchase Parity Converter helps travelers, students, expats, and budget-conscious users estimate whether prices in another country feel cheap, normal, or expensive compared with their home economy.

## Solution

Purchase Parity Converter is a web app that adjusts travel and item costs using purchasing power parity (PPP). Instead of only converting currencies, it shows what a price feels like in the user's home country and helps estimate realistic trip budgets.

## How It Works

1. Select a home country and destination country.
2. Choose either the trip planner or single-item converter.
3. Pick common travel categories or specific items.
4. The backend combines item prices, exchange rates, and PPP data.
5. The frontend displays a home-equivalent cost and practical travel budget context.

Core calculation:

```text
Home Equivalent Price = Destination Price x PPP Ratio
```

Example:

```text
Bread in the USA = $4
PPP-adjusted equivalent in India = Rs80
```

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite
- Data model: countries, items, prices, PPP indexes, exchange rates
- API routes: countries, items, prices, single-item conversion, trip planning
- Version control and hosting: GitHub

## Future Improvements

- Add more countries and item prices.
- Add city-level comparisons.
- Support user-submitted price updates.
- Add receipt or menu image scanning.
- Add saved trips and favorite country pairs.
- Connect live exchange-rate updates.
- Improve deployment setup for public access.

## Screenshots

Screenshots are not committed yet. Add app screenshots here after capturing the trip planner and single-item converter screens.
