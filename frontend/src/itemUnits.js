// Maps each unit-priced item to how its quantity should be labeled and
// defaulted — "2" alone doesn't say whether that's nights, packs, or rides.
// perTripDays/perTripWeeks default the initial quantity to the trip length
// instead of 1, for items typically bought once per day/week of travel.
export const ITEM_UNITS = {
  'Day transit pass (1 day, unlimited rides)': { unit: 'day', perTripDays: true },
  'Bike or scooter rental (1 day)': { unit: 'day', perTripDays: true },
  'Car rental with fuel (1 day)': { unit: 'day', perTripDays: true },
  'Parking (1 day)': { unit: 'day', perTripDays: true },
  'Portable wifi or hotspot rental (1 day)': { unit: 'day', perTripDays: true },
  'International roaming add-on (1 day)': { unit: 'day', perTripDays: true },
  'Gym day pass (1 day)': { unit: 'day', perTripDays: true },

  'Hostel dorm bed (1 night)': { unit: 'night', perTripDays: true },
  'Budget hotel or guesthouse room (1 night)': { unit: 'night', perTripDays: true },
  'Mid-range hotel room (1 night)': { unit: 'night', perTripDays: true },
  'Boutique or luxury hotel room (1 night)': { unit: 'night', perTripDays: true },
  'Private Airbnb or vacation rental (1 night)': { unit: 'night', perTripDays: true },

  'Basic groceries (1 week, 1 person)': { unit: 'week', perTripWeeks: true },
  'Travel insurance (per week of coverage)': { unit: 'week', perTripWeeks: true },

  'Breakfast pastry or snack (1 item)': { unit: 'item' },
  'Casual sit-down meal (1 person)': { unit: 'meal' },
  'Fast food combo meal (1 person)': { unit: 'meal' },
  'Fine-dining meal (1 person, no drinks)': { unit: 'meal' },
  'Bottled water (1.5L)': { unit: 'bottle' },
  'Coffee or tea (1 cup)': { unit: 'cup' },
  'Local beer or glass of wine (1 drink)': { unit: 'drink' },
  'Public transit (1 ride)': { unit: 'ride' },
  'Taxi or rideshare (short ride, ~3km)': { unit: 'ride' },
  'Road toll (1 pass-through)': { unit: 'toll' },
  'Local SIM card (one-time, no data)': { unit: 'SIM card' },
  'Mobile data plan — 1GB': { unit: 'pack' },
  'Mobile data plan — 5GB': { unit: 'pack' },
  'Mobile data plan — 10GB': { unit: 'pack' },
  'Mobile data plan — 20GB': { unit: 'pack' },
  'Mobile data plan — Unlimited (1 day)': { unit: 'day', perTripDays: true },
  'Typical refundable deposit (hotel or rental)': { unit: 'deposit' },
  'Intercity train ticket (one-way, standard class)': { unit: 'ticket' },
  'Long-distance bus ticket (one-way)': { unit: 'ticket' },
  'Domestic flight (one-way, economy)': { unit: 'flight' },
  'Airport transfer (one-way)': { unit: 'transfer' },
  'Multi-day rail pass (e.g. 3-day unlimited)': { unit: 'pass' },
  'International round-trip flight (estimated, economy)': { unit: 'ticket' },
  'Visa fee (single entry, per traveler)': { unit: 'traveler' },
  'Vaccination or health certificate (one-time)': { unit: 'certificate' },
  'Passport photos or printing (one set)': { unit: 'set' },
  'Massage or spa treatment (1 hour)': { unit: 'hour' },
  'Haircut (basic, 1 visit)': { unit: 'visit' },
  'Toiletries restock (per trip)': { unit: 'trip' },
  'Laundry service (1 load)': { unit: 'load' },
  'Museum or attraction entry (1 person)': { unit: 'entry' },
  'Guided tour or day trip (1 person)': { unit: 'tour' },
  'Adventure activity (1 person, e.g. diving or rafting)': { unit: 'activity' },
  'Nightlife or club entry (1 person cover charge)': { unit: 'entry' },
  'Concert or event ticket (1 ticket)': { unit: 'ticket' },
  'National park entry (1 person)': { unit: 'entry' },
  'Souvenir (1 typical item)': { unit: 'item' },
  'Basic clothing item (e.g. 1 T-shirt)': { unit: 'item' },
  'Duty-free item (e.g. spirits or perfume)': { unit: 'item' },
  'Departure or airport exit tax (per traveler)': { unit: 'traveler' },
  'Checked baggage fee (1 bag, one-way)': { unit: 'bag' },
  'Emergency doctor visit (1 visit)': { unit: 'visit' }
};

export function getItemUnit(item) {
  return ITEM_UNITS[item.name] ?? { unit: 'item' };
}

export function pluralizeUnit(unit, quantity) {
  return quantity === 1 ? unit : `${unit}s`;
}

// Items named "Group label — Tier label" (e.g. "Mobile data plan — 10GB")
// are picked from a single dropdown rather than shown as separate
// checkboxes, since only one tier applies at a time.
export function getTierGroupLabel(item) {
  const idx = item.name.indexOf(' — ');
  return idx === -1 ? null : item.name.slice(0, idx);
}

export function getTierLabel(item) {
  const idx = item.name.indexOf(' — ');
  return idx === -1 ? item.name : item.name.slice(idx + 3);
}
