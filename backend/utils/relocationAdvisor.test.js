import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelocationEstimate } from './relocationAdvisor.js';

test('summarizes relocation costs from India to San Francisco', () => {
  const estimate = buildRelocationEstimate({
    originCountry: {
      country_name: 'India',
      currency_code: 'INR'
    },
    destinationCity: 'San Francisco',
    lifestyleLevel: 'average'
  });

  assert.equal(estimate.expected_monthly_spending.amount, 4500);
  assert.equal(estimate.expected_monthly_spending.currency, 'USD');
  assert.equal(estimate.equivalent_lifestyle.amount, 95000);
  assert.equal(estimate.equivalent_lifestyle.currency, 'INR');
  assert.deepEqual(estimate.category_changes, [
    { category: 'Housing', change_percent: 280 },
    { category: 'Food', change_percent: 140 },
    { category: 'Transportation', change_percent: 60 },
    { category: 'Utilities', change_percent: 45 },
    { category: 'Healthcare', change_percent: 120 },
    { category: 'Entertainment', change_percent: 85 },
    { category: 'Electronics', change_percent: -10 },
    { category: 'Personal care', change_percent: 70 }
  ]);
  assert.equal(estimate.most_surprising_cost_increase, 'Rent');
  assert.equal(estimate.most_affordable_category, 'Electronics');
});
