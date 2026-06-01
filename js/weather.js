const OWM_KEY = '260f449843afdeafdd3bd3b725cff43c';
const LAT = 13.0827, LON = 80.2707;
const CITY_NAME = 'Chennai';

let map, currentWeather = null;
let currentWeatherLayer = 'temperature';
let weatherMarkers = [];

// Initialize map
function initMap() {
  map = L.map('map').setView([LAT, LON], 11);
  
  // Add dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19,
    className: 'dark-tiles'
  }).addTo(map);

  // Add main station marker
  addStationMarker();
  
  // Add surrounding weather stations
  addWeatherStations();
}

function addStationMarker() {
  const stationIcon = L.divIcon({
    className: 'station-marker',
    html: `<div style="background: #00ff9f; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #00c8ff; box-shadow: 0 0 8px rgba(0,255,159,0.6);"></div>`,
    iconSize: [16, 16],
    popupAnchor: [0, -8]
  });

  L.marker([LAT, LON], { icon: stationIcon })
    .bindPopup(`<strong>${CITY_NAME} IMD Center</strong><br>13.0827°N 80.2707°E`)
    .addTo(map);
}

function addWeatherStations() {
  // Surrounding weather stations in Chennai region
  const stations = [
    { name: 'Meenambakkam', lat: 12.9903, lon: 80.1691 },
    { name: 'Nungambakkam', lat: 13.0012, lon: 80.1822 },
    { name: 'Tiruvallur', lat: 13.1398, lon: 79.9106 },
    { name: 'Chengalpattu', lat: 12.6639, lon: 79.9611 },
    { name: 'Kanchipuram', lat: 12.8342, lon: 79.7029 }
  ];

  stations.forEach(station => {
    const icon = L.divIcon({
      className: 'weather-station',
      html: `<div style="background: rgba(0,200,255,0.3); width: 8px; height: 8px; border-radius: 50%; border: 1px solid #00c8ff;"></div>`,
      iconSize: [10, 10]
    });

    L.marker([station.lat, station.lon], { icon: icon })
      .bindPopup(`<small>${station.name}</small>`)
      .addTo(map);
  });
}

// Update clock
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  document.getElementById('date-display').textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// Weather data handler
function applyWeather(w) {
  currentWeather = w;

  document.getElementById('temp-val').innerHTML = `${w.temp}<span class="unit">°C</span>`;
  document.getElementById('temp-feel').textContent = `Feels like ${w.feels}°C · ${w.desc || ''}`;
  document.getElementById('temp-bar').style.width = `${Math.min(Math.max((w.temp - 18) / 28 * 100, 0), 100)}%`;

  document.getElementById('rain-val').innerHTML = `${parseFloat(w.rain).toFixed(1)}<span class="unit">mm</span>`;
  document.getElementById('rain-desc').textContent = w.rain > 20 ? 'Heavy Rainfall ⚠' : w.rain > 5 ? 'Moderate Rain' : w.rain > 0 ? 'Light Rain' : 'No Rainfall';
  document.getElementById('rain-bar').style.width = `${Math.min(w.rain / 80 * 100, 100)}%`;

  const hdesc = w.humidity > 90 ? 'Very Humid' : w.humidity > 80 ? 'Very Humid' : w.humidity > 70 ? 'Humid — Coastal' : w.humidity > 60 ? 'Moderate' : 'Comfortable';
  document.getElementById('hum-val').innerHTML = `${w.humidity}<span class="unit">%</span>`;
  document.getElementById('hum-desc').textContent = hdesc;
  document.getElementById('hum-bar').style.width = `${w.humidity}%`;
  document.getElementById('hum-big').textContent = `${w.humidity}%`;
  document.getElementById('hum-comfort').textContent = hdesc;
  document.getElementById('hum-ring-val').textContent = `${w.humidity}%`;

  const circ = 2 * Math.PI * 27;
  document.querySelector('.ring-fill').style.strokeDasharray = circ;
  document.querySelector('.ring-fill').style.strokeDashoffset = circ - (w.humidity / 100 * circ);

  const dir = degToDir(w.windDeg);
  document.getElementById('wind-val').innerHTML = `${w.windKmh}<span class="unit">km/h</span>`;
  document.getElementById('wind-bar').style.width = `${Math.min(w.windKmh / 100 * 100, 100)}%`;
  document.getElementById('wind-dir-text').textContent = `Direction: ${dir} (${w.windDeg}°)`;
  document.getElementById('wind-speed-big').textContent = `${w.windKmh} km/h`;
  document.getElementById('wind-dir-display').textContent = `${dir} · ${w.windDeg}°`;
  document.getElementById('needle').style.transform = `translateX(-50%) translateY(-100%) rotate(${w.windDeg}deg)`;

  setCyclone(w.windKmh);
  setTicker(w);
  document.getElementById('loading-overlay').classList.add('hidden');
}

