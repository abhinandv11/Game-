/**
 * Stone Paper Pencil Scissors — Game Types
 */

export type SPPSChoice = 'stone' | 'paper' | 'pencil' | 'scissors';

export type RoundResult = 'player1' | 'player2' | 'draw';

export interface SPPSRoundSummary {
  roundNumber: number;
  player1Choice: SPPSChoice;
  player2Choice: SPPSChoice;
  result: RoundResult;
}

export interface SPPSGameState {
  currentRound: number;
  totalRounds: number;
  player1Score: number;
  player2Score: number;
  drawCount: number;
  roundHistory: SPPSRoundSummary[];
  phase: 'choosing' | 'revealing' | 'finished';
}
