
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Leave',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h3 id="confirm-dialog-title" className="text-display mb-sm" style={{ fontSize: '1.25rem' }}>
          {title}
        </h3>
        {message && <p className="text-muted text-sm mb-lg">{message}</p>}

        <div className="flex gap-md mt-md">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'} flex-1`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
