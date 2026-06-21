import { useState } from 'react';
import { advisePrice } from './api.js';

const DEFAULT_FORM = {
  item: 'lunch',
  destination_city: 'New York',
  destination_country: 'USA',
  home_country: 'India',
  destination_currency: 'USD',
  destination_price: '25',
  home_currency: 'INR',
  exchange_rate: '83',
  affordability_score: '500',
  destination_typical_min: '18',
  destination_typical_max: '30',
  home_typical_min: '150',
  home_typical_max: '300'
};

const NUMERIC_FIELDS = new Set([
  'destination_price',
  'exchange_rate',
  'affordability_score',
  'destination_typical_min',
  'destination_typical_max',
  'home_typical_min',
  'home_typical_max'
]);

function toPayload(form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      NUMERIC_FIELDS.has(key) ? Number(value) : value
    ])
  );
}

export default function TravelPriceAdvisor() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="advisor-question">
          Is {form.destination_currency} {form.destination_price || '0'} for {form.item || 'this item'} in {form.destination_city || 'this city'} expensive for someone from {form.home_country || 'home'}?
        </div>

        <div className="advisor-grid">
          <div className="field">
            <label htmlFor="advisor-item">Item</label>
            <input id="advisor-item" value={form.item} onChange={(e) => updateField('item', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-price">Price</label>
            <input id="advisor-price" type="number" min="0" step="any" value={form.destination_price} onChange={(e) => updateField('destination_price', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-city">City</label>
            <input id="advisor-city" value={form.destination_city} onChange={(e) => updateField('destination_city', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-destination">Destination country</label>
            <input id="advisor-destination" value={form.destination_country} onChange={(e) => updateField('destination_country', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-home">Home country</label>
            <input id="advisor-home" value={form.home_country} onChange={(e) => updateField('home_country', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-rate">Exchange rate</label>
            <input id="advisor-rate" type="number" min="0" step="any" value={form.exchange_rate} onChange={(e) => updateField('exchange_rate', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="advisor-score">Travel Affordability Score</label>
            <input id="advisor-score" type="number" min="0" step="any" value={form.affordability_score} onChange={(e) => updateField('affordability_score', e.target.value)} />
          </div>
        </div>

        <div className="advisor-ranges">
          <div className="field">
            <label>Typical {form.item || 'item'} in {form.destination_city || 'destination'}</label>
            <div className="range-row">
              <input type="number" min="0" step="any" value={form.destination_typical_min} onChange={(e) => updateField('destination_typical_min', e.target.value)} aria-label="Destination typical minimum" />
              <span>to</span>
              <input type="number" min="0" step="any" value={form.destination_typical_max} onChange={(e) => updateField('destination_typical_max', e.target.value)} aria-label="Destination typical maximum" />
            </div>
          </div>
          <div className="field">
            <label>Typical {form.item || 'item'} in {form.home_country || 'home'}</label>
            <div className="range-row">
              <input type="number" min="0" step="any" value={form.home_typical_min} onChange={(e) => updateField('home_typical_min', e.target.value)} aria-label="Home typical minimum" />
              <span>to</span>
              <input type="number" min="0" step="any" value={form.home_typical_max} onChange={(e) => updateField('home_typical_max', e.target.value)} aria-label="Home typical maximum" />
            </div>
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
          <h2>{advice.verdict}</h2>
          <p>{advice.conversion}</p>
          <p>{advice.affordability}</p>
          <p>{advice.localContext}</p>
          <p>{advice.homeContext}</p>
          <strong>{advice.summary}</strong>
        </section>
      )}
    </>
  );
}
