import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Percent } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { resolveImageUrl, preloadInBackground } from '../utils/imageUrl';
import { formatSpecSummary } from '../utils/specs';

/** Debe coincidir con CARD_WIDTH en App.jsx para reusar la misma precarga. */
const CARD_WIDTH = 640;

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

  // La segunda foto se trae apenas la tarjeta existe, no al hacer hover.
  // Si esperáramos al hover, el primer paso del mouse encontraba una imagen
  // sin descargar — que es de dónde salía el parpadeo.
  useEffect(() => {
    if (!secondaryImage || secondaryImage === primaryImage) return;
    return preloadInBackground([
      resolveImageUrl(secondaryImage, { width: CARD_WIDTH, quality: 72 })
    ]);
  }, [secondaryImage, primaryImage]);

  const isDiscount = item.isOffer || (item.oldPrice && Number(item.oldPrice) > Number(item.price));

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
        <OptimizedImage
          src={activeImg}
          alt={item.title}
          className={`card-interactive-img ${isHovered ? 'hover-active' : ''}`}
          targetWidth={CARD_WIDTH}
        />

        {/* Top Badges Row */}
        <div className="wander-top-badges">
          <div className="card-top-left-stack">
            <div className="price-pill-badge">
              <span>{item.currency || 'USD'}</span>
              <span>{item.price?.toLocaleString('es-AR')}</span>
            </div>

            {isDiscount && (
              <span className="discount-pill-badge" title="Unidad en Descuento / Bajó de Precio">
                <Percent size={11} strokeWidth={3} />
                <span>DESCUENTO</span>
              </span>
            )}
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
              {item.category || (isAuto ? 'Auto' : item.sectionId === 'propiedades' ? 'Propiedad' : (item.sectionId ? item.sectionId.toUpperCase() : 'Destacado'))}
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
            })() : item.sectionId === 'propiedades' ? (
              <span>
                {[
                  (item.features?.sqm ? `${item.features.sqm} m²` : (item.surface ? `${item.surface} m²` : null)),
                  (item.features?.rooms ? `${item.features.rooms} Amb` : (item.rooms ? `${item.rooms} Amb` : null)),
                  (item.garages ? `${item.garages} Cochera` : null)
                ].filter(Boolean).join(' • ') || 'Propiedad'}
              </span>
            ) : (() => {
              const summary = formatSpecSummary(item.specs || item.customFields);
              if (summary) {
                return <span>{summary}</span>;
              }
              return <span>{item.condition || 'Excelente'} • {item.category || 'Destacado'}</span>;
            })()}
          </div>

        </div>
      </div>
    </div>
  );
}
