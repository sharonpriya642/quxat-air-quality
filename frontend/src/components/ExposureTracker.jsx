import { useState } from 'react';

const STATIONS = [
  'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur', 'Nellore',
  'Kurnool', 'Kakinada', 'Rajahmundry', 'Kadapa', 'Anantapur',
  'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam',
  'Adoni', 'Tenali', 'Chittoor', 'Hindupur', 'Srikakulam',
  'Bhimavaram', 'Tadepalligudem', 'Narasaraopet', 'Proddatur',
  'Rajampet', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada',
  'Narasapuram', 'Amaravati', 'Puttaparthi', 'Sullurpeta', 'Bapatla', 'Kavali'
];

const ACTIVITIES = [
  { label: 'Walking / Cycling', multiplier: 2.0 },
  { label: 'Commuting (Bus/Car)', multiplier: 1.2 },
  { label: 'Working Indoors', multiplier: 0.5 },
  { label: 'Outdoor Exercise', multiplier: 2.5 },
  { label: 'Sleeping', multiplier: 0.3 },
];

const getLevel = (aqi) => {
  if (aqi <= 50)  return { label: 'Good',        color: '#00e400', bg: '#f0fff4' };
  if (aqi <= 100) return { label: 'Moderate',     color: '#b7a800', bg: '#fffff0' };
  if (aqi <= 150) return { label: 'Poor',         color: '#ff7e00', bg: '#fff5e6' };
  if (aqi <= 200) return { label: 'Unhealthy',    color: '#ff0000', bg: '#fff5f5' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8f3f97', bg: '#faf5ff' };
  return              { label: 'Hazardous',       color: '#7e0023', bg: '#fff5f5' };
};

const getHealthAdvice = (aqi) => {
  if (aqi <= 50)  return 'Low risk. Safe for all outdoor activities.';
  if (aqi <= 100) return 'Moderate risk. Sensitive individuals should limit prolonged outdoor exposure.';
  if (aqi <= 150) return 'Unhealthy for sensitive groups. Reduce outdoor time if possible.';
  if (aqi <= 200) return 'Unhealthy. Wear a mask outdoors and limit exposure.';
  if (aqi <= 300) return 'Very unhealthy. Avoid outdoor activities. Stay indoors.';
  return 'Hazardous! Do not go outside. Keep windows closed.';
};

const EMPTY_STOP = { location: '', hours: 1, activity: ACTIVITIES[0].label };

export default function ExposureTracker({ stations }) {
  const [stops, setStops] = useState([{ ...EMPTY_STOP }]);
  const [result, setResult] = useState(null);

  const addStop = () => setStops([...stops, { ...EMPTY_STOP }]);
  const removeStop = (i) => setStops(stops.filter((_, idx) => idx !== i));

  const updateStop = (i, field, value) => {
    const updated = [...stops];
    updated[i][field] = value;
    setStops(updated);
  };

  const calculate = () => {
    const details = stops.map(stop => {
      const station = stations.find(s => s.station === stop.location);
      if (!station) return null;
      const activity = ACTIVITIES.find(a => a.label === stop.activity);
      const effectiveAQI = Math.round(station.aqi * activity.multiplier);
      return {
        location: stop.location,
        hours: parseFloat(stop.hours),
        activity: stop.activity,
        rawAQI: station.aqi,
        effectiveAQI,
        contribution: effectiveAQI * parseFloat(stop.hours),
      };
    }).filter(Boolean);

    if (details.length === 0) return;

    const totalHours = details.reduce((sum, d) => sum + d.hours, 0);
    const totalContribution = details.reduce((sum, d) => sum + d.contribution, 0);
    const avgExposure = Math.round(totalContribution / totalHours);

    setResult({ details, avgExposure, totalHours });
  };

  const level = result ? getLevel(result.avgExposure) : null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
        🚶 Personal Exposure Tracker
      </h3>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        Add your daily route stops to calculate your total AQI exposure
      </p>

      {/* Stops */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {stops.map((stop, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr auto',
            gap: '10px',
            alignItems: 'center',
            background: '#f7fafc',
            padding: '12px',
            borderRadius: '8px',
          }}>
            {/* Location */}
            <div>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                📍 Location
              </label>
              <select
                value={stop.location}
                onChange={e => updateStop(i, 'location', e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px', borderRadius: '6px',
                  border: '1px solid #e2e8f0', fontSize: '13px', background: '#fff',
                }}>
                <option value=''>Select station</option>
                {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Activity */}
            <div>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                🏃 Activity
              </label>
              <select
                value={stop.activity}
                onChange={e => updateStop(i, 'activity', e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px', borderRadius: '6px',
                  border: '1px solid #e2e8f0', fontSize: '13px', background: '#fff',
                }}>
                {ACTIVITIES.map(a => <option key={a.label} value={a.label}>{a.label}</option>)}
              </select>
            </div>

            {/* Hours */}
            <div>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                ⏱ Hours
              </label>
              <input
                type='number'
                min='0.5'
                max='24'
                step='0.5'
                value={stop.hours}
                onChange={e => updateStop(i, 'hours', e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px', borderRadius: '6px',
                  border: '1px solid #e2e8f0', fontSize: '13px',
                }}
              />
            </div>

            {/* Remove */}
            <button
              onClick={() => removeStop(i)}
              disabled={stops.length === 1}
              style={{
                padding: '6px 10px', borderRadius: '6px', border: 'none',
                background: stops.length === 1 ? '#eee' : '#fed7d7',
                color: stops.length === 1 ? '#999' : '#c53030',
                cursor: stops.length === 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px', marginTop: '16px',
              }}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={addStop}
          style={{
            padding: '8px 18px', borderRadius: '8px',
            border: '1px dashed #3182ce', background: '#ebf8ff',
            color: '#2b6cb0', fontSize: '13px', cursor: 'pointer',
          }}>
          + Add Stop
        </button>
        <button
          onClick={calculate}
          style={{
            padding: '8px 24px', borderRadius: '8px',
            border: 'none', background: '#2b6cb0',
            color: '#fff', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer',
          }}>
          Calculate Exposure
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          background: level.bg,
          border: `2px solid ${level.color}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          {/* Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                Average Daily Exposure over {result.totalHours}h
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '52px', fontWeight: '800', color: level.color, lineHeight: 1 }}>
                  {result.avgExposure}
                </span>
                <span style={{ fontSize: '13px', color: '#999' }}>AQI (weighted)</span>
              </div>
            </div>
            <div style={{
              background: '#fff',
              border: `2px solid ${level.color}`,
              borderRadius: '10px',
              padding: '10px 20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Risk Level</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: level.color, margin: 0 }}>
                {level.label}
              </p>
            </div>
          </div>

          {/* Health advice */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '10px 14px',
            borderLeft: `4px solid ${level.color}`,
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>
              💡 {getHealthAdvice(result.avgExposure)}
            </p>
          </div>

          {/* Breakdown table */}
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>
            Stop-by-stop Breakdown:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {result.details.map((d, i) => {
              const l = getLevel(d.effectiveAQI);
              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1.5fr 0.5fr 0.8fr 0.8fr',
                  gap: '8px',
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  alignItems: 'center',
                  fontSize: '13px',
                }}>
                  <span style={{ fontWeight: '600', color: '#1a365d' }}>📍 {d.location}</span>
                  <span style={{ color: '#555' }}>{d.activity}</span>
                  <span style={{ color: '#888' }}>{d.hours}h</span>
                  <span style={{ color: '#888' }}>AQI {d.rawAQI}</span>
                  <span style={{
                    fontWeight: '700', color: l.color,
                    background: l.bg, borderRadius: '6px',
                    padding: '2px 8px', textAlign: 'center',
                  }}>
                    {d.effectiveAQI} eff.
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}