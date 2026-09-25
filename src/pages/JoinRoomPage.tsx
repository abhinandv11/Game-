import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../services/roomService';
import { validatePlayerName, validateRoomCode } from '../utils/validation';
import { savePlayerSession } from '../utils/session';

export default function JoinRoomPage() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validatePlayerName(playerName);
    if (nameErr) {
      setError(nameErr);
      return;
    }

    const codeErr = validateRoomCode(roomCode);
    if (codeErr) {
      setError(codeErr);
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await joinRoom(roomCode, playerName);

    if ('error' in res) {
      setError(res.error);
      setSubmitting(false);
      return;
    }

    // Persist session
    savePlayerSession({
      playerId: res.player.id,
      playerName: res.player.player_name,
      playerNumber: res.player.player_number,
      roomId: res.room.id,
      roomCode: res.room.room_code,
    });

    navigate(`/room/${res.room.id}/lobby`);
  };

  return (
    <div className="page safe-bottom">
      <div className="text-center mt-md mb-lg">
        <h1 className="text-display mb-xs">
          Join a Room
        </h1>
        <p className="text-sm text-muted">
          Enter your name and the 6-character room code
        </p>
      </div>

      <form onSubmit={handleJoin} className="card flex flex-col gap-lg">
        {/* Name input */}
        <div className="form-group">
          <label htmlFor="join-name" className="form-label">
            Your Name
          </label>
          <input
            id="join-name"
            type="text"
            className="form-input"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (error) setError(null);
            }}
            maxLength={20}
            autoFocus
            disabled={submitting}
          />
        </div>

        {/* Room Code input */}
        <div className="form-group">
          <label htmlFor="join-code" className="form-label">
            Room Code
          </label>
          <input
            id="join-code"
            type="text"
            className="form-input room-code-input"
            placeholder="e.g. A7K2P9"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              if (error) setError(null);
            }}
            maxLength={6}
            disabled={submitting}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={!playerName.trim() || roomCode.trim().length !== 6 || submitting}
        >
          {submitting ? 'Joining Room...' : 'Join Room'}
        </button>
      </form>
    </div>
  );
}
