import type { Player } from '../types';

interface PlayerCardProps {
  player: Player | null;
  isYou?: boolean;
  label?: string;
}

export default function PlayerCard({ player, isYou, label }: PlayerCardProps) {
  if (!player) {
    return (
      <div className="player-card player-card-empty">
        <p className="player-role">{label || 'Friend'}</p>
        <div className="waiting-indicator">
          <div className="waiting-dots">
            <span /><span /><span />
          </div>
        </div>
        <p className="player-status">Waiting...</p>
      </div>
    );
  }

  return (
    <div className={`player-card ${isYou ? 'you' : ''}`}>
      <p className="player-role">{label || (isYou ? 'You' : 'Friend')}</p>
      <p className="player-name" title={player.player_name}>{player.player_name}</p>
      <p className={`player-status ${player.connected ? 'connected' : ''}`}>
        <span className={`dot ${player.connected ? 'dot-active' : 'dot-inactive'}`} />
        <span>{player.connected ? 'Connected' : 'Disconnected'}</span>
      </p>
    </div>
  );
}
