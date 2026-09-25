import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type ChangeHandler = (payload: Record<string, unknown>) => void;

/**
 * Subscribe to all changes on a specific room (rooms, players, game_rounds tables).
 * Returns a cleanup function.
 */
interface RoomSubscriber {
  id: string;
  onRoomChange: ChangeHandler;
  onPlayerChange: ChangeHandler;
  onRoundChange: ChangeHandler;
}

interface RoomChannelEntry {
  channel: RealtimeChannel;
  subscribers: RoomSubscriber[];
}

const activeChannels = new Map<string, RoomChannelEntry>();

/**
 * Subscribe to all changes on a specific room (rooms, players, game_rounds tables).
 * Multiplexes subscriptions for the same roomId to prevent duplicate channels.
 * Returns a cleanup function.
 */
export function subscribeToRoom(
  roomId: string,
  onRoomChange: ChangeHandler,
  onPlayerChange: ChangeHandler,
  onRoundChange: ChangeHandler
): () => void {
  const subId = Math.random().toString(36).substring(2, 9);
  const subscriber: RoomSubscriber = {
    id: subId,
    onRoomChange,
    onPlayerChange,
    onRoundChange,
  };

  let entry = activeChannels.get(roomId);

  if (!entry) {
    const channel: RealtimeChannel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const current = activeChannels.get(roomId);
          if (current) {
            current.subscribers.forEach((sub) => sub.onRoomChange(payload as Record<string, unknown>));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const current = activeChannels.get(roomId);
          if (current) {
            current.subscribers.forEach((sub) => sub.onPlayerChange(payload as Record<string, unknown>));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rounds',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const current = activeChannels.get(roomId);
          if (current) {
            current.subscribers.forEach((sub) => sub.onRoundChange(payload as Record<string, unknown>));
          }
        }
      )
      .subscribe();

    entry = { channel, subscribers: [subscriber] };
    activeChannels.set(roomId, entry);
  } else {
    entry.subscribers.push(subscriber);
  }

  return () => {
    const currentEntry = activeChannels.get(roomId);
    if (!currentEntry) return;

    currentEntry.subscribers = currentEntry.subscribers.filter((s) => s.id !== subId);

    if (currentEntry.subscribers.length === 0) {
      supabase.removeChannel(currentEntry.channel);
      activeChannels.delete(roomId);
    }
  };
}
