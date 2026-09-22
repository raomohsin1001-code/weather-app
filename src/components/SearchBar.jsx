import { useState } from 'react'

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [term, setTerm] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(term.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search news by keyword…"
        aria-label="Search news"
      />
      <button type="submit">Search</button>
    </form>
  )
}