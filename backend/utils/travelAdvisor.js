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

export function buildTravelPriceAdvice(input) {
  const localVerdict = classifyAgainstRange(input.destinationPrice, input.destinationTypicalRange);
  const convertedPrice = input.destinationPrice * input.exchangeRate;
  const homeRangeAverage = (input.homeTypicalRange.min + input.homeTypicalRange.max) / 2;
  const feelsExpensiveAtHome = input.affordabilityScore > homeRangeAverage;

  return {
    verdict: sentenceCase(localVerdict),
    conversion: `${formatAmount(input.destinationCurrency, input.destinationPrice)} is about ${formatAmount(input.homeCurrency, convertedPrice)} by currency conversion.`,
    affordability: `For someone from ${input.homeCountry}, it may feel closer to spending around ${formatAmount(input.homeCurrency, input.affordabilityScore)}.`,
    localContext: `In ${input.destinationCity}, a typical ${input.item} is around ${formatRange(input.destinationCurrency, input.destinationTypicalRange)}, so this is ${localVerdict}.`,
    homeContext: `Compared with a typical ${input.item} in ${input.homeCountry} at ${formatRange(input.homeCurrency, input.homeTypicalRange)}, it will still feel ${feelsExpensiveAtHome ? 'expensive' : 'reasonable'} against everyday food costs at home.`,
    summary: `It is not a scam price, but it is ${feelsExpensiveAtHome ? 'expensive' : 'reasonable'} compared with ${countryAdjective(input.homeCountry)} daily food costs.`
  };
}
