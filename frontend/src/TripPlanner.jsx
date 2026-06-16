import { useEffect, useState } from 'react';
import { estimateTrip } from './api.js';
import { loadTripState, saveTripState, clearTripState } from './tripStorage.js';
import { countryFlag } from './flags.js';
import StatusBadge from './StatusBadge.jsx';
import ProgressBar from './ProgressBar.jsx';
import BasketChecklist from './BasketChecklist.jsx';

export default function TripPlanner({ countries, items }) {
  const saved = loadTripState();

  const [homeCountryId, setHomeCountryId] = useState(
    saved?.homeCountryId ?? (countries[0] ? String(countries[0].id) : '')
  );
  const [monthlyIncome, setMonthlyIncome] = useState(saved?.monthlyIncome ?? '');
  const [startDate, setStartDate] = useState(saved?.startDate ?? '');
  const [endDate, setEndDate] = useState(saved?.endDate ?? '');
  const [basket, setBasket] = useState(saved?.basket ?? []);
  const [shortlist, setShortlist] = useState(saved?.shortlist ?? []);
  const [shortlistFilter, setShortlistFilter] = useState('');
  const [result, setResult] = useState(saved?.result ?? null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nights =
    startDate && endDate
      ? Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000))
      : 1;

  useEffect(() => {
    if (basket.length === 0 && !result) return;
    saveTripState({ homeCountryId, monthlyIncome, startDate, endDate, basket, shortlist, result });
  }, [homeCountryId, monthlyIncome, startDate, endDate, basket, shortlist, result]);

  function startOver() {
    clearTripState();
    setHomeCountryId(countries[0] ? String(countries[0].id) : '');
    setMonthlyIncome('');
    setStartDate('');
    setEndDate('');
    setBasket([]);
    setShortlist([]);
    setResult(null);
    setError('');
  }

  function toggleShortlistCountry(countryId) {
    setShortlist((prev) =>
      prev.includes(countryId) ? prev.filter((id) => id !== countryId) : [...prev, countryId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    if (basket.length === 0) {
      setError('Add at least one item to your basket.');
      return;
    }
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      setError('Enter your monthly income.');
      return;
    }

    setLoading(true);
    try {
      const candidateIds = shortlist.length > 0 ? shortlist : undefined;
      const res = await estimateTrip(Number(homeCountryId), Number(monthlyIncome), basket, candidateIds);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const shortlistCountries = countries
    .filter((c) => String(c.id) !== homeCountryId)
    .filter((c) => c.country_name.toLowerCase().includes(shortlistFilter.toLowerCase()));

  const homeCurrencySymbol = countries.find((c) => String(c.id) === homeCountryId)?.currency_symbol ?? '';

  return (
    <>
      <form onSubmit={handleSubmit} className="convert-form">
        <div className="field">
          <label htmlFor="home">Home country</label>
          <select id="home" value={homeCountryId} onChange={(e) => setHomeCountryId(e.target.value)}>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{countryFlag(c.country_code)} {c.country_name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Destination countries (optional — leave empty to compare every country)</label>
          <input
            type="text"
            className="shortlist-filter"
            placeholder="🔍 Filter countries…"
            value={shortlistFilter}
            onChange={(e) => setShortlistFilter(e.target.value)}
          />
          <div className="shortlist-grid">
            {shortlistCountries.map((c) => (
              <label key={c.id} className={`shortlist-option ${shortlist.includes(c.id) ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={shortlist.includes(c.id)}
                  onChange={() => toggleShortlistCountry(c.id)}
                />
                {countryFlag(c.country_code)} {c.country_name}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Trip duration</label>
          <div className="date-range-row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="From"
            />
            <span className="date-range-sep">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="To"
            />
          </div>
          {startDate && endDate && (
            <p className="hint">
              {nights} night{nights === 1 ? '' : 's'} — newly checked hotel/stay items default to this many nights.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="income">Monthly income</label>
          <div className="currency-input">
            {homeCurrencySymbol && <span className="currency-symbol">{homeCurrencySymbol}</span>}
            <input
              id="income"
              type="number"
              min="0"
              step="any"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="e.g. 50000"
              className={homeCurrencySymbol ? 'has-currency-symbol' : ''}
            />
          </div>
        </div>

        <BasketChecklist items={items} basket={basket} onChange={setBasket} defaultNights={nights} />

        <div className="trip-form-actions">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : '🧭 Estimate Trip'}
          </button>
          {(basket.length > 0 || result) && (
            <button type="button" className="secondary" onClick={startOver}>
              Start Over
            </button>
          )}
        </div>
        {(basket.length > 0 || result) && (
          <p className="hint">Your trip is kept on this device for 1 hour, then clears automatically.</p>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className="result fade-in">
          {result.unpriced_items.length > 0 && (
            <p className="warning">
              No price data for: {result.unpriced_items.map((u) => u.name).join(', ')} — excluded from totals.
            </p>
          )}

          <p className="result-legend">
            Ranked from most to least affordable for you. <strong>Basket cost</strong> is what you
            checked, priced in their currency. <strong>Home-equivalent</strong> converts that to your
            currency at the real exchange rate — what it actually costs you. <strong>% of income</strong>{' '}
            is how much of one month's income the trip would use.
          </p>

          <div className="table-scroll">
            <table className="destination-table">
              <thead>
                <tr>
                  <th title="The country you're considering">Destination</th>
                  <th title="Total cost of your checked items, priced in that country's own currency">Basket cost</th>
                  <th title="That cost converted to your home currency at the real exchange rate — what it actually costs you">Home-equivalent</th>
                  <th title="The home-equivalent cost as a share of the monthly income you entered">% of income</th>
                  <th title="A quick read on affordability, from Very Affordable to Unaffordable">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.destinations.map((d, i) => (
                  <tr key={d.country_id} style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}>
                    <td className="destination-cell">
                      <span className="flag">{countryFlag(countries.find((c) => c.id === d.country_id)?.country_code)}</span>
                      {d.country_name}
                    </td>
                    <td>{d.currency_code} {d.basket_total_dest_currency}</td>
                    <td>{result.home_country.currency_code} {d.basket_total_home_equivalent}</td>
                    <td>
                      <div className="pct-cell">
                        <span>{d.pct_of_income}%</span>
                        <ProgressBar pct={d.pct_of_income} statusText={d.income_status} />
                      </div>
                    </td>
                    <td><StatusBadge text={d.income_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
