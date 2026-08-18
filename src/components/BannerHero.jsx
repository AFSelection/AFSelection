import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function BannerHero({
  onScrollToSection,
  onToggleMap,
  searchQuery,
  setSearchQuery
}) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = () => {
    setSearchQuery(localSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <section className="split-hero-section">
      {/* Full Bleed Background Media */}
      <div className="split-hero-media">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2400&q=95"
          alt="AF • Select Showroom"
        />
        <div className="split-hero-dark-overlay" />
      </div>

      {/* Top Mobile Brand Header (Outside / Above Glass Panel - Solid Black Logo) */}
      <div className="mobile-top-brand-bar">
        <a href="#" className="split-brand-logo mobile-logo-dark">
          <span className="logo-text-bold">AF</span>
          <span className="brand-dot-black" />
          <span className="logo-text-light">SELECT</span>
        </a>
      </div>

      {/* Glass Panel */}
      <div className="split-glass-panel">
        {/* Navigation Bar Inside Glass Panel (Desktop Only) */}
        <div className="split-glass-nav desktop-only-nav">
          <a href="#" className="split-brand-logo">
            <span className="logo-text-bold">AF</span>
            <span className="brand-dot-black" />
            <span className="logo-text-light">SELECT</span>
          </a>

          <div className="split-nav-links">
            <button onClick={() => onScrollToSection('autos')} className="split-nav-link">
              AUTOS
            </button>
            <button onClick={() => onScrollToSection('propiedades')} className="split-nav-link">
              PROPIEDADES
            </button>
            <button onClick={() => onScrollToSection('por-que-elegirnos')} className="split-nav-link">
              NOSOTROS
            </button>
          </div>
        </div>

        {/* Spacious, Harmonious Editorial Content */}
        <div className="split-glass-body">
          <div className="split-badge-pill">
            <ShieldCheck size={14} className="dark-sparkle-icon" />
            <span>TRATO DIRECTO CON AGUSTÍN FIDALGO</span>
          </div>

          {/* Strictly 2-Line Title: Line 1 All Black, Line 2 White with Black Highlight Badge */}
          <h1 className="split-hero-title">
            <span className="hero-line-strict line-black-text">GARAGE DE AUTOS</span>
            <span className="hero-line-strict line-black-highlight">
              <span className="highlight-badge-inner">Y PROPIEDADES</span>
            </span>
          </h1>

          <p className="split-hero-desc">
            Selección y gestión de vehículos y propiedades en Tucumán, Salta y Buenos Aires.
          </p>

          {/* Sleek Compact Search Bar */}
          <div className="split-search-box">
            <Search size={16} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Buscar Toyota, Honda, Yerba Buena..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
            />
            <button
              className="split-search-btn"
              onClick={handleSearchSubmit}
              title="Buscar"
            >
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="split-actions-row">
            <button
              className="btn-split-primary"
              onClick={() => onScrollToSection('autos')}
            >
              EXPLORAR CATÁLOGO
            </button>

            <button
              className="btn-split-secondary"
              onClick={onToggleMap}
            >
              <MapPin size={14} />
              <span>VER MAPA</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="split-glass-footer">
          <span className="split-footer-label">ATENCIÓN PERSONALIZADA</span>
          <span className="split-footer-val">LUN - SÁB: 09:00 - 20:00 HS</span>
        </div>
      </div>
    </section>
  );
}
