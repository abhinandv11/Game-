import type { SPPSChoice, RoundResult } from '../games/stone-paper-pencil-scissors/types';
import { CHOICE_META } from '../games/stone-paper-pencil-scissors/rules';

interface ResultDisplayProps {
  roundNumber: number;
  totalRounds: number;
  myChoice: SPPSChoice;
  opponentChoice: SPPSChoice;
  myName: string;
  opponentName: string;
  result: RoundResult; // 'player1' | 'player2' | 'draw'
  isPlayer1: boolean;
  myScore: number;
  opponentScore: number;
}

export default function ResultDisplay({
  roundNumber,
  totalRounds,
  myChoice,
  opponentChoice,
  myName,
  opponentName,
  result,
  isPlayer1,
  myScore,
  opponentScore,
}: ResultDisplayProps) {
  const didIWin =
    (isPlayer1 && result === 'player1') || (!isPlayer1 && result === 'player2');
  const isDraw = result === 'draw';

  const statusClass = isDraw ? 'draw' : didIWin ? 'win' : 'loss';
  const headline = isDraw ? 'Round Draw' : didIWin ? 'You Won The Round' : 'Round Lost';

  const myMeta = CHOICE_META[myChoice];
  const oppMeta = CHOICE_META[opponentChoice];

  return (
    <div
      className={`result-banner ${statusClass}`}
      role="region"
      aria-live="polite"
      aria-label={`Round ${roundNumber} result: ${headline}`}
    >
      <div className="flex justify-center mb-md">
        <span className="round-badge">
          Round {roundNumber} of {totalRounds}
        </span>
      </div>

      <h2 className={`result-title ${statusClass} mb-lg`}>{headline}</h2>

      <div className="reveal-grid mb-lg">
        <div className={`reveal-card ${didIWin ? 'winner' : ''}`}>
          <span className="reveal-label">You ({myName})</span>
          <span className="reveal-emoji" role="img" aria-label={myMeta?.label}>
            {myMeta?.emoji || '-'}
          </span>
          <span className="reveal-choice">{myMeta?.label || 'Choice'}</span>
        </div>

        <div className="vs-badge">vs</div>

        <div className={`reveal-card ${!didIWin && !isDraw ? 'winner' : ''}`}>
          <span className="reveal-label">{opponentName}</span>
          <span className="reveal-emoji" role="img" aria-label={oppMeta?.label}>
            {oppMeta?.emoji || '-'}
          </span>
          <span className="reveal-choice">{oppMeta?.label || 'Choice'}</span>
        </div>
      </div>

      <div className="result-score-summary">
        <span className="text-muted">Score:</span>
        <strong className="result-score-text">
          {myName} {myScore} — {opponentScore} {opponentName}
        </strong>
      </div>
    </div>
  );
}
