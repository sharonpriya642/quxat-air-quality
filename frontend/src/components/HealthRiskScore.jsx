import { useState } from 'react';

const CONDITIONS = [
  'None',
  'Asthma',
  'Heart Disease',
  'Diabetes',
  'Lung Disease',
  'Pregnant',
  'Elderly (60+)',
];

const getAQILevel = (aqi) => {
  if (aqi <= 50)  return { label: 'Good',           color: '#00e400', bg: '#f0fff4' };
  if (aqi <= 100) return { label: 'Moderate',        color: '#b7a800', bg: '#fffff0' };
  if (aqi <= 150) return { label: 'Poor',            color: '#ff7e00', bg: '#fff5e6' };
  if (aqi <= 200) return { label: 'Unhealthy',       color: '#ff0000', bg: '#fff5f5' };
  if (aqi <= 300) return { label: 'Very Unhealthy',  color: '#8f3f97', bg: '#faf5ff' };
  return              { label: 'Hazardous',          color: '#7e0023', bg: '#fff5f5' };
};

const calculateRiskScore = (aqi, age, conditions) => {
  // Base score from AQI (0-60 points)
  let base = 0;
  if (aqi <= 50)       base = 5;
  else if (aqi <= 100) base = 20;
  else if (aqi <= 150) base = 35;
  else if (aqi <= 200) base = 50;
  else if (aqi <= 300) base = 70;
  else                 base = 90;

  // Age multiplier
  let ageMult = 1.0;
  if (age < 5)        ageMult = 1.8;
  else if (age < 12)  ageMult = 1.4;
  else if (age < 18)  ageMult = 1.1;
  else if (age < 60)  ageMult = 1.0;
  else                ageMult = 1.6;

  // Condition multiplier
  let condMult = 1.0;
  if (conditions.includes('Asthma'))       condMult += 0.5;
  if (conditions.includes('Heart Disease')) condMult += 0.6;
  if (conditions.includes('Lung Disease')) condMult += 0.6;
  if (conditions.includes('Diabetes'))     condMult += 0.3;
  if (conditions.includes('Pregnant'))     condMult += 0.4;
  if (conditions.includes('Elderly (60+)')) condMult += 0.5;

  const score = Math.min(Math.round(base * ageMult * condMult), 100);
  return score;
};

const getRiskLevel = (score) => {
  if (score <= 20)  return { label: 'Low Risk',         color: '#00e400', bg: '#f0fff4', emoji: '😊' };
  if (score <= 40)  return { label: 'Moderate Risk',    color: '#b7a800', bg: '#fffff0', emoji: '😐' };
  if (score <= 60)  return { label: 'High Risk',        color: '#ff7e00', bg: '#fff5e6', emoji: '😟' };
  if (score <= 80)  return { label: 'Very High Risk',   color: '#ff0000', bg: '#fff5f5', emoji: '😨' };
  return                   { label: 'Extreme Risk',     color: '#7e0023', bg: '#fff5f5', emoji: '🚨' };
};

const getRecommendations = (score, conditions) => {
  const recs = [];
  if (score <= 20) {
    recs.push('✅ Air quality is safe for you today.');
    recs.push('✅ Outdoor activities are fine.');
    recs.push('✅ No special precautions needed.');
  } else if (score <= 40) {
    recs.push('⚠️ Consider reducing prolonged outdoor activity.');
    recs.push('⚠️ Keep windows closed during peak hours.');
    recs.push('⚠️ Stay hydrated throughout the day.');
  } else if (score <= 60) {
    recs.push('🚫 Limit outdoor exposure to under 30 minutes.');
    recs.push('😷 Wear an N95 mask if going outside.');
    recs.push('🏠 Keep indoor air clean using a purifier.');
    if (conditions.includes('Asthma')) recs.push('💊 Keep your inhaler accessible.');
  } else if (score <= 80) {
    recs.push('🚫 Avoid all non-essential outdoor activities.');
    recs.push('😷 Wear N95 mask if you must go outside.');
    recs.push('🏠 Stay indoors with windows and doors sealed.');
    recs.push('💊 Take prescribed medications as scheduled.');
    if (conditions.includes('Heart Disease')) recs.push('❤️ Monitor heart rate and blood pressure closely.');
  } else {
    recs.push('🚨 Do NOT go outside under any circumstances.');
    recs.push('🏥 Have emergency contacts ready.');
    recs.push('😷 Even indoors, consider wearing a mask.');
    recs.push('💊 Follow all prescribed medication schedules strictly.');
    recs.push('📞 Consult your doctor if you feel any discomfort.');
  }
  return recs;
};

