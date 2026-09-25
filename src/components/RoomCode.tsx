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
      <div>
        <p className="text-sm uppercase text-muted" style={{ letterSpacing: '0.1em', textAlign: 'center', marginBottom: '8px' }}>
          Room Code
        </p>
        <div className="room-code-value" aria-label={`Room code: ${code.split('').join(' ')}`}>
          {code}
        </div>
      </div>
      <p className="text-sm text-muted text-center">
        Share this code with your friend
      </p>
      <div className="room-code-actions">
        <button
          className="btn btn-secondary flex-1"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy room code'}
        >
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
        {typeof navigator.share === 'function' && (
          <button
            className="btn btn-secondary"
            onClick={handleShare}
            aria-label="Share room code"
            style={{ padding: '14px 18px' }}
          >
            📤
          </button>
        )}
      </div>
    </div>
  );
}
