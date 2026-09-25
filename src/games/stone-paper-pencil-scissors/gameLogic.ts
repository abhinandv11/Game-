import { determineRoundWinner, CHOICE_META } from './rules';
import type { SPPSChoice, RoundResult, SPPSRoundSummary } from './types';
import type { GameRound } from '../../types';

export function calculateRoundOutcome(
  p1Choice: string | null,
  p2Choice: string | null
): RoundResult {
  if (!p1Choice || !p2Choice) return 'draw';
  return determineRoundWinner(p1Choice as SPPSChoice, p2Choice as SPPSChoice);
}

export function parseRoundSummaries(rounds: GameRound[]): SPPSRoundSummary[] {
  return rounds
    .filter((r) => r.result !== null && r.player1_choice && r.player2_choice)
    .map((r) => ({
      roundNumber: r.round_number,
      player1Choice: r.player1_choice as SPPSChoice,
      player2Choice: r.player2_choice as SPPSChoice,
      result: r.result as RoundResult,
    }));
}

export function computeGameScores(rounds: GameRound[]): {
  player1Score: number;
  player2Score: number;
  drawCount: number;
} {
  let player1Score = 0;
  let player2Score = 0;
  let drawCount = 0;

  for (const round of rounds) {
    if (round.result === 'player1') {
      player1Score += 1;
    } else if (round.result === 'player2') {
      player2Score += 1;
    } else if (round.result === 'draw') {
      drawCount += 1;
    }
  }

  return { player1Score, player2Score, drawCount };
}

export function getOverallWinner(
  player1Name: string,
  player2Name: string,
  p1Score: number,
  p2Score: number
): { winnerName: string | null; isDraw: boolean } {
  if (p1Score > p2Score) {
    return { winnerName: player1Name, isDraw: false };
  } else if (p2Score > p1Score) {
    return { winnerName: player2Name, isDraw: false };
  }
  return { winnerName: null, isDraw: true };
}

export { CHOICE_META, determineRoundWinner };
