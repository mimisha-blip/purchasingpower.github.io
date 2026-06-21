export default function ProgressBar({ pct }) {
  // Tone is derived directly from the number, not a backend status string —
  // a result cached in localStorage from an older response shape (or any
  // future wording change) can never get the in-budget/over-budget color wrong.
  const tone = pct <= 100 ? 'good' : 'bad';
  // Fill represents budget headroom, not cost — a very affordable trip
  // (low cost) should read as a full green bar, not a near-empty one.
  const width = pct > 100 ? 100 : Math.max(2, Math.min(100, 100 - pct));

  return (
    <div className="progress-track">
      <div className={`progress-fill tone-${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}
