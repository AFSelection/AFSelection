import React, { useRef } from 'react';
import ListingCard from './ListingCard';
import { ChevronLeft, ChevronRight, ArrowUpRight, Car } from 'lucide-react';

export default function AutosCarouselShowcase({
  listings,
  favorites,
  toggleFavorite,
  onSelectListing,
  onViewAll
}) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -384 : 384;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isEmpty = listings.length === 0;

  return (
    <section className="dark-section-block" style={{ marginBottom: '60px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        paddingBottom: '18px',
        borderBottom: '1px solid var(--border-dark)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: '#FFFFFF',
            color: '#111317',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 0
          }}>
            <Car size={20} style={{ display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: '#FFF', lineHeight: '1.05' }}>
              GARAJE DE AUTOS
            </h2>
          </div>
        </div>

        {/* Crisp Single-Line Action Controls Group */}
        <div className="showcase-actions-group">
          <div className="carousel-nav-arrows">
            <button onClick={() => scroll('left')} className="btn-arrow-circle" title="Anterior">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="btn-arrow-circle" title="Siguiente">
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            className="btn-square-sm active-btn-dark"
            onClick={onViewAll}
          >
            <span>VER CATÁLOGO ({listings.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', padding: '32px 0', fontStyle: 'italic' }}>
          Por el momento no hay autos disponibles.
        </div>
      ) : (
        <div className="carousel-track-wrapper">
          <div
            ref={sliderRef}
            className="showcase-carousel-track"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '16px 8px 24px 8px',
              margin: '-16px -8px -24px -8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {listings.map((item) => (
              <div
                key={item.id}
                style={{ width: '360px', minWidth: '360px', maxWidth: '360px', flex: '0 0 360px', scrollSnapAlign: 'start' }}
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
        </div>
      )}
    </section>
  );
}
