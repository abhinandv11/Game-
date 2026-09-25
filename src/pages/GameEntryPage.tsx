import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '../config/games';

export default function GameEntryPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const game = GAMES.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="page page-centered text-center">
        <h2>Game not found</h2>
        <button className="btn btn-primary mt-md" onClick={() => navigate('/')}>
          Back to Game കളിക്കാം
        </button>
      </div>
    );
  }

  return (
    <div className="page safe-bottom">
      <div className="text-center mt-md mb-lg">
        <div className="game-emojis justify-center mb-sm" style={{ fontSize: '2.5rem' }}>
          {game.emoji.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
        <h1 className="text-display mb-xs" style={{ fontSize: '1.75rem' }}>
          {game.name}
        </h1>
        <p className="text-sm text-muted">
          Create a room and invite your friend, or enter a room code to join.
        </p>
      </div>

      <div className="card flex flex-col gap-md mb-lg">
        <button
          type="button"
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigate(`/game/${gameId}/create`)}
        >
          Create Room
        </button>

        <div className="section-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-lg btn-full"
          onClick={() => navigate(`/game/${gameId}/join`)}
        >
          Join Room
        </button>
      </div>

      {/* Rules Overview */}
      <div className="card" style={{ background: 'var(--color-surface-2)' }}>
        <h3 className="text-xs uppercase text-muted font-bold mb-sm" style={{ letterSpacing: '0.08em' }}>
          How It Works
        </h3>
        <ul className="text-xs text-muted flex flex-col gap-xs" style={{ lineHeight: '1.6' }}>
          <li>🪨 <strong>Stone</strong> beats Scissors & Pencil</li>
          <li>✂️ <strong>Scissors</strong> beats Paper & Pencil</li>
          <li>✏️ <strong>Pencil</strong> beats Paper</li>
          <li>📄 <strong>Paper</strong> beats Stone</li>
          <li>⚖️ Identical moves or other matchups result in a <strong>Draw</strong></li>
        </ul>
      </div>
    </div>
  );
}
