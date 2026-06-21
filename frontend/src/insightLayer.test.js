import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInsight } from './insightLayer.js';

test('formats the Travel Affordability Score insight with conversion and verdict', () => {
  const insight = buildInsight({
    item: 'Coffee or tea (1 cup)',
    original_currency: 'USD',
    original_price: 5,
    currency_conversion_price: 430,
    home_currency: 'INR',
    travel_affordability_score: 90,
    source_country: 'India',
    verdict: '⚪ Normal local pricing'
  });

  assert.deepEqual(insight, {
    item: 'Coffee or tea',
    price: 'USD 5.00',
    currencyConversion: 'INR 430.00',
    affordabilityScore: 'Feels like spending INR 90.00 in India',
    verdict: 'Normal local pricing'
  });
});

test('strips emoji from verdict labels without changing plain labels', () => {
  const insight = buildInsight({
    item: 'Bottled water (1.5L)',
    original_currency: 'GBP',
    original_price: 1,
    currency_conversion_price: 108,
    home_currency: 'INR',
    travel_affordability_score: 21,
    source_country: 'India',
    verdict: 'Normal local pricing'
  });

  assert.equal(insight.verdict, 'Normal local pricing');
});
