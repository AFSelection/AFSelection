import React, { useState, useEffect } from 'react';
import { Car, Home, Layers, MapPin, Grid, Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import SectionIcon from './SectionIcon';


function SpotlightCard({ children, onClick, isActive, className = '' }) {
  const cardRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spotlight-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cat-banner-card ${isActive ? 'active-card' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default function SectionsCategoryBar({
  sections = [],
  activeSection,
  setActiveSection,
  onToggleMap,
  showMap,
  searchQuery = '',
  setSearchQuery
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const getSectionIcon = (iconName, secId, isLight = false) => {
    const iconClass = isLight ? 'shortcut-icon-light' : 'cat-icon-gold';
    const foundSec = (sections || []).find((s) => s.id === secId);
    return (
      <SectionIcon
        icon={foundSec?.icon || iconName}
        iconType={foundSec?.iconType}
        size={22}
        className={iconClass}
        style={isLight ? { color: '#FFFFFF' } : {}}
      />
    );
  };

  const getSectionBgImage = (secId) => {
    if (secId === 'autos') {
      return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80';
    }
    if (secId === 'propiedades') {
      return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80';
  };

  // Build unified array of all section cards
  const allSectionCards = [
    {
      id: 'autos',
      name: 'AUTOS',
      badge: '01 / AUTOS',
      icon: <Car size={22} className="cat-icon-gold" />,
      desc: 'Deportivos, SUVs & Pick-ups'
    },
    {
      id: 'propiedades',
      name: 'PROPIEDADES',
      badge: '02 / PROPIEDADES',
      icon: <Home size={22} className="cat-icon-gold" />,
      desc: 'Casas, Penthouses & Terrenos'
    },
    ...sections
      .filter((s) => s.id !== 'autos' && s.id !== 'propiedades')
      .map((sec, idx) => ({
        id: sec.id,
        name: sec.name.toUpperCase(),
        badge: `${String(idx + 3).padStart(2, '0')} / ${sec.name.toUpperCase()}`,
        icon: getSectionIcon(sec.icon, sec.id, true),
        desc: sec.id === 'inversiones'
          ? 'Desarrollos, Pozos & Oportunidades'
          : (sec.categories?.length > 0 ? sec.categories.join(', ') : 'Selección de activos')
      }))
  ];

  const totalCount = allSectionCards.length;
  let topRowItems = [];
  let bottomRowItems = [];

  if (totalCount <= 4) {
    topRowItems = allSectionCards;
    bottomRowItems = [];
  } else {
    const isEven = totalCount % 2 === 0;
    const topCount = isEven ? totalCount / 2 : Math.ceil(totalCount / 2);
    topRowItems = allSectionCards.slice(0, topCount);
    bottomRowItems = allSectionCards.slice(topCount);
  }

  return (
    <section className="sections-bar-container">
      {/* Header Row (Desktop Only) */}
      <div className="sections-bar-header desktop-only-header">
        <div className="sections-title-group">
          <h2 className="sections-main-head">SECCIONES DE PRODUCTOS</h2>
        </div>

        <button
          className={`btn-square-sm ${activeSection === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSection('all')}
        >
          <span>TODAS LAS SECCIONES</span>
        </button>
      </div>

      {/* MOBILE INTEGRATED SEARCH BAR (Visible ONLY on Mobile) */}
      <div className="mobile-search-bar-wrap">
        <div className="mobile-integrated-search-box">
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por Toyota, Hilux, Yerba Buena..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (setSearchQuery) setSearchQuery(e.target.value);
            }}
          />
          {localSearch && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setLocalSearch('');
                if (setSearchQuery) setSearchQuery('');
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY CARDS GRID */}
      <div className="sections-cards-row">
        {/* Desktop Layout (> 768px): Controlled by CSS .cards-desktop-only */}
        <div className="cards-desktop-only">
          {topRowItems.length > 0 && (
            <div className="sections-row-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${topRowItems.length}, 1fr)`, gap: '14px', width: '100%' }}>
              {topRowItems.map((card) => (
                <SpotlightCard
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  isActive={activeSection === card.id}
                >
                  <div className="cat-card-top">
                    <span className="cat-badge-pill">{card.badge}</span>
                    {card.icon}
                  </div>
                  <div className="cat-card-bottom">
                    <h3 className="cat-card-title">{card.name}</h3>
                    <p className="cat-card-desc">{card.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}

          {bottomRowItems.length > 0 && (
            <div className="sections-row-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${bottomRowItems.length}, 1fr)`, gap: '14px', width: '100%' }}>
              {bottomRowItems.map((card) => (
                <SpotlightCard
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  isActive={activeSection === card.id}
                >
                  <div className="cat-card-top">
                    <span className="cat-badge-pill">{card.badge}</span>
                    {card.icon}
                  </div>
                  <div className="cat-card-bottom">
                    <h3 className="cat-card-title">{card.name}</h3>
                    <p className="cat-card-desc">{card.desc}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Layout (< 768px): Controlled by CSS .cards-mobile-only */}
        <div className="cards-mobile-only">
          {allSectionCards.map((card, idx) => {
            const isLastOdd = (allSectionCards.length % 2 !== 0) && (idx === allSectionCards.length - 1);
            return (
              <div key={card.id} style={{ gridColumn: isLastOdd ? 'span 2 / span 2' : 'auto' }}>
                <SpotlightCard
                  onClick={() => setActiveSection(card.id)}
                  isActive={activeSection === card.id}
                >
                  <div className="cat-card-top">
                    <span className="cat-badge-pill">{card.badge}</span>
                    {card.icon}
                  </div>
                  <div className="cat-card-bottom">
                    <h3 className="cat-card-title">{card.name}</h3>
                    <p className="cat-card-desc">{card.desc}</p>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search Bar placed right BELOW the section cards */}
      <div className="category-bar-search-container">
        <div className="category-bar-search-box">
          <Search size={18} className="search-icon-muted" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, ubicación o categoría (ej: Toyota, Hilux, Yerba Buena...)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && setSearchQuery) {
                setSearchQuery(localSearch);
              }
            }}
          />
          <button
            type="button"
            className="category-bar-search-btn"
            onClick={() => setSearchQuery && setSearchQuery(localSearch)}
            title="Buscar"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}


