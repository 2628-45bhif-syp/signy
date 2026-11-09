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
      <h1 className="library-title">Sign Library</h1>
      {isLoading && <p className="sign-status">Loading signs...</p>}
      {error && (
        <p role="alert" className="camera-alert">
          Could not load signs: {error}
        </p>
      )}
      {[...groupByCategory(signs)].map(([category, categorySigns]) => (
        <section key={category} className="sign-category" aria-label={category}>
          <h2 className="sign-category-title">{category}</h2>
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
