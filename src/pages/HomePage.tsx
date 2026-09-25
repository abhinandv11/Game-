import { GAMES } from '../config/games';
import GameCard from '../components/GameCard';
import { isSupabaseConfigured } from '../services/supabase';

export default function HomePage() {
  return (
    <div className="page safe-bottom">
      {!isSupabaseConfigured && (
        <div className="config-banner mb-lg" role="alert">
          <div className="flex items-center gap-sm mb-xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <strong>Supabase Configuration Required</strong>
          </div>
          <p className="text-sm text-muted">
            Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> and run the provided SQL schema in Supabase to enable live multiplayer.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1 className="hero-title">
          Game കളിക്കാം
        </h1>
        <p className="hero-subtitle">
          Minimal multiplayer games for two players. Fast, synchronized, and distraction-free.
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
      <footer className="footer-bar text-center">
        <p>Game കളിക്കാം — Real-time Multiplayer</p>
      </footer>
    </div>
  );
}
