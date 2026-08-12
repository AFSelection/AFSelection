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
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (listings.length === 0) return null;

  return (
    <section className="dark-section-block" style={{ marginBottom: '60px', borderRadius: '32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        paddingBottom: '18px',
        borderBottom: '1px solid var(--border-dark)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--accent-gold)', color: '#111317', padding: '10px', borderRadius: '50%' }}>
            <Car size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>
              SECCIÓN 01 / SHOWROOM PRIVADO
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#FFF' }}>
              GARAJE DE AUTOS DE LUXE
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scroll('left')}
              className="btn-pill"
              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
              title="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn-pill"
              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
              title="Siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            className="btn-pill"
            style={{ background: '#FFF', color: '#111317', border: 'none', fontWeight: '800' }}
            onClick={onViewAll}
          >
            <span>Ver Catálogo Completo de Autos ({listings.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
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
              minWidth: '350px',
              maxWidth: '370px',
              flex: '0 0 auto',
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
