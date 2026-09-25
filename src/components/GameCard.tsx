import { useNavigate } from 'react-router-dom';
import type { GameDefinition } from '../config/games';

interface GameCardProps {
  game: GameDefinition;
}

export default function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const isAvailable = game.status === 'available';

  return (
    <div className={`game-card ${game.status}`}>
      <div className="game-emojis" aria-hidden="true">
        {game.emoji.map((e, i) => (
          <span key={i}>{e}</span>
        ))}
      </div>

      <div>
        <h2 className="game-name">{game.name}</h2>
        <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
          {game.description}
        </p>
      </div>

      <div className="game-meta">
        <span className="game-meta-tag">👥 {game.players} Players</span>
        <span className="game-meta-tag">
          {isAvailable ? '🟢 Online Multiplayer' : '⏳ Coming Soon'}
        </span>
      </div>

      <button
        className={`btn btn-full ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => isAvailable && navigate(game.path)}
        disabled={!isAvailable}
        aria-label={isAvailable ? `Play ${game.name}` : `${game.name} coming soon`}
      >
        {isAvailable ? 'Play Now' : 'Coming Soon'}
      </button>
    </div>
  );
}
