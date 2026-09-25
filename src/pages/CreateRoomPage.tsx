import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRoom } from '../services/roomService';
import { validatePlayerName, VALID_ROUNDS, type ValidRounds } from '../utils/validation';
import { savePlayerSession } from '../utils/session';
import type { GameType } from '../types';

export default function CreateRoomPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState('');
  const [rounds, setRounds] = useState<ValidRounds>(5);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePlayerName(playerName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const validGameType = (gameId || 'stone-paper-pencil-scissors') as GameType;
    const res = await createRoom(validGameType, rounds, playerName);

    if ('error' in res) {
      setError(res.error);
      setSubmitting(false);
      return;
    }

    // Persist session
    savePlayerSession({
      playerId: res.player.id,
      playerName: res.player.player_name,
      playerNumber: 1,
      roomId: res.room.id,
      roomCode: res.room.room_code,
    });

    navigate(`/room/${res.room.id}/lobby`);
  };

  return (
    <div className="page safe-bottom">
      <div className="text-center mt-md mb-lg">
        <h1 className="text-display mb-xs">
          Create Room
        </h1>
        <p className="text-sm text-muted">
          Choose the match length and invite a friend
        </p>
      </div>

      <form onSubmit={handleCreate} className="card flex flex-col gap-lg">
        {/* Name input */}
        <div className="form-group">
          <label htmlFor="player-name" className="form-label">
            Your Name
          </label>
          <input
            id="player-name"
            type="text"
            className={`form-input ${error ? 'error' : ''}`}
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

        {/* Rounds selector */}
        <div className="form-group">
          <label className="form-label">Number of Rounds</label>
          <div className="rounds-selector" role="radiogroup" aria-label="Number of rounds">
            {VALID_ROUNDS.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={rounds === r}
                className={`rounds-option ${rounds === r ? 'selected' : ''}`}
                onClick={() => setRounds(r)}
                disabled={submitting}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={!playerName.trim() || submitting}
        >
          {submitting ? 'Creating Room...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
}
