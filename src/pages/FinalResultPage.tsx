import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import {
  getAllRounds,
  resetForRematch,
  setPlayerReady,
} from '../services/roomService';
import { getPlayerSession, clearPlayerSession } from '../utils/session';
import { parseRoundSummaries, computeGameScores, getOverallWinner } from '../games/stone-paper-pencil-scissors/gameLogic';
import type { GameRound } from '../types';
import LoadingState from '../components/LoadingState';

export default function FinalResultPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const session = getPlayerSession();
  const currentSessionPlayerId = session && session.roomId === roomId ? session.playerId : null;

  const { room, players, loading: roomLoading } = useRoom(
    roomId || null,
    currentSessionPlayerId
  );

  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [loadingRounds, setLoadingRounds] = useState(true);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [resetting, setResetting] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentSessionPlayerId) || null;
  const isPlayer1 = currentPlayer?.player_number === 1;

  const p1 = players.find((p) => p.player_number === 1);
  const p2 = players.find((p) => p.player_number === 2);
  const p1Name = p1?.player_name || 'Player 1';
  const p2Name = p2?.player_name || 'Player 2';

  // Load round history
  useEffect(() => {
    if (!roomId) return;
    getAllRounds(roomId).then((res) => {
      setRounds(res);
      setLoadingRounds(false);
    });
  }, [roomId]);

  // Watch for room reset (rematch started by both) -> if room.status goes back to 'waiting', redirect to lobby
  useEffect(() => {
    if (room?.status === 'waiting') {
      navigate(`/room/${room.id}/lobby`);
    }
  }, [room?.status, room?.id, navigate]);

  // Handle player ready state for rematch
  const bothReady = players.length >= 2 && players.every((p) => p.ready);

  useEffect(() => {
    // If both players are marked ready, host resets the room
    if (bothReady && isPlayer1 && !resetting && roomId) {
      setResetting(true);
      resetForRematch(roomId).then(() => {
        // Also unmark ready states
        if (p1) setPlayerReady(p1.id, false);
        if (p2) setPlayerReady(p2.id, false);
      });
    }
  }, [bothReady, isPlayer1, resetting, roomId, p1, p2]);

  const handlePlayAgain = async () => {
    if (!currentPlayer || !roomId) return;
    setRematchRequested(true);
    await setPlayerReady(currentPlayer.id, true);
  };

  const handleBackHome = () => {
    clearPlayerSession();
    navigate('/');
  };

  if (roomLoading || loadingRounds) {
    return (
      <div className="page page-centered">
        <LoadingState message="Calculating final scores..." />
      </div>
    );
  }

  const { player1Score, player2Score } = computeGameScores(rounds);
  const { winnerName, isDraw } = getOverallWinner(p1Name, p2Name, player1Score, player2Score);

  const myScore = isPlayer1 ? player1Score : player2Score;
  const oppScore = isPlayer1 ? player2Score : player1Score;
  const oppName = isPlayer1 ? p2Name : p1Name;

  const summaries = parseRoundSummaries(rounds);

  return (
    <div className="page safe-bottom">
      {/* Trophy / Header */}
      <div className="text-center mt-md mb-lg">
        <div style={{ fontSize: '3.5rem', lineHeight: 1 }} role="img" aria-label="Trophy">
          🏆
        </div>
        <p className="text-xs uppercase text-muted font-bold mt-sm" style={{ letterSpacing: '0.12em' }}>
          Game Over
        </p>
        <h1 className="text-brand mt-xs" style={{ fontSize: '2rem' }}>
          {isDraw ? "It's a Draw!" : `${winnerName} Wins!`}
        </h1>
      </div>

      {/* Final Score Card */}
      <div className="card mb-lg text-center">
        <p className="text-xs uppercase text-muted font-bold mb-md" style={{ letterSpacing: '0.08em' }}>
          Final Score
        </p>
        <div className="flex justify-center items-center gap-xl mb-sm">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-muted">{currentPlayer?.player_name}</span>
            <span className="text-display" style={{ fontSize: '3rem', color: myScore > oppScore ? 'var(--color-success)' : 'inherit' }}>
              {myScore}
            </span>
          </div>

          <span className="score-divider" style={{ fontSize: '2rem' }}>—</span>

          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-muted">{oppName}</span>
            <span className="text-display" style={{ fontSize: '3rem', color: oppScore > myScore ? 'var(--color-success)' : 'inherit' }}>
              {oppScore}
            </span>
          </div>
        </div>
      </div>

      {/* Round Breakdown */}
      <div className="mb-lg">
        <div className="section-divider mb-md">
          <span>Round Results</span>
        </div>

        <div className="round-history">
          {summaries.map((summary) => {
            const isRoundDraw = summary.result === 'draw';
            const didIWin =
              (isPlayer1 && summary.result === 'player1') ||
              (!isPlayer1 && summary.result === 'player2');

            const pillClass = isRoundDraw ? 'draw' : didIWin ? 'win' : 'loss';
            const pillText = isRoundDraw ? 'Draw' : didIWin ? 'Win' : 'Loss';

            return (
              <div key={summary.roundNumber} className="round-history-item">
                <span className="round-history-num">
                  Round {summary.roundNumber}
                </span>
                <span className={`round-result-pill ${pillClass}`}>
                  {pillText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rematch & Navigation Actions */}
      <div className="flex flex-col gap-sm">
        {rematchRequested ? (
          <div className="card text-center py-md" style={{ background: 'var(--color-surface-2)' }}>
            <p className="text-sm text-muted waiting-indicator justify-center">
              Waiting for {oppName} to accept rematch...
              <span className="waiting-dots">
                <span /><span /><span />
              </span>
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-lg btn-full"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={handleBackHome}
        >
          Back to Game കളിക്കാം
        </button>
      </div>
    </div>
  );
}