function setCyclone(windSpeed) {
  const box = document.getElementById('cyclone-box');
  const lbl = document.getElementById('cyclone-label');
  const det = document.getElementById('cyclone-detail');
  const ico = document.getElementById('cyclone-icon');
  const val = document.getElementById('cyclone-val');
  const sub = document.getElementById('cyclone-sub');
  const bar = document.getElementById('cyclone-bar');

  if (windSpeed > 62) {
    box.className = 'cyclone-box danger';
    lbl.textContent = '⚠ HIGH WIND ALERT';
    ico.textContent = '🌀';
    val.style.color = 'var(--danger)';
    val.textContent = 'ALERT';
    sub.textContent = 'High Wind Detected';
    det.textContent = `Sustained winds ${windSpeed} km/h. Fishermen advised not to venture to sea.`;
    bar.style.width = '90%';
    bar.style.background = 'var(--danger)';
  } else if (windSpeed > 40) {
    box.className = 'cyclone-box watch';
    lbl.textContent = 'WATCH';
    ico.textContent = '⚠️';
    val.style.color = 'var(--warn)';
    val.textContent = 'WATCH';
    sub.textContent = 'Monitoring Bay of Bengal';
    det.textContent = `Elevated winds (${windSpeed} km/h). No immediate cyclone. Continue monitoring.`;
    bar.style.width = '55%';
    bar.style.background = 'var(--warn)';
  } else {
    box.className = 'cyclone-box safe';
    lbl.textContent = 'ALL CLEAR';
    ico.textContent = '✅';
    val.style.color = 'var(--accent2)';
    val.textContent = 'CLEAR';
    sub.textContent = 'Bay of Bengal — Normal';
    det.textContent = 'No active cyclonic systems. Normal sea conditions. Fishing advisory: safe with caution.';
    bar.style.width = '12%';
    bar.style.background = 'var(--accent2)';
  }
}

function setTicker(w) {
  const bar = document.getElementById('alert-bar');
  const ticker = document.getElementById('ticker-text');
  const lbl = document.getElementById('ticker-label');
  const dir = degToDir(w.windDeg);
  const msgs = [
    `🌡 Chennai: ${w.temp}°C — ${w.desc || ''}`,
    `💧 Humidity: ${w.humidity}%`,
    `💨 Wind: ${w.windKmh} km/h from ${dir}`,
    `📡 IMD Regional Meteorological Centre Chennai | imd.gov.in`,
    `🌡 சென்னை: ${w.temp}°C | 💧 ${w.humidity}% | 💨 ${w.windKmh} கிமீ/மணி`,
    `⚓ மீனவர்கள் கடலுக்கு செல்வதற்கு முன் IMD அறிவிப்பை பாருங்கள்`
  ];

  if (w.rain > 15) {
    bar.className = 'alert-bar danger';
    lbl.textContent = '⚠ HEAVY RAIN';
    msgs.unshift(`⚠ HEAVY RAINFALL WARNING — ${parseFloat(w.rain).toFixed(1)}mm — மழை எச்சரிக்கை`);
  } else if (w.rain > 3) {
    bar.className = 'alert-bar warn';
    lbl.textContent = '🌧 RAIN';
    msgs.unshift(`🌧 RAINFALL: ${parseFloat(w.rain).toFixed(1)}mm in Chennai`);
  } else {
    bar.className = 'alert-bar safe';
    lbl.textContent = '✅ STATUS';
    msgs.push('✅ No severe weather alerts — சென்னைக்கு இப்போது எந்த எச்சரிக்கையும் இல்லை');
  }

  ticker.textContent = msgs.join('   ·   ');
}

function setStatus(text, cls, timestamp) {
  document.getElementById('api-status').textContent = text;
  document.getElementById('api-status').className = 'api-status ' + cls;
  document.getElementById('last-update').textContent = timestamp;
}

// Fetch weather from OpenWeatherMap
async function fetchWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('API Error: ' + response.status);
    
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);

    const weather = {
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      rain: data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0,
      windKmh: Math.round(data.wind.speed * 3.6),
      windDeg: data.wind.deg || 90,
      desc: capitalize(data.weather[0].description)
    };

    applyWeather(weather);
    fetchForecast();
    setStatus('✅ OWM LIVE', 'ok', `Updated: ${new Date().toLocaleTimeString('en-IN')}`);
    return;
  } catch (error) {
    console.warn('OWM fetch failed:', error);
    tryAlternativeWeatherSource();
  }
}

