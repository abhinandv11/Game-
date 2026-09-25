import { supabase } from './supabase';
import { generateRoomCode } from '../utils/roomCode';
import type { Room, Player, GameRound, GameType } from '../types';

// ─── Room Operations ──────────────────────────────────────────────────────────

export async function createRoom(
  gameType: GameType,
  rounds: number,
  hostName: string
): Promise<{ room: Room; player: Player } | { error: string }> {
  const room_code = generateRoomCode();

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      room_code,
      game_type: gameType,
      rounds,
      status: 'waiting',
    })
    .select()
    .single();

  if (roomError || !room) {
    console.error('Room creation error:', roomError);
    return { error: 'Could not create room. Please try again.' };
  }

  const { data: player, error: playerError } = await supabase
    .from('players')
    .insert({
      room_id: room.id,
      player_name: hostName.trim(),
      player_number: 1,
      connected: true,
      ready: false,
    })
    .select()
    .single();

  if (playerError || !player) {
    console.error('Player creation error:', playerError);
    // Clean up orphaned room
    await supabase.from('rooms').delete().eq('id', room.id);
    return { error: 'Could not create player. Please try again.' };
  }

  return { room, player };
}

export async function joinRoom(
  roomCode: string,
  playerName: string
): Promise<{ room: Room; player: Player; players: Player[] } | { error: string }> {
  const normalized = roomCode.toUpperCase().trim();

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select()
    .eq('room_code', normalized)
    .single();

  if (roomError || !room) {
    return { error: 'Room not found. Check the code and try again.' };
  }

  if (room.status === 'abandoned') {
    return { error: 'This room is no longer active.' };
  }

  if (room.status === 'playing') {
    return { error: 'This game has already started.' };
  }

  if (room.status === 'finished') {
    return { error: 'This game has already finished.' };
  }

  // Count current players
  const { data: existingPlayers, error: playersError } = await supabase
    .from('players')
    .select()
    .eq('room_id', room.id);

  if (playersError) {
    return { error: 'Could not verify room. Please try again.' };
  }

  if (existingPlayers && existingPlayers.length >= 2) {
    return { error: 'This room is already full.' };
  }

  const { data: player, error: playerError } = await supabase
    .from('players')
    .insert({
      room_id: room.id,
      player_name: playerName.trim(),
      player_number: 2,
      connected: true,
      ready: false,
    })
    .select()
    .single();

  if (playerError || !player) {
    console.error('Join error:', playerError);
    return { error: 'Could not join room. Please try again.' };
  }

  const allPlayers = [...(existingPlayers || []), player];
  return { room, player, players: allPlayers };
}

export async function getRoomByCode(
  roomCode: string
): Promise<{ room: Room; players: Player[] } | { error: string }> {
  const { data: room, error } = await supabase
    .from('rooms')
    .select()
    .eq('room_code', roomCode.toUpperCase().trim())
    .single();

  if (error || !room) return { error: 'Room not found.' };

  const { data: players } = await supabase.from('players').select().eq('room_id', room.id);

  return { room, players: players || [] };
}

export async function getRoomById(
  roomId: string
): Promise<{ room: Room; players: Player[] } | { error: string }> {
  const { data: room, error } = await supabase.from('rooms').select().eq('id', roomId).single();

  if (error || !room) return { error: 'Room not found.' };

  const { data: players } = await supabase.from('players').select().eq('room_id', room.id);

  return { room, players: players || [] };
}

export async function startGame(roomId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('rooms')
    .update({ status: 'playing', updated_at: new Date().toISOString() })
    .eq('id', roomId);

  if (error) return { error: 'Could not start game. Please try again.' };

  // Create first round
  const { error: roundError } = await supabase.from('game_rounds').insert({
    room_id: roomId,
    round_number: 1,
    player1_locked: false,
    player2_locked: false,
  });

  if (roundError) return { error: 'Could not initialize round.' };

  return {};
}

export async function updatePlayerConnection(
  playerId: string,
  connected: boolean
): Promise<void> {
  await supabase.from('players').update({ connected }).eq('id', playerId);
}

export async function leaveRoom(
  roomId: string,
  playerId: string,
  isHost: boolean
): Promise<void> {
  await supabase.from('players').update({ connected: false }).eq('id', playerId);

  if (isHost) {
    await supabase
      .from('rooms')
      .update({ status: 'abandoned', updated_at: new Date().toISOString() })
      .eq('id', roomId);
  }
}

// ─── Round Operations ─────────────────────────────────────────────────────────

export async function submitChoice(
  roundId: string,
  playerNumber: 1 | 2,
  choice: string
): Promise<{ error?: string }> {
  const field =
    playerNumber === 1
      ? { player1_choice: choice, player1_locked: true }
      : { player2_choice: choice, player2_locked: true };

  const { error } = await supabase.from('game_rounds').update(field).eq('id', roundId);

  if (error) return { error: 'Could not submit choice. Please try again.' };
  return {};
}

export async function updateRoundResult(
  roundId: string,
  result: 'player1' | 'player2' | 'draw'
): Promise<{ error?: string }> {
  const { error } = await supabase.from('game_rounds').update({ result }).eq('id', roundId);

  if (error) return { error: 'Could not save round result.' };
  return {};
}

export async function createNextRound(
  roomId: string,
  roundNumber: number
): Promise<{ round: GameRound } | { error: string }> {
  const { data, error } = await supabase
    .from('game_rounds')
    .insert({
      room_id: roomId,
      round_number: roundNumber,
      player1_locked: false,
      player2_locked: false,
    })
    .select()
    .single();

  if (error || !data) return { error: 'Could not create next round.' };
  return { round: data };
}

export async function getCurrentRound(roomId: string): Promise<GameRound | null> {
  const { data } = await supabase
    .from('game_rounds')
    .select()
    .eq('room_id', roomId)
    .order('round_number', { ascending: false })
    .limit(1)
    .single();

  return data || null;
}

export async function getAllRounds(roomId: string): Promise<GameRound[]> {
  const { data } = await supabase
    .from('game_rounds')
    .select()
    .eq('room_id', roomId)
    .order('round_number', { ascending: true });

  return data || [];
}

export async function finishGame(roomId: string): Promise<void> {
  await supabase
    .from('rooms')
    .update({ status: 'finished', updated_at: new Date().toISOString() })
    .eq('id', roomId);
}

export async function resetForRematch(roomId: string): Promise<{ error?: string }> {
  // Delete all game rounds
  const { error: deleteError } = await supabase
    .from('game_rounds')
    .delete()
    .eq('room_id', roomId);

  if (deleteError) return { error: 'Could not reset game.' };

  // Reset room status to waiting
  const { error: roomError } = await supabase
    .from('rooms')
    .update({ status: 'waiting', updated_at: new Date().toISOString() })
    .eq('id', roomId);

  if (roomError) return { error: 'Could not reset room status.' };

  return {};
}

export async function setPlayerReady(playerId: string, ready: boolean): Promise<void> {
  await supabase.from('players').update({ ready }).eq('id', playerId);
}
