const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

// WMO weather interpretation codes -> readable label + simple icon key
const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mostly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'rain' },
  53: { label: 'Drizzle', icon: 'rain' },
  55: { label: 'Dense drizzle', icon: 'rain' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  71: { label: 'Slight snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  80: { label: 'Rain showers', icon: 'rain' },
  81: { label: 'Rain showers', icon: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm with hail', icon: 'storm' },
  99: { label: 'Thunderstorm with hail', icon: 'storm' },
}

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: 'cloud' }
}

/**
 * Searches for locations by name.
 * @param {string} name
 * @returns {Promise<Array>} list of { name, country, admin1, latitude, longitude }
 */
export async function searchLocations(name) {
  if (!name || name.trim().length < 2) return []

  const url = new URL(GEOCODE_URL)
  url.searchParams.set('name', name.trim())
  url.searchParams.set('count', '5')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Location search failed (${res.status})`)

  const data = await res.json()
  return data.results || []
}

/**
 * Fetches current weather for a given coordinate.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<{temperatureC: number, windspeed: number, humidity: number|null, code: number, time: string}>}
 */
export async function fetchCurrentWeather(latitude, longitude) {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('current_weather', 'true')
  url.searchParams.set('hourly', 'relative_humidity_2m')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`)

  const data = await res.json()
  const current = data.current_weather

  let humidity = null
  if (data.hourly?.time && data.hourly?.relative_humidity_2m) {
    // Current time may fall between hourly marks (e.g. 14:45 vs 14:00/15:00),
    // so find the closest hourly timestamp instead of requiring an exact match.
    const currentMs = new Date(current.time).getTime()
    let closestIdx = -1
    let closestDiff = Infinity
    data.hourly.time.forEach((t, i) => {
      const diff = Math.abs(new Date(t).getTime() - currentMs)
      if (diff < closestDiff) {
        closestDiff = diff
        closestIdx = i
      }
    })
    if (closestIdx !== -1) humidity = data.hourly.relative_humidity_2m[closestIdx]
  }

  return {
    temperatureC: current.temperature,
    windspeed: current.windspeed,
    humidity,
    code: current.weathercode,
    time: current.time,
  }
}