export default function RecentSearches({ searches, onSelect }) {
  if (!searches.length) return null

  return (
    <div className="recent-searches">
      <span className="recent-searches__label">Recent:</span>
      {searches.map((term) => (
        <button
          key={term}
          className="recent-searches__item"
          onClick={() => onSelect(term)}
        >
          {term}
        </button>
      ))}
    </div>
  )
}