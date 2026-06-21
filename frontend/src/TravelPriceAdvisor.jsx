import { useEffect, useState } from 'react';
import { advisePrice } from './api.js';

const DEFAULT_FORM = {
  item: 'lunch',
  destination_city: 'New York',
  destination_country_id: '',
  home_country_id: '',
  destination_price: '25',
  destination_typical_min: '18',
  destination_typical_max: '30',
  home_typical_min: '150',
  home_typical_max: '300'
};

const NUMERIC_FIELDS = new Set([
  'destination_country_id',
  'home_country_id',
  'destination_price',
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
            Is {destinationCountry?.currency_code || ''} {form.destination_price || '0'} for {form.item || 'this item'} in {form.destination_city || 'this city'} expensive for someone from {homeCountry?.country_name || 'home'}?
          </strong>
        </div>

        <ol className="advisor-process">
          <li>Convert the price into your home currency.</li>
          <li>Calculate the Travel Affordability Score: what it feels like at home.</li>
          <li>Compare the price with local and home-country ranges.</li>
          <li>Give a simple verdict.</li>
        </ol>

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

        <div className="advisor-ranges">
          <div className="field">
            <label>Normal range in {form.destination_city || 'destination'}</label>
            <div className="range-row">
              <input type="number" min="0" step="any" value={form.destination_typical_min} onChange={(e) => updateField('destination_typical_min', e.target.value)} aria-label="Destination typical minimum" />
              <span>to</span>
              <input type="number" min="0" step="any" value={form.destination_typical_max} onChange={(e) => updateField('destination_typical_max', e.target.value)} aria-label="Destination typical maximum" />
            </div>
          </div>
          <div className="field">
            <label>Normal range in {homeCountry?.country_name || 'home'}</label>
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
          <strong className="advisor-summary">{advice.summary}</strong>
          <div className="advisor-facts">
            <div>
              <span>Currency conversion</span>
              <strong>1 {destinationCountry?.currency_code} = {homeCountry?.currency_code} {advice.exchange_rate?.toFixed(2)}</strong>
              <small>What the price becomes after exchange rate conversion.</small>
            </div>
            <div>
              <span>Travel Affordability Score</span>
              <strong>{homeCountry?.currency_code} {advice.affordability_score?.toFixed(2)}</strong>
              <small>What this feels like in your home economy.</small>
            </div>
          </div>
          <div className="advisor-steps">
            {advice.steps.map((step, index) => (
              <div key={step.title} className="advisor-step">
                <span>{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
