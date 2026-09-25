export interface StoredSession {
  playerId: string;
  playerName: string;
  playerNumber: 1 | 2;
  roomId: string;
  roomCode: string;
}

const SESSION_KEY = 'game_kalikkam_session';

export function savePlayerSession(session: StoredSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Also save to localStorage for recovering on page close/reopen
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function getPlayerSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch (err) {
    console.error('Failed to read session:', err);
    return null;
  }
}

export function clearPlayerSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}
