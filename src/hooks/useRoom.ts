import { useState, useEffect, useCallback, useRef } from 'react';
import { subscribeToRoom } from '../services/realtimeService';
import { getRoomById, updatePlayerConnection } from '../services/roomService';
import type { Room, Player } from '../types';

interface UseRoomState {
  room: Room | null;
  players: Player[];
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export function useRoom(roomId: string | null, currentPlayerId: string | null) {
  const [state, setState] = useState<UseRoomState>({
    room: null,
    players: [],
    loading: !!roomId,
    error: null,
    connected: false,
  });

  const cleanupRef = useRef<(() => void) | null>(null);

  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    const result = await getRoomById(roomId);
    if ('error' in result) {
      setState((s) => ({ ...s, loading: false, error: result.error }));
      return;
    }

    setState((s) => ({
      ...s,
      room: result.room,
      players: result.players,
      loading: false,
      connected: true,
    }));
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    loadRoom();

    // Subscribe to realtime changes
    const cleanup = subscribeToRoom(
      roomId,
      // Room change
      (payload) => {
        const newRoom = (payload as { new: Room }).new;
        if (newRoom) {
          setState((s) => ({ ...s, room: newRoom }));
        }
      },
      // Player change
      (_payload) => {
        // Re-fetch players on any player change
        getRoomById(roomId).then((result) => {
          if (!('error' in result)) {
            setState((s) => ({ ...s, players: result.players }));
          }
        });
      },
      // Round change — handled by useGame hook
      () => {}
    );

    cleanupRef.current = cleanup;

    return () => {
      cleanup();
      cleanupRef.current = null;
    };
  }, [roomId, loadRoom]);

  // Mark player as connected/disconnected
  useEffect(() => {
    if (!currentPlayerId) return;

    updatePlayerConnection(currentPlayerId, true);

    const handleVisibilityChange = () => {
      updatePlayerConnection(currentPlayerId, !document.hidden);
    };

    const handleBeforeUnload = () => {
      updatePlayerConnection(currentPlayerId, false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updatePlayerConnection(currentPlayerId, false);
    };
  }, [currentPlayerId]);

  return { ...state, reload: loadRoom };
}
