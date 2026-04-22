import { useState, useEffect } from 'react';
import { searchCity } from '../services/aqiService';

const METRO_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  
];

const levels = [
  { label: 'Good',      min: 0,   max: 50,  color: '#00e400' },
  { label: 'Moderate',  min: 51,  max: 100, color: '#ffff00' },
  { label: 'Poor',      min: 101, max: 150, color: '#ff7e00' },
  { label: 'Unhealthy', min: 151, max: 200, color: '#ff0000' },
  { label: 'Severe',    min: 201, max: 300, color: '#8f3f97' },
  { label: 'Hazardous', min: 301, max: 500, color: '#7e0023' },
];

const getLevel = (aqi) => levels.find(l => aqi >= l.min && aqi <= l.max) || levels[levels.length - 1];

function CitySearch() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = [];
      for (const city of METRO_CITIES) {
        try {
          const data = await searchCity(city);
          if (data.success && data.data.length > 0) {
            results.push(data.data[0]);
          }
        } catch (e) { console.error(e); }
      }
      setCities(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        🏙️ Indian Metropolitan Cities — Live AQI
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          Loading city data...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          {cities.map((city, i) => {
            const level = getLevel(city.aqi);
            const textColor = level.color === '#ffff00' ? '#b7a800' : level.color;
            return (
              <div key={i} style={{
                borderRadius: '10px',
                padding: '16px',
                background: '#f7fafc',
                border: `2px solid ${level.color}`,
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a365d', marginBottom: '6px' }}>
                  {city.name}
                </p>
                <p style={{ fontSize: '36px', fontWeight: '800', color: textColor, margin: '4px 0' }}>
                  {city.aqi}
                </p>
                <p style={{ fontSize: '12px', fontWeight: '600', color: textColor, margin: '4px 0' }}>
                  {level.label}
                </p>
                <p style={{ fontSize: '11px', color: '#888', margin: '6px 0 0' }}>
                  PM2.5: {city.pollutants.pm25?.toFixed(1)} · PM10: {city.pollutants.pm10?.toFixed(1)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CitySearch;