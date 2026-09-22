const CATEGORIES = [
  'general',
  'business',
  'technology',
  'sports',
  'health',
  'science',
  'entertainment',
]

export default function CategoryFilter({ active, onSelect }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`chip ${active === category ? 'chip--active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  )
}