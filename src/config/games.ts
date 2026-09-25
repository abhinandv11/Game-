/**
 * Game registry — add new games here to have them appear on the homepage.
 * The multiplayer infrastructure is generic; game_type routes to the correct game.
 */

export type GameStatus = 'available' | 'coming-soon';

export interface GameDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  emoji: string[];
  players: number;
  status: GameStatus;
  path: string;
}

export const GAMES: GameDefinition[] = [
  {
    id: 'stone-paper-pencil-scissors',
    name: 'Stone Paper Pencil Scissors',
    shortName: 'SPPS',
    description: 'A 4-choice twist on the classic game.',
    emoji: ['🪨', '📄', '✏️', '✂️'],
    players: 2,
    status: 'available',
    path: '/game/stone-paper-pencil-scissors',
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    shortName: 'TTT',
    description: 'The classic 3×3 strategy game.',
    emoji: ['⭕', '❌'],
    players: 2,
    status: 'coming-soon',
    path: '/game/tic-tac-toe',
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    shortName: 'C4',
    description: 'Drop pieces and connect four in a row.',
    emoji: ['🔴', '🟡'],
    players: 2,
    status: 'coming-soon',
    path: '/game/connect-four',
  },
];
