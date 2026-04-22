import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import { getStationHistory } from '../services/aqiService';

// Detect anomalies — points > mean + 1.5 * stddev
const detectAnomalies = (data) => {
  if (data.length < 3) return data;
  const mean = data.reduce((s, d) => s + d.aqi, 0) / data.length;
  const std = Math.sqrt(data.reduce((s, d) => s + Math.pow(d.aqi - mean, 2), 0) / data.length);
  const threshold = mean + 1.5 * std;
  return data.map(d => ({ ...d, anomaly: d.aqi > threshold, mean: Math.round(mean) }));
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload.anomaly) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#e53e3e" stroke="#fff" strokeWidth={2} />
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize={10} fill="#e53e3e" fontWeight="700">⚠</text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: '#fff', borderRadius: '8px', padding: '10px 14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: '12px',
      border: d?.anomaly ? '2px solid #e53e3e' : '1px solid #e2e8f0',
    }}>
      <p style={{ fontWeight: '700', marginBottom: '4px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.name.toUpperCase()}: {p.value}
        </p>
      ))}
      {d?.anomaly && (
        <p style={{ color: '#e53e3e', fontWeight: '700', marginTop: '6px' }}>
          ⚠️ Anomaly detected! AQI is {Math.round(((d.aqi - d.mean) / d.mean) * 100)}% above average ({d.mean})
        </p>
      )}
    </div>
  );
};

function HistoryChart({ stationId, stationName }) {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [hours, setHours]           = useState(168);
  const [activeLines, setActiveLines] = useState({ aqi: true, pm25: true, pm10: false });

  const timeOptions = [
    { label: '24 Hours', value: 24 },
    { label: '7 Days',   value: 168 },
    { label: '30 Days',  value: 720 },
  ];

  useEffect(() => {
    if (!stationId && stationId !== 0) return;
    setLoading(true);
    getStationHistory(stationId, hours)
      .then(d => { setData(detectAnomalies(d)); setLoading(false); })
      .catch(() => setLoading(false));
  }, [stationId, hours]);

  const toggleLine = (key) =>
    setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const anomalies = data.filter(d => d.anomaly);

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>📈 AQI History</h3>
          <p style={{ fontSize: '12px', color: '#888' }}>{stationName}</p>
        </div>
        <select
          value={hours}
          onChange={e => setHours(Number(e.target.value))}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: '#f7fafc', color: '#2d3748' }}>
          {timeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Anomaly banner */}
      {anomalies.length > 0 && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '8px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontSize: '13px', color: '#c53030', fontWeight: '500' }}>
            {anomalies.length} anomalous AQI spike{anomalies.length > 1 ? 's' : ''} detected — marked in red on the chart
          </span>
        </div>
      )}

      {/* Toggle lines */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { key: 'aqi',  label: 'AQI',   color: '#3182ce' },
          { key: 'pm25', label: 'PM2.5', color: '#e53e3e' },
          { key: 'pm10', label: 'PM10',  color: '#38a169' },
        ].map(line => (
          <button key={line.key} onClick={() => toggleLine(line.key)} style={{
            padding: '4px 12px', borderRadius: '20px',
            border: `1px solid ${line.color}`,
            background: activeLines[line.key] ? line.color : 'transparent',
            color: activeLines[line.key] ? '#fff' : line.color,
            fontSize: '12px', fontWeight: '500', cursor: 'pointer',
          }}>{line.label}</button>
        ))}
        <span style={{ fontSize: '11px', color: '#888', alignSelf: 'center', marginLeft: '8px' }}>
          ⚠️ = Anomaly spike
        </span>
      </div>

      {/* Chart */}
      {loading ? (
        <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          Loading data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={hours === 24 ? 3 : hours === 168 ? 0 : 4} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50}  stroke="#00e400" strokeDasharray="4 4" label={{ value: 'Good',     fontSize: 10 }} />
            <ReferenceLine y={100} stroke="#ffff00" strokeDasharray="4 4" label={{ value: 'Moderate', fontSize: 10 }} />
            {data[0]?.mean && (
              <ReferenceLine y={data[0].mean} stroke="#3182ce" strokeDasharray="6 3"
                label={{ value: `Avg: ${data[0].mean}`, fontSize: 10, fill: '#3182ce' }} />
            )}
            {activeLines.aqi && (
              <Line type="monotone" dataKey="aqi" stroke="#3182ce" strokeWidth={2.5}
                dot={<CustomDot />} name="AQI" />
            )}
            {activeLines.pm25 && <Line type="monotone" dataKey="pm25" stroke="#e53e3e" strokeWidth={2} dot={false} name="PM2.5" />}
            {activeLines.pm10 && <Line type="monotone" dataKey="pm10" stroke="#38a169" strokeWidth={2} dot={false} name="PM10" />}
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Anomaly list */}
      {anomalies.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' }}>🔍 Anomaly Details:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {anomalies.map((a, i) => (
              <div key={i} style={{
                background: '#fff5f5', border: '1px solid #fed7d7',
                borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
              }}>
                <strong>{a.date}</strong> — AQI {a.aqi}
                <span style={{ color: '#e53e3e', marginLeft: '6px' }}>
                  (+{Math.round(((a.aqi - a.mean) / a.mean) * 100)}% above avg)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary stats */}
      {data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginTop: '14px' }}>
          {[
            { label: 'Average AQI', value: data[0]?.mean ?? '-',                          color: '#3182ce' },
            { label: 'Max AQI',     value: Math.max(...data.map(d => d.aqi)),              color: '#e53e3e' },
            { label: 'Min AQI',     value: Math.min(...data.map(d => d.aqi)),              color: '#38a169' },
            { label: 'Anomalies',   value: anomalies.length,                               color: '#e53e3e' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#f7fafc', borderRadius: '8px', padding: '10px', textAlign: 'center', borderTop: `3px solid ${stat.color}` }}>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: stat.color, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryChart;