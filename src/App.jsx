import { useState, useEffect, useCallback } from 'react'
import { fetchNews } from './api/newsApi.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

import SearchBar from './components/SearchBar.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import RecentSearches from './components/RecentSearches.jsx'
import NewsGrid from './components/NewsGrid.jsx'
import WeatherPanel from './components/WeatherPanel.jsx'
import Loader from './components/Loader.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default function App() {
  const [category, setCategory] = useState('general')
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const [activeTab, setActiveTab] = useState('headlines') // headlines | favorites
  const [favorites, setFavorites] = useLocalStorage('news:favorites', [])
  const [recentSearches, setRecentSearches] = useLocalStorage('news:recentSearches', [])

  const loadNews = useCallback(async (cat, q) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const results = await fetchNews({ category: cat, query: q })
      setArticles(results)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load news.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    loadNews(category, query)
  }, [category, query, loadNews])

  function handleSearch(term) {
    setQuery(term)
    if (term) {
      setRecentSearches((prev) => {
        const next = [term, ...prev.filter((t) => t !== term)]
        return next.slice(0, 6)
      })
    }
  }

  function handleSelectCategory(cat) {
    setCategory(cat)
    setActiveTab('headlines')
  }

  function toggleFavorite(article) {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.url === article.url)
      if (exists) return prev.filter((f) => f.url !== article.url)
      return [article, ...prev]
    })
  }

  const articlesToShow = activeTab === 'favorites' ? favorites : articles

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__inner">
          <div className="masthead__top">
            <h1 className="masthead__title">Weather+News App</h1>
            <span className="masthead__date">{TODAY}</span>
          </div>
          <p className="masthead__tagline">"News and Weather, side by side.".</p>

          <SearchBar onSearch={handleSearch} initialValue={query} />
          <RecentSearches searches={recentSearches} onSelect={handleSearch} />
        </div>
      </header>

      <main className="container">
        <div className="layout">
          <div className="layout__news">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'headlines' ? 'tab--active' : ''}`}
                onClick={() => setActiveTab('headlines')}
              >
                Top Headlines
              </button>
              <button
                className={`tab ${activeTab === 'favorites' ? 'tab--active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites ({favorites.length})
              </button>
            </div>

            {activeTab === 'headlines' && (
              <CategoryFilter active={category} onSelect={handleSelectCategory} />
            )}

            {activeTab === 'headlines' && status === 'loading' && (
              <Loader label="Fetching the latest news…" />
            )}
            {activeTab === 'headlines' && status === 'error' && (
              <ErrorMessage message={errorMsg} onRetry={() => loadNews(category, query)} />
            )}
            {activeTab === 'headlines' && status === 'success' && (
              <NewsGrid
                articles={articlesToShow}
                category={category}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}

            {activeTab === 'favorites' && (
              <NewsGrid
                articles={articlesToShow}
                category=""
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>

          <div className="layout__weather">
            <WeatherPanel />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>News via NewsAPI.org · Weather via Open-Meteo</p>
        <p> Made by [Mohsin Javed].2026</p>
      </footer>
    </div>
  )
}
