import { useState, useEffect, useCallback, useRef } from 'react';
import { subscribeToRoom } from '../services/realtimeService';
import {
  getCurrentRound,
  getAllRounds,
  submitChoice,
  updateRoundResult,
  createNextRound,
  finishGame,
} from '../services/roomService';
import { determineRoundWinner } from '../games/stone-paper-pencil-scissors/rules';
import type { GameRound } from '../types';
import type { SPPSChoice, RoundResult } from '../games/stone-paper-pencil-scissors/types';

interface UseGameState {
  currentRound: GameRound | null;
  allRounds: GameRound[];
  player1Score: number;
  player2Score: number;
  drawCount: number;
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

export function useGame(
  roomId: string | null,
  totalRounds: number,
  playerNumber: 1 | 2 | null,
  isHost: boolean
) {
  const [state, setState] = useState<UseGameState>({
    currentRound: null,
    allRounds: [],
    player1Score: 0,
    player2Score: 0,
    drawCount: 0,
    loading: true,
    error: null,
    submitting: false,
  });

  const processingRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const computeScores = (rounds: GameRound[]) => {
    let p1 = 0,
      p2 = 0,
      draws = 0;
    for (const r of rounds) {
      if (r.result === 'player1') p1++;
      else if (r.result === 'player2') p2++;
      else if (r.result === 'draw') draws++;
    }
    return { player1Score: p1, player2Score: p2, drawCount: draws };
  };

  const loadGameState = useCallback(async () => {
    if (!roomId) return;
    setState((s) => ({ ...s, loading: true }));

    const [current, all] = await Promise.all([getCurrentRound(roomId), getAllRounds(roomId)]);

    const scores = computeScores(all);
    setState((s) => ({
      ...s,
      currentRound: current,
      allRounds: all,
      ...scores,
      loading: false,
    }));
  }, [roomId]);

  // Process round result when both choices are locked — only host does this
  const processRoundIfReady = useCallback(
    async (round: GameRound) => {
      if (!isHost) return;
      if (!round.player1_locked || !round.player2_locked) return;
      if (round.result !== null) return;
      if (processingRef.current) return;

      processingRef.current = true;

      const result: RoundResult = determineRoundWinner(
        round.player1_choice as SPPSChoice,
        round.player2_choice as SPPSChoice
      );

      await updateRoundResult(round.id, result);

      // Check if game is over
      const all = await getAllRounds(roomId!);
      const completedRounds = all.filter((r) => r.result !== null);

      if (completedRounds.length >= totalRounds) {
        await finishGame(roomId!);
      } else {
        // Create next round
        await createNextRound(roomId!, round.round_number + 1);
      }

      processingRef.current = false;
    },
    [isHost, roomId, totalRounds]
  );

  useEffect(() => {
    if (!roomId) return;

    loadGameState();

    const cleanup = subscribeToRoom(
      roomId,
      () => {}, // room changes handled by useRoom
      () => {}, // player changes handled by useRoom
      async (_payload) => {
        // Re-fetch all round data
        const [current, all] = await Promise.all([
          getCurrentRound(roomId),
          getAllRounds(roomId),
        ]);

        const scores = computeScores(all);
        setState((s) => ({
          ...s,
          currentRound: current,
          allRounds: all,
          ...scores,
        }));

        // If host, check if we need to process the result
        if (current && isHost) {
          await processRoundIfReady(current);
        }
      }
    );

    cleanupRef.current = cleanup;
    return () => {
      cleanup();
      cleanupRef.current = null;
    };
  }, [roomId, loadGameState, isHost, processRoundIfReady]);

  const submitMyChoice = useCallback(
    async (choice: SPPSChoice) => {
      if (!state.currentRound || !playerNumber) return { error: 'No active round.' };

      setState((s) => ({ ...s, submitting: true, error: null }));

      const result = await submitChoice(state.currentRound.id, playerNumber, choice);

      setState((s) => ({ ...s, submitting: false, error: result.error || null }));
      return result;
    },
    [state.currentRound, playerNumber]
  );

  return {
    ...state,
    submitMyChoice,
    reload: loadGameState,
  };
}
