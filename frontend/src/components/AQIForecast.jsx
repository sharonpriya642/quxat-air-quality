import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getStationForecast } from '../services/aqiService';

const getLevel = (aqi) => {
  if (aqi <= 50)  return { label: 'Good',          color: '#00e400' };
  if (aqi <= 100) return { label: 'Moderate',       color: '#b7a800' };
  if (aqi <= 150) return { label: 'Poor',           color: '#ff7e00' };
  if (aqi <= 200) return { label: 'Unhealthy',      color: '#ff0000' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8f3f97' };
  return              { label: 'Hazardous',         color: '#7e0023' };
};

export default function AQIForecast({ stationId, stationName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  if (!stationId) return;
  
  const fetchForecast = async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await getStationForecast(stationId);
      setData(d);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchForecast();
}, [stationId]);

  const peak = data.length ? data.reduce((a, b) => a.aqi > b.aqi ? a : b) : null;
  const best = data.length ? data.reduce((a, b) => a.aqi < b.aqi ? a : b) : null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
            🔮 24-Hour AQI Forecast
          </h3>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{stationName}</p>
        </div>
        {/* Peak & Best time badges */}
        {peak && best && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              background: '#fff5f5', border: '1px solid #fed7d7',
              borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
            }}>
              🔴 Peak: <strong>{peak.time}</strong> — AQI {peak.aqi}
            </div>
            <div style={{
              background: '#f0fff4', border: '1px solid #c6f6d5',
              borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
            }}>
              🟢 Cleanest: <strong>{best.time}</strong> — AQI {best.aqi}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          Loading forecast...
        </div>
      ) : error ? (
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e53e3e' }}>
          Failed to load forecast data.
        </div>
      ) : (
        <>
          {/* Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3182ce" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                formatter={(value, name) => [value, name.toUpperCase()]}
              />
              <ReferenceLine y={50}  stroke="#00e400" strokeDasharray="4 4" label={{ value: 'Good',     fontSize: 10 }} />
              <ReferenceLine y={100} stroke="#ffff00" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 10 }} />
              <ReferenceLine y={150} stroke="#ff7e00" strokeDasharray="4 4" label={{ value: 'Poor',     fontSize: 10 }} />
              <Area type="monotone" dataKey="aqi" stroke="#3182ce" strokeWidth={2.5} fill="url(#aqiGrad)" dot={{ r: 4, fill: '#3182ce' }} name="AQI" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Hourly cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '6px',
            marginTop: '16px',
          }}>
            {data.map((item, i) => {
              const level = getLevel(item.aqi);
              return (
                <div key={i} style={{
                  background: '#f7fafc',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  textAlign: 'center',
                  borderTop: `3px solid ${level.color}`,
                }}>
                  <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{item.time}</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: level.color, margin: '2px 0' }}>{item.aqi}</p>
                  <p style={{ fontSize: '9px', color: '#999', margin: '2px 0' }}>{item.temp}°C</p>
                  <p style={{ fontSize: '9px', color: '#aaa', margin: 0 }}>{item.humidity}%💧</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}