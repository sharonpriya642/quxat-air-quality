import { useState } from 'react';
import axios from 'axios';

function CityLocations() {
  const [city, setCity] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState('');
  const [sortField, setSortField] = useState('aqi');
  const [sortDir, setSortDir] = useState('desc');

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setLocations([]);
    setSearched(city);

    try {
      const response = await axios.get(`http://localhost:5000/api/aqi/locations?city=${city}`);
      if (response.data.success) {
        setLocations(response.data.data);
      } else {
        setError('City not found. Please try another name.');
      }
    } catch {
      setError('Failed to fetch data. Please try again.');
    }

    setLoading(false);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...locations].sort((a, b) => {
    const aVal = isNaN(a[sortField]) ? a[sortField] : Number(a[sortField]);
    const bVal = isNaN(b[sortField]) ? b[sortField] : Number(b[sortField]);
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => (
    <span style={{ marginLeft: '4px', color: sortField === field ? '#2b6cb0' : '#ccc', fontSize: '10px' }}>
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
          📍 City Locations — Real-time Air Pollution Level
        </h3>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Enter a city to see AQI breakdown across its main areas
        </p>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. Vijayawada, Visakhapatnam, Guntur..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? '#90cdf4' : '#2b6cb0',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {/* Error */}
      {error && <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3182ce',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px',
          }} />
          Fetching air quality data for {city} locations...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Table */}
      {!loading && sorted.length > 0 && (
        <>
          {/* City title */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1a365d', marginBottom: '2px' }}>
              {searched}'s Locations
            </h4>
            <p style={{ fontSize: '13px', color: '#2b6cb0', fontWeight: '500' }}>
              Real-time Air Pollution Level
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {[
                    { label: 'Location',       field: 'name' },
                    { label: 'Status',         field: 'status' },
                    { label: 'AQI (IN)',       field: 'aqi' },
                    { label: 'PM₂.₅ (µg/m³)', field: 'pm25' },
                    { label: 'PM₁₀ (µg/m³)',  field: 'pm10' },
                    { label: 'Temp. (°C)',     field: 'temp' },
                    { label: 'Humi. (%)',      field: 'humidity' },
                    { label: 'Wind (m/s)',     field: 'windSpeed' },
                  ].map(col => (
                    <th
                      key={col.field}
                      onClick={() => handleSort(col.field)}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: '#555',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                      }}>
                      {col.label}<SortIcon field={col.field} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((loc, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? '#fff' : '#f7fafc',
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ebf8ff'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f7fafc'}
                  >
                    <td style={{ padding: '12px 16px', color: '#2d3748', fontWeight: '500' }}>
                      {loc.name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: loc.color,
                        color: loc.color === '#ffff00' ? '#666' : '#fff',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {loc.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: loc.color === '#ffff00' ? '#b7a800' : loc.color }}>
                      {loc.aqi}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#2d3748', fontWeight: '600' }}>{loc.pm25}</td>
                    <td style={{ padding: '12px 16px', color: '#2d3748', fontWeight: '600' }}>{loc.pm10}</td>
                    <td style={{ padding: '12px 16px', color: '#2d3748' }}>🌡️ {loc.temp}</td>
                    <td style={{ padding: '12px 16px', color: '#2d3748' }}>💧 {loc.humidity}</td>
                    <td style={{ padding: '12px 16px', color: '#2d3748' }}>💨 {loc.windSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '16px' }}>
            {[
              { label: 'Avg AQI',      value: Math.round(locations.reduce((a, b) => a + Number(b.aqi), 0) / locations.length), color: '#3182ce' },
              { label: 'Best Area',    value: locations.reduce((a, b) => Number(a.aqi) < Number(b.aqi) ? a : b).name.split(' ').slice(-1)[0], color: '#38a169' },
              { label: 'Worst Area',   value: locations.reduce((a, b) => Number(a.aqi) > Number(b.aqi) ? a : b).name.split(' ').slice(-1)[0], color: '#e53e3e' },
              { label: 'Avg Humidity', value: Math.round(locations.reduce((a, b) => a + b.humidity, 0) / locations.length) + '%', color: '#805ad5' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#f7fafc',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                borderTop: `3px solid ${s.color}`,
              }}>
                <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{s.label}</p>
                <p style={{ fontSize: '16px', fontWeight: '700', color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CityLocations;
