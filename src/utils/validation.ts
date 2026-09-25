// Input validation utilities

export const MAX_NAME_LENGTH = 20;
export const MIN_NAME_LENGTH = 1;

export function validatePlayerName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Please enter your name.';
  if (trimmed.length > MAX_NAME_LENGTH)
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  if (!/^[\w\s\u0D00-\u0D7F'-]+$/u.test(trimmed))
    return 'Name contains invalid characters.';
  return null;
}

export function validateRoomCode(code: string): string | null {
  const normalized = code.toUpperCase().trim();
  if (!normalized) return 'Please enter a room code.';
  if (normalized.length !== 6) return 'Room code must be 6 characters.';
  if (!/^[A-Z0-9]{6}$/.test(normalized)) return 'Room code contains invalid characters.';
  return null;
}

export const VALID_ROUNDS = [3, 5, 7, 10] as const;
export type ValidRounds = (typeof VALID_ROUNDS)[number];
