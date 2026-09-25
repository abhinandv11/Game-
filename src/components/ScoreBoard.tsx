interface ScoreBoardProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  isPlayer1: boolean;
  currentRound: number;
  totalRounds: number;
}

export default function ScoreBoard({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  isPlayer1,
  currentRound,
  totalRounds,
}: ScoreBoardProps) {
  const myName = isPlayer1 ? player1Name : player2Name;
  const opponentName = isPlayer1 ? player2Name : player1Name;
  const myScore = isPlayer1 ? player1Score : player2Score;
  const opponentScore = isPlayer1 ? player2Score : player1Score;

  return (
    <div>
      <div className="flex justify-center mb-md">
        <span className="round-badge">Round {currentRound} / {totalRounds}</span>
      </div>
      <div className="score-board">
        <div className="score-item">
          <span className="score-label" title={myName}>
            {myName.length > 8 ? myName.slice(0, 8) + '…' : myName}
          </span>
          <span className="score-value">{myScore}</span>
        </div>
        <span className="score-divider">—</span>
        <div className="score-item">
          <span className="score-label" title={opponentName}>
            {opponentName.length > 8 ? opponentName.slice(0, 8) + '…' : opponentName}
          </span>
          <span className="score-value">{opponentScore}</span>
        </div>
      </div>
    </div>
  );
}
