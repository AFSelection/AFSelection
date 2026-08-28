import React, { useRef } from 'react';
import ListingCard from './ListingCard';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import SectionIcon from './SectionIcon';

export default function DynamicSectionShowcase({
  section,
  listings = [],
  favorites = [],
  toggleFavorite,
  onSelectListing,
  onViewAll
}) {
  const sliderRef = useRef(null);

  if (!section) return null;

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -384 : 384;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const sectionListings = listings.filter((l) => {
    const itemSec = String(l.sectionId || l.section_id || l.section || '').toLowerCase().trim();
    const targetSecId = String(section.id || '').toLowerCase().trim();
    const targetSecSlug = String(section.slug || '').toLowerCase().trim();
    const targetSecName = String(section.name || '').toLowerCase().trim();
    return itemSec === targetSecId || itemSec === targetSecSlug || itemSec === targetSecName;
  });

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
            <SectionIcon icon={section.icon} iconType={section.iconType} size={20} style={{ color: '#111317' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: '#FFF', lineHeight: '1.05' }}>
              {section.name.toUpperCase()}
            </h2>
          </div>
        </div>

        {/* Action Controls Group */}
        <div className="showcase-actions-group">
          {sectionListings.length > 0 && (
            <div className="carousel-nav-arrows">
              <button onClick={() => scroll('left')} className="btn-arrow-circle" title="Anterior">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scroll('right')} className="btn-arrow-circle" title="Siguiente">
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button
            className="btn-square-sm active-btn-dark"
            onClick={onViewAll}
          >
            <span>VER SECCIÓN ({sectionListings.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {sectionListings.length === 0 ? (
        <div style={{
          color: 'rgba(255, 255, 255, 0.45)',
          fontSize: '0.88rem',
          fontFamily: 'var(--font-body)',
          padding: '36px 20px',
          fontStyle: 'italic',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)'
        }}>
          Próximamente unidades disponibles en la sección <strong>{section.name}</strong>.
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
            {sectionListings.map((item) => (
              <div
                key={item.id}
                style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  width: '360px',
                  maxWidth: '85vw'
                }}
              >
                <ListingCard
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={onSelectListing}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

