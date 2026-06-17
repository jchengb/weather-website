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

### Feature Development (every slice)
Never commit directly to `main`. Every feature follows this flow:

```
1. Create branch    git checkout -b feature/issue-{n}-{short-description}
2. Build & commit   Claude builds the slice, pre-commit hook runs tests
3. Push branch      git push origin feature/issue-{n}-{short-description}
4. Open PR          gh pr create --title "..." --body "Closes #{n}"
5. Wait for CI      GitHub Actions runs tests on the branch
6. Report to you    Claude reports: PR link + CI status + summary of changes
7. You approve      Reply "yes" (or "no" to request changes)
8. Claude merges    gh pr merge --squash --delete-branch
```

**Branch naming:** `feature/issue-{number}-{short-description}`
Examples: `feature/issue-1-sunrise-sunset`, `feature/issue-4-share-link`

**PR approval:** You approve in the conversation — no GitHub UI needed.
Claude will not merge without your explicit "yes".

### Every Commit
The pre-commit hook runs `node tests.js` automatically and blocks the commit if any test fails.

### Every Push / PR
GitHub Actions (`ci.yml`) runs the tests again as a remote safety net.
Claude waits for CI to pass before asking for your merge approval.

### Cutting a Release
```sh
./release.sh v1.0.0
```
Validates version format, checks for uncommitted changes, runs tests, creates an annotated git tag, pushes to GitHub, and triggers `release.yml` which creates a GitHub Release with `index.html` attached.

## Definition of Done
1. Searching "Taipei" returns real weather data
2. Searching "zzzzz" shows a user-friendly error message
3. Layout renders correctly at 375px (mobile) and 1280px (desktop)
