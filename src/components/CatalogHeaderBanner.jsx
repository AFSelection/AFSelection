import React from 'react';
import { ArrowLeft, Grid, List, Sparkles, MapPin } from 'lucide-react';

export default function CatalogHeaderBanner({
  activeSection,
  onBackToHome,
  totalCount,
  viewLayout,
  setViewLayout,
  showMap,
  setShowMap
}) {
  const getBannerInfo = () => {
    if (activeSection === 'autos') {
      return {
        badge: 'CATÁLOGO AUTOMOTRIZ DE LUXE',
        title: 'GARAJE DE AUTOS DE COLECCIÓN & DEPORTIVOS',
        subtitle: 'Explorá vehículos de alta gama, superdeportivos e íconos de colección con inspección técnica de 150 puntos y tasación oficial.'
      };
    }
    if (activeSection === 'propiedades') {
      return {
        badge: 'CATÁLOGO ARQUITECTÓNICO',
        title: 'RESIDENCIAS DE AUTOR & PENTHOUSES',
        subtitle: 'Portafolio exclusivo de mansiones contemporáneas, residencias sobre el agua y departamentos de arquitectura destacada.'
      };
    }
    return {
      badge: 'PORTAFOLIO COMPLETO',
      title: `CATÁLOGO DE ${activeSection.toUpperCase()}`,
      subtitle: 'Explorá nuestra selección curada de activos de lujo con asesoramiento notarial y atención concierge 24/7.'
    };
  };

  const info = getBannerInfo();

  return (
    <div style={{ paddingTop: '120px', marginBottom: '40px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <button
          className="btn-pill"
          onClick={onBackToHome}
          style={{ padding: '10px 20px', fontSize: '0.82rem' }}
        >
          <ArrowLeft size={16} />
          <span>Volver al Inicio</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeSection === 'propiedades' && (
            <button
              className={`btn-pill ${showMap ? 'active' : ''}`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin size={14} />
              <span>{showMap ? 'Ocultar Mapa' : 'Ver Mapa Interactivo'}</span>
            </button>
          )}

          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-light)' }}>
            <button
              className={`btn-pill ${viewLayout === 'grid' ? 'active' : ''}`}
              onClick={() => setViewLayout('grid')}
              style={{ padding: '6px 12px', border: 'none' }}
              title="Vista Grilla"
            >
              <Grid size={15} />
            </button>
            <button
              className={`btn-pill ${viewLayout === 'list' ? 'active' : ''}`}
              onClick={() => setViewLayout('list')}
              style={{ padding: '6px 12px', border: 'none' }}
              title="Vista Lista"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Title Header Banner */}
      <div className="catalog-hero-block">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--text-main)', color: '#FFF', padding: '6px 16px', borderRadius: 'var(--radius-pill)', marginBottom: '16px' }}>
          <Sparkles size={13} />
          <span>{info.badge}</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', color: 'var(--text-main)', lineHeight: '1.05', marginBottom: '12px' }}>
          {info.title}
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '760px', lineHeight: '1.6', marginBottom: '20px' }}>
          {info.subtitle}
        </p>

        <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
          {totalCount} {totalCount === 1 ? 'Unidad Disponible' : 'Unidades Disponibles'}
        </div>
      </div>
    </div>
  );
}
