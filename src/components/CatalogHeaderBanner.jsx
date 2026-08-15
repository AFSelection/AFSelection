import React from 'react';
import { ArrowLeft, Grid, List, MapPin } from 'lucide-react';

export default function CatalogHeaderBanner({
  activeSection,
  onBackToHome,
  totalCount,
  viewLayout,
  setViewLayout,
  showMap,
  setShowMap,
  searchQuery
}) {
  const getBannerInfo = () => {
    if (searchQuery && searchQuery.trim() !== '') {
      return {
        title: 'RESULTADOS DE BÚSQUEDA',
        subtitle: `Unidades que coinciden con "${searchQuery}" en Tucumán, Salta y Buenos Aires.`
      };
    }
    if (activeSection === 'autos') {
      return {
        title: 'GARAJE DE AUTOS',
        subtitle: 'Vehículos inspeccionados y listos para transferir.'
      };
    }
    if (activeSection === 'propiedades') {
      return {
        title: 'PROPIEDADES',
        subtitle: 'Casas, departamentos y terrenos en venta.'
      };
    }
    return {
      title: 'CATÁLOGO GENERAL',
      subtitle: 'Selección de vehículos y propiedades con atención directa.'
    };
  };

  const info = getBannerInfo();

  return (
    <div className="open-catalog-header">
      {/* Top Action Controls Row (No Container Box) */}
      <div className="open-catalog-controls">
        <button
          className="btn-back-text"
          onClick={onBackToHome}
        >
          <ArrowLeft size={16} />
          <span>VOLVER AL INICIO</span>
        </button>

        <div className="open-catalog-right-controls">
          <span className="catalog-count-pill">
            {totalCount} {totalCount === 1 ? 'ACTIVO DISPONIBLE' : 'ACTIVOS DISPONIBLES'}
          </span>

          {activeSection === 'propiedades' && (
            <button
              className={`btn-square-sm ${showMap ? 'active-btn-dark' : ''}`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapPin size={14} />
              <span>{showMap ? 'OCULTAR MAPA' : 'VER MAPA'}</span>
            </button>
          )}

          <div className="layout-toggles-pill">
            <button
              className={`btn-layout-toggle ${viewLayout === 'grid' ? 'active' : ''}`}
              onClick={() => setViewLayout('grid')}
              title="Vista Grilla"
            >
              <Grid size={15} />
            </button>
            <button
              className={`btn-layout-toggle ${viewLayout === 'list' ? 'active' : ''}`}
              onClick={() => setViewLayout('list')}
              title="Vista Lista"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Title & Subtitle Directly On Background */}
      <div className="open-catalog-title-block">
        <h1 className="open-catalog-title">
          {info.title}
        </h1>

        <p className="open-catalog-subtitle">
          {info.subtitle}
        </p>
      </div>

      {/* Subtle Separator Line */}
      <div className="open-catalog-divider" />
    </div>
  );
}
