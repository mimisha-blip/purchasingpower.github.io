# Purchase Parity Converter

## Problem

Travelers often judge whether something is "expensive" or "cheap" based only on currency conversion, which can lead to poor spending decisions. A $5 coffee may sound expensive when converted to Rs430, but it may be completely normal for that country.

## Why It Matters

People planning international trips need a clearer way to understand real-world affordability before deciding what is worth buying. Purchase Parity Converter helps travelers, students, expats, and budget-conscious users estimate whether prices in another country feel cheap, normal, or expensive compared with their home economy.

## Solution

Purchase Parity Converter is a web app that compares travel and relocation costs with a simple **Travel Affordability Score**. Instead of only converting currencies, it explains what prices and monthly lifestyle costs feel like in the user's home country.

The MVP is intentionally focused: 10 high-interest countries, 20 varied advisor items, currency conversion, Travel Affordability Score, a Travel Price Advisor, and a Relocation Cost Advisor for travelers, digital nomads, international students, and expats.

## How It Works

1. Choose one of 20 common items and enter the price seen while traveling.
2. Select the destination country and home country.
3. The backend fills exchange rates, normal price ranges, and purchasing-power data.
4. The frontend displays currency conversion, Travel Affordability Score, and a plain-English verdict.
5. The Travel Price Advisor answers questions like, "Is $25 for lunch in the USA expensive for someone from India?" using stored exchange rates, local price ranges, and home-country affordability context.
6. The Relocation Cost Advisor estimates monthly lifestyle costs, equivalent home-country lifestyle, biggest cost shock, and most affordable category.

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

The advisor gives a summary-first answer:

1. A short verdict in plain language.
2. Currency conversion for the price the traveler entered.
3. Travel Affordability Score, which is the "feels like" amount at home.
4. A local comparison using the right item context, such as food, entertainment, transport, stay, services, or products.

Advisor example:

```text
Question: Is $25 for lunch in the USA expensive for someone from India?
Answer: $25 is normal for lunch in the USA, but for someone from India it may feel like spending around Rs500. It is not a scam price, but it is expensive compared with Indian daily food costs.

Question: Is $999 for an iPhone in the USA expensive for someone from India?
Answer: $999 may be normal for an iPhone in the USA, and for someone from India it should be compared with Indian iPhone prices, not daily food costs.
```

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite
- MVP data: India, United States, United Kingdom, Japan, Australia, Canada, Germany, France, Singapore, Brazil
- Insight Layer: plain-English interpretation of Travel Affordability Score results
- Travel Price Advisor: structured AI-style explanation using local range, exchange-rate, and affordability-score data
- Relocation Cost Advisor: monthly lifestyle comparison for relocation, students, digital nomads, and expats
- Data model: countries, items, prices, affordability indexes, exchange rates
- API routes: countries, items, prices, travel price advisor, relocation advisor
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

Screenshots are not committed yet. Add app screenshots here after capturing the Travel Price Advisor and Relocation screens.
