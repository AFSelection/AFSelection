import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowRight, MapPin } from 'lucide-react';

// Custom Map Marker Icon
const createCustomIcon = (price, currency = 'USD') => {
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(price);

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: #000;
        border: 2px solid #F59E0B;
        color: #FFF;
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -100%);
      ">
        <span style="color: #F59E0B;">●</span> ${priceFormatted}
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 30]
  });
};

export default function PropertyMapView({ listings, onSelectListing }) {
  // Filter items with valid coordinates
  const mapItems = listings.filter((item) => item.coordinates && item.coordinates.lat && item.coordinates.lng);

  const defaultCenter = mapItems.length > 0
    ? [mapItems[0].coordinates.lat, mapItems[0].coordinates.lng]
    : [-34.6037, -58.3816]; // Default Buenos Aires center

  return (
    <div className="map-container-wrapper">
      {mapItems.length === 0 ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <MapPin size={48} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
          <h3>No hay propiedades con mapa en el filtro actual</h3>
          <p style={{ fontSize: '0.88rem' }}>Seleccioná "Propiedades" o agregá coordenadas desde el CRM</p>
        </div>
      ) : (
        <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {mapItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.coordinates.lat, item.coordinates.lng]}
              icon={createCustomIcon(item.price, item.currency)}
            >
              <Popup>
                <div className="map-popup-card">
                  <img src={item.images?.[0]} alt={item.title} />
                  <div className="map-popup-price">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency || 'USD', maximumFractionDigits: 0 }).format(item.price)}
                  </div>
                  <div className="map-popup-title">{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '8px' }}>{item.location}</div>
                  <button
                    onClick={() => onSelectListing(item)}
                    style={{
                      width: '100%',
                      background: '#000',
                      color: '#FFF',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Ver Ficha Completa</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
