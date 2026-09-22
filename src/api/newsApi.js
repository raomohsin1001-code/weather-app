const TOP_HEADLINES_URL = 'https://newsapi.org/v2/top-headlines'
const EVERYTHING_URL = 'https://newsapi.org/v2/everything'
const API_KEY = import.meta.env.VITE_NEWS_API_KEY

// The "everything" endpoint (used for worldwide search) has no category
// filter, so when a category is active during a search we fold in a few
// keywords for that category to approximate the same filtering.
const CATEGORY_KEYWORDS = {
  business: 'business OR economy OR finance OR market',
  technology: 'technology OR tech OR software OR AI',
  sports: 'sports OR match OR tournament OR championship',
  health: 'health OR medical OR disease OR hospital',
  science: 'science OR research OR study OR discovery',
  entertainment: 'entertainment OR movie OR music OR celebrity',
}

/**
 * Fetches news articles from NewsAPI.org.
 *
 * - No search keyword: uses top-headlines (country=us) with the chosen
 *   category, since top-headlines is the endpoint that supports category
 *   filtering.
 * - With a search keyword: uses the "everything" endpoint, which searches
 *   worldwide sources (any country, any topic) for that keyword. If a
 *   category is also selected, its keywords are combined with the search
 *   term so results stay roughly on-topic.
 *
 * @param {{ category?: string, query?: string }} params
 * @returns {Promise<Array>} list of article objects
 */
export async function fetchNews({ category = '', query = '' } = {}) {
  if (!API_KEY) {
    throw new Error(
      'Missing API key. Add VITE_NEWS_API_KEY to a .env file (see .env.example).'
    )
  }

  const trimmedQuery = query.trim()
  const usingSearch = trimmedQuery.length > 0

  const url = new URL(usingSearch ? EVERYTHING_URL : TOP_HEADLINES_URL)
  url.searchParams.set('apiKey', API_KEY)
  url.searchParams.set('pageSize', '30')

  if (usingSearch) {
    const categoryTerm = category && category !== 'general' ? CATEGORY_KEYWORDS[category] : ''
    const combinedQuery = categoryTerm
      ? `${trimmedQuery} AND (${categoryTerm})`
      : trimmedQuery

    url.searchParams.set('q', combinedQuery)
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('language', 'en')
  } else {
    url.searchParams.set('country', 'us')
    if (category) {
      url.searchParams.set('category', category)
    }
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `News request failed (${res.status})`)
  }

  const data = await res.json()
  return (data.articles || []).filter(
    (a) => a.title && a.title !== '[Removed]' && a.url
  )
}