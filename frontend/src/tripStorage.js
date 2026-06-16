const KEY = 'ppp-trip-planner-state';
const TTL_MS = 60 * 60 * 1000; // 1 hour

export function loadTripState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveTripState(state) {
  const existing = loadTripState();
  const savedAt = existing?.savedAt ?? Date.now();
  localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt }));
}

export function clearTripState() {
  localStorage.removeItem(KEY);
}
