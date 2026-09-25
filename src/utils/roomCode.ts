/**
 * Room code generator.
 * Uses uppercase alphanumeric chars, excluding ambiguous: O, 0, I, 1, S, 5
 */

const SAFE_CHARS = 'ABCDEFGHJKLMNPQRTUVWXYZ2346789';
const CODE_LENGTH = 6;

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return code;
}

export function normalizeRoomCode(input: string): string {
  return input.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
}

export function isValidRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(normalizeRoomCode(code));
}
