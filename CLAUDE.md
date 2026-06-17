# Weather App — Project Conventions

## Project Links
- **GitHub repo**: https://github.com/jchengb/weather-website
- **GitHub Issues** (backlog): https://github.com/jchengb/weather-website/issues
- **GitHub Actions** (CI/CD): https://github.com/jchengb/weather-website/actions
- **Current milestone**: Weather App v1.1

## Project Overview
A single-page weather app where a user types a city name and sees current weather data.
No build tools, no frameworks, no API keys required.

## File Structure
```
index.html                        ← entire app: HTML, CSS, and JavaScript in one file
tests.js                          ← unit tests for pure functions (run with: node tests.js)
release.sh                        ← release script (run with: ./release.sh v1.0.0)
.gitignore
.github/workflows/ci.yml          ← runs tests on every push and pull request
.github/workflows/release.yml     ← creates a GitHub Release when a vX.Y.Z tag is pushed
CLAUDE.md                         ← this file
```

## Tech Stack
- **HTML/CSS/Vanilla JavaScript** — no frameworks, no external libraries
- **Open-Meteo Geocoding API** — resolves city names to lat/lon (no key required)
  - `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
- **Open-Meteo Forecast API** — fetches current weather (no key required)
  - `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
- **Browser Geolocation API** — auto-detects user location on load (no key required)

## Key Functions
| Function | Responsibility |
|---|---|
| `geocodeCity(cityName)` | Resolves city name → `{lat, lon, displayName}`, returns `null` if not found |
| `fetchWeather(lat, lon)` | Fetches current weather block from Open-Meteo forecast API |
| `getWeatherLabel(code)` | Maps WMO weather code → human-readable string |
| `getWeatherEmoji(code)` | Maps WMO weather code → emoji |
| `toFahrenheit(c)` | Converts Celsius to Fahrenheit (`c * 9/5 + 32`) |
| `renderWeather(data)` | Updates result card DOM with merged geocoding + weather data |
| `renderError(message)` | Displays a generic friendly error message in the result area |
| `renderNudge()` | Shows a soft prompt when location permission is denied ("Allow location or search above") |
| `setLoading(bool)` | Toggles loading spinner and disables search button |
| `handleSearch()` | Orchestrates the full search flow; wired to button click and Enter key |
| `initGeolocation()` | Runs on page load; requests position → `fetchWeather`, falls back to `renderNudge` on denial |

## Conventions
- **No comments** unless the reason behind code is non-obvious
- **No external fonts, icon libraries, or CDN dependencies** — all styling is hand-written CSS
- **Theme**: light — white/light grey background, dark text
- **CSS layout**: mobile-first, single breakpoint at `600px`
- **Units**: temperature in both °C and °F; wind speed in km/h (Open-Meteo default)
- **WMO codes**: mapped via a lookup table; unmapped codes fall back to `"Unknown"` / ❓
- **Geocoding**: always use the first result (highest relevance) when multiple matches exist
- **Input validation**: empty/whitespace input is caught client-side before any network call
- **No caching**: each search triggers a fresh API call
- **No search history** — no localStorage for data
- **localStorage for UI preferences only** — currently: theme preference (key: `weather_theme`, values: `"dark"` / `"light"`)
- **Errors**: generic friendly message for all failure cases (no per-case differentiation)
- **Geolocation denial**: show a soft nudge ("Allow location access, or search for a city above") — do not show an error

## Git Workflow

**Every commit** — the pre-commit hook runs `node tests.js` automatically and blocks the commit if any test fails.

**Every push / PR** — GitHub Actions (`ci.yml`) runs the tests again as a remote safety net.

**To cut a release:**
```sh
./release.sh v1.0.0
```
This validates the version format, checks for uncommitted changes, runs tests, creates an annotated git tag, pushes the tag to GitHub, and triggers `release.yml` which creates a GitHub Release with `index.html` attached.

**One-time setup required** (after creating a GitHub repo):
```sh
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Definition of Done
1. Searching "Taipei" returns real weather data
2. Searching "zzzzz" shows a user-friendly error message
3. Layout renders correctly at 375px (mobile) and 1280px (desktop)
