# Purchase Parity Converter

## Problem

Travelers often judge whether something is "expensive" or "cheap" based only on currency conversion, which can lead to poor spending decisions. A $5 coffee may sound expensive when converted to Rs430, but it may be completely normal for that country.

## Why It Matters

People planning international trips need a clearer way to understand real-world affordability before deciding what is worth buying. Purchase Parity Converter helps travelers, students, expats, and budget-conscious users estimate whether prices in another country feel cheap, normal, or expensive compared with their home economy.

## Solution

Purchase Parity Converter is a web app that compares travel prices with a simple **Travel Affordability Score**. Instead of only converting currencies, it explains what a price feels like in the user's home country and whether it is meaningfully cheaper, similar, or more expensive than the home benchmark.

The MVP is intentionally focused: 10 high-interest countries, 10 common travel items, currency conversion, Travel Affordability Score, a simple verdict, and a Travel Price Advisor. The single-item converter was removed so the app can focus on advice instead of raw conversion.

## How It Works

1. Select a home country and destination country from the MVP country set.
2. Pick one of 10 common travel items.
3. The backend combines item prices, exchange rates, and purchasing-power data.
4. The frontend displays currency conversion, Travel Affordability Score, and a plain-English verdict.
5. The Travel Price Advisor answers questions like, "Is $25 for lunch in New York expensive for someone from India?" using stored exchange rates, local price ranges, and home-country affordability context.

Core calculation:

```text
Travel Affordability Score = Destination Price x Local Affordability Ratio
```

Example:

```text
Coffee in the USA = $5
Currency conversion = Rs430
Travel Affordability Score = Feels like spending Rs90 in India
Verdict = Normal local pricing
```

Metric guide:

- Price: the amount shown by the shop, menu, ticket, or receipt in the destination currency.
- Currency conversion: what that price becomes in your home currency using the exchange rate.
- Travel Affordability Score: the "feels like" amount in your home currency after adjusting for local affordability.
- Local price range: the normal low-to-high price for the same item in the destination city.
- Home price range: the normal low-to-high price for the same item in your home country.
- Verdict: the final answer that explains whether the price is cheap, normal, or expensive.

Advisor example:

```text
Question: Is $25 for lunch in New York expensive for someone from India?
Answer: $25 is normal for lunch in New York, but for someone from India it may feel like spending around Rs500. It is not a scam price, but it is expensive compared with Indian daily food costs.
```

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite
- MVP data: India, United States, United Kingdom, Japan, Australia, Canada, Germany, France, Singapore, Brazil
- Insight Layer: plain-English interpretation of Travel Affordability Score results
- Travel Price Advisor: structured AI-style explanation using local range, exchange-rate, and affordability-score data
- Data model: countries, items, prices, affordability indexes, exchange rates
- API routes: countries, items, prices, travel price advisor, trip planning
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

Screenshots are not committed yet. Add app screenshots here after capturing the Travel Price Advisor and Trip Planner screens.
