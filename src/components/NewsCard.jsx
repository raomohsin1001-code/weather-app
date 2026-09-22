const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="#d6d9cd"/><text x="200" y="130" font-family="sans-serif" font-size="16" fill="#8a9198" text-anchor="middle">No image</text></svg>`
  )

function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function NewsCard({ article, category, isFavorite, onToggleFavorite }) {
  const { title, description, url, urlToImage, publishedAt, source } = article

  return (
    <article className="news-card">
      <div className="news-card__image-wrap">
        <img
          src={urlToImage || PLACEHOLDER_IMG}
          alt=""
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMG
          }}
        />
        <button
          className={`news-card__fav ${isFavorite ? 'news-card__fav--active' : ''}`}
          onClick={() => onToggleFavorite(article)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      {category && <p className="news-card__category">{category}</p>}

      <h3 className="news-card__title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>

      {description && <p className="news-card__desc">{description}</p>}

      <div className="news-card__meta">
        <span>{source?.name || 'Unknown source'}</span>
        <span>{formatDate(publishedAt)}</span>
      </div>
    </article>
  )
}