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

      {/* MOBILE MERCADO LIBRE STYLE SQUARE SHORTCUTS (Visible ONLY on Mobile) */}
      <div className="mobile-meli-shortcuts-wrapper">
        <div className="mobile-meli-shortcuts-row">
          {/* Todas Shortcut */}
          <button
            className={`mobile-shortcut-item ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSection('all')}
          >
            <div className="mobile-shortcut-square">
              <Grid size={24} className="shortcut-icon" />
            </div>
            <span className="mobile-shortcut-label">TODAS</span>
          </button>

          {/* Autos Shortcut */}
          <button
            className={`mobile-shortcut-item ${activeSection === 'autos' ? 'active' : ''}`}
            onClick={() => setActiveSection('autos')}
          >
            <div className="mobile-shortcut-square img-shortcut" style={{ backgroundImage: `url("${getSectionBgImage('autos')}")` }}>
              <div className="shortcut-img-overlay">
                <Car size={22} className="shortcut-icon-light" />
              </div>
            </div>
            <span className="mobile-shortcut-label">AUTOS</span>
          </button>

          {/* Propiedades Shortcut */}
          <button
            className={`mobile-shortcut-item ${activeSection === 'propiedades' ? 'active' : ''}`}
            onClick={() => setActiveSection('propiedades')}
          >
            <div className="mobile-shortcut-square img-shortcut" style={{ backgroundImage: `url("${getSectionBgImage('propiedades')}")` }}>
              <div className="shortcut-img-overlay">
                <Home size={22} className="shortcut-icon-light" />
              </div>
            </div>
            <span className="mobile-shortcut-label">PROPIEDADES</span>
          </button>

          {/* Dynamic Custom Sections */}
          {sections.filter((s) => s.id !== 'autos' && s.id !== 'propiedades').map((sec) => (
            <button
              key={sec.id}
              className={`mobile-shortcut-item ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <div className="mobile-shortcut-square dark-shortcut">
                {getSectionIcon(sec.icon, sec.id, true)}
              </div>
              <span className="mobile-shortcut-label">{sec.name.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP CATEGORY CARDS GRID (Hidden on Mobile) */}
      <div className="sections-cards-row desktop-cards-grid">
        {/* Autos Card */}
        <SpotlightCard
          onClick={() => setActiveSection('autos')}
          isActive={activeSection === 'autos'}
        >
          <div className="cat-card-top">
            <span className="cat-badge-pill">01 / AUTOS</span>
            <Car size={22} className="cat-icon-gold" />
          </div>

          <div className="cat-card-bottom">
            <h3 className="cat-card-title">AUTOS DE LUJO</h3>
            <p className="cat-card-desc">Deportivos, SUVs & Pick-ups</p>
          </div>
        </SpotlightCard>

        {/* Propiedades Card */}
        <SpotlightCard
          onClick={() => setActiveSection('propiedades')}
          isActive={activeSection === 'propiedades'}
        >
          <div className="cat-card-top">
            <span className="cat-badge-pill">02 / PROPIEDADES</span>
            <Home size={22} className="cat-icon-gold" />
          </div>

          <div className="cat-card-bottom">
            <h3 className="cat-card-title">PROPIEDADES</h3>
            <p className="cat-card-desc">Casas, Penthouses & Terrenos</p>
          </div>
        </SpotlightCard>

        {/* Dynamic Custom Sections */}
        {sections.filter((s) => s.id !== 'autos' && s.id !== 'propiedades').map((sec, idx) => {
          const numberStr = String(idx + 3).padStart(2, '0');
          const desc = sec.id === 'inversiones'
            ? 'Desarrollos, Pozos & Oportunidades'
            : (sec.categories?.length > 0 ? sec.categories.join(', ') : 'Selección de activos');

          return (
            <SpotlightCard
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              isActive={activeSection === sec.id}
            >
              <div className="cat-card-top">
                <span className="cat-badge-pill">{numberStr} / {sec.name.toUpperCase()}</span>
                {getSectionIcon(sec.icon, sec.id, true)}
              </div>


              <div className="cat-card-bottom">
                <h3 className="cat-card-title">{sec.name.toUpperCase()}</h3>
                <p className="cat-card-desc">{desc}</p>
              </div>
            </SpotlightCard>
          );
        })}
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


