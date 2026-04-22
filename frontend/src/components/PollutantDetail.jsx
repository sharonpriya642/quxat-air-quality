function PollutantDetail({ pollutant, value, onClose }) {
  const details = {
    pm25: {
      name: 'Particulate Matter (PM₂.₅)',
      unit: 'µg/m³',
      who: 15,
      levels: [
        { label: 'Good',      min: 0,    max: 12,   color: '#00e400' },
        { label: 'Moderate',  min: 12.1, max: 35.4, color: '#b7a800' },
        { label: 'Poor',      min: 35.5, max: 55.4, color: '#ff7e00' },
        { label: 'Unhealthy', min: 55.5, max: 150,  color: '#ff0000' },
        { label: 'Severe',    min: 150,  max: 250,  color: '#8f3f97' },
        { label: 'Hazardous', min: 250,  max: 500,  color: '#7e0023' },
      ],
      description: 'Fine particles smaller than 2.5 micrometers that penetrate deep into lungs and bloodstream.',
      sources: [
        { icon: '🏗️', title: 'Windblown Dust',           desc: 'Daily activities like construction or other practices' },
        { icon: '🏠', title: 'Home-related emission',     desc: 'Household activities such as cooking and heating' },
        { icon: '🏭', title: 'Factories and industries',  desc: 'Regular operations in factories and industries' },
        { icon: '⚡', title: 'Power plants generation',   desc: 'Emission from routine energy production in power plants' },
        { icon: '🔥', title: 'Landfill fires',            desc: 'Fires in landfills, often caused by waste mismanagement' },
        { icon: '🚛', title: 'Transportation emission',   desc: 'Diesel operated daily vehicles produce exhaust' },
        { icon: '🌾', title: 'Human-caused emissions',    desc: 'Common practices like open burning of waste or agricultural residues' },
      ],
      impacts: [
        { icon: '👁️', title: 'Irritation in Eyes',    desc: 'Redness, itching, and discomfort in your eyes' },
        { icon: '🤕', title: 'Headaches',              desc: 'Frequent or intense headaches' },
        { icon: '😴', title: 'Fatigue',                desc: 'Feeling unusually tired or weak' },
        { icon: '😮‍💨', title: 'Aggravated asthma',   desc: 'Increased asthma attacks and symptoms' },
        { icon: '😷', title: 'Breathing problems',     desc: 'Coughing, wheezing, and shortness of breath' },
        { icon: '❤️', title: 'Cardiovascular effects', desc: 'Increased risk of heart disease with long-term exposure' },
      ],
    },
    pm10: {
      name: 'Particulate Matter (PM₁₀)',
      unit: 'µg/m³',
      who: 45,
      levels: [
        { label: 'Good',      min: 0,   max: 54,  color: '#00e400' },
        { label: 'Moderate',  min: 55,  max: 154, color: '#b7a800' },
        { label: 'Poor',      min: 155, max: 254, color: '#ff7e00' },
        { label: 'Unhealthy', min: 255, max: 354, color: '#ff0000' },
        { label: 'Severe',    min: 355, max: 424, color: '#8f3f97' },
        { label: 'Hazardous', min: 425, max: 604, color: '#7e0023' },
      ],
      description: 'Coarse particles up to 10 micrometers from dust, pollen, and mould that affect the nose and throat.',
      sources: [
        { icon: '🏗️', title: 'Construction dust',       desc: 'Dust from construction and demolition activities' },
        { icon: '🛣️', title: 'Road dust',               desc: 'Dust resuspended from roads by vehicles' },
        { icon: '🌾', title: 'Agricultural activities', desc: 'Dust from farming, harvesting and tilling' },
        { icon: '🏭', title: 'Industrial processes',    desc: 'Crushing, grinding and processing of materials' },
        { icon: '🌬️', title: 'Natural dust',            desc: 'Wind-blown soil and sand particles' },
        { icon: '🔥', title: 'Biomass burning',         desc: 'Burning of wood, crop residues and waste' },
      ],
      impacts: [
        { icon: '👃', title: 'Nasal irritation',       desc: 'Runny nose, sneezing and nasal congestion' },
        { icon: '😷', title: 'Throat irritation',      desc: 'Soreness and irritation in the throat' },
        { icon: '🫁', title: 'Lung irritation',        desc: 'Coughing and difficulty breathing' },
        { icon: '😮‍💨', title: 'Aggravated asthma',   desc: 'Worsening of asthma and bronchitis' },
        { icon: '👁️', title: 'Eye irritation',         desc: 'Redness and watering of eyes' },
        { icon: '🤧', title: 'Allergic reactions',     desc: 'Allergic rhinitis and sinusitis' },
      ],
    },
    o3: {
      name: 'Ozone (O₃)',
      unit: 'µg/m³',
      who: 100,
      levels: [
        { label: 'Good',      min: 0,   max: 54,  color: '#00e400' },
        { label: 'Moderate',  min: 55,  max: 70,  color: '#b7a800' },
        { label: 'Poor',      min: 71,  max: 85,  color: '#ff7e00' },
        { label: 'Unhealthy', min: 86,  max: 105, color: '#ff0000' },
        { label: 'Severe',    min: 106, max: 200, color: '#8f3f97' },
        { label: 'Hazardous', min: 201, max: 500, color: '#7e0023' },
      ],
      description: 'Ground-level ozone formed by sunlight reacting with vehicle exhaust and industrial emissions.',
      sources: [
        { icon: '🚗', title: 'Vehicle emissions',       desc: 'Nitrogen oxides from cars and trucks react with sunlight' },
        { icon: '🏭', title: 'Industrial emissions',    desc: 'VOCs released by factories and chemical plants' },
        { icon: '⛽', title: 'Fuel evaporation',        desc: 'Evaporation of petrol and solvents' },
        { icon: '☀️', title: 'Sunlight reaction',       desc: 'UV radiation triggers chemical reactions in the atmosphere' },
        { icon: '🖨️', title: 'Consumer products',      desc: 'Paints, cleaning products and aerosols' },
      ],
      impacts: [
        { icon: '🫁', title: 'Lung damage',             desc: 'Long-term exposure can permanently damage lung tissue' },
        { icon: '😷', title: 'Breathing difficulty',    desc: 'Shortness of breath and chest pain' },
        { icon: '😮‍💨', title: 'Aggravated asthma',   desc: 'Triggers asthma attacks especially in children' },
        { icon: '🤧', title: 'Airway inflammation',     desc: 'Inflammation of airways and throat' },
        { icon: '🏃', title: 'Reduced lung function',  desc: 'Decreased ability to exercise or do physical work' },
        { icon: '👁️', title: 'Eye irritation',         desc: 'Watering and irritation of eyes' },
      ],
    },
    no2: {
      name: 'Nitrogen Dioxide (NO₂)',
      unit: 'µg/m³',
      who: 25,
      levels: [
        { label: 'Good',      min: 0,   max: 53,  color: '#00e400' },
        { label: 'Moderate',  min: 54,  max: 100, color: '#b7a800' },
        { label: 'Poor',      min: 101, max: 360, color: '#ff7e00' },
        { label: 'Unhealthy', min: 361, max: 649, color: '#ff0000' },
        { label: 'Severe',    min: 650, max: 1249, color: '#8f3f97' },
        { label: 'Hazardous', min: 1250, max: 2049, color: '#7e0023' },
      ],
      description: 'A reddish-brown gas from burning fossil fuels that contributes to smog and acid rain.',
      sources: [
        { icon: '🚗', title: 'Vehicle exhaust',         desc: 'Cars, trucks and buses burning petrol and diesel' },
        { icon: '⚡', title: 'Power stations',          desc: 'Coal and gas fired power plants' },
        { icon: '🏭', title: 'Industrial boilers',      desc: 'Industrial combustion processes' },
        { icon: '✈️', title: 'Aviation',                desc: 'Aircraft engines during takeoff and landing' },
        { icon: '🚢', title: 'Shipping',                desc: 'Large vessels burning heavy fuel oil' },
      ],
      impacts: [
        { icon: '🫁', title: 'Respiratory infections',  desc: 'Increased susceptibility to lung infections' },
        { icon: '😮‍💨', title: 'Asthma',              desc: 'Triggers and worsens asthma symptoms' },
        { icon: '🤧', title: 'Airway inflammation',     desc: 'Swelling and irritation of the airways' },
        { icon: '👶', title: 'Child development',       desc: 'Affects lung development in children' },
        { icon: '❤️', title: 'Cardiovascular risk',    desc: 'Linked to increased risk of heart disease' },
        { icon: '🧠', title: 'Cognitive effects',       desc: 'Long-term exposure may affect brain function' },
      ],
    },
    so2: {
      name: 'Sulphur Dioxide (SO₂)',
      unit: 'µg/m³',
      who: 40,
      levels: [
        { label: 'Good',      min: 0,   max: 35,  color: '#00e400' },
        { label: 'Moderate',  min: 36,  max: 75,  color: '#b7a800' },
        { label: 'Poor',      min: 76,  max: 185, color: '#ff7e00' },
        { label: 'Unhealthy', min: 186, max: 304, color: '#ff0000' },
        { label: 'Severe',    min: 305, max: 604, color: '#8f3f97' },
        { label: 'Hazardous', min: 605, max: 1004, color: '#7e0023' },
      ],
      description: 'A toxic gas released by burning fossil fuels containing sulphur, especially coal and oil.',
      sources: [
        { icon: '⚡', title: 'Power plants',             desc: 'Coal-burning power stations are the largest source' },
        { icon: '🏭', title: 'Metal smelting',           desc: 'Processing of copper, zinc and lead ores' },
        { icon: '🛢️', title: 'Oil refineries',          desc: 'Refining of crude oil releases sulphur compounds' },
        { icon: '🚢', title: 'Shipping',                 desc: 'Large ships burning high-sulphur fuel oil' },
        { icon: '🌋', title: 'Volcanic activity',        desc: 'Natural volcanic eruptions release large amounts' },
      ],
      impacts: [
        { icon: '😷', title: 'Breathing difficulty',    desc: 'Immediate irritation to nose and throat' },
        { icon: '🫁', title: 'Lung damage',             desc: 'Long-term exposure damages lung tissue' },
        { icon: '😮‍💨', title: 'Asthma attacks',       desc: 'Even low levels can trigger severe asthma' },
        { icon: '👁️', title: 'Eye irritation',         desc: 'Burning and watering of eyes' },
        { icon: '🤧', title: 'Acid rain effects',       desc: 'Contributes to acid rain harming ecosystems' },
        { icon: '❤️', title: 'Cardiovascular risk',    desc: 'Associated with increased heart disease risk' },
      ],
    },
    co: {
      name: 'Carbon Monoxide (CO)',
      unit: 'µg/m³',
      who: 4000,
      levels: [
        { label: 'Good',      min: 0,    max: 4400,  color: '#00e400' },
        { label: 'Moderate',  min: 4401, max: 9400,  color: '#b7a800' },
        { label: 'Poor',      min: 9401, max: 12400, color: '#ff7e00' },
        { label: 'Unhealthy', min: 12401, max: 15400, color: '#ff0000' },
        { label: 'Severe',    min: 15401, max: 30400, color: '#8f3f97' },
        { label: 'Hazardous', min: 30401, max: 50000, color: '#7e0023' },
      ],
      description: 'A colourless, odourless gas from incomplete combustion that prevents blood from carrying oxygen.',
      sources: [
        { icon: '🚗', title: 'Vehicle exhaust',         desc: 'Petrol and diesel engines are the main source' },
        { icon: '🏠', title: 'Home heating',            desc: 'Gas boilers, fireplaces and wood stoves' },
        { icon: '🏭', title: 'Industrial processes',    desc: 'Steel production and chemical manufacturing' },
        { icon: '🔥', title: 'Open burning',            desc: 'Burning of agricultural waste and forest fires' },
        { icon: '🚬', title: 'Cigarette smoke',         desc: 'Tobacco smoking is a significant indoor source' },
      ],
      impacts: [
        { icon: '🤕', title: 'Headaches',               desc: 'One of the first symptoms of CO poisoning' },
        { icon: '😴', title: 'Dizziness',               desc: 'Feeling lightheaded and confused' },
        { icon: '🤢', title: 'Nausea',                  desc: 'Feeling sick, especially indoors' },
        { icon: '😵', title: 'Loss of consciousness',   desc: 'High levels can cause unconsciousness' },
        { icon: '❤️', title: 'Heart strain',            desc: 'Forces the heart to work harder' },
        { icon: '☠️', title: 'Fatal at high levels',    desc: 'CO poisoning can be fatal without warning' },
      ],
    },
  };

  const info = details[pollutant];
  if (!info) return null;

  const getLevel = (val) => {
    return info.levels.find(l => val >= l.min && val <= l.max) || info.levels[info.levels.length - 1];
  };

  const current = getLevel(value);
  const maxVal = info.levels[info.levels.length - 1].max;
  const percentage = Math.min((value / maxVal) * 100, 100);
  const whoRatio = (value / info.who).toFixed(1);

  const gradientBar = 'linear-gradient(to right, #00e400 0%, #ffff00 20%, #ff7e00 40%, #ff0000 60%, #8f3f97 80%, #7e0023 100%)';

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff0000', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: '12px', color: '#e53e3e', fontWeight: '600' }}>LIVE</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a365d', marginBottom: '4px' }}>
              {info.name}
            </h2>
            <p style={{ fontSize: '13px', color: '#888' }}>Andhra Pradesh, India</p>
          </div>
          <button onClick={onClose} style={{
            background: '#f7fafc', border: '1px solid #e2e8f0',
            borderRadius: '8px', padding: '6px 12px',
            fontSize: '13px', cursor: 'pointer', color: '#555',
          }}>✕ Close</button>
        </div>

        {/* Live level card */}
        <div style={{
          background: `linear-gradient(135deg, ${current.color}22, ${current.color}44)`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: `1px solid ${current.color}55`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Current Level</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '52px', fontWeight: '800', color: current.color === '#b7a800' ? '#b7a800' : current.color, lineHeight: 1 }}>
                  {value?.toFixed(1)}
                </span>
                <span style={{ fontSize: '14px', color: '#888' }}>{info.unit}</span>
              </div>
            </div>
            <div style={{
              background: current.color === '#b7a800' ? '#fffde7' : `${current.color}22`,
              border: `2px solid ${current.color}`,
              borderRadius: '10px',
              padding: '10px 20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '18px', fontWeight: '700', color: current.color === '#b7a800' ? '#b7a800' : current.color, margin: 0 }}>
                {current.label}
              </p>
            </div>
          </div>

          {/* Gradient bar */}
          <div style={{ height: '12px', borderRadius: '6px', background: gradientBar, position: 'relative', marginBottom: '6px' }}>
            <div style={{
              position: 'absolute',
              left: `${percentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#fff',
              border: `3px solid ${current.color}`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {info.levels.map(l => (
              <span key={l.label} style={{ fontSize: '10px', color: l.label === current.label ? '#2d3748' : '#999', fontWeight: l.label === current.label ? '700' : '400' }}>
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* WHO comparison */}
        <div style={{
          background: whoRatio > 1 ? '#fff5f5' : '#f0fff4',
          border: `1px solid ${whoRatio > 1 ? '#feb2b2' : '#9ae6b4'}`,
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            background: whoRatio > 1 ? '#e53e3e' : '#38a169',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 12px',
            fontWeight: '700',
            fontSize: '16px',
            textAlign: 'center',
            minWidth: '60px',
          }}>
            {whoRatio}x<br />
            <span style={{ fontSize: '11px', fontWeight: '400' }}>{whoRatio > 1 ? 'Above' : 'Below'}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#444', margin: 0, lineHeight: '1.6' }}>
            The current {info.name} level is <strong>{whoRatio}x {whoRatio > 1 ? 'above' : 'below'}</strong> the recommended WHO guideline of <span style={{ color: '#2b6cb0', fontWeight: '600' }}>{info.who} {info.unit}</span>.
          </p>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.7', marginBottom: '20px', padding: '12px 16px', background: '#f7fafc', borderRadius: '8px' }}>
          ℹ️ {info.description}
        </p>

        {/* Sources */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1a365d', marginBottom: '12px' }}>
            🏭 Sources of {info.name}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {info.sources.map((s, i) => (
              <div key={i} style={{
                background: '#2d3748',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>{s.title}</p>
                  <p style={{ fontSize: '12px', color: '#a0aec0', margin: 0, lineHeight: '1.4' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health impacts */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#1a365d', marginBottom: '12px' }}>
            🏥 Short-Term Health Impacts
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {info.impacts.map((impact, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <span style={{ fontSize: '24px' }}>{impact.icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '2px' }}>{impact.title}</p>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: '1.4' }}>{impact.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>
    </div>
  );
}

export default PollutantDetail;