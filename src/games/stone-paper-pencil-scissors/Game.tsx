import { useState, useEffect } from 'react';
import type { GameRound, Player } from '../../types';
import type { SPPSChoice, RoundResult } from './types';
import { ALL_CHOICES } from './rules';
import ChoiceButton from '../../components/ChoiceButton';
import ResultDisplay from '../../components/ResultDisplay';

interface SPPSGameProps {
  currentRound: GameRound;
  player: Player;
  opponent: Player | null;
  totalRounds: number;
  myScore: number;
  opponentScore: number;
  onSubmitChoice: (choice: SPPSChoice) => Promise<{ error?: string }>;
  submitting: boolean;
}

export default function SPPSGame({
  currentRound,
  player,
  opponent,
  totalRounds,
  myScore,
  opponentScore,
  onSubmitChoice,
  submitting,
}: SPPSGameProps) {
  const [selectedChoice, setSelectedChoice] = useState<SPPSChoice | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const isPlayer1 = player.player_number === 1;

  // Check if I have locked
  const myLocked = isPlayer1
    ? currentRound.player1_locked
    : currentRound.player2_locked;

  // Check if opponent has locked
  const opponentLocked = isPlayer1
    ? currentRound.player2_locked
    : currentRound.player1_locked;

  // Both choices locked and result computed?
  const bothLocked = currentRound.player1_locked && currentRound.player2_locked;
  const isRoundResolved = bothLocked && currentRound.result !== null;

  // Clear selectedChoice on new round
  useEffect(() => {
    setSelectedChoice(null);
    setConfirmError(null);
  }, [currentRound.round_number]);

  const handleConfirm = async () => {
    if (!selectedChoice) return;
    setConfirmError(null);
    const res = await onSubmitChoice(selectedChoice);
    if (res.error) {
      setConfirmError(res.error);
    }
  };

  const myChoiceValue = (
    isPlayer1 ? currentRound.player1_choice : currentRound.player2_choice
  ) as SPPSChoice | null;

  const opponentChoiceValue = (
    isPlayer1 ? currentRound.player2_choice : currentRound.player1_choice
  ) as SPPSChoice | null;

  const myName = player.player_name;
  const opponentName = opponent ? opponent.player_name : 'Opponent';

  // If round result is ready, show ResultDisplay
  if (isRoundResolved && myChoiceValue && opponentChoiceValue) {
    return (
      <div className="w-full">
        <ResultDisplay
          roundNumber={currentRound.round_number}
          totalRounds={totalRounds}
          myChoice={myChoiceValue}
          opponentChoice={opponentChoiceValue}
          myName={myName}
          opponentName={opponentName}
          result={currentRound.result as RoundResult}
          isPlayer1={isPlayer1}
          myScore={myScore}
          opponentScore={opponentScore}
        />
        <div className="text-center mt-lg">
          <p className="text-muted text-sm waiting-indicator">
            Next round starting soon
            <span className="waiting-dots">
              <span /><span /><span />
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-lg">
      <div className="text-center">
        <p className="form-label mb-xs">
          Choose Your Move
        </p>
        {myLocked ? (
          <div className="waiting-indicator mt-sm">
            <span className="dot dot-active" />
            <span className="choice-locked-label">
              Choice locked
            </span>
            <span className="text-muted">
              {!opponentLocked ? `— waiting for ${opponentName}` : '— calculating result'}
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted">
            Select one and confirm your choice
          </p>
        )}
      </div>

      {/* Choice Grid */}
      <div className="choice-grid" role="group" aria-label="Game choices">
        {ALL_CHOICES.map((choice) => {
          const isSelected = selectedChoice === choice;
          return (
            <ChoiceButton
              key={choice}
              choice={choice}
              selected={isSelected}
              disabled={myLocked || submitting}
              onSelect={(c) => setSelectedChoice(c)}
            />
          );
        })}
      </div>

      {/* Opponent Status Indicator */}
      <div className="card opponent-status-card">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{opponentName}'s status</span>
          {opponentLocked ? (
            <span className="flex items-center gap-sm font-bold">
              <span className="dot dot-active" />
              <span>Choice locked</span>
            </span>
          ) : (
            <span className="flex items-center gap-sm text-muted">
              <span className="dot dot-inactive" />
              <span>Thinking...</span>
            </span>
          )}
        </div>
      </div>

      {confirmError && (
        <p className="form-error text-center">{confirmError}</p>
      )}

      {/* Confirm Button */}
      {!myLocked && (
        <button
          type="button"
          className="btn btn-primary btn-lg btn-full"
          disabled={!selectedChoice || submitting}
          onClick={handleConfirm}
        >
          {submitting ? 'Locking Choice...' : 'Confirm Choice'}
        </button>
      )}
    </div>
  );
}
