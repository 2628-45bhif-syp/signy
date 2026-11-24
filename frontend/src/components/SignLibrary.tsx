import { Loader2, AlertCircle } from 'lucide-react';
import { useSigns, type Sign } from '../hooks/useSigns';
import { SignCard } from './SignCard';

function groupByCategory(signs: Sign[]): Map<string, Sign[]> {
  const groups = new Map<string, Sign[]>();
  for (const sign of signs) {
    groups.set(sign.category, [...(groups.get(sign.category) ?? []), sign]);
  }
  return groups;
}

export function SignLibrary() {
  const { signs, error, isLoading } = useSigns();

  return (
    <div className="sign-library">
      <div className="library-header">
        <h1 className="library-title">Sign Library</h1>
        {signs.length > 0 && <span className="library-badge">{signs.length} signs</span>}
      </div>
      {isLoading && (
        <p className="sign-status">
          <Loader2 size={15} className="spin-icon" aria-hidden="true" />
          <span>Loading signs...</span>
        </p>
      )}
      {error && (
        <p role="alert" className="camera-alert">
          <AlertCircle size={15} aria-hidden="true" />
          <span>Could not load signs: {error}</span>
        </p>
      )}
      {[...groupByCategory(signs)].map(([category, categorySigns]) => (
        <section key={category} className="sign-category" aria-label={category}>
          <div className="category-header">
            <h2 className="sign-category-title">{category}</h2>
            <span className="category-count">{categorySigns.length}</span>
          </div>
          <ul className="sign-list">
            {categorySigns.map((sign) => (
              <SignCard key={sign.id} sign={sign} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
