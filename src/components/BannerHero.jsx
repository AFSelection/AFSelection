import React from 'react';
import { Search, ArrowRight, MapPin, Car, Home, CheckCircle2, Sparkles } from 'lucide-react';

export default function BannerHero({
  onScrollToSection,
  onToggleMap,
  searchQuery,
  setSearchQuery
}) {
  return (
    <section className="hero-monumental">
      <div className="hero-bg-media">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
          alt="AF • Selection Luxury Residence & Porsche"
        />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content-inner">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>SELECCIÓN PREMIUM · CATÁLOGO CURADO</span>
        </div>

        {/* STRICT GUARANTEED 2-LINE HEADLINE WITH PALETTE ACCENT GOLD (#C5A059) */}
        <h1 className="hero-headline">
          <span className="hero-line-1">GARAGE DE LUJO Y RESIDENCIAS DE AUTOR</span>
          <br />
          <span className="hero-line-2">TRATO DIRECTO CON AGUSTÍN FIDALGO</span>
        </h1>

        <p className="hero-lead">
          180+ operaciones cerradas en Tucumán, Salta y Buenos Aires. Coordinación transparente sin intermediarios extra.
        </p>

        {/* Embedded Glass Search Input */}
        <div className="hero-search-box">
          <Search size={20} className="hero-search-icon" />
          <input
            type="text"
            placeholder="Buscar Porsche, BMW, Penthouse Puerto Madero, Yerba Buena..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="hero-search-btn"
            onClick={() => onScrollToSection('autos')}
          >
            <span>EXPLORAR</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Sleek Glass Quick Pills */}
        <div className="hero-quick-pills">
          <button
            className="hero-pill-btn hero-pill-gold"
            onClick={() => onScrollToSection('autos')}
          >
            <CheckCircle2 size={15} />
            <span>Verificado por Agustín</span>
          </button>

          <button
            className="hero-pill-btn"
            onClick={() => onScrollToSection('autos')}
          >
            <Car size={15} />
            <span>Garaje de Autos</span>
          </button>

          <button
            className="hero-pill-btn"
            onClick={() => onScrollToSection('propiedades')}
          >
            <Home size={15} />
            <span>Propiedades Exclusivas</span>
          </button>

          <button
            className="hero-pill-btn"
            onClick={onToggleMap}
          >
            <MapPin size={15} />
            <span>Ver Mapa de Propiedades</span>
          </button>
        </div>
      </div>
    </section>
  );
}
