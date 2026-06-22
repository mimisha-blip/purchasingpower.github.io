import { useEffect, useState } from 'react';
import { getCountries, getItems } from './api.js';
import TripPlanner from './TripPlanner.jsx';
import TravelPriceAdvisor from './TravelPriceAdvisor.jsx';
import RelocationAdvisor from './RelocationAdvisor.jsx';
import TravelBackdrop from './TravelBackdrop.jsx';
import './App.css';

export default function App() {
  const [countries, setCountries] = useState([]);
  const [items, setItems] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('advisor');

  useEffect(() => {
    Promise.all([getCountries(), getItems()])
      .then(([countriesRes, itemsRes]) => {
        setCountries(countriesRes.data);
        setItems(itemsRes.data);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  if (loadError) {
    return (
      <>
        <TravelBackdrop />
        <div className="app">
          <p className="error">
            Couldn't reach the API ({loadError}). Make sure the backend is running.
          </p>
        </div>
      </>
    );
  }

  if (countries.length === 0 || items.length === 0) {
    return (
      <>
        <TravelBackdrop />
        <div className="app">
          <div className="loading-spinner" />
        </div>
      </>
    );
  }

  return (
    <>
      <TravelBackdrop />
      <div className="app">
        <header className="header-glass">
          <div className="header-top">
            <span className="header-icon">✈️</span>
            <h1>Purchase Parity Converter</h1>
          </div>
          <p className="subtitle">
            See what a trip really costs you, adjusted for purchasing power — not just exchange rates.
          </p>
        </header>

        <div className="tab-toggle">
          <div className={`tab-indicator tab-${activeTab}`} />
          <button
            className={activeTab === 'advisor' ? 'active' : ''}
            onClick={() => setActiveTab('advisor')}
          >
            Advisor
          </button>
          <button
            className={activeTab === 'planner' ? 'active' : ''}
            onClick={() => setActiveTab('planner')}
          >
            Trip Planner
          </button>
          <button
            className={activeTab === 'relocation' ? 'active' : ''}
            onClick={() => setActiveTab('relocation')}
          >
            Relocation
          </button>
        </div>

        <div key={activeTab} className="tab-panel">
          {activeTab === 'advisor' ? (
            <TravelPriceAdvisor countries={countries} />
          ) : activeTab === 'planner' ? (
            <TripPlanner countries={countries} items={items} />
          ) : (
            <RelocationAdvisor countries={countries} />
          )}
        </div>
      </div>
    </>
  );
}