export default function HealthRiskScore({ selected }) {
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState([]);
  const [result, setResult] = useState(null);

  const toggleCondition = (c) => {
    if (c === 'None') { setConditions([]); return; }
    setConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev.filter(x => x !== 'None'), c]
    );
  };

  const calculate = () => {
    if (!age || !selected) return;
    const score = calculateRiskScore(selected.aqi, parseInt(age), conditions);
    setResult(score);
  };

  const risk = result !== null ? getRiskLevel(result) : null;
  const aqiLevel = selected ? getAQILevel(selected.aqi) : null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
        🏥 Personal Health Risk Score
      </h3>
      <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        Get a personalised AQI health risk score based on your age and health conditions
      </p>

      {/* Current AQI info */}
      {selected && (
        <div style={{
          background: aqiLevel.bg,
          border: `1px solid ${aqiLevel.color}`,
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '13px', color: '#555' }}>Current AQI at <strong>{selected.station}</strong>:</span>
          <span style={{ fontSize: '20px', fontWeight: '800', color: aqiLevel.color }}>{selected.aqi}</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: aqiLevel.color }}>{aqiLevel.label}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
        {/* Age input */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '8px' }}>
            👤 Your Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="e.g. 25"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Health conditions */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '8px' }}>
            🩺 Health Conditions (select all that apply)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CONDITIONS.map(c => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #3182ce',
                  background: conditions.includes(c) || (c === 'None' && conditions.length === 0)
                    ? '#3182ce' : 'transparent',
                  color: conditions.includes(c) || (c === 'None' && conditions.length === 0)
                    ? '#fff' : '#3182ce',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <button
        onClick={calculate}
        disabled={!age || !selected}
        style={{
          padding: '10px 28px',
          borderRadius: '8px',
          border: 'none',
          background: !age || !selected ? '#e2e8f0' : '#2b6cb0',
          color: !age || !selected ? '#999' : '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: !age || !selected ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}>
        Calculate My Risk Score
      </button>

      {/* Result */}
      {result !== null && risk && (
        <div style={{
          background: risk.bg,
          border: `2px solid ${risk.color}`,
          borderRadius: '12px',
          padding: '20px',
        }}>
          {/* Score display */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Your Personal Risk Score</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '64px', fontWeight: '800', color: risk.color, lineHeight: 1 }}>
                  {result}
                </span>
                <span style={{ fontSize: '18px', color: '#999' }}>/100</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>{risk.emoji}</div>
              <div style={{
                background: '#fff',
                border: `2px solid ${risk.color}`,
                borderRadius: '10px',
                padding: '8px 16px',
                marginTop: '6px',
              }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: risk.color }}>
                  {risk.label}
                </span>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(to right, #00e400, #ffff00, #ff7e00, #ff0000, #7e0023)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: `${result}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '18px', height: '18px',
                borderRadius: '50%',
                background: '#fff',
                border: `3px solid ${risk.color}`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Low', 'Moderate', 'High', 'Very High', 'Extreme'].map(l => (
                <span key={l} style={{ fontSize: '10px', color: '#aaa' }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '14px 16px',
            borderLeft: `4px solid ${risk.color}`,
          }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>
              📋 Personalised Recommendations:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {getRecommendations(result, conditions).map((r, i) => (
                <p key={i} style={{ fontSize: '13px', color: '#555', margin: 0 }}>{r}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}