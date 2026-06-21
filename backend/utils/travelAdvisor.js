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
    homeTypicalRange: { INR: { min: 150, max: 300 } }
  },
  coffee: {
    destinationTypicalRange: { USD: { min: 4, max: 7 } },
    homeTypicalRange: { INR: { min: 50, max: 150 } }
  },
  taxi: {
    destinationTypicalRange: { USD: { min: 12, max: 25 } },
    homeTypicalRange: { INR: { min: 100, max: 300 } }
  }
};

function fallbackRange(currency, type) {
  if (currency === 'USD') return type === 'destination' ? { min: 10, max: 30 } : { min: 10, max: 30 };
  if (currency === 'INR') return { min: 100, max: 300 };
  return { min: 10, max: 30 };
}

export function getDefaultPriceContext({ item, destinationCurrency, homeCurrency }) {
  const key = item.toLowerCase().includes('coffee')
    ? 'coffee'
    : item.toLowerCase().includes('taxi')
      ? 'taxi'
      : 'lunch';
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
  const summary = `It is not a scam price, but it is ${homeFeel} compared with ${countryAdjective(input.homeCountry)} daily food costs.`;

  return {
    verdict: sentenceCase(localVerdict),
    conversion: `${destinationPrice} is about ${convertedAmount} by currency conversion.`,
    affordability: `For someone from ${input.homeCountry}, it may feel closer to spending around ${affordabilityAmount}.`,
    localContext: `In ${input.destinationCity}, a typical ${input.item} is around ${destinationRange}, so this is ${localVerdict}.`,
    homeContext: `Compared with a typical ${input.item} in ${input.homeCountry} at ${homeRange}, it will still feel ${homeFeel} against everyday food costs at home.`,
    summary,
    steps: [
      {
        title: 'Convert the price',
        detail: `${destinationPrice} is about ${convertedAmount} at the exchange rate.`
      },
      {
        title: 'Calculate the feels-like value',
        detail: `For someone from ${input.homeCountry}, this feels closer to ${affordabilityAmount}.`
      },
      {
        title: 'Check the local range',
        detail: `A typical ${input.item} in ${input.destinationCity} is ${destinationRange}, so ${destinationPrice} is ${localVerdict}.`
      },
      {
        title: 'Compare with home prices',
        detail: `A typical ${input.item} in ${input.homeCountry} is ${homeRange}, so ${affordabilityAmount} feels ${homeFeel} at home.`
      },
      {
        title: 'Give the verdict',
        detail: summary
      }
    ]
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

  return {
    item,
    destinationCity: destinationCity || destinationCountry.country_name || defaultContext.destinationCity,
    destinationCountry: destinationCountry.country_name,
    homeCountry: homeCountry.country_name,
    destinationCurrency: destinationCountry.currency_code,
    destinationPrice,
    homeCurrency: homeCountry.currency_code,
    exchangeRate: homeCountry.exchange_rate / destinationCountry.exchange_rate,
    affordabilityScore: destinationPrice * homeCountry.ppp_index / destinationCountry.ppp_index,
    destinationTypicalRange: destinationTypicalRange || defaultContext.destinationTypicalRange,
    homeTypicalRange: homeTypicalRange || defaultContext.homeTypicalRange
  };
}
