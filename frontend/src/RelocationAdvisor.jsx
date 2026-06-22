import { useEffect, useState } from 'react';
import { estimateRelocation } from './api.js';

const DESTINATION_CITIES = ['San Francisco'];
const LIFESTYLE_LEVELS = [
  { value: 'budget', label: 'Budget' },
  { value: 'average', label: 'Average' },
  { value: 'comfortable', label: 'Comfortable' }
];

function findCountryId(countries, code, fallbackIndex) {
  return String(countries.find((c) => c.country_code === code)?.id ?? countries[fallbackIndex]?.id ?? '');
}

function formatMoney(money) {
  return `${money.currency} ${Number(money.amount).toLocaleString()}`;
}

function formatChange(value) {
  return `${value > 0 ? '+' : ''}${value}%`;
}

export default function RelocationAdvisor({ countries }) {
  const [form, setForm] = useState({
    origin_country_id: '',
    destination_city: 'San Francisco',
    lifestyle_level: 'average'
  });
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      origin_country_id: prev.origin_country_id || findCountryId(countries, 'IN', 0)
    }));
  }, [countries]);

  const originCountry = countries.find((c) => String(c.id) === String(form.origin_country_id));

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEstimate(null);
    setLoading(true);

    try {
      const res = await estimateRelocation({
        origin_country_id: Number(form.origin_country_id),
        destination_city: form.destination_city,
        lifestyle_level: form.lifestyle_level
      });
      setEstimate(res.data);
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
          <span>Relocation advisor</span>
          <strong>
            I&apos;m moving from {originCountry?.country_name || 'home'} to {form.destination_city}. What will my lifestyle cost?
          </strong>
        </div>

        <p className="advisor-note">
          Compare monthly lifestyle costs for relocation, digital nomad planning, international students, and expats.
        </p>

        <div className="advisor-grid">
          <div className="field">
            <label htmlFor="relocation-origin">Moving from</label>
            <select id="relocation-origin" value={form.origin_country_id} onChange={(e) => updateField('origin_country_id', e.target.value)}>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.country_name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="relocation-destination">Moving to</label>
            <select id="relocation-destination" value={form.destination_city} onChange={(e) => updateField('destination_city', e.target.value)}>
              {DESTINATION_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="relocation-lifestyle">Lifestyle level</label>
            <select id="relocation-lifestyle" value={form.lifestyle_level} onChange={(e) => updateField('lifestyle_level', e.target.value)}>
              {LIFESTYLE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? <span className="btn-spinner" /> : 'Estimate Move'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {estimate && (
        <section className="result advisor-result relocation-result fade-in">
          <span className="insight-label">Lifestyle Affordability Advisor</span>
          <h2>Relocation Summary</h2>
          <strong className="advisor-summary">{estimate.summary}</strong>

          <div className="advisor-facts relocation-highlights">
            <div>
              <span>Expected monthly spending</span>
              <strong>{formatMoney(estimate.expected_monthly_spending)}</strong>
              <small>Estimated monthly cost in {estimate.destination_city}.</small>
            </div>
            <div>
              <span>Equivalent lifestyle at home</span>
              <strong>{formatMoney(estimate.equivalent_lifestyle)}</strong>
              <small>What a similar lifestyle feels like in {originCountry?.country_name || 'your home country'}.</small>
            </div>
            <div>
              <span>Most surprising cost increase</span>
              <strong>{estimate.most_surprising_cost_increase}</strong>
              <small>The category most likely to feel like a shock.</small>
            </div>
            <div>
              <span>Most affordable category</span>
              <strong>{estimate.most_affordable_category}</strong>
              <small>The area least likely to feel worse than home.</small>
            </div>
          </div>

          <div className="relocation-bars">
            {estimate.category_changes.map((item) => (
              <div key={item.category} className="relocation-bar-row">
                <div>
                  <span>{item.category}</span>
                  <strong>{formatChange(item.change_percent)}</strong>
                </div>
                <div className="relocation-track">
                  <span
                    className={item.change_percent < 0 ? 'relocation-fill affordable' : 'relocation-fill'}
                    style={{ width: `${Math.min(Math.abs(item.change_percent), 300) / 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
