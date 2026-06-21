import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTravelPriceAdvice, buildAdvisorInputFromCountries, getDefaultPriceContext } from './travelAdvisor.js';

test('explains whether a New York lunch is normal or expensive for an Indian traveler', () => {
  const advice = buildTravelPriceAdvice({
    item: 'lunch',
    destinationCity: 'New York',
    destinationCountry: 'USA',
    homeCountry: 'India',
    destinationCurrency: 'USD',
    destinationPrice: 25,
    homeCurrency: 'INR',
    exchangeRate: 83,
    affordabilityScore: 500,
    destinationTypicalRange: { min: 18, max: 30 },
    homeTypicalRange: { min: 150, max: 300 }
  });

  assert.deepEqual(advice, {
    verdict: 'Normal local pricing',
    conversion: 'USD 25.00 is about INR 2,075.00 by currency conversion.',
    affordability: 'For someone from India, it may feel closer to spending around INR 500.00.',
    localContext: 'In New York, a typical lunch is around USD 18.00-30.00, so this is normal local pricing.',
    homeContext: 'Compared with a typical lunch in India at INR 150.00-300.00, it will still feel expensive against everyday food costs at home.',
    summary: 'It is not a scam price, but it is expensive compared with Indian daily food costs.',
    steps: [
      {
        title: 'Convert the price',
        detail: 'USD 25.00 is about INR 2,075.00 at the exchange rate.'
      },
      {
        title: 'Calculate the feels-like value',
        detail: 'For someone from India, this feels closer to INR 500.00.'
      },
      {
        title: 'Check the local range',
        detail: 'A typical lunch in New York is USD 18.00-30.00, so USD 25.00 is normal local pricing.'
      },
      {
        title: 'Compare with home prices',
        detail: 'A typical lunch in India is INR 150.00-300.00, so INR 500.00 feels expensive at home.'
      },
      {
        title: 'Give the verdict',
        detail: 'It is not a scam price, but it is expensive compared with Indian daily food costs.'
      }
    ]
  });
});

test('derives exchange conversion and affordability score from country indexes', () => {
  const input = buildAdvisorInputFromCountries({
    item: 'lunch',
    destinationCity: 'New York',
    destinationCountry: {
      country_name: 'United States',
      currency_code: 'USD',
      exchange_rate: 1,
      ppp_index: 1
    },
    homeCountry: {
      country_name: 'India',
      currency_code: 'INR',
      exchange_rate: 83,
      ppp_index: 20
    },
    destinationPrice: 25,
    destinationTypicalRange: { min: 18, max: 30 },
    homeTypicalRange: { min: 150, max: 300 }
  });

  assert.equal(input.exchangeRate, 83);
  assert.equal(input.affordabilityScore, 500);
  assert.equal(input.destinationCurrency, 'USD');
  assert.equal(input.homeCurrency, 'INR');
});

test('builds a complete advisor input when users only provide item, price, and countries', () => {
  const input = buildAdvisorInputFromCountries({
    item: 'lunch',
    destinationCountry: {
      country_name: 'United States',
      currency_code: 'USD',
      exchange_rate: 1,
      ppp_index: 1
    },
    homeCountry: {
      country_name: 'India',
      currency_code: 'INR',
      exchange_rate: 83,
      ppp_index: 20
    },
    destinationPrice: 25
  });

  assert.equal(input.destinationCity, 'United States');
  assert.deepEqual(input.destinationTypicalRange, { min: 18, max: 30 });
  assert.deepEqual(input.homeTypicalRange, { min: 150, max: 300 });
});

test('provides default ranges for common item context', () => {
  const context = getDefaultPriceContext({
    item: 'lunch',
    destinationCurrency: 'USD',
    homeCurrency: 'INR'
  });

  assert.deepEqual(context, {
    destinationCity: 'the destination',
    destinationTypicalRange: { min: 18, max: 30 },
    homeTypicalRange: { min: 150, max: 300 }
  });
});
