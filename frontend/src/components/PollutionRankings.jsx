import { useState } from 'react';

const COUNTRIES = [
  { rank: 1,  name: 'Bangladesh',        aqi: 79.9,  flag: '🇧🇩' },
  { rank: 2,  name: 'Pakistan',           aqi: 73.7,  flag: '🇵🇰' },
  { rank: 3,  name: 'India',              aqi: 54.4,  flag: '🇮🇳' },
  { rank: 4,  name: 'Tajikistan',         aqi: 49.0,  flag: '🇹🇯' },
  { rank: 5,  name: 'Burkina Faso',       aqi: 46.6,  flag: '🇧🇫' },
  { rank: 6,  name: 'Iraq',               aqi: 43.8,  flag: '🇮🇶' },
  { rank: 7,  name: 'Nepal',              aqi: 42.6,  flag: '🇳🇵' },
  { rank: 8,  name: 'Egypt',              aqi: 38.6,  flag: '🇪🇬' },
  { rank: 9,  name: 'Democratic Republic of Congo', aqi: 38.2, flag: '🇨🇩' },
  { rank: 10, name: 'Myanmar',            aqi: 37.2,  flag: '🇲🇲' },
  { rank: 11, name: 'China',              aqi: 35.9,  flag: '🇨🇳' },
  { rank: 12, name: 'Indonesia',          aqi: 35.7,  flag: '🇮🇩' },
  { rank: 13, name: 'Kazakhstan',         aqi: 34.2,  flag: '🇰🇿' },
  { rank: 14, name: 'Vietnam',            aqi: 33.6,  flag: '🇻🇳' },
  { rank: 15, name: 'Ghana',              aqi: 32.9,  flag: '🇬🇭' },
];

const CITIES = [
  { rank: 1,  name: 'Byrnihat',       country: 'India',       aqi: 128.2 },
  { rank: 2,  name: 'Begusarai',      country: 'India',       aqi: 118.9 },
  { rank: 3,  name: 'Mullanpur',      country: 'India',       aqi: 115.7 },
  { rank: 4,  name: 'New Delhi',      country: 'India',       aqi: 106.8 },
  { rank: 5,  name: 'Dhaka',          country: 'Bangladesh',  aqi: 105.4 },
  { rank: 6,  name: 'Faridabad',      country: 'India',       aqi: 103.2 },
  { rank: 7,  name: 'Lahore',         country: 'Pakistan',    aqi: 101.5 },
  { rank: 8,  name: 'Gurugram',       country: 'India',       aqi: 99.8  },
  { rank: 9,  name: 'Noida',          country: 'India',       aqi: 97.3  },
  { rank: 10, name: 'Ghaziabad',      country: 'India',       aqi: 95.4  },
  { rank: 11, name: 'Muzaffarpur',    country: 'India',       aqi: 94.1  },
  { rank: 12, name: 'Peshawar',       country: 'Pakistan',    aqi: 91.8  },
  { rank: 13, name: 'Patna',          country: 'India',       aqi: 90.2  },
  { rank: 14, name: 'Hotan',          country: 'China',       aqi: 88.7  },
  { rank: 15, name: 'Bahawalpur',     country: 'Pakistan',    aqi: 87.3  },
];

function getColor(aqi) {
  if (aqi <= 50)  return { bg: '#f0fff4', text: '#276749', bar: '#00e400' };
  if (aqi <= 100) return { bg: '#fffff0', text: '#744210', bar: '#ffff00' };
  if (aqi <= 150) return { bg: '#fffaf0', text: '#7b341e', bar: '#ff7e00' };
  if (aqi <= 200) return { bg: '#fff5f5', text: '#742a2a', bar: '#ff0000' };
  if (aqi <= 300) return { bg: '#faf5ff', text: '#44337a', bar: '#8f3f97' };
  return               { bg: '#fff5f5', text: '#742a2a', bar: '#7e0023' };
}

