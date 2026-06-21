/**
 * Shared PPP (Purchasing Power Parity) math, used by both the single-item
 * converter and the trip planner so the underlying formula can't drift
 * between the two features.
 */

export function convertPrice(price, fromPppIndex, toPppIndex) {
  return price * toPppIndex / fromPppIndex;
}

/**
 * Resolves a price for `targetCountry` from a list of known price rows for
 * one item ({ country_id, price, country_ppp_index }). Uses a direct price
 * if one exists for that country; otherwise PPP-scales from any other known
 * price. Returns null only if there are no known prices for the item at all.
 */
export function resolvePrice(knownPrices, targetCountry) {
  const direct = knownPrices.find((p) => p.country_id === targetCountry.id);
  if (direct) {
    return { price: direct.price, estimated: false, sourceCountryId: null };
  }
  if (knownPrices.length === 0) return null;

  const source = knownPrices[0];
  return {
    price: convertPrice(source.price, source.country_ppp_index, targetCountry.ppp_index),
    estimated: true,
    sourceCountryId: source.country_id
  };
}

/**
 * Resolves a percentage rate for `targetCountry` from known rate rows
 * ({ country_id, price }) for one 'percentage' pricing_model item — e.g. a
 * tipping norm or card fee. Unlike resolvePrice, the fallback does NOT
 * PPP-scale: a rate like "12% tipping" means the same thing regardless of
 * local price levels, so a known rate is reused as-is rather than converted.
 */
export function resolvePercentage(knownRates, targetCountry) {
  const direct = knownRates.find((r) => r.country_id === targetCountry.id);
  if (direct) {
    return { rate: direct.price, estimated: false, sourceCountryId: null };
  }
  if (knownRates.length === 0) return null;

  const source = knownRates[0];
  return { rate: source.price, estimated: true, sourceCountryId: source.country_id };
}

export function getExpenseStatus(percentageDifference) {
  if (percentageDifference < -50) return '🟢 Very Cheap';
  if (percentageDifference < -20) return '🟡 Cheap';
  if (percentageDifference < 20) return '⚪ Similar';
  if (percentageDifference < 100) return '🟠 Expensive';
  return '🔴 Very Expensive';
}

// Budget is the 100% baseline: at or under it is in-budget, over it isn't.
export function getIncomeStatus(pctOfIncome) {
  return pctOfIncome <= 100 ? '🟢 Within Budget' : '🔴 Over Budget';
}
