import { useState } from 'react';
import { LiveCamera } from './components/LiveCamera';

type ActiveSection = 'translator' | 'library';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('translator');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            🤟
          </span>
          <span className="brand-title">Signy</span>
        </div>
        <div className="status-pill">
          <span className="status-dot" aria-hidden="true" />
          <span>{activeSection === 'translator' ? 'Camera / Translator' : 'Sign Library'}</span>
        </div>
      </header>

      <main className="app-main">
        {activeSection === 'translator' ? (
          <section className="view-section" aria-label="Camera and Translator">
            <div className="camera-card">
              <LiveCamera />
            </div>
            <div className="translator-panel">
              <span className="panel-label">Live Translation</span>
              <p className="translator-placeholder">
                Translation output area — ready for sign recognition.
              </p>
            </div>
          </section>
        ) : (
          <section className="view-section" aria-label="Sign Library">
            <div className="library-shell">
              <span className="library-icon" aria-hidden="true">
                📚
              </span>
              <h1 className="library-title">Sign Library</h1>
              <p className="library-subtitle">
                Browse and explore ÖGS signs here soon.
              </p>
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <div className="bottom-nav-inner">
          <button
            type="button"
            className={`nav-button ${activeSection === 'translator' ? 'active' : ''}`}
            aria-pressed={activeSection === 'translator'}
            onClick={() => setActiveSection('translator')}
          >
            <span className="nav-icon" aria-hidden="true">
              📷
            </span>
            <span>Translator</span>
          </button>
          <button
            type="button"
            className={`nav-button ${activeSection === 'library' ? 'active' : ''}`}
            aria-pressed={activeSection === 'library'}
            onClick={() => setActiveSection('library')}
          >
            <span className="nav-icon" aria-hidden="true">
              📚
            </span>
            <span>Library</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
