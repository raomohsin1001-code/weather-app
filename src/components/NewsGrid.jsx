import NewsCard from './NewsCard.jsx'

export default function NewsGrid({ articles, category, favorites, onToggleFavorite }) {
  if (!articles.length) {
    return (
      <div className="state-block">
        <p>No articles to show. Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <NewsCard
          key={article.url}
          article={article}
          category={category}
          isFavorite={favorites.some((f) => f.url === article.url)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}