function RankingRow({ item, maxAqi, type }) {
  const colors = getColor(item.aqi);
  const barWidth = Math.round((item.aqi / maxAqi) * 100);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      background: item.rank <= 3 ? colors.bg : 'transparent',
      borderRadius: '8px',
      marginBottom: '6px',
      border: item.rank <= 3 ? `1px solid ${colors.bar}33` : 'none',
    }}>
      {/* Rank */}
      <div style={{
        minWidth: '28px',
        height: '28px',
        borderRadius: '50%',
        background: item.rank === 1 ? '#d4af37' : item.rank === 2 ? '#c0c0c0' : item.rank === 3 ? '#cd7f32' : '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        color: item.rank <= 3 ? '#fff' : '#666',
      }}>
        {item.rank}
      </div>

      {/* Name */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          {type === 'country' && <span style={{ fontSize: '16px' }}>{item.flag}</span>}
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#2d3748' }}>
            {item.name}
          </span>
          {type === 'city' && (
            <span style={{ fontSize: '11px', color: '#888' }}>
              {item.country}
            </span>
          )}
        </div>
        {/* Progress bar */}
        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', width: '100%' }}>
          <div style={{
            background: colors.bar,
            borderRadius: '4px',
            height: '6px',
            width: `${barWidth}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* AQI value */}
      <div style={{ textAlign: 'right', minWidth: '60px' }}>
        <span style={{
          fontSize: '15px',
          fontWeight: '700',
          color: colors.bar === '#ffff00' ? '#b7a800' : colors.bar,
        }}>
          {item.aqi}
        </span>
        <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>PM2.5</p>
      </div>
    </div>
  );
}

function PollutionRankings() {
  const [tab, setTab] = useState('cities');

  const maxCityAqi = Math.max(...CITIES.map(c => c.aqi));
  const maxCountryAqi = Math.max(...COUNTRIES.map(c => c.aqi));

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            🌍 Global Pollution Rankings 2025
          </h3>
          <p style={{ fontSize: '12px', color: '#888' }}>
            Source: IQAir World Air Quality Report 2025 · PM2.5 µg/m³ annual average
          </p>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setTab('cities')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              background: tab === 'cities' ? '#2b6cb0' : '#f7fafc',
              color: tab === 'cities' ? '#fff' : '#555',
            }}>
            🏙️ Cities
          </button>
          <button
            onClick={() => setTab('countries')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              background: tab === 'countries' ? '#2b6cb0' : '#f7fafc',
              color: tab === 'countries' ? '#fff' : '#555',
            }}>
            🌐 Countries
          </button>
        </div>
      </div>

      {/* India highlight */}
      {tab === 'countries' && (
        <div style={{
          background: '#ebf8ff',
          border: '1px solid #bee3f8',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '14px',
          fontSize: '13px',
          color: '#2c5282',
        }}>
          🇮🇳 India ranks <strong>#3 most polluted country</strong> globally with an average PM2.5 of 54.4 µg/m³ — 10× the WHO safe limit of 5 µg/m³.
        </div>
      )}

      {tab === 'cities' && (
        <div style={{
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '14px',
          fontSize: '13px',
          color: '#742a2a',
        }}>
          🇮🇳 India dominates the top 10 — <strong>9 out of 15 most polluted cities</strong> are in India, with Byrnihat (Assam) ranked #1 globally.
        </div>
      )}

      {/* Rankings list */}
      <div>
        {tab === 'cities'
          ? CITIES.map(city => (
              <RankingRow key={city.rank} item={city} maxAqi={maxCityAqi} type="city" />
            ))
          : COUNTRIES.map(country => (
              <RankingRow key={country.rank} item={country} maxAqi={maxCountryAqi} type="country" />
            ))
        }
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
        {[
          { color: '#00e400', label: 'Good (0-50)' },
          { color: '#ffff00', label: 'Moderate (51-100)' },
          { color: '#ff7e00', label: 'Unhealthy Sensitive (101-150)' },
          { color: '#ff0000', label: 'Unhealthy (151-200)' },
          { color: '#8f3f97', label: 'Very Unhealthy (201-300)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '11px', color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PollutionRankings;