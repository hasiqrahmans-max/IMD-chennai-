# IMD Chennai Weather Dashboard

A modern, real-time weather dashboard for Chennai displaying live meteorological data from the India Meteorological Department (IMD) with an interactive map and comprehensive weather metrics.

## Features

### 🎯 Real-Time Weather Data
- **Live Temperature Monitoring** - Current temperature with "feels like" indicator
- **Humidity Tracking** - Visual ring indicator and comfort level
- **Wind Speed & Direction** - Animated compass and directional information
- **Rainfall Monitoring** - Real-time precipitation data with alerts
- **Cyclone Alerts** - Automated warnings based on wind patterns

### 🗺️ Interactive Map
- **Leaflet-based Live Map** - Real-time weather visualization
- **Multiple Weather Layers** - Switch between Temperature, Humidity, and Wind
- **Weather Stations** - View surrounding meteorological stations
- **Dark Theme** - Custom dark tile layer for night viewing

### 📊 Dashboard Features
- **5-Day Forecast** - Daily high/low temperatures and precipitation
- **Status Alerts** - Color-coded weather alerts (Safe/Warning/Danger)
- **Ticker System** - Scrolling weather updates in Tamil and English
- **Live Clock** - Real-time IST (Indian Standard Time) display
- **Multiple Data Sources** - OpenWeatherMap API with Open-Meteo fallback

### 🎨 Visual Design
- **Cyberpunk Theme** - Dark blue and cyan color scheme
- **Responsive Layout** - Mobile, tablet, and desktop optimized
- **Animated Elements** - Smooth transitions and pulse animations
- **Bilingual Support** - English and Tamil interfaces

## Data Sources

1. **Primary**: OpenWeatherMap API (https://openweathermap.org)
2. **Fallback**: Open-Meteo (https://open-meteo.com)
3. **Backup**: Simulated data with realistic weather patterns

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Mapping**: Leaflet.js
- **Data**: OpenWeatherMap API, Open-Meteo API
- **Fonts**: Google Fonts (Rajdhani, Orbitron, Noto Sans Tamil)
- **Styling**: Custom CSS with CSS variables

## File Structure

```
IMD-chennai-/
├── index.html          # Main dashboard HTML
├── js/
│   └── weather.js      # Weather logic and API handlers
├── README.md          # Documentation
└── .gitignore         # Git ignore file
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hasiqrahmans-max/IMD-chennai-.git
cd IMD-chennai-
```

2. Open in browser:
```bash
# Simply open index.html in a web browser
open index.html

# Or use a local server
python -m http.server 8000
```

## API Keys

The dashboard uses a public OpenWeatherMap API key. For production use:

1. Sign up at https://openweathermap.org/api
2. Get your API key from the dashboard
3. Replace `OWM_KEY` in `js/weather.js`

## Weather Metrics

### Temperature
- **Range**: 18°C - 46°C (displayed with progress bar)
- **Status**: Feels-like indicator
- **Color**: Orange (#ff6b35)

### Humidity
- **Range**: 0% - 100%
- **States**: Comfortable, Moderate, Humid, Very Humid
- **Color**: Cyan (#00bfff)

### Wind Speed
- **Units**: km/h
- **Direction**: 16-point compass (N, NNE, NE, etc.)
- **Color**: Green (#00ff9f)

### Cyclone Alerts
- **Clear** (<40 km/h): ✅ All clear
- **Watch** (40-62 km/h): ⚠️ Monitoring
- **Alert** (>62 km/h): 🚨 High wind alert

## Customization

### Change Location

Edit `js/weather.js`:
```javascript
const LAT = 13.0827;  // Your latitude
const LON = 80.2707;  // Your longitude
const CITY_NAME = 'Chennai';  // Your city
```

### Modify Colors

Edit CSS variables in `index.html` within `<style>` tag:
```css
:root {
  --accent: #00c8ff;    /* Cyan */
  --accent2: #00ff9f;   /* Green */
  --accent3: #ff6b35;   /* Orange */
  --warn: #ffcc00;      /* Yellow */
  --danger: #ff2d55;    /* Red */
}
```

## Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Performance

- **Initial Load**: ~2-3 seconds
- **API Update Interval**: 10 minutes
- **Map Refresh**: Real-time
- **Bundle Size**: ~150KB (including Leaflet)

## Known Issues

1. Map may take 2-3 seconds to render on slower connections
2. Mobile zoom may require pinch gesture on iOS
3. Historical data not available in free tier APIs

## Future Enhancements

- [ ] Air Quality Index (AQI) integration
- [ ] UV Index monitoring
- [ ] Severe weather animations
- [ ] Weather history graphs
- [ ] Push notifications for alerts
- [ ] Offline mode with cached data
- [ ] Multiple city comparison
- [ ] Custom alert thresholds

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues and questions:
- GitHub Issues: https://github.com/hasiqrahmans-max/IMD-chennai-/issues
- Email: support@example.com

## Acknowledgments

- India Meteorological Department (IMD)
- OpenWeatherMap
- Open-Meteo
- Leaflet.js community
- Google Fonts

---

**Stay weather aware! 🌦️**
