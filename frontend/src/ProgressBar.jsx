const TONE_BY_EMOJI = {
  '🟢': 'good',
  '🟡': 'ok',
  '⚪': 'neutral',
  '🟠': 'warn',
  '🔴': 'bad'
};

export default function ProgressBar({ pct, statusText }) {
  const emoji = statusText.slice(0, 2).trim();
  const tone = TONE_BY_EMOJI[emoji] ?? 'neutral';
  const width = Math.max(2, Math.min(100, pct));

  return (
    <div className="progress-track">
      <div className={`progress-fill tone-${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}
