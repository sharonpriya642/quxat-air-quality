const SOURCES = [
  {
    name: 'Vehicle Traffic',
    emoji: '🚗',
    color: '#e53e3e',
    bg: '#fff5f5',
    indicators: { no2: 0.4, co: 0.35, pm25: 0.15, pm10: 0.1 },
    description: 'High NO₂ and CO levels suggest heavy vehicle emissions.',
  },
  {
    name: 'Industrial Emissions',
    emoji: '🏭',
    color: '#8f3f97',
    bg: '#faf5ff',
    indicators: { so2: 0.45, no2: 0.25, pm25: 0.2, pm10: 0.1 },
    description: 'Elevated SO₂ points to industrial or power plant activity.',
  },
  {
    name: 'Dust / Construction',
    emoji: '🏗️',
    color: '#b7791f',
    bg: '#fffaf0',
    indicators: { pm10: 0.55, pm25: 0.3, no2: 0.1, so2: 0.05 },
    description: 'Dominant PM10 levels indicate dust from roads or construction.',
  },
  {
    name: 'Crop / Biomass Burning',
    emoji: '🔥',
    color: '#dd6b20',
    bg: '#fff5e6',
    indicators: { pm25: 0.5, co: 0.3, pm10: 0.15, so2: 0.05 },
    description: 'High PM2.5 and CO are signatures of biomass or crop burning.',
  },
  {
    name: 'Secondary Pollution',
    emoji: '🌫️',
    color: '#718096',
    bg: '#f7fafc',
    indicators: { o3: 0.5, no2: 0.3, pm25: 0.15, co: 0.05 },
    description: 'Elevated O₃ and NO₂ suggest photochemical smog formation.',
  },
];

const classifySource = (pollutants) => {
  const { pm25 = 0, pm10 = 0, o3 = 0, no2 = 0, so2 = 0, co = 0 } = pollutants;

  // Normalise each pollutant to 0-1 scale
  const norm = {
    pm25: Math.min(pm25 / 75,  1),
    pm10: Math.min(pm10 / 150, 1),
    o3:   Math.min(o3   / 100, 1),
    no2:  Math.min(no2  / 100, 1),
    so2:  Math.min(so2  / 75,  1),
    co:   Math.min(co   / 10000, 1),
  };

  // Score each source
  const scores = SOURCES.map(source => {
    const score = Object.entries(source.indicators).reduce((sum, [key, weight]) => {
      return sum + (norm[key] || 0) * weight;
    }, 0);
    return { ...source, score: Math.round(score * 100) };
  });

  return scores.sort((a, b) => b.score - a.score);
};

export default function PollutionSourceClassifier({ selected }) {
  if (!selected) return null;

  const results = classifySource(selected.pollutants);
  const top = results[0];
  const { pm25, pm10, o3, no2, so2, co } = selected.pollutants;

  const pollutantItems = [
    { label: 'PM2.5', value: pm25?.toFixed(1), safe: 12,   unit: 'µg/m³', color: '#e53e3e' },
    { label: 'PM10',  value: pm10?.toFixed(1), safe: 54,   unit: 'µg/m³', color: '#dd6b20' },
    { label: 'O₃',   value: o3?.toFixed(1),   safe: 70,   unit: 'µg/m³', color: '#718096' },
    { label: 'NO₂',  value: no2?.toFixed(1),  safe: 53,   unit: 'µg/m³', color: '#e53e3e' },
    { label: 'SO₂',  value: so2?.toFixed(1),  safe: 35,   unit: 'µg/m³', color: '#8f3f97' },
    { label: 'CO',   value: co?.toFixed(1),   safe: 4400, unit: 'µg/m³', color: '#b7791f' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
        🔬 Pollution Source Classifier
      </h3>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        Identifies likely pollution sources based on pollutant composition at <strong>{selected.station}</strong>
      </p>

      {/* Top source */}
      <div style={{
        background: top.bg, border: `2px solid ${top.color}`,
        borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <span style={{ fontSize: '48px' }}>{top.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Primary Pollution Source</p>
          <p style={{ fontSize: '20px', fontWeight: '800', color: top.color, marginBottom: '4px' }}>{top.name}</p>
          <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{top.description}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Confidence</p>
          <p style={{ fontSize: '36px', fontWeight: '800', color: top.color, margin: 0 }}>{top.score}%</p>
        </div>
      </div>

      {/* All sources ranked */}
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '10px' }}>
        Source Ranking:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {results.map((source, i) => (
          <div key={source.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', width: '24px' }}>{source.emoji}</span>
            <span style={{ fontSize: '13px', width: '160px', color: '#444' }}>
              {i === 0 && <strong>{source.name}</strong>}
              {i !== 0 && source.name}
            </span>
            <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '4px', height: '8px' }}>
              <div style={{
                width: `${source.score}%`, height: '100%',
                borderRadius: '4px', background: source.color,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: source.color, width: '36px', textAlign: 'right' }}>
              {source.score}%
            </span>
          </div>
        ))}
      </div>

      {/* Pollutant breakdown */}
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '10px' }}>
        Pollutant Levels:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {pollutantItems.map(p => {
          const isHigh = parseFloat(p.value) > p.safe;
          return (
            <div key={p.label} style={{
              background: isHigh ? '#fff5f5' : '#f0fdf4',
              borderRadius: '8px', padding: '10px', textAlign: 'center',
              border: `1px solid ${isHigh ? '#fed7d7' : '#c6f6d5'}`,
            }}>
              <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{p.label}</p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: isHigh ? '#e53e3e' : '#38a169', margin: '2px 0' }}>
                {p.value}
              </p>
              <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>{p.unit}</p>
              {isHigh && <p style={{ fontSize: '10px', color: '#e53e3e', margin: '2px 0 0', fontWeight: '600' }}>Above safe</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}