/**
 * Stone Paper Pencil Scissors — Official Rules
 *
 * STONE beats: SCISSORS, PENCIL
 * SCISSORS beats: PAPER, PENCIL
 * PENCIL beats: PAPER
 * PAPER beats: STONE
 *
 * Any other matchup = DRAW
 *
 * DO NOT use standard Rock-Paper-Scissors rules here.
 */

import type { SPPSChoice, RoundResult } from './types';

/** Explicitly defined winning relationships */
const WINS_AGAINST: Record<SPPSChoice, SPPSChoice[]> = {
  stone: ['scissors', 'pencil'],
  scissors: ['paper', 'pencil'],
  pencil: ['paper'],
  paper: ['stone'],
};

/**
 * Determine the winner of a single round.
 *
 * @param player1 - Choice made by player 1
 * @param player2 - Choice made by player 2
 * @returns 'player1' | 'player2' | 'draw'
 */
export function determineRoundWinner(player1: SPPSChoice, player2: SPPSChoice): RoundResult {
  if (player1 === player2) return 'draw';

  if (WINS_AGAINST[player1]?.includes(player2)) return 'player1';
  if (WINS_AGAINST[player2]?.includes(player1)) return 'player2';

  // Any unspecified matchup is a draw
  return 'draw';
}

/** Human-readable display information for each choice */
export const CHOICE_META: Record<SPPSChoice, { label: string; emoji: string }> = {
  stone: { label: 'Stone', emoji: '🪨' },
  paper: { label: 'Paper', emoji: '📄' },
  pencil: { label: 'Pencil', emoji: '✏️' },
  scissors: { label: 'Scissors', emoji: '✂️' },
};

export const ALL_CHOICES: SPPSChoice[] = ['stone', 'paper', 'pencil', 'scissors'];
