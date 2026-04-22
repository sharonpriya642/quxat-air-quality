function AQIScale() {
  const levels = [
    {
      category: 'Good',
      range: '0 to 50',
      color: '#00e400',
      bg: '#f0fff4',
      description: 'The air is fresh and free from toxins. Enjoy outdoor activities without any health concerns.',
      icon: '😊',
    },
    {
      category: 'Moderate',
      range: '51 to 100',
      color: '#ffff00',
      bg: '#fffff0',
      description: 'Air quality is acceptable for most, but sensitive individuals might experience mild discomfort.',
      icon: '🙂',
    },
    {
      category: 'Unhealthy for Sensitive Groups',
      range: '101 to 150',
      color: '#ff7e00',
      bg: '#fffaf0',
      description: 'Breathing may become slightly uncomfortable, especially for those with respiratory issues.',
      icon: '😐',
    },
    {
      category: 'Unhealthy',
      range: '151 to 200',
      color: '#ff0000',
      bg: '#fff5f5',
      description: 'This air quality is particularly risky for children, pregnant women, and the elderly. Limit outdoor activities.',
      icon: '😷',
    },
    {
      category: 'Very Unhealthy',
      range: '201 to 300',
      color: '#8f3f97',
      bg: '#faf5ff',
      description: 'Prolonged exposure can cause chronic health issues or organ damage. Avoid outdoor activities.',
      icon: '🤢',
    },
    {
      category: 'Hazardous',
      range: '301+',
      color: '#7e0023',
      bg: '#fff5f5',
      description: 'Dangerously high pollution levels. Life-threatening health risks. Stay indoors immediately.',
      icon: '☠️',
    },
  ];

  const pollutants = [
    { name: 'PM2.5', who: '5', india: '15', unit: 'µg/m³', desc: 'Fine particles that penetrate deep into lungs' },
    { name: 'PM10',  who: '15', india: '60', unit: 'µg/m³', desc: 'Coarse particles affecting breathing' },
    { name: 'O₃',   who: '60', india: '100', unit: 'µg/m³', desc: 'Ground-level ozone causing respiratory irritation' },
    { name: 'NO₂',  who: '10', india: '40', unit: 'µg/m³', desc: 'Nitrogen dioxide from vehicle emissions' },
    { name: 'SO₂',  who: '15', india: '50', unit: 'µg/m³', desc: 'Sulphur dioxide from industrial sources' },
    { name: 'CO',   who: '4000', india: '2000', unit: 'µg/m³', desc: 'Carbon monoxide from combustion' },
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
        📊 Air Quality Index Scale
      </h3>
      <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
        Standard AQI categories and health implications
      </p>

      {/* AQI Level rows */}
      {levels.map((level, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '14px 16px',
          background: level.bg,
          borderRadius: '10px',
          marginBottom: '8px',
          borderLeft: `5px solid ${level.color}`,
        }}>
          {/* Color dot */}
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: level.color,
            flexShrink: 0,
            border: level.color === '#ffff00' ? '1px solid #e0c800' : 'none',
          }} />

          {/* Category + range */}
          <div style={{ minWidth: '220px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', margin: 0 }}>
              {level.category}
            </p>
            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
              ({level.range})
            </p>
          </div>

          {/* Description */}
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5', flex: 1, margin: 0 }}>
            {level.description}
          </p>

          {/* Icon */}
          <span style={{ fontSize: '28px', flexShrink: 0 }}>{level.icon}</span>
        </div>
      ))}

      {/* WHO vs India limits table */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
          🌍 WHO vs India Safe Limits Comparison
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f7fafc' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#555', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Pollutant</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#555', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Description</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#0f6e56', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>WHO Limit</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', color: '#185fa5', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>India NAAQS Limit</th>
              </tr>
            </thead>
            <tbody>
              {pollutants.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f7fafc' }}>
                  <td style={{ padding: '10px 14px', fontWeight: '600', color: '#2d3748', borderBottom: '1px solid #e2e8f0' }}>
                    {p.name}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#666', borderBottom: '1px solid #e2e8f0' }}>
                    {p.desc}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{
                      background: '#e1f5ee',
                      color: '#0f6e56',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '12px',
                    }}>
                      {p.who} {p.unit}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{
                      background: '#e6f1fb',
                      color: '#185fa5',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '12px',
                    }}>
                      {p.india} {p.unit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
          NAAQS = National Ambient Air Quality Standards · WHO = World Health Organization guidelines 2021
        </p>
      </div>
    </div>
  );
}

export default AQIScale;