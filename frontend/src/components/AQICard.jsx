function AQICard({ station }) {
  const levels = [
    { label: 'Good',      min: 0,   max: 50,  color: '#00e400' },
    { label: 'Moderate',  min: 51,  max: 100, color: '#ffff00' },
    { label: 'Poor',      min: 101, max: 150, color: '#ff7e00' },
    { label: 'Unhealthy', min: 151, max: 200, color: '#ff0000' },
    { label: 'Severe',    min: 201, max: 300, color: '#8f3f97' },
    { label: 'Hazardous', min: 301, max: 500, color: '#7e0023' },
  ];

  const getLevel = (aqi) => {
    return levels.find(l => aqi >= l.min && aqi <= l.max) || levels[levels.length - 1];
  };

  const current = getLevel(station.aqi);
  const percentage = Math.min((station.aqi / 500) * 100, 100);

  const gradientBar = 'linear-gradient(to right, #00e400 0%, #ffff00 20%, #ff7e00 40%, #ff0000 60%, #8f3f97 80%, #7e0023 100%)';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff8f0 0%, #fff 100%)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
    }}>

      {/* Title */}
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a365d', marginBottom: '4px' }}>
        Real-time Air Quality Index (AQI)
      </h2>

      {/* Station name */}
      <p style={{ fontSize: '14px', color: '#2b6cb0', fontWeight: '500', marginBottom: '2px', textDecoration: 'underline' }}>
        📍 {station.station}, Delhi, India
      </p>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
        Last Updated: {new Date(station.timestamp).toLocaleString('en-IN')} (Local Time)
      </p>

      {/* Live AQI + Category */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ff0000',
              animation: 'pulse 1.5s infinite',
            }} />
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Live AQI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontSize: '72px',
              fontWeight: '800',
              color: current.color === '#ffff00' ? '#b7a800' : current.color,
              lineHeight: 1,
            }}>
              {station.aqi}
            </span>
            <span style={{ fontSize: '13px', color: '#999' }}>AQI (US)</span>
          </div>
        </div>

        {/* Category box */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>Air Quality is</p>
          <div style={{
            background: current.color === '#ffff00' ? '#fffde7' : `${current.color}22`,
            border: `2px solid ${current.color}`,
            borderRadius: '10px',
            padding: '10px 20px',
          }}>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: current.color === '#ffff00' ? '#b7a800' : current.color,
            }}>
              {current.label}
            </span>
          </div>
        </div>
      </div>

      {/* PM2.5 and PM10 */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>
            PM2.5 : {station.pollutants.pm25?.toFixed(1)} µg/m³
          </span>
        </div>
        <div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>
            PM10 : {station.pollutants.pm10?.toFixed(1)} µg/m³
          </span>
        </div>
      </div>

      {/* Gradient bar with moving person */}
      <div style={{ marginBottom: '8px', position: 'relative' }}>

        {/* Person above the bar */}
        <div style={{
          position: 'relative',
          height: '80px',
          marginBottom: '4px',
        }}>
          <div style={{
            position: 'absolute',
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            bottom: '0',
            textAlign: 'center',
            transition: 'left 0.8s ease',
          }}>
            {/* Speech bubble */}
            <div style={{
              background: current.color === '#ffff00' ? '#fffde7' : `${current.color}22`,
              border: `1px solid ${current.color}`,
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: '600',
              color: current.color === '#ffff00' ? '#b7a800' : current.color,
              marginBottom: '4px',
              whiteSpace: 'nowrap',
            }}>
              {current.label}
            </div>

            {/* Person emoji based on AQI level */}
            <div style={{
              fontSize: '36px',
              lineHeight: 1,
              filter: percentage > 60 ? 'grayscale(0.3)' : 'none',
            }}>
              {station.aqi <= 50  ? '😊' :
               station.aqi <= 100 ? '🙂' :
               station.aqi <= 150 ? '😐' :
               station.aqi <= 200 ? '😷' :
               station.aqi <= 300 ? '🤢' : '☠️'}
            </div>

            {/* Line from person to bar */}
            <div style={{
              width: '2px',
              height: '8px',
              background: current.color === '#ffff00' ? '#b7a800' : current.color,
              margin: '0 auto',
            }} />
          </div>
        </div>

        {/* Gradient bar */}
        <div style={{
          height: '14px',
          borderRadius: '7px',
          background: gradientBar,
          position: 'relative',
          marginBottom: '6px',
        }}>
          {/* Indicator dot */}
          <div style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            border: `3px solid ${current.color === '#ffff00' ? '#b7a800' : current.color}`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'left 0.8s ease',
          }} />
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {levels.map(l => (
            <span key={l.label} style={{
              fontSize: '10px',
              color: l.label === current.label ? '#2d3748' : '#999',
              fontWeight: l.label === current.label ? '700' : '400',
            }}>
              {l.label}
            </span>
          ))}
        </div>

        {/* Scale numbers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          {[0, 50, 100, 150, 200, 300, '301+'].map(n => (
            <span key={n} style={{ fontSize: '10px', color: '#bbb' }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Health advice */}
      <div style={{
        background: `${current.color}15`,
        borderRadius: '8px',
        padding: '10px 14px',
        marginTop: '12px',
        borderLeft: `4px solid ${current.color}`,
      }}>
        <p style={{ fontSize: '13px', color: '#444', margin: 0, lineHeight: '1.5' }}>
          💡 {station.advice}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export default AQICard;