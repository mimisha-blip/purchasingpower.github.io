# Global Cost Advisor

## Problem

People often judge international prices using currency conversion alone. That creates misleading decisions: a $5 coffee may look expensive when converted to Rs430, but it may be normal local pricing in the destination country.

The same problem becomes larger for people relocating, studying abroad, working remotely, or planning longer stays. They need to understand not only what something costs, but how that cost compares with the lifestyle they are used to at home.

## Why It Matters

Global mobility decisions are expensive and emotional. Travelers, students, digital nomads, expats, and relocating professionals need fast answers to questions like:

- Is this price fair, or am I overpaying?
- What will my monthly lifestyle cost after moving?
- Which categories will feel most expensive?
- What is actually cheaper abroad?

Traditional currency converters answer only the exchange-rate question. Global Cost Advisor focuses on the affordability question.

## Solution

Global Cost Advisor is a web app that explains travel and relocation costs through a **Travel Affordability Score**. The product translates prices into plain-language affordability insights, helping users understand how a price or lifestyle cost feels relative to their home economy.

The MVP includes:

- A travel price advisor for item-level decisions
- A relocation cost advisor for monthly lifestyle planning
- A floating affordability chatbot for follow-up questions
- A focused set of 20 common items across travel, electronics, food, transport, stay, entertainment, and services

## Target Users

- Travelers comparing prices abroad
- International students planning living costs
- Digital nomads choosing where to live
- Expats and relocating professionals
- Budget-conscious users making cross-country spending decisions

## Product Strategy

The product is designed around one core insight: users do not just need conversion, they need context.

Instead of showing only:

```text
$5 = Rs430
```

Global Cost Advisor shows:

```text
Currency conversion: Rs430
Travel Affordability Score: Feels like Rs90 in India
Verdict: Normal local pricing
```

This turns the product from a calculator into an affordability decision tool.

## Core User Flows

### 1. Travel Price Advisor

The user selects a home country, destination country, item, and price they saw. The app returns:

- Currency conversion
- Travel Affordability Score
- Cheap, normal, or expensive verdict
- Item-specific context

Example:

```text
Question: Is $999 for an iPhone in the USA expensive for someone from India?
Answer: $999 may be normal for an iPhone in the USA, and for someone from India it should be compared with Indian iPhone prices, not daily food costs.
```

### 2. Relocation Cost Advisor

The user selects where they are moving from, where they are moving to, and lifestyle level. The app returns:

```text
Expected monthly spending: $4,500
Equivalent lifestyle in India: Rs95,000/month
Most surprising cost increase: Rent
Most affordable category: Electronics
```

Category examples:

- Housing: +280%
- Food: +140%
- Transportation: +60%
- Utilities: +45%

### 3. Floating Chat Assistant

The user can ask follow-up questions without leaving the current screen.

Example questions:

- What does Travel Affordability Score mean?
- Why is rent the biggest shock in San Francisco?
- What is cheaper in the US than India?
- How much should I budget for San Francisco?

## MVP Scope

The MVP intentionally stays focused:

- 10 high-interest countries
- 20 preset advisor items
- India to San Francisco relocation example
- Rule-based affordability chatbot
- Summary-first outputs instead of long explanations

Preset item categories include:

- Electronics: iPhone, smartphone, laptop
- Food: coffee, lunch, fast food, bottled water, groceries
- Entertainment: movie ticket, amusement park ticket, museum ticket
- Transport: taxi ride, public transit ride, car rental
- Stay: hotel room, hostel bed
- Services/products: local SIM card, sneakers, T-shirt, haircut

## Success Metrics

Potential product success metrics:

- Users can understand whether a price is fair in under 30 seconds
- Users can identify the biggest relocation cost shock in one result view
- Users ask follow-up questions through the chat assistant
- Users compare more than one item or lifestyle category per session
- Users report higher confidence in travel or relocation budgeting decisions

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite
- Data model: countries, prices, affordability indexes, exchange rates
- APIs: travel price advisor, relocation advisor, chat assistant
- Version control: GitHub

## Roadmap

Planned improvements:

- Add more relocation cities
- Add city-level price comparisons
- Add live exchange-rate updates
- Expand item and category data
- Add user-submitted price feedback
- Add saved comparisons
- Connect the chat assistant to a real LLM with structured app data
- Add screenshots and deployment links

## Screenshots

Screenshots are not committed yet. Add screenshots for:

- Travel Price Advisor
- Relocation Cost Advisor
- Floating Chat Assistant
