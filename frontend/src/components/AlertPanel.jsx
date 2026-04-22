import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AlertPanel({ user }) {
  const [alerts, setAlerts] = useState([]);
  const [stationId, setStationId] = useState(101);
  const [threshold, setThreshold] = useState(100);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const stationMap = {
  101: 'Vijayawada', 102: 'Visakhapatnam', 103: 'Tirupati',
  104: 'Guntur', 105: 'Nellore', 106: 'Kurnool',
  107: 'Kakinada', 108: 'Rajahmundry', 109: 'Kadapa',
  110: 'Anantapur', 111: 'Vizianagaram', 112: 'Eluru',
  113: 'Ongole', 114: 'Nandyal', 115: 'Machilipatnam',
  116: 'Adoni', 117: 'Tenali', 118: 'Chittoor',
  119: 'Hindupur', 120: 'Srikakulam', 121: 'Bhimavaram',
  122: 'Tadepalligudem', 123: 'Narasaraopet', 124: 'Proddatur',
  125: 'Rajampet', 126: 'Madanapalle', 127: 'Guntakal',
  128: 'Dharmavaram', 129: 'Gudivada', 130: 'Narasapuram',
  131: 'Amaravati', 132: 'Puttaparthi', 133: 'Sullurpeta',
  134: 'Bapatla', 135: 'Kavali',
};

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data } = await supabase
        .from('users_alerts')
        .select('*')
        .eq('user_id', user.id);
      setAlerts(data || []);
    };
    fetchAlerts();
  }, [user.id]);

  const saveAlert = async () => {
    setSaving(true);
    setMessage('');
    const { error } = await supabase.from('users_alerts').insert({
      user_id: user.id,
      station_id: stationId,
      station_name: stationMap[stationId],
      threshold: threshold,
    });
    if (!error) {
      setMessage('Alert saved successfully!');
      const { data } = await supabase
        .from('users_alerts')
        .select('*')
        .eq('user_id', user.id);
      setAlerts(data || []);
    }
    setSaving(false);
  };

  const deleteAlert = async (id) => {
    await supabase.from('users_alerts').delete().eq('id', id);
    const { data } = await supabase
      .from('users_alerts')
      .select('*')
      .eq('user_id', user.id);
    setAlerts(data || []);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        🔔 AQI Alert Settings
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        <select
          value={stationId}
          onChange={(e) => setStationId(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
          }}
        >
          {Object.entries(stationMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', color: '#555' }}>
            Alert when AQI exceeds:
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            min="0"
            max="500"
            style={{
              width: '70px',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
            }}
          />
        </div>

        <button
          onClick={saveAlert}
          disabled={saving}
          style={{
            padding: '8px 20px',
            background: saving ? '#90cdf4' : '#2b6cb0',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Alert'}
        </button>
      </div>

      {message && (
        <p style={{ fontSize: '13px', color: '#276749', marginBottom: '12px' }}>
          {message}
        </p>
      )}

      {alerts.length > 0 ? (
        <div>
          <p
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#555',
              marginBottom: '8px',
            }}
          >
            Your active alerts:
          </p>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: '#f7fafc',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '13px',
              }}
            >
              <span>
                📍 {alert.station_name} — Alert when AQI &gt;{' '}
                <strong>{alert.threshold}</strong>
              </span>
              <button
                onClick={() => deleteAlert(alert.id)}
                style={{
                  background: '#fff5f5',
                  color: '#c53030',
                  border: '1px solid #feb2b2',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: '#999' }}>No alerts set yet.</p>
      )}
    </div>
  );
}

export default AlertPanel;