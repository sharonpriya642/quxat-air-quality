import { useState } from 'react';
import PollutantDetail from './PollutantDetail';

function PollutantCard({ pollutants }) {
  const [selected, setSelected] = useState(null);

  const items = [
    { key: 'pm25', label: 'PM₂.₅', unit: 'µg/m³', safe: 12 },
    { key: 'pm10', label: 'PM₁₀',  unit: 'µg/m³', safe: 54 },
    { key: 'o3',   label: 'O₃',    unit: 'µg/m³', safe: 70 },
    { key: 'no2',  label: 'NO₂',   unit: 'µg/m³', safe: 53 },
    { key: 'so2',  label: 'SO₂',   unit: 'µg/m³', safe: 35 },
    { key: 'co',   label: 'CO',    unit: 'µg/m³', safe: 4400 },
  ];

  return (
    <>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
          Pollutant Breakdown
        </h3>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
          Click on any pollutant to see detailed information
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {items.map(item => {
            const value = pollutants[item.key];
            const isHigh = value > item.safe;
            return (
              <div
                key={item.key}
                onClick={() => setSelected({ key: item.key, value })}
                style={{
                  background: isHigh ? '#fff5f5' : '#f0fdf4',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: `1px solid ${isHigh ? '#feb2b2' : '#9ae6b4'}`,
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: '500' }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: isHigh ? '#e53e3e' : '#38a169',
                  marginBottom: '4px',
                }}>
                  {value?.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>{item.unit}</div>
                <div style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  background: isHigh ? '#e53e3e' : '#38a169',
                  color: '#fff',
                  fontWeight: '500',
                }}>
                  {isHigh ? '⚠️ High' : '✓ Safe'}
                </div>
                <div style={{ fontSize: '10px', color: '#aaa', marginTop: '6px' }}>
                  Click for details
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <PollutantDetail
          pollutant={selected.key}
          value={selected.value}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

export default PollutantCard;