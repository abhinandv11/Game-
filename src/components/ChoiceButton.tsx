import type { SPPSChoice } from '../games/stone-paper-pencil-scissors/types';
import { CHOICE_META } from '../games/stone-paper-pencil-scissors/rules';

interface ChoiceButtonProps {
  choice: SPPSChoice;
  selected: boolean;
  disabled?: boolean;
  onSelect: (choice: SPPSChoice) => void;
}

export default function ChoiceButton({
  choice,
  selected,
  disabled = false,
  onSelect,
}: ChoiceButtonProps) {
  const meta = CHOICE_META[choice];

  return (
    <button
      type="button"
      className={`choice-btn ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(choice)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Select ${meta.label}`}
    >
      <span className="choice-emoji" role="img" aria-hidden="true">
        {meta.emoji}
      </span>
      <span>{meta.label}</span>
    </button>
  );
}
