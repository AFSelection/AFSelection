import React, { useState } from 'react';
import { Heart, MapPin } from 'lucide-react';

export default function ListingCard({
  item,
  isFavorite,
  onToggleFavorite,
  onSelect,
  layout = 'grid'
}) {
  const isAuto = item.sectionId === 'autos';

  const primaryImage = item.images?.[0] || (isAuto
    ? 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80');

  const secondaryImage = item.images?.[1] || (isAuto
    ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80');

  const [activeImg, setActiveImg] = useState(primaryImage);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="wander-card"
      onClick={() => onSelect(item)}
      onMouseEnter={() => {
        setIsHovered(true);
        setActiveImg(secondaryImage);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImg(primaryImage);
      }}
      style={layout === 'list' ? { height: '260px' } : {}}
    >
      <div className="wander-image-container">
        <img
          src={activeImg}
          alt={item.title}
          className={`card-interactive-img ${isHovered ? 'hover-active' : ''}`}
          loading="lazy"
        />

        {/* Top Badges Row */}
        <div className="wander-top-badges">
          <div className="price-pill-badge">
            USD {item.price?.toLocaleString()}
          </div>

          <button
            className={`btn-fav-circle ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Gradient Overlay & Information */}
        <div className="wander-image-overlay">
          <div className="overlay-tag-row">
            <span className="category-pill-tag">
              {item.category || (isAuto ? 'Auto' : 'Propiedad')}
            </span>
          </div>

          <h3 className="wander-card-title">{item.title}</h3>

          <div className="wander-location-row">
            <MapPin size={13} />
            <span>{item.location || 'Tucumán, Argentina'}</span>
          </div>

          {/* Key Technical Features Bar */}
          <div className="wander-specs-bar">
            {isAuto ? (() => {
              const kmRaw = item.kilometers ?? item.kms;
              const kmNum = kmRaw !== undefined && kmRaw !== null ? Number(String(kmRaw).replace(/[^\d]/g, '')) : null;
              const kmText = (kmNum !== null && !isNaN(kmNum) && kmNum > 0)
                ? `${kmNum.toLocaleString('es-AR')} km`
                : '0km';
              return (
                <span>{item.year || '2024'} • {kmText} • {item.fuel || 'Nafta'}</span>
              );
            })() : (
              <span>{item.features?.sqm ? `${item.features.sqm} m²` : (item.surface ? `${item.surface} m²` : '280 m²')} • {item.features?.rooms ? `${item.features.rooms} Amb` : (item.rooms ? `${item.rooms} Amb` : '4 Amb')} • Cochera</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
