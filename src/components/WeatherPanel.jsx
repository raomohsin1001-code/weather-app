import { useState, useEffect, useRef } from 'react'
import { searchLocations, fetchCurrentWeather, describeWeatherCode } from '../api/weatherApi.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import WeatherIcon from './WeatherIcon.jsx'
import Loader from './Loader.jsx'
import ErrorMessage from './ErrorMessage.jsx'

export default function WeatherPanel() {
  const [location, setLocation] = useLocalStorage('weather:selectedLocation', {
    name: 'Multan',
    country: 'Pakistan',
    latitude: 30.1575,
    longitude: 71.5249,
  })
  const [unit, setUnit] = useLocalStorage('weather:unit', 'C')

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const debounceRef = useRef(null)

  // Debounced location search as the user types
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocations(query)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  // Fetch weather whenever the selected location changes
  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      setErrorMsg('')
      try {
        const data = await fetchCurrentWeather(location.latitude, location.longitude)
        if (!cancelled) {
          setWeather(data)
          setStatus('success')
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || 'Could not load weather.')
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [location])

  function handleSelectLocation(result) {
    setLocation({
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    })
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  function retryLoad() {
    // trick effect into re-running by cloning the location object
    setLocation((prev) => ({ ...prev }))
  }

  const displayTemp =
    weather && typeof weather.temperatureC === 'number'
      ? unit === 'C'
        ? Math.round(weather.temperatureC)
        : Math.round((weather.temperatureC * 9) / 5 + 32)
      : null

  const description = weather ? describeWeatherCode(weather.code) : null

  return (
    <section className="weather-panel">
      <h2 className="weather-panel__heading">Weather</h2>

      <div className="weather-panel__search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search a city…"
          aria-label="Search for a location"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="weather-panel__suggestions">
            {suggestions.map((result) => (
              <button
                key={`${result.latitude}-${result.longitude}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectLocation(result)}
              >
                {result.name}
                {result.admin1 ? `, ${result.admin1}` : ''}
                {result.country ? `, ${result.country}` : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      {status === 'loading' && <Loader label="Fetching weather…" />}

      {status === 'error' && <ErrorMessage message={errorMsg} onRetry={retryLoad} />}

      {status === 'success' && weather && (
        <>
          <div className="weather-current">
            <p className="weather-current__location">
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </p>
            <WeatherIcon icon={description.icon} />
            <p className="weather-current__temp">
              {displayTemp}°{unit}
            </p>
            <p className="weather-current__condition">{description.label}</p>

            <div className="unit-toggle">
              <button
                className={unit === 'C' ? 'active' : ''}
                onClick={() => setUnit('C')}
              >
                °C
              </button>
              <button
                className={unit === 'F' ? 'active' : ''}
                onClick={() => setUnit('F')}
              >
                °F
              </button>
            </div>
          </div>

          <div className="weather-stats">
            <div className="weather-stats__item">
              <p className="weather-stats__value">
                {weather.humidity !== null ? `${weather.humidity}%` : '—'}
              </p>
              <p className="weather-stats__label">Humidity</p>
            </div>
            <div className="weather-stats__item">
              <p className="weather-stats__value">{Math.round(weather.windspeed)} km/h</p>
              <p className="weather-stats__label">Wind</p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}