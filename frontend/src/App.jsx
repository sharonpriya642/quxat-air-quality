import { useEffect, useState } from 'react';
import AQIScale from './components/AQIScale';
import PollutionRankings from './components/PollutionRankings';
import ExposureTracker from './components/ExposureTracker';
import CitySearch from './components/CitySearch';
import PollutionSourceClassifier from './components/PollutionSourceClassifier';
import { getAllStations } from './services/aqiService';
import AQIForecast from './components/AQIForecast';
import HealthRiskScore from './components/HealthRiskScore';
import { supabase } from './supabaseClient';
import AQICard from './components/AQICard';
import PollutantCard from './components/PollutantCard';
import AQIChart from './components/AQIChart';
import HistoryChart from './components/HistoryChart';
import Map from './components/Map';
import Auth from './components/Auth';

function App() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    getAllStations()
      .then(data => {
        setStations(data);
        setSelected(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error:', err);
        setError('Failed to load AQI data. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleStationChange = (e) => {
    const index = parseInt(e.target.value);
    setSelected(stations[index]);
  };

  if (!user) return <Auth onLogin={setUser} />;

  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #3182ce',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ color: '#666', fontSize: '16px' }}>Loading Andhra Pradesh AQI data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px', color: '#e53e3e' }}>
      {error}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Sky background */}
      <div className="sky-bg" />

      {/* Moving clouds */}
      <div className="cloud cloud-1"><div className="cloud-shape" /></div>
      <div className="cloud cloud-2"><div className="cloud-shape" /></div>
      <div className="cloud cloud-3"><div className="cloud-shape" /></div>
      <div className="cloud cloud-4"><div className="cloud-shape" /></div>
      <div className="cloud cloud-5"><div className="cloud-shape" /></div>
      <div className="cloud cloud-6"><div className="cloud-shape" /></div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
        color: '#fff',
        padding: '24px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0 }}>
              🌬️ Andhra Pradesh AQI Monitor
            </h1>
            <p style={{ fontSize: '14px', color: '#bee3f8', marginTop: '4px' }}>
              Real-time Air Quality Index — Andhra Pradesh · Data: OpenWeatherMap
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#bee3f8',
            }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#bee3f8',
            }}>
              👤 {user.email}
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
              }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Station selector */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>
            📍 Select Station:
          </span>
          <select
            onChange={handleStationChange}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              cursor: 'pointer',
              background: '#f7fafc',
            }}>
            {stations.map((s, i) => (
              <option key={s.station} value={i}>{s.station}</option>
            ))}
          </select>
          <span style={{ fontSize: '13px', color: '#888' }}>
            Showing live AQI for {stations.length} Andhra Pradesh stations
          </span>
          {stations.length > 0 && (() => {
            const highest = stations.reduce((a, b) => a.aqi > b.aqi ? a : b);
            const lowest  = stations.reduce((a, b) => a.aqi < b.aqi ? a : b);
            return (
              <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                <span style={{
                  background: '#fff5f5', border: '1px solid #fed7d7',
                  borderRadius: '8px', padding: '4px 12px', fontSize: '13px',
                }}>
                  🔴 Highest: <strong>{highest.station}</strong> — AQI {highest.aqi}
                </span>
                <span style={{
                  background: '#f0fff4', border: '1px solid #c6f6d5',
                  borderRadius: '8px', padding: '4px 12px', fontSize: '13px',
                }}>
                  🟢 Lowest: <strong>{lowest.station}</strong> — AQI {lowest.aqi}
                </span>
              </div>
            );
          })()}
        </div>

        {/* 1. Live AQI */}
        {selected && <AQICard station={selected} />}

        {/* 2. AQI Scale */}
        <div style={{ marginTop: '24px' }}>
          <AQIScale />
        </div>

        {/* 3. Pollutant Breakdown */}
        {selected && (
          <div style={{ marginTop: '24px' }}>
            <PollutantCard pollutants={selected.pollutants} />
          </div>
        )}

        {/* 4. AQI Map + AQI History */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '24px',
        }}>
          <Map stations={stations} />
          <HistoryChart stationId={selected?.id} stationName={selected?.station} />
        </div>

        {/* 5. 24hr AQI Forecast */}
        <div style={{ marginTop: '24px' }}>
          <AQIForecast stationId={selected?.id} stationName={selected?.station} />
        </div>

        {/* 6. Indian Metropolitan Cities */}
        <div style={{ marginTop: '24px' }}>
          <CitySearch />
        </div>

        {/* 7. Personal Exposure Tracker */}
        <div style={{ marginTop: '24px' }}>
          <ExposureTracker stations={stations} />
        </div>

        {/* 8. Personal Health Risk Score */}
        <div style={{ marginTop: '24px' }}>
          <HealthRiskScore selected={selected} />
        </div>

        {/* 9. Pollution Source Classifier */}
        <div style={{ marginTop: '24px' }}>
          <PollutionSourceClassifier selected={selected} />
        </div>

        {/* 10. Global Pollution Rankings */}
        <div style={{ marginTop: '24px' }}>
          <PollutionRankings />
        </div>

        {/* 11. AQI Comparison Chart */}
        <div style={{ marginTop: '24px' }}>
          <AQIChart stations={stations} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', color: '#999', fontSize: '13px' }}>
          <p>Data refreshes every 30 minutes · Built with React + FastAPI · MSc Project</p>
        </div>

      </div>
    </div>
  );
}

export default App;