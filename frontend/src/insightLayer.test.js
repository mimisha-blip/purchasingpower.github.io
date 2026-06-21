import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInsight } from './insightLayer.js';

test('explains a destination price as a home-equivalent feeling and multiplier', () => {
  const insight = buildInsight({
    item: 'Coffee or tea (1 cup)',
    original_currency: 'USD',
    original_price: 4.5,
    dest_country: 'United States',
    home_currency: 'INR',
    home_equivalent_price: 91,
    source_country: 'India',
    actual_home_price: 50
  });

  assert.equal(
    insight,
    'A USD 4.50 coffee or tea in the United States feels similar to paying INR 91.00 in India. Compared with the typical India price, it is 1.8x more expensive.'
  );
});

test('labels near-equal prices as similar instead of forcing a multiplier', () => {
  const insight = buildInsight({
    item: 'Bottled water (1.5L)',
    original_currency: 'GBP',
    original_price: 1,
    dest_country: 'United Kingdom',
    home_currency: 'INR',
    home_equivalent_price: 21,
    source_country: 'India',
    actual_home_price: 20
  });

  assert.equal(
    insight,
    'A GBP 1.00 bottled water in the United Kingdom feels similar to paying INR 21.00 in India. Compared with the typical India price, it is about the same.'
  );
});
