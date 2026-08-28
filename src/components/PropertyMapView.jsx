import React, { useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const formatPinPrice = (price, currency = 'USD') => {
  if (!price) return '';
  if (price >= 1000000) return `${currency} ${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `${currency} ${Math.round(price / 1000)}K`;
  return `${currency} ${price}`;
};

const createPinIcon = (price, currency = 'USD', isActive = false, isHovered = false) => {
  const label = formatPinPrice(price, currency);

  let bg = '#111317';
  let border = 'rgba(255,255,255,0.18)';
  let color = 'rgba(255,255,255,0.85)';
  let shadow = '0 2px 10px rgba(0,0,0,0.55)';
  let fontWeight = '600';

  if (isActive) {
    bg = '#F59E0B';
    border = '#F59E0B';
    color = '#111317';
    shadow = '0 4px 20px rgba(245,158,11,0.5)';
    fontWeight = '800';
  } else if (isHovered) {
    bg = '#1e2128';
    border = 'rgba(255,255,255,0.55)';
    color = '#ffffff';
    shadow = '0 4px 14px rgba(0,0,0,0.65)';
    fontWeight = '700';
  }

  // Use a transparent wrapper div (180x40) anchored at bottom-center.
  // The visible pill is absolutely positioned inside it, centered horizontally at the bottom.
  // This gives a proper hitbox regardless of text length.
  return L.divIcon({
    className: 'price-pin-outer',
    html: `<div style="
      position:absolute;
      left:50%;
      bottom:0;
      transform:translateX(-50%);
      background:${bg};
      border:2px solid ${border};
      color:${color};
      font-family:'Outfit',sans-serif;
      font-weight:${fontWeight};
      font-size:12px;
      padding:5px 12px;
      border-radius:20px;
      box-shadow:${shadow};
      white-space:nowrap;
      cursor:pointer;
      letter-spacing:0.02em;
    ">${label}</div>`,
    iconSize: [180, 40],
    iconAnchor: [90, 40],
  });
};

function MapFlyController({ selectedId, items }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedId) return;
    const item = items.find((i) => i.id === selectedId);
    if (item?.coordinates?.lat && item?.coordinates?.lng) {
      map.flyTo([item.coordinates.lat, item.coordinates.lng], Math.max(map.getZoom(), 14), {
        duration: 0.55,
        easeLinearity: 0.35,
      });
    }
  }, [selectedId]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

export default function PropertyMapView({ listings = [], hoveredId, selectedId, onPinClick, onMapClick }) {
  const mapItems = listings.filter((i) => i.coordinates?.lat && i.coordinates?.lng);

  const defaultCenter = mapItems.length > 0
    ? [mapItems[0].coordinates.lat, mapItems[0].coordinates.lng]
    : [-26.8241, -65.2226];

  const handleMapClick = useCallback(() => {
    onMapClick?.();
  }, [onMapClick]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      scrollWheelZoom={true}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFlyController selectedId={selectedId} items={mapItems} />
      <MapClickHandler onMapClick={handleMapClick} />
      {mapItems.map((item) => {
        const isActive = item.id === selectedId;
        const isHovered = item.id === hoveredId;
        return (
          <Marker
            key={item.id}
            position={[item.coordinates.lat, item.coordinates.lng]}
            icon={createPinIcon(item.price, item.currency, isActive, isHovered)}
            zIndexOffset={isActive ? 1000 : isHovered ? 500 : 0}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
                onPinClick?.(item);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
