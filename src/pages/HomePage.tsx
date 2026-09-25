import { GAMES } from '../config/games';
import GameCard from '../components/GameCard';
import { isSupabaseConfigured } from '../services/supabase';

export default function HomePage() {
  return (
    <div className="page safe-bottom">
      {!isSupabaseConfigured && (
        <div
          className="card mb-lg"
          style={{
            borderColor: 'var(--color-warning)',
            background: 'rgba(251, 191, 36, 0.08)',
          }}
        >
          <div className="flex items-center gap-sm mb-xs">
            <span role="img" aria-label="Notice">⚠️</span>
            <strong style={{ color: 'var(--color-warning)', fontSize: '0.9375rem' }}>
              Supabase Configuration Required
            </strong>
          </div>
          <p className="text-sm text-muted">
            Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> and run the provided SQL schema in Supabase to enable live multiplayer.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center mt-lg mb-xl">
        <div className="mb-sm flex justify-center">
          <span
            style={{
              display: 'inline-flex',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(124, 108, 252, 0.12)',
              border: '1px solid rgba(124, 108, 252, 0.25)',
              color: 'var(--color-primary-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Multiplayer Platform
          </span>
        </div>
        <h1
          className="text-brand mb-xs"
          style={{
            fontSize: 'clamp(2rem, 7vw, 2.75rem)',
            background: 'linear-gradient(135deg, #ffffff 40%, #b8b3ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Game കളിക്കാം
        </h1>
        <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '340px', margin: '0 auto' }}>
          Play simple games with your friends.
        </p>
      </section>

      {/* Available Games Section */}
      <section>
        <div className="section-divider mb-lg">
          <span>Available Games</span>
        </div>

        <div className="flex flex-col gap-md">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="text-center mt-2xl text-xs text-muted">
        <p>Game കളിക്കാം • Real-time Online Multiplayer</p>
      </footer>
    </div>
  );
}
