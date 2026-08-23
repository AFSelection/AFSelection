import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { fetchHeroImages } from '../services/storage';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=80'
];

const SLIDE_DURATION = 7000; // ms per slide

export default function BannerHero({
  onScrollToSection,
  onGoToSection,
  onGoToAbout,
  onToggleMap,
  searchQuery,
  setSearchQuery
}) {
  const [localSearch, setLocalSearch] = useState('');
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);

  // Load hero images from Supabase on mount
  useEffect(() => {
    fetchHeroImages().then((imgs) => {
      if (imgs && imgs.length > 0) setImages(imgs);
    });
  }, []);

  const goTo = useCallback((idx, total) => {
    const next = (idx + total) % total;
    setPrev(current);
    setCurrent(next);
  }, [current]);

  // Auto advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setTimeout(() => {
      goTo(current + 1, images.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, images.length, goTo]);

  const handleSearchSubmit = () => {
    setSearchQuery(localSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="split-hero-section">
      {/* ── Full Bleed Slideshow ── */}
      <div className="split-hero-media">
        {images.map((src, i) => {
          const isActive = i === current;
          const isPrev   = i === prev;
          return (
            <img
              key={src}
              src={src}
              alt={`AF • Select Showroom ${i + 1}`}
              className={`hero-slide ${isActive ? 'hero-slide--active' : ''} ${isPrev ? 'hero-slide--exit' : ''}`.trim()}
            />
          );
        })}
        <div className="split-hero-dark-overlay" />
      </div>

      {/* Top Mobile Brand Header */}
      <div className="mobile-top-brand-bar">
        <a href="#" className="split-brand-logo mobile-logo-dark">
          <span className="logo-text-bold">AF</span>
          <span className="brand-dot-black" />
          <span className="logo-text-light">SELECT</span>
        </a>
      </div>

      {/* Glass Panel */}
      <div className="split-glass-panel">
        {/* Navigation Bar (Desktop Only) */}
        <div className="split-glass-nav desktop-only-nav">
          <a href="#" className="split-brand-logo">
            <span className="logo-text-bold">AF</span>
            <span className="brand-dot-black" />
            <span className="logo-text-light">SELECT</span>
          </a>

          <div className="split-nav-links">
            <button onClick={() => onGoToSection ? onGoToSection('autos') : onScrollToSection('autos')} className="split-nav-link">
              AUTOS
            </button>
            <button onClick={() => onGoToSection ? onGoToSection('propiedades') : onScrollToSection('propiedades')} className="split-nav-link">
              PROPIEDADES
            </button>
            <button onClick={() => onGoToAbout ? onGoToAbout() : onScrollToSection('por-que-elegirnos')} className="split-nav-link">
              NOSOTROS
            </button>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="split-glass-body">
          <div className="split-badge-pill">
            <ShieldCheck size={14} style={{ color: '#FFFFFF' }} />
            <span>TRATO DIRECTO CON AGUSTÍN FIDALGO</span>
          </div>

          <h1 className="split-hero-title">
            <span className="hero-line-strict line-black-text">GARAGE DE AUTOS</span>
            <span className="hero-line-strict line-black-highlight">
              <span className="highlight-badge-inner">Y PROPIEDADES</span>
            </span>
          </h1>

          <p className="split-hero-desc desktop-only-desc">
            Selección y gestión de vehículos y propiedades en Tucumán, Salta y Buenos Aires.
          </p>

          {/* Search Bar (Desktop Only) */}
          <div className="split-search-box desktop-only-search">
            <Search size={16} className="search-icon-muted" />
            <input
              type="text"
              placeholder="Buscar Toyota, Hilux, Yerba Buena..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
            />
            <button className="split-search-btn" onClick={handleSearchSubmit} title="Buscar">
              <ArrowRight size={14} />
            </button>
          </div>

          {/* CTAs */}
          <div className="split-actions-row">
            <button
              className="btn-split-primary"
              onClick={() => onGoToSection ? onGoToSection('autos') : onScrollToSection('autos')}
            >
              EXPLORAR CATÁLOGO
            </button>
            <button className="btn-split-secondary desktop-only-btn" onClick={onToggleMap}>
              <MapPin size={14} />
              <span>VER MAPA</span>
            </button>
          </div>
        </div>

        {/* Footer (Desktop Only) */}
        <div className="split-glass-footer desktop-only-footer">
          <span className="split-footer-label">ATENCIÓN PERSONALIZADA</span>
          <span className="split-footer-val">LUN - SÁB: 09:00 - 20:00 HS</span>
        </div>
      </div>
    </section>
  );
}
