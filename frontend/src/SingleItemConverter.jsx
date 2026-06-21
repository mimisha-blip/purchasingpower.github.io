import { useState } from 'react';
import { convert } from './api.js';
import { countryFlag } from './flags.js';
import StatusBadge from './StatusBadge.jsx';

const GROUP_ORDER = [
  'Daily essentials',
  'Trip-level costs',
  'Lifestyle & discretionary',
  'Easy-to-forget hidden costs'
];

export default function SingleItemConverter({ countries, items }) {
  // Percentage-based items (tipping norms, card fees) don't have a per-unit
  // price to compare across countries — only unit-priced items apply here.
  const unitItems = items.filter((i) => i.pricing_model === 'unit');

  // Grouped the same way as the trip planner's basket checklist (by group,
  // then category) so a 60-item dropdown isn't one giant flat alphabetical
  // wall of text.
  const itemGroups = GROUP_ORDER.map((groupName) => {
    const groupItems = unitItems.filter((i) => i.group_name === groupName);
    const categories = [...new Set(groupItems.map((i) => i.category))];
    return {
      name: groupName,
      categories: categories.map((cat) => ({
        name: cat,
        items: groupItems.filter((i) => i.category === cat)
      }))
    };
  }).filter((g) => g.categories.length > 0);

  const [sourceCountryId, setSourceCountryId] = useState(countries[0] ? String(countries[0].id) : '');
  const [destCountryId, setDestCountryId] = useState(countries[1] ? String(countries[1].id) : '');
  const [itemId, setItemId] = useState(unitItems[0] ? String(unitItems[0].id) : '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (sourceCountryId === destCountryId) {
      setError('Choose two different countries to compare.');
      return;
    }

    setLoading(true);
    try {
      const res = await convert(Number(sourceCountryId), Number(destCountryId), Number(itemId));
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="convert-form">
        <div className="field">
          <label htmlFor="source">Home country</label>
          <select id="source" value={sourceCountryId} onChange={(e) => setSourceCountryId(e.target.value)}>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{countryFlag(c.country_code)} {c.country_name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="dest">Destination country</label>
          <select id="dest" value={destCountryId} onChange={(e) => setDestCountryId(e.target.value)}>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{countryFlag(c.country_code)} {c.country_name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="item">Item</label>
          <select id="item" value={itemId} onChange={(e) => setItemId(e.target.value)}>
            {itemGroups.map((group) =>
              group.categories.map((cat) => (
                <optgroup key={`${group.name}-${cat.name}`} label={`${group.name} — ${cat.name}`}>
                  {cat.items.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </div>

        <button type="submit" className="primary" disabled={loading || !sourceCountryId || !destCountryId || !itemId}>
          {loading ? <span className="btn-spinner" /> : '⚡ Compare'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className="result fade-in">
          <div className="destination-banner">
            <img
              src={`https://flagcdn.com/w640/${result.dest_country_code.toLowerCase()}.png`}
              alt={`Flag of ${result.dest_country}`}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="destination-banner-caption">📍 {result.dest_country}</div>
          </div>
          <h2>{result.item}</h2>
          <StatusBadge text={result.expense_status} />
          <div className="result-grid">
            <div>
              <span className="label">Price in {result.dest_country}</span>
              <span className="value">
                {result.original_currency} {result.original_price}
                {result.original_price_estimated && <span className="estimated-tag"> estimated</span>}
              </span>
            </div>
            <div>
              <span className="label">Home-equivalent cost</span>
              <span className="value">{result.home_currency} {result.home_equivalent_price}</span>
            </div>
            <div>
              <span className="label">Actual price in {result.source_country}</span>
              <span className="value">
                {result.home_currency} {result.actual_home_price}
                {result.actual_home_price_estimated && <span className="estimated-tag"> estimated</span>}
              </span>
            </div>
            <div>
              <span className="label">Difference vs. home</span>
              <span className="value">{result.percentage_difference > 0 ? '+' : ''}{result.percentage_difference}%</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
