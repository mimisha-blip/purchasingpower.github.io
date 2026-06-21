import { useEffect, useState } from 'react';
import { advisePrice } from './api.js';

const DEFAULT_FORM = {
  item: 'lunch',
  destination_country_id: '',
  home_country_id: '',
  destination_price: '25'
};

const NUMERIC_FIELDS = new Set([
  'destination_country_id',
  'home_country_id',
  'destination_price'
]);

function toPayload(form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      NUMERIC_FIELDS.has(key) ? Number(value) : value
    ])
  );
}

function findCountryId(countries, code, fallbackIndex) {
  return String(countries.find((c) => c.country_code === code)?.id ?? countries[fallbackIndex]?.id ?? '');
}

export default function TravelPriceAdvisor({ countries }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      home_country_id: prev.home_country_id || findCountryId(countries, 'IN', 0),
      destination_country_id: prev.destination_country_id || findCountryId(countries, 'US', 1)
    }));
  }, [countries]);

  const homeCountry = countries.find((c) => String(c.id) === String(form.home_country_id));
  const destinationCountry = countries.find((c) => String(c.id) === String(form.destination_country_id));

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setAdvice(null);
    setLoading(true);

    try {
      const res = await advisePrice(toPayload(form));
      setAdvice(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="convert-form">
        <div className="advisor-hero">
          <span>Ask the advisor</span>
          <strong>
            Is {destinationCountry?.currency_code || ''} {form.destination_price || '0'} for {form.item || 'this item'} expensive for someone from {homeCountry?.country_name || 'home'}?
          </strong>
        </div>

        <p className="advisor-note">
          Add the price you saw. The advisor fills the exchange rate and comparison data automatically.
        </p>

        <div className="advisor-grid">
          <div className="field">
            <label htmlFor="advisor-item">Item you want to check</label>
            <input id="advisor-item" value={form.item} onChange={(e) => updateField('item', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-price">Price you saw</label>
            <input id="advisor-price" type="number" min="0" step="any" value={form.destination_price} onChange={(e) => updateField('destination_price', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-destination">Destination country</label>
            <select id="advisor-destination" value={form.destination_country_id} onChange={(e) => updateField('destination_country_id', e.target.value)}>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.country_name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="advisor-home">Home country</label>
            <select id="advisor-home" value={form.home_country_id} onChange={(e) => updateField('home_country_id', e.target.value)}>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.country_name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? <span className="btn-spinner" /> : 'Ask Advisor'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {advice && (
        <section className="result advisor-result fade-in">
          <span className="insight-label">Travel Price Advisor</span>
          <h2>Summary</h2>
          <strong className="advisor-summary">{advice.summary}</strong>
          <div className="advisor-facts">
            <div>
              <span>Currency conversion</span>
              <strong>{advice.conversion}</strong>
              <small>Rate used: 1 {destinationCountry?.currency_code} = {homeCountry?.currency_code} {advice.exchange_rate?.toFixed(2)}</small>
            </div>
            <div>
              <span>Travel Affordability Score</span>
              <strong>{homeCountry?.currency_code} {advice.affordability_score?.toFixed(2)}</strong>
              <small>What this feels like in your home economy.</small>
            </div>
            <div>
              <span>Verdict</span>
              <strong>{advice.verdict}</strong>
              <small>{advice.localContext}</small>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
