import test from 'node:test';
import assert from 'node:assert/strict';
import { ADVISOR_ITEMS } from './advisorItems.js';

test('advisor exposes exactly 20 varied preset items', () => {
  assert.equal(ADVISOR_ITEMS.length, 20);
  assert.deepEqual(
    ADVISOR_ITEMS.map((item) => item.value),
    [
      'iPhone',
      'Smartphone',
      'Laptop',
      'Coffee',
      'Lunch',
      'Fast food meal',
      'Movie ticket',
      'Amusement park ticket',
      'Museum ticket',
      'Taxi ride',
      'Public transit ride',
      'Car rental',
      'Hotel room',
      'Hostel bed',
      'Bottled water',
      'Groceries',
      'Local SIM card',
      'Sneakers',
      'T-shirt',
      'Haircut'
    ]
  );
});
