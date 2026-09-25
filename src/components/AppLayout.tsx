import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="header-logo" aria-label="Game കളിക്കാം Home">
            <span className="logo-mark" aria-hidden="true">■</span>
            <span className="logo-text">Game കളിക്കാം</span>
          </Link>

          <div className="header-actions">
            <ThemeToggle />
            {!isHome && (
              <button
                className="header-back-btn btn-ghost"
                onClick={() => navigate('/')}
                aria-label="Back to home"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
