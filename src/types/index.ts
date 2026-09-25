// Game type identifiers — extend this list as new games are added
export type GameType = 'stone-paper-pencil-scissors' | 'tic-tac-toe' | 'connect-four';

// Room statuses
export type RoomStatus = 'waiting' | 'playing' | 'finished' | 'abandoned';

// Player roles
export type PlayerNumber = 1 | 2;

// Core room data (matches DB schema)
export interface Room {
  id: string;
  room_code: string;
  game_type: GameType;
  rounds: number;
  status: RoomStatus;
  host_player_id: string;
  created_at: string;
  updated_at: string;
}

// Core player data (matches DB schema)
export interface Player {
  id: string;
  room_id: string;
  player_name: string;
  player_number: PlayerNumber;
  connected: boolean;
  ready: boolean;
  created_at: string;
}

// Game round data (matches DB schema)
export interface GameRound {
  id: string;
  room_id: string;
  round_number: number;
  player1_choice: string | null;
  player2_choice: string | null;
  player1_locked: boolean;
  player2_locked: boolean;
  result: 'player1' | 'player2' | 'draw' | null;
  created_at: string;
}

// Full room context used across the app
export interface RoomContext {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  opponent: Player | null;
}
