const CITY_PROFILES = {
  'San Francisco': {
    country: 'United States',
    currency: 'USD',
    baseMonthlySpend: 4500,
    equivalentLifestyleByOrigin: {
      India: { amount: 95000, currency: 'INR' }
    },
    categoryChangesByOrigin: {
      India: [
        { category: 'Housing', change_percent: 280 },
        { category: 'Food', change_percent: 140 },
        { category: 'Transportation', change_percent: 60 },
        { category: 'Utilities', change_percent: 45 },
        { category: 'Healthcare', change_percent: 120 },
        { category: 'Entertainment', change_percent: 85 },
        { category: 'Electronics', change_percent: -10 },
        { category: 'Personal care', change_percent: 70 }
      ]
    },
    mostSurprisingCostIncrease: 'Rent',
    mostAffordableCategory: 'Electronics'
  }
};

const LIFESTYLE_MULTIPLIERS = {
  budget: 0.75,
  average: 1,
  comfortable: 1.3
};

function roundToNearest(value, nearest) {
  return Math.round(value / nearest) * nearest;
}

function formatMoney(currency, amount) {
  return `${currency} ${Number(amount).toLocaleString()}`;
}

export function availableRelocationCities() {
  return Object.keys(CITY_PROFILES);
}

export function buildRelocationEstimate({ originCountry, destinationCity, lifestyleLevel = 'average' }) {
  const profile = CITY_PROFILES[destinationCity];
  if (!profile) {
    throw new Error(`No relocation profile found for ${destinationCity}`);
  }

  const multiplier = LIFESTYLE_MULTIPLIERS[lifestyleLevel] || LIFESTYLE_MULTIPLIERS.average;
  const equivalentBase = profile.equivalentLifestyleByOrigin[originCountry.country_name] || {
    amount: 95000,
    currency: originCountry.currency_code
  };
  const categoryChanges = profile.categoryChangesByOrigin[originCountry.country_name] || profile.categoryChangesByOrigin.India;
  const expectedMonthly = roundToNearest(profile.baseMonthlySpend * multiplier, 50);
  const equivalentLifestyle = roundToNearest(equivalentBase.amount * multiplier, 1000);

  const summary = `Moving from ${originCountry.country_name} to ${destinationCity} would likely cost around ${formatMoney(profile.currency, expectedMonthly)} per month. A similar lifestyle at home is about ${formatMoney(equivalentBase.currency, equivalentLifestyle)} per month. Rent is likely to be the biggest shock, while electronics stay comparatively affordable.`;

  return {
    destination_city: destinationCity,
    destination_country: profile.country,
    lifestyle_level: lifestyleLevel,
    expected_monthly_spending: {
      amount: expectedMonthly,
      currency: profile.currency
    },
    equivalent_lifestyle: {
      amount: equivalentLifestyle,
      currency: equivalentBase.currency
    },
    category_changes: categoryChanges,
    most_surprising_cost_increase: profile.mostSurprisingCostIncrease,
    most_affordable_category: profile.mostAffordableCategory,
    summary
  };
}
