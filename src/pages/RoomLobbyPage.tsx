import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { startGame, leaveRoom } from '../services/roomService';
import { getPlayerSession, clearPlayerSession } from '../utils/session';
import RoomCode from '../components/RoomCode';
import PlayerCard from '../components/PlayerCard';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

export default function RoomLobbyPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const session = getPlayerSession();
  const currentSessionPlayerId = session && session.roomId === roomId ? session.playerId : null;

  const { room, players, loading, error, reload } = useRoom(
    roomId || null,
    currentSessionPlayerId
  );

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Identify players
  const player1 = players.find((p) => p.player_number === 1) || null;
  const player2 = players.find((p) => p.player_number === 2) || null;

  const currentPlayer = players.find((p) => p.id === currentSessionPlayerId) || null;
  const isHost = currentPlayer?.player_number === 1;
  const bothConnected = Boolean(player1 && player2);

  // If game status is 'playing', navigate to play screen
  useEffect(() => {
    if (room?.status === 'playing') {
      navigate(`/room/${room.id}/play`);
    } else if (room?.status === 'abandoned') {
      setStartError('The host has left or closed this room.');
    }
  }, [room?.status, room?.id, navigate]);

  const handleStartGame = async () => {
    if (!roomId) return;
    setStarting(true);
    setStartError(null);

    const res = await startGame(roomId);
    if (res.error) {
      setStartError(res.error);
      setStarting(false);
    }
    // Room status will become 'playing' in realtime and trigger navigation
  };

  const handleLeave = async () => {
    if (roomId && currentSessionPlayerId) {
      await leaveRoom(roomId, currentSessionPlayerId, isHost);
    }
    clearPlayerSession();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page page-centered">
        <LoadingState message="Connecting to room lobby..." />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="page page-centered">
        <ErrorMessage
          message={error || 'Room not found.'}
          onRetry={reload}
        />
        <button
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

  return (
    <div className="page safe-bottom">
      <div className="flex justify-between items-center mb-md">
        <span className="round-badge">
          {room.rounds} Rounds Match
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setShowLeaveModal(true)}
          style={{ color: '#f87171' }}
        >
          Leave Game
        </button>
      </div>

      {/* Room Code Display */}
      <div className="mb-lg">
        <RoomCode code={room.room_code} />
      </div>

      {/* Players Section */}
      <div className="card mb-lg">
        <p className="form-label mb-md text-center">Players</p>
        <div className="player-grid">
          <PlayerCard
            player={player1}
            isYou={player1?.id === currentSessionPlayerId}
            label={player1?.id === currentSessionPlayerId ? 'You (Host)' : 'Host'}
          />

          <div className="vs-badge">VS</div>

          <PlayerCard
            player={player2}
            isYou={player2?.id === currentSessionPlayerId}
            label={player2?.id === currentSessionPlayerId ? 'You' : 'Friend'}
          />
        </div>
      </div>

      {/* Action / Waiting State */}
      <div className="card text-center" style={{ background: 'var(--color-surface-2)' }}>
        {!bothConnected ? (
          <div className="waiting-indicator py-sm">
            <span className="dot dot-yellow" />
            <span>Waiting for your friend to join...</span>
          </div>
        ) : isHost ? (
          <div className="flex flex-col gap-sm">
            <p className="text-sm text-muted">
              Both players connected! Ready to begin.
            </p>
            {startError && <p className="form-error justify-center">{startError}</p>}
            <button
              type="button"
              className="btn btn-primary btn-lg btn-full"
              disabled={starting}
              onClick={handleStartGame}
            >
              {starting ? 'Starting Game...' : 'Start Game'}
            </button>
          </div>
        ) : (
          <div className="waiting-indicator py-sm">
            <span className="dot dot-green" />
            <span>Connected! Waiting for host to start the game...</span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showLeaveModal}
        title="Leave this game?"
        message="Are you sure you want to leave the room?"
        confirmLabel="Leave"
        cancelLabel="Cancel"
        onConfirm={handleLeave}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
}
