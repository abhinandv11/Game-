import { useState } from 'react';

interface RoomCodeProps {
  code: string;
}

export default function RoomCode({ code }: RoomCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for devices without clipboard API
      const el = document.createElement('input');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Game കളിക്കാം',
          text: `Join my game! Room code: ${code}`,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div className="room-code-display">
      <div className="room-code-header">
        <p className="room-code-label">Room Code</p>
        <div className="room-code-value" aria-label={`Room code: ${code.split('').join(' ')}`}>
          {code}
        </div>
      </div>
      <p className="text-sm text-muted text-center">
        Share this 6-character code with your friend
      </p>
      <div className="room-code-actions">
        <button
          type="button"
          className="btn btn-secondary flex-1"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy room code'}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <span>Copy Code</span>
            </>
          )}
        </button>
        {typeof navigator.share === 'function' && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShare}
            aria-label="Share room code"
            title="Share room code"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
