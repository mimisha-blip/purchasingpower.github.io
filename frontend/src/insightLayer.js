function stripItemDetail(itemName) {
  return itemName.replace(/\s*\([^)]*\)/g, '').trim();
}

function formatAmount(currency, value) {
  return `${currency} ${Number(value).toFixed(2)}`;
}

function stripVerdictEmoji(verdict) {
  return verdict.replace(/^[^\w]+/, '').trim();
}

export function buildInsight(result) {
  const item = stripItemDetail(result.item);

  return {
    item,
    price: formatAmount(result.original_currency, result.original_price),
    currencyConversion: formatAmount(result.home_currency, result.currency_conversion_price),
    affordabilityScore: `Feels like spending ${formatAmount(result.home_currency, result.travel_affordability_score)} in ${result.source_country}`,
    verdict: stripVerdictEmoji(result.verdict || result.expense_status)
  };
}