// Try Open-Meteo as fallback
async function tryAlternativeWeatherSource() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    
    const data = await res.json();
    const current = data.current;
    
    const weather = {
      temp: Math.round(current.temperature_2m),
      feels: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      rain: current.precipitation || 0,
      windKmh: Math.round(current.wind_speed_10m),
      windDeg: current.wind_direction_10m || 90,
      desc: getWeatherDesc(current.weather_code)
    };

    applyWeather(weather);
    setStatus('✅ LIVE DATA', 'ok', `Updated: ${new Date().toLocaleTimeString('en-IN')} (Open-Meteo)`);
  } catch (error) {
    console.warn('Alternative source failed:', error);
    useSimulatedData();
  }
}

// Use simulated data as final fallback
function useSimulatedData() {
  const weather = generateSimulatedWeather();
  applyWeather(weather);
  buildSimulatedForecast();
  setStatus('🟡 SIMULATED', 'sim', `Updated: ${new Date().toLocaleTimeString('en-IN')}`);
}

function generateSimulatedWeather() {
  const month = new Date().getMonth();
  const hour = new Date().getHours();
  const temps = [[29, 20], [31, 22], [34, 25], [36, 28], [38, 30], [37, 29], [35, 28], [35, 28], [34, 27], [32, 25], [29, 23], [28, 21]];
  const [maxT, minT] = temps[month];
  const dayProgress = (hour - 6) / 18;
  const temp = minT + (maxT - minT) * Math.max(0, Math.min(dayProgress, 1)) + (Math.random() * 2 - 1);
  
  return {
    temp: Math.round(temp),
    feels: Math.round(temp + 3),
    humidity: Math.round(70 + Math.random() * 20 - 10),
    rain: Math.random() < 0.1 ? parseFloat((Math.random() * 25).toFixed(1)) : 0,
    windKmh: Math.round(12 + Math.random() * 8 - 4),
    windDeg: 180 + Math.random() * 90,
    desc: 'Partly Cloudy'
  };
}

// Fetch forecast
async function fetchForecast() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&units=metric&cnt=40`
    );
    if (!response.ok) throw new Error();
    
    const data = await response.json();
    buildForecast(data.list);
  } catch (error) {
    console.warn('Forecast failed:', error);
    buildSimulatedForecast();
  }
}

function buildForecast(forecasts) {
  const days = {};
  forecasts.forEach(item => {
    const day = new Date(item.dt * 1000).toLocaleDateString('en-IN', { weekday: 'short' });
    if (!days[day]) days[day] = { temps: [], rain: 0, icons: [] };
    days[day].temps.push(item.main.temp);
    days[day].rain += (item.rain && item.rain['3h']) || 0;
    days[day].icons.push(item.weather[0].main);
  });

  const iconMap = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Mist: '🌫️' };
  const html = Object.entries(days).slice(0, 5).map(([day, info]) => `
    <div class="forecast-item">
      <div class="forecast-day">${day}</div>
      <div class="forecast-icon">${iconMap[info.icons[0]] || '🌤️'}</div>
      <div class="forecast-range">
        <span class="hi">${Math.round(Math.max(...info.temps))}°</span>
        <span class="lo"> / ${Math.round(Math.min(...info.temps))}°</span>
      </div>
      <div class="forecast-rain">💧${info.rain.toFixed(1)}mm</div>
    </div>
  `).join('');
  
  document.getElementById('forecast-list').innerHTML = html;
}

function buildSimulatedForecast() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const html = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const high = 32 + Math.random() * 4;
    const low = 24 + Math.random() * 3;
    const rain = Math.random() < 0.2 ? parseFloat((Math.random() * 15).toFixed(1)) : 0;
    return `
      <div class="forecast-item">
        <div class="forecast-day">${days[d.getDay()]}</div>
        <div class="forecast-icon">${rain > 5 ? '🌧️' : rain > 0 ? '🌦️' : '☀️'}</div>
        <div class="forecast-range">
          <span class="hi">${Math.round(high)}°</span>
          <span class="lo"> / ${Math.round(low)}°</span>
        </div>
        <div class="forecast-rain">💧${rain}mm</div>
      </div>
    `;
  }).join('');
  
  document.getElementById('forecast-list').innerHTML = html;
}

// Weather layer switching
function switchWeatherLayer(layer) {
  currentWeatherLayer = layer;
  ['temp', 'hum', 'wind'].forEach(btn => {
    document.getElementById(`btn-${btn}`).classList.toggle('active', 
      (btn === 'temp' && layer === 'temperature') ||
      (btn === 'hum' && layer === 'humidity') ||
      (btn === 'wind' && layer === 'wind')
    );
  });
}

// Utility functions
function degToDir(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getWeatherDesc(code) {
  if (code === 0) return 'Clear Sky';
  if (code <= 2) return 'Partly Cloudy';
  if (code <= 3) return 'Overcast';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 82) return 'Rain Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Cloudy';
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  initMap();
  useSimulatedData();
  setTimeout(fetchWeather, 500);
  setInterval(fetchWeather, 10 * 60 * 1000); // Update every 10 minutes
});
