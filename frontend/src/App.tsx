import { useState } from 'react';
import { Camera, BookOpen, Hand } from 'lucide-react';
import { LiveCamera } from './components/LiveCamera';
import { SignLibrary } from './components/SignLibrary';

type ActiveSection = 'translator' | 'library';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('translator');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <Hand size={18} strokeWidth={2.2} />
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
            <LiveCamera />
            <div className="translator-panel">
              <div className="panel-header">
                <span className="panel-label">Live Translation</span>
              </div>
              <p className="translator-placeholder">
                Translation output area — ready for sign recognition.
              </p>
            </div>
          </section>
        ) : (
          <section className="view-section" aria-label="Sign Library">
            <SignLibrary />
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
              <Camera size={18} strokeWidth={2.2} />
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
              <BookOpen size={18} strokeWidth={2.2} />
            </span>
            <span>Library</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
