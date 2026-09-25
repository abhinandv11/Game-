import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <span className="logo-icon">🎮</span>
            <span>Game കളിക്കാം</span>
          </Link>

          {!isHome && (
            <button
              className="header-back-btn btn-ghost"
              onClick={() => navigate('/')}
              aria-label="Back to Game കളിക്കാം"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
            </button>
          )}
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
}
