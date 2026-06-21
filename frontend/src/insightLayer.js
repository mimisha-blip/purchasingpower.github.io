function stripItemDetail(itemName) {
  return itemName.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
}

function formatAmount(currency, value) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

function formatCountryName(countryName) {
  return /^United /.test(countryName) ? `the ${countryName}` : countryName;
}

function formatMultiplier(homeEquivalentPrice, actualHomePrice) {
  if (!actualHomePrice || actualHomePrice <= 0) {
    return 'not enough home-price data to compare.';
  }

  const ratio = homeEquivalentPrice / actualHomePrice;
  if (ratio >= 0.9 && ratio <= 1.1) {
    return 'about the same.';
  }
  if (ratio > 1.1) {
    return `${ratio.toFixed(1)}x more expensive.`;
  }

  return `${(1 / ratio).toFixed(1)}x cheaper.`;
}

export function buildInsight(result) {
  const item = stripItemDetail(result.item);
  const destinationPrice = formatAmount(result.original_currency, result.original_price);
  const homeEquivalent = formatAmount(result.home_currency, result.home_equivalent_price);
  const multiplier = formatMultiplier(result.home_equivalent_price, result.actual_home_price);
  const destination = formatCountryName(result.dest_country);

  return `A ${destinationPrice} ${item} in ${destination} feels similar to paying ${homeEquivalent} in ${result.source_country}. Compared with the typical ${result.source_country} price, it is ${multiplier}`;
}
