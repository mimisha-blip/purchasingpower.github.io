function formatAmount(currency, value) {
  return `${currency} ${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatRange(currency, range) {
  return `${formatAmount(currency, range.min)}-${Number(range.max).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function classifyAgainstRange(price, range) {
  if (price < range.min) return 'cheap';
  if (price > range.max) return 'expensive';
  return 'normal local pricing';
}

function localVerdictSummary(verdict) {
  if (verdict === 'normal local pricing') return 'normal for the destination';
  if (verdict === 'cheap') return 'below the typical destination range';
  return 'above the typical destination range';
}

function sentenceCase(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function countryAdjective(country) {
  const adjectives = {
    India: 'Indian',
    USA: 'US',
    'United States': 'US',
    'United Kingdom': 'UK',
    UK: 'UK',
    Japan: 'Japanese',
    Australia: 'Australian',
    Canada: 'Canadian',
    Germany: 'German',
    France: 'French',
    Singapore: 'Singaporean',
    Brazil: 'Brazilian'
  };
  return adjectives[country] || country;
}

const DEFAULT_PRICE_CONTEXT = {
  lunch: {
    destinationTypicalRange: { USD: { min: 18, max: 30 } },
    homeTypicalRange: { INR: { min: 200, max: 500 } }
  },
  fastFood: {
    destinationTypicalRange: { USD: { min: 9, max: 14 } },
    homeTypicalRange: { INR: { min: 250, max: 450 } }
  },
  coffee: {
    destinationTypicalRange: { USD: { min: 4, max: 7 } },
    homeTypicalRange: { INR: { min: 80, max: 250 } }
  },
  movie: {
    destinationTypicalRange: { USD: { min: 14, max: 22 } },
    homeTypicalRange: { INR: { min: 250, max: 600 } }
  },
  amusement: {
    destinationTypicalRange: { USD: { min: 90, max: 160 } },
    homeTypicalRange: { INR: { min: 1500, max: 5000 } }
  },
  museum: {
    destinationTypicalRange: { USD: { min: 15, max: 30 } },
    homeTypicalRange: { INR: { min: 150, max: 800 } }
  },
  taxi: {
    destinationTypicalRange: { USD: { min: 15, max: 30 } },
    homeTypicalRange: { INR: { min: 150, max: 500 } }
  },
  transit: {
    destinationTypicalRange: { USD: { min: 2.5, max: 4 } },
    homeTypicalRange: { INR: { min: 20, max: 80 } }
  },
  carRental: {
    destinationTypicalRange: { USD: { min: 60, max: 120 } },
    homeTypicalRange: { INR: { min: 2500, max: 6000 } }
  },
  hotel: {
    destinationTypicalRange: { USD: { min: 120, max: 220 } },
    homeTypicalRange: { INR: { min: 2500, max: 7000 } }
  },
  hostel: {
    destinationTypicalRange: { USD: { min: 35, max: 70 } },
    homeTypicalRange: { INR: { min: 600, max: 1500 } }
  },
  water: {
    destinationTypicalRange: { USD: { min: 1.5, max: 3 } },
    homeTypicalRange: { INR: { min: 20, max: 50 } }
  },
  groceries: {
    destinationTypicalRange: { USD: { min: 45, max: 80 } },
    homeTypicalRange: { INR: { min: 800, max: 1600 } }
  },
  sim: {
    destinationTypicalRange: { USD: { min: 15, max: 40 } },
    homeTypicalRange: { INR: { min: 200, max: 700 } }
  },
  iphone: {
    destinationTypicalRange: { USD: { min: 799, max: 1099 } },
    homeTypicalRange: { INR: { min: 75000, max: 120000 } }
  },
  phone: {
    destinationTypicalRange: { USD: { min: 500, max: 900 } },
    homeTypicalRange: { INR: { min: 30000, max: 80000 } }
  },
  laptop: {
    destinationTypicalRange: { USD: { min: 900, max: 1400 } },
    homeTypicalRange: { INR: { min: 70000, max: 130000 } }
  },
  sneakers: {
    destinationTypicalRange: { USD: { min: 70, max: 140 } },
    homeTypicalRange: { INR: { min: 3000, max: 10000 } }
  },
  tshirt: {
    destinationTypicalRange: { USD: { min: 20, max: 40 } },
    homeTypicalRange: { INR: { min: 500, max: 1500 } }
  },
  haircut: {
    destinationTypicalRange: { USD: { min: 30, max: 70 } },
    homeTypicalRange: { INR: { min: 200, max: 800 } }
  },
  product: {
    destinationTypicalRange: { USD: { min: 40, max: 120 } },
    homeTypicalRange: { INR: { min: 2000, max: 9000 } }
  }
};

function fallbackRange(currency, type) {
  if (currency === 'USD') return type === 'destination' ? { min: 10, max: 30 } : { min: 10, max: 30 };
  if (currency === 'INR') return { min: 100, max: 300 };
  return { min: 10, max: 30 };
}

function getItemContext(item) {
  const normalized = item.toLowerCase();
  if (normalized.includes('coffee') || normalized.includes('tea')) return { key: 'coffee', category: 'food', benchmark: `${item} prices` };
  if (normalized.includes('fast food')) return { key: 'fastFood', category: 'food', benchmark: 'fast food prices' };
  if (normalized.includes('movie')) return { key: 'movie', category: 'entertainment', benchmark: `${item} prices` };
  if (normalized.includes('amusement') || normalized.includes('theme park')) return { key: 'amusement', category: 'entertainment', benchmark: `${item} prices` };
  if (normalized.includes('museum') || normalized.includes('attraction')) return { key: 'museum', category: 'entertainment', benchmark: `${item} prices` };
  if (normalized.includes('transit') || normalized.includes('metro') || normalized.includes('bus') || normalized.includes('train')) return { key: 'transit', category: 'transport', benchmark: `${item} prices` };
  if (normalized.includes('taxi') || normalized.includes('cab') || normalized.includes('ride') || normalized.includes('uber')) return { key: 'taxi', category: 'transport', benchmark: `${item} prices` };
  if (normalized.includes('car rental') || normalized.includes('rental car')) return { key: 'carRental', category: 'transport', benchmark: `${item} prices` };
  if (normalized.includes('hotel')) return { key: 'hotel', category: 'stay', benchmark: `${item} prices` };
  if (normalized.includes('hostel')) return { key: 'hostel', category: 'stay', benchmark: `${item} prices` };
  if (normalized.includes('water')) return { key: 'water', category: 'food', benchmark: `${item} prices` };
  if (normalized.includes('grocery') || normalized.includes('groceries')) return { key: 'groceries', category: 'food', benchmark: `${item} prices` };
  if (normalized.includes('sim') || normalized.includes('data') || normalized.includes('mobile')) return { key: 'sim', category: 'connectivity', benchmark: `${item} prices` };
  if (normalized.includes('iphone')) return { key: 'iphone', category: 'product', benchmark: `${item} prices` };
  if (normalized.includes('phone') || normalized.includes('smartphone')) return { key: 'phone', category: 'product', benchmark: `${item} prices` };
  if (normalized.includes('laptop') || normalized.includes('macbook') || normalized.includes('computer')) return { key: 'laptop', category: 'product', benchmark: `${item} prices` };
  if (normalized.includes('shoe') || normalized.includes('sneaker')) return { key: 'sneakers', category: 'product', benchmark: `${item} prices` };
  if (normalized.includes('shirt') || normalized.includes('t-shirt') || normalized.includes('clothes') || normalized.includes('clothing')) return { key: 'tshirt', category: 'product', benchmark: `${item} prices` };
  if (normalized.includes('haircut')) return { key: 'haircut', category: 'service', benchmark: `${item} prices` };
  if (normalized.includes('lunch') || normalized.includes('dinner') || normalized.includes('meal') || normalized.includes('food')) return { key: 'lunch', category: 'food', benchmark: 'daily food costs' };
  return { key: 'product', category: 'product', benchmark: `${item} prices` };
}

function homeComparisonText({ item, homeCountry, homeFeel }) {
  const context = getItemContext(item);

  if (context.category === 'food') {
    return `${homeFeel} compared with ${countryAdjective(homeCountry)} daily food costs`;
  }

  return `${homeFeel} compared with ${countryAdjective(homeCountry)} ${context.benchmark}`;
}

function homeContextText({ item, homeCountry, homeFeel }) {
  const context = getItemContext(item);

  if (context.category === 'food') {
    return `${homeFeel} against everyday food costs`;
  }

  return `${homeFeel} compared with ${countryAdjective(homeCountry)} ${context.benchmark}`;
}

function shouldUseExchangeScore(item) {
  return getItemContext(item).category === 'product';
}

export function getDefaultPriceContext({ item, destinationCurrency, homeCurrency }) {
  const { key } = getItemContext(item);
  const context = DEFAULT_PRICE_CONTEXT[key];

  return {
    destinationCity: 'the destination',
    destinationTypicalRange: context.destinationTypicalRange[destinationCurrency] || fallbackRange(destinationCurrency, 'destination'),
    homeTypicalRange: context.homeTypicalRange[homeCurrency] || fallbackRange(homeCurrency, 'home')
  };
}

export function buildTravelPriceAdvice(input) {
  const localVerdict = classifyAgainstRange(input.destinationPrice, input.destinationTypicalRange);
  const convertedPrice = input.destinationPrice * input.exchangeRate;
  const homeRangeAverage = (input.homeTypicalRange.min + input.homeTypicalRange.max) / 2;
  const feelsExpensiveAtHome = input.affordabilityScore > homeRangeAverage;
  const destinationPrice = formatAmount(input.destinationCurrency, input.destinationPrice);
  const convertedAmount = formatAmount(input.homeCurrency, convertedPrice);
  const affordabilityAmount = formatAmount(input.homeCurrency, input.affordabilityScore);
  const destinationRange = formatRange(input.destinationCurrency, input.destinationTypicalRange);
  const homeRange = formatRange(input.homeCurrency, input.homeTypicalRange);
  const homeFeel = feelsExpensiveAtHome ? 'expensive' : 'reasonable';
  const homeComparison = homeComparisonText({ item: input.item, homeCountry: input.homeCountry, homeFeel });
  const homeContext = homeContextText({ item: input.item, homeCountry: input.homeCountry, homeFeel });
  const summary = `This price is ${localVerdictSummary(localVerdict)}. For someone from ${input.homeCountry}, it feels ${homeComparison}.`;

  return {
    verdict: sentenceCase(localVerdict),
    conversion: `${destinationPrice} is about ${convertedAmount} by currency conversion.`,
    affordability: `For someone from ${input.homeCountry}, it may feel closer to spending around ${affordabilityAmount}.`,
    localContext: `In ${input.destinationCity}, a typical ${input.item} is around ${destinationRange}, so this is ${localVerdict}.`,
    homeContext: `Compared with a typical ${input.item} in ${input.homeCountry} at ${homeRange}, it will still feel ${homeContext} at home.`,
    summary
  };
}

export function buildAdvisorInputFromCountries({
  item,
  destinationCity,
  destinationCountry,
  homeCountry,
  destinationPrice,
  destinationTypicalRange,
  homeTypicalRange
}) {
  const defaultContext = getDefaultPriceContext({
    item,
    destinationCurrency: destinationCountry.currency_code,
    homeCurrency: homeCountry.currency_code
  });
  const exchangeRate = homeCountry.exchange_rate / destinationCountry.exchange_rate;
  const affordabilityScore = shouldUseExchangeScore(item)
    ? Math.round(destinationPrice * exchangeRate * 100) / 100
    : destinationPrice * homeCountry.ppp_index / destinationCountry.ppp_index;

  return {
    item,
    destinationCity: destinationCity || destinationCountry.country_name || defaultContext.destinationCity,
    destinationCountry: destinationCountry.country_name,
    homeCountry: homeCountry.country_name,
    destinationCurrency: destinationCountry.currency_code,
    destinationPrice,
    homeCurrency: homeCountry.currency_code,
    exchangeRate,
    affordabilityScore,
    destinationTypicalRange: destinationTypicalRange || defaultContext.destinationTypicalRange,
    homeTypicalRange: homeTypicalRange || defaultContext.homeTypicalRange
  };
}
