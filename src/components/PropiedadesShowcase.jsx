import React, { useRef } from 'react';
import ListingCard from './ListingCard';
import { ChevronLeft, ChevronRight, ArrowUpRight, Home, MapPin } from 'lucide-react';

export default function PropiedadesShowcase({
  listings,
  favorites,
  toggleFavorite,
  onSelectListing,
  onViewAll,
  onToggleMap
}) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -384 : 384;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (listings.length === 0) return null;

  return (
    <section className="light-section-block" style={{ marginBottom: '60px', borderRadius: '32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        paddingBottom: '18px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--text-main)', color: '#FFF', padding: '10px', borderRadius: '50%' }}>
            <Home size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              SECCIÓN 02 / ARQUITECTURA & INTERIORISMO
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-main)' }}>
              RESIDENCIAS DE AUTOR & PENTHOUSES
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scroll('left')}
              className="btn-pill"
              style={{ padding: '8px 12px' }}
              title="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn-pill"
              style={{ padding: '8px 12px' }}
              title="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            className="btn-pill"
            onClick={onToggleMap}
            style={{ background: 'var(--text-main)', color: '#FFF' }}
          >
            <MapPin size={14} />
            <span>Ver Mapa</span>
          </button>

          <button
            className="btn-pill btn-pill-dark"
            onClick={onViewAll}
          >
            <span>Ver Catálogo Completo de Propiedades ({listings.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container with STRICT FIXED CARD WIDTH */}
      <div
        ref={sliderRef}
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '16px'
        }}
      >
        {listings.map((item) => (
          <div
            key={item.id}
            style={{
              width: '360px',
              minWidth: '360px',
              maxWidth: '360px',
              flex: '0 0 360px',
              scrollSnapAlign: 'start'
            }}
          >
            <ListingCard
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onSelect={onSelectListing}
              layout="grid"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
