import React from 'react';
import { Search, Heart, MapPin } from 'lucide-react';

export default function Header({
  sections,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  showMap,
  setShowMap,
  onOpenFavorites,
  isVisible
}) {
  return (
    <header className={`editorial-header ${isVisible ? 'visible-nav' : 'hidden-nav'}`}>
      <div className="header-inner">
        {/* Brand Logo with Solid Circular Dot (AF • Selection) */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setActiveSection('all'); }}>
          <span>AF</span>
          <span className="brand-dot" />
          <span>Selection</span>
        </a>

        {/* Minimalist Search Box */}
        <div className="search-pill">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, locación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className={`btn-pill ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSection('all')}
          >
            <span>Todas</span>
          </button>

          <button
            className={`btn-pill ${activeSection === 'autos' ? 'active' : ''}`}
            onClick={() => setActiveSection('autos')}
          >
            <span>Autos</span>
          </button>

          <button
            className={`btn-pill ${activeSection === 'propiedades' ? 'active' : ''}`}
            onClick={() => setActiveSection('propiedades')}
          >
            <span>Propiedades</span>
          </button>

          {activeSection === 'propiedades' && (
            <button
              className={`btn-pill ${showMap ? 'active' : ''}`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin size={14} />
              <span>{showMap ? 'Ocultar Mapa' : 'Ver Mapa'}</span>
            </button>
          )}

          <button className="btn-pill" onClick={onOpenFavorites}>
            <Heart size={14} className={favoritesCount > 0 ? 'fill-current text-red-500' : ''} />
            <span>Favoritos ({favoritesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
