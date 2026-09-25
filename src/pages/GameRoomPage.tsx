import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useGame } from '../hooks/useGame';
import { leaveRoom } from '../services/roomService';
import { getPlayerSession, clearPlayerSession } from '../utils/session';
import SPPSGame from '../games/stone-paper-pencil-scissors/Game';
import ScoreBoard from '../components/ScoreBoard';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

export default function GameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const session = getPlayerSession();
  const currentSessionPlayerId = session && session.roomId === roomId ? session.playerId : null;

  const { room, players, loading: roomLoading, error: roomError } = useRoom(
    roomId || null,
    currentSessionPlayerId
  );

  const currentPlayer = players.find((p) => p.id === currentSessionPlayerId) || null;
  const isHost = currentPlayer?.player_number === 1;
  const playerNumber = (currentPlayer?.player_number || session?.playerNumber || null) as 1 | 2 | null;

  const opponent = players.find((p) => p.id !== currentSessionPlayerId) || null;

  const {
    currentRound,
    allRounds,
    player1Score,
    player2Score,
    loading: gameLoading,
    error: gameError,
    submitMyChoice,
    submitting,
  } = useGame(roomId || null, room?.rounds || 5, playerNumber, isHost);

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // If game is finished or all rounds are finished, redirect to final result screen
  useEffect(() => {
    if (!room) return;

    if (room.status === 'finished') {
      navigate(`/room/${room.id}/result`);
      return;
    }

    const completedRounds = allRounds.filter((r) => r.result !== null);
    if (completedRounds.length >= room.rounds && room.rounds > 0) {
      navigate(`/room/${room.id}/result`);
    }
  }, [room?.status, room?.rounds, allRounds, room?.id, navigate]);

  const handleLeave = async () => {
    if (roomId && currentSessionPlayerId) {
      await leaveRoom(roomId, currentSessionPlayerId, isHost);
    }
    clearPlayerSession();
    navigate('/');
  };

  if (roomLoading || gameLoading) {
    return (
      <div className="page page-centered">
        <LoadingState message="Loading game..." />
      </div>
    );
  }

  if (roomError || !room || !currentPlayer) {
    return (
      <div className="page page-centered">
        <ErrorMessage message={roomError || 'Room session not found.'} />
        <button
          type="button"
          className="btn btn-secondary mt-md"
          onClick={() => {
            clearPlayerSession();
            navigate('/');
          }}
        >
          Back to Game കളിക്കാം
        </button>
      </div>
    );
  }

  const p1 = players.find((p) => p.player_number === 1);
  const p2 = players.find((p) => p.player_number === 2);
  const p1Name = p1?.player_name || 'Player 1';
  const p2Name = p2?.player_name || 'Player 2';

  const myScore = playerNumber === 1 ? player1Score : player2Score;
  const opponentScore = playerNumber === 1 ? player2Score : player1Score;

  return (
    <div className="page safe-bottom">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-md">
        <span className="game-type-badge">
          Stone • Paper • Pencil • Scissors
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setShowLeaveModal(true)}
          aria-label="Leave current game"
        >
          Leave
        </button>
      </div>

      {/* Opponent disconnected warning */}
      {opponent && !opponent.connected && (
        <div className="notice-box mb-md text-center">
          <p className="text-xs">
            {opponent.player_name} lost connection. Reconnecting...
          </p>
        </div>
      )}

      {/* Score Board */}
      <div className="mb-lg">
        <ScoreBoard
          player1Name={p1Name}
          player2Name={p2Name}
          player1Score={player1Score}
          player2Score={player2Score}
          isPlayer1={playerNumber === 1}
          currentRound={currentRound?.round_number || 1}
          totalRounds={room.rounds}
        />
      </div>

      {gameError && (
        <div className="mb-md">
          <p className="form-error text-center">{gameError}</p>
        </div>
      )}

      {/* Game Play Area */}
      {currentRound ? (
        <SPPSGame
          currentRound={currentRound}
          player={currentPlayer}
          opponent={opponent}
          totalRounds={room.rounds}
          myScore={myScore}
          opponentScore={opponentScore}
          onSubmitChoice={submitMyChoice}
          submitting={submitting}
        />
      ) : (
        <div className="card text-center py-xl">
          <LoadingState message="Preparing round..." />
        </div>
      )}

      <ConfirmDialog
        isOpen={showLeaveModal}
        title="Leave this game?"
        message="Are you sure? Your progress will be discarded."
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={handleLeave}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
}
