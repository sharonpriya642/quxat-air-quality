import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ stations }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        🗺️ Andhra Pradesh AQI Map
      </h3>
      <MapContainer
        center={[15.9129, 79.7400]}
        zoom={7}
        style={{ height: '420px', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {stations.map(station => (
          <CircleMarker
            key={station.station}
            center={[station.lat, station.lon]}
            radius={18}
            fillColor={station.color}
            color="#fff"
            weight={2}
            fillOpacity={0.85}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif', minWidth: '160px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {station.station}
                </p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: station.color, margin: '4px 0' }}>
                  {station.aqi}
                </p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                  {station.category}
                </p>
                <p style={{ fontSize: '12px', color: '#444', marginBottom: '2px' }}>
                  PM2.5: {station.pollutants.pm25?.toFixed(1)} µg/m³
                </p>
                <p style={{ fontSize: '12px', color: '#444', marginBottom: '2px' }}>
                  PM10: {station.pollutants.pm10?.toFixed(1)} µg/m³
                </p>
                <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
                  {station.advice}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;