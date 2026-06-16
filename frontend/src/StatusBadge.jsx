const TONE_BY_EMOJI = {
  '🟢': 'good',
  '🟡': 'ok',
  '⚪': 'neutral',
  '🟠': 'warn',
  '🔴': 'bad'
};

export default function StatusBadge({ text }) {
  const emoji = text.slice(0, 2).trim();
  const label = text.slice(text.indexOf(' ') + 1);
  const tone = TONE_BY_EMOJI[emoji] ?? 'neutral';

  return (
    <span className={`status-badge tone-${tone}`}>
      <span>{emoji}</span> {label}
    </span>
  );
}
