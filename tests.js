// Standalone unit tests for pure functions.
// Run with: node tests.js
//
// These implementations must stay in sync with the equivalents in index.html.
// Only pure functions are tested here; DOM and network functions are verified
// manually via the Definition of Done in CLAUDE.md.

// ─── Implementations ─────────────────────────────────────────────────────────

function toFahrenheit(c) {
  return Math.round((c * 9 / 5 + 32) * 10) / 10;
}

const WEATHER_LABELS = {
  0:  "Clear sky",
  1:  "Mainly clear",  2: "Partly cloudy",  3: "Overcast",
  45: "Fog",          48: "Fog",
  51: "Drizzle",      53: "Drizzle",        55: "Drizzle",
  61: "Rain",         63: "Rain",           65: "Rain",
  71: "Snow",         73: "Snow",           75: "Snow",
  77: "Snow grains",
  80: "Rain showers", 81: "Rain showers",   82: "Rain showers",
  85: "Snow showers", 86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail", 99: "Thunderstorm with hail",
};

const WEATHER_EMOJIS = {
  0:  "☀️",
  1:  "🌤️",  2: "⛅",   3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "🌨️",
  77: "🌨️",
  80: "🌦️", 81: "🌦️", 82: "🌦️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️",
  96: "⛈️", 99: "⛈️",
};

function getWeatherLabel(code) {
  return WEATHER_LABELS[code] ?? "Unknown";
}

function getWeatherEmoji(code) {
  return WEATHER_EMOJIS[code] ?? "❓";
}

function toMph(kmh) {
  return Math.round(kmh * 0.621371 * 10) / 10;
}

function getUVLabel(index) {
  if (index <= 2) return 'Low';
  if (index <= 5) return 'Moderate';
  if (index <= 7) return 'High';
  if (index <= 10) return 'Very High';
  return 'Extreme';
}

function getWindDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

function getDayName(dateString) {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
}

function addRecentCity(city, cities) {
  const filtered = cities.filter(c => c !== city);
  return [city, ...filtered].slice(0, 5);
}

// ─── Test runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ ${description}`);
    console.error(`      expected: ${JSON.stringify(expected)}`);
    console.error(`      received: ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ─── toFahrenheit ─────────────────────────────────────────────────────────────

console.log("\ntoFahrenheit");
assert("0°C → 32°F (freezing point)",     toFahrenheit(0),    32);
assert("100°C → 212°F (boiling point)",   toFahrenheit(100),  212);
assert("-40°C → -40°F (crossover point)", toFahrenheit(-40),  -40);
assert("37°C → 98.6°F (body temp)",       toFahrenheit(37),   98.6);

// ─── getWeatherLabel ──────────────────────────────────────────────────────────

console.log("\ngetWeatherLabel");
assert("code 0  → Clear sky",     getWeatherLabel(0),   "Clear sky");
assert("code 61 → Rain",          getWeatherLabel(61),  "Rain");
assert("code 95 → Thunderstorm",  getWeatherLabel(95),  "Thunderstorm");
assert("code 999 → Unknown",      getWeatherLabel(999), "Unknown");

// ─── getWeatherEmoji ──────────────────────────────────────────────────────────

console.log("\ngetWeatherEmoji");
assert("code 0  → ☀️",  getWeatherEmoji(0),   "☀️");
assert("code 61 → 🌧️", getWeatherEmoji(61),  "🌧️");
assert("code 71 → 🌨️", getWeatherEmoji(71),  "🌨️");
assert("code 95 → ⛈️",  getWeatherEmoji(95),  "⛈️");
assert("code 999 → ❓", getWeatherEmoji(999), "❓");

// ─── toMph ───────────────────────────────────────────────────────────────────

console.log("\ntoMph");
assert("0 km/h → 0 mph",      toMph(0),    0);
assert("10 km/h → 6.2 mph",   toMph(10),   6.2);
assert("100 km/h → 62.1 mph", toMph(100),  62.1);

// ─── getUVLabel ───────────────────────────────────────────────────────────────

console.log("\ngetUVLabel");
assert("0 → Low",        getUVLabel(0),  "Low");
assert("2 → Low",        getUVLabel(2),  "Low");
assert("3 → Moderate",   getUVLabel(3),  "Moderate");
assert("6 → High",       getUVLabel(6),  "High");
assert("8 → Very High",  getUVLabel(8),  "Very High");
assert("11 → Extreme",   getUVLabel(11), "Extreme");

// ─── getWindDirection ─────────────────────────────────────────────────────────

console.log("\ngetWindDirection");
assert("0° → N",    getWindDirection(0),    "N");
assert("45° → NE",  getWindDirection(45),   "NE");
assert("90° → E",   getWindDirection(90),   "E");
assert("180° → S",  getWindDirection(180),  "S");
assert("270° → W",  getWindDirection(270),  "W");
assert("315° → NW", getWindDirection(315),  "NW");
assert("360° → N",  getWindDirection(360),  "N");

// ─── getDayName ───────────────────────────────────────────────────────────────

console.log("\ngetDayName");
assert("2026-06-17 → Wed", getDayName("2026-06-17"), "Wed");
assert("2026-06-21 → Sun", getDayName("2026-06-21"), "Sun");

// ─── addRecentCity ────────────────────────────────────────────────────────────

console.log("\naddRecentCity");
assert("empty list → [city]",
  JSON.stringify(addRecentCity("Taipei, Taiwan", [])),
  JSON.stringify(["Taipei, Taiwan"]));
assert("new city prepended to front",
  JSON.stringify(addRecentCity("London, United Kingdom", ["Taipei, Taiwan"])),
  JSON.stringify(["London, United Kingdom", "Taipei, Taiwan"]));
assert("duplicate moved to front, no double entry",
  JSON.stringify(addRecentCity("Taipei, Taiwan", ["London, United Kingdom", "Taipei, Taiwan", "Tokyo, Japan"])),
  JSON.stringify(["Taipei, Taiwan", "London, United Kingdom", "Tokyo, Japan"]));
assert("6th city drops oldest, max 5 enforced",
  JSON.stringify(addRecentCity("Paris, France", ["A", "B", "C", "D", "E"])),
  JSON.stringify(["Paris, France", "A", "B", "C", "D"]));

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
