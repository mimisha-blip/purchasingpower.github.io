const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return body;
}

export function getCountries() {
  return request('/countries');
}

export function getItems() {
  return request('/items');
}

export function convert(sourceCountryId, destCountryId, itemId) {
  return request('/convert', {
    method: 'POST',
    body: JSON.stringify({
      source_country_id: sourceCountryId,
      dest_country_id: destCountryId,
      item_id: itemId
    })
  });
}

export function estimateTrip(homeCountryId, monthlyIncome, basket, candidateCountryIds) {
  return request('/trip-planner/estimate', {
    method: 'POST',
    body: JSON.stringify({
      home_country_id: homeCountryId,
      monthly_income: monthlyIncome,
      basket,
      candidate_country_ids: candidateCountryIds
    })
  });
}

export function advisePrice(payload) {
  return request('/advisor/price', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
