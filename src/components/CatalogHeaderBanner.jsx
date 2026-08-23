import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import FiltersPopup from './FiltersPopup';

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Más recientes' },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
];
const SORT_OPTIONS_AUTOS = [
  ...SORT_OPTIONS,
  { value: 'year_desc', label: 'Año más nuevo' },
  { value: 'km_asc',    label: 'Menor kilometraje' },
];

function SortDropdown({ value, onChange, activeSection }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const options = activeSection === 'autos' ? SORT_OPTIONS_AUTOS : SORT_OPTIONS;
  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="sort-dropdown-wrap">
      <button
        type="button"
        className={`btn-square-sm sort-dropdown-trigger${open ? ' active-btn-dark' : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{current.label}</span>
        <ChevronDown size={13} style={{ transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div className="sort-dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`sort-dropdown-item${opt.value === value ? ' active' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogHeaderBanner({
  activeSection,
  onBackToHome,
  totalCount,
  showMap,
  setShowMap,
  searchQuery,
  sortBy,          setSortBy,
  priceMin,        setPriceMin,
  priceMax,        setPriceMax,
  selectedCategory, setSelectedCategory,
  availableCategories,
  filterRooms,     setFilterRooms,
  filterCurrency,  setFilterCurrency,
  filterOperationType, setFilterOperationType,
  filterCondition, setFilterCondition,
  filterFuel, setFilterFuel,
  onResetFilters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  const getBannerInfo = () => {
    if (searchQuery && searchQuery.trim() !== '') {
      return {
        title: 'RESULTADOS DE BÚSQUEDA',
        subtitle: `Unidades que coinciden con "${searchQuery}" en Tucumán, Salta y Buenos Aires.`
      };
    }
    if (activeSection === 'autos') {
      return { title: 'GARAJE DE AUTOS', subtitle: 'Vehículos inspeccionados y listos para transferir.' };
    }
    if (activeSection === 'propiedades') {
      return { title: 'PROPIEDADES', subtitle: 'Casas, departamentos y terrenos en venta.' };
    }
    if (activeSection === 'todos') {
      return { title: 'CATÁLOGO COMPLETO', subtitle: 'Todos los activos disponibles: autos, propiedades e inversiones.' };
    }
    return { title: 'CATÁLOGO GENERAL', subtitle: 'Selección de vehículos y propiedades con atención directa.' };
  };

  const info = getBannerInfo();

  const activeFilterCount = [
    selectedCategory && selectedCategory !== 'all',
    filterRooms && filterRooms !== 'all',
    filterCurrency && filterCurrency !== 'all',
    filterOperationType && filterOperationType !== 'all',
    filterCondition && filterCondition !== 'all',
    filterFuel && filterFuel !== 'all',
    priceMin !== '',
    priceMax !== '',
  ].filter(Boolean).length;

  return (
    <div className="open-catalog-header">
      {/* 1. Back button at top */}
      <div style={{ marginBottom: '16px' }}>
        <button className="btn-back-text" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>VOLVER AL INICIO</span>
        </button>
      </div>

      {/* 2. Title Block */}
      <div className="open-catalog-title-block" style={{ marginBottom: '16px' }}>
        <h1 className="open-catalog-title">{info.title}</h1>
        <p className="open-catalog-subtitle">{info.subtitle}</p>
      </div>

      {/* 3. Controls Row BELOW Title */}
      <div className="open-catalog-bottom-controls-row">
        <span className="catalog-count-pill">
          {totalCount} {totalCount === 1 ? 'ACTIVO DISPONIBLE' : 'ACTIVOS DISPONIBLES'}
        </span>

        {/* Custom sort dropdown */}
        <SortDropdown value={sortBy} onChange={setSortBy} activeSection={activeSection} />

        {/* Compact Filters button */}
        <button
          className={`btn-square-sm compact-filter-btn${activeFilterCount > 0 ? ' active-btn-dark' : ''}`}
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal size={14} />
          <span>FILTROS{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
        </button>

        {activeSection === 'propiedades' && (
          <button
            className={`btn-square-sm compact-filter-btn ${showMap ? 'active-btn-dark' : ''}`}
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin size={14} />
            <span>{showMap ? 'OCULTAR MAPA' : 'VER MAPA'}</span>
          </button>
        )}
      </div>

      {/* Sub-filter Pills Row for Propiedades & Inversiones */}
      {activeSection === 'propiedades' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', marginTop: '14px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          <button
            type="button"
            className={`btn-square-sm ${selectedCategory === 'all' ? 'active-btn-dark' : ''}`}
            onClick={() => setSelectedCategory('all')}
            style={{ padding: '6px 14px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
          >
            <span>TODOS (PROPIEDADES E INVERSIONES)</span>
          </button>
          <button
            type="button"
            className={`btn-square-sm ${selectedCategory === 'propiedades' ? 'active-btn-dark' : ''}`}
            onClick={() => setSelectedCategory('propiedades')}
            style={{ padding: '6px 14px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
          >
            <span>PROPIEDADES SOLAS</span>
          </button>
          <button
            type="button"
            className={`btn-square-sm ${selectedCategory === 'inversiones' ? 'active-btn-dark' : ''}`}
            onClick={() => setSelectedCategory('inversiones')}
            style={{ padding: '6px 14px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
          >
            <span>INVERSIONES SOLAS</span>
          </button>
        </div>
      )}

      <div className="open-catalog-divider" style={{ marginTop: '20px' }} />

      {/* Filters popup */}
      {showFilters && (
        <FiltersPopup
          onClose={() => setShowFilters(false)}
          dark={false}
          activeSection={activeSection}
          sortBy={sortBy}            setSortBy={setSortBy}
          priceMin={priceMin}        setPriceMin={setPriceMin}
          priceMax={priceMax}        setPriceMax={setPriceMax}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories || []}
          filterRooms={filterRooms}               setFilterRooms={setFilterRooms}
          filterCurrency={filterCurrency}          setFilterCurrency={setFilterCurrency}
          filterOperationType={filterOperationType} setFilterOperationType={setFilterOperationType}
          filterCondition={filterCondition}          setFilterCondition={setFilterCondition}
          filterFuel={filterFuel}                    setFilterFuel={setFilterFuel}
          onReset={onResetFilters}
        />
      )}
    </div>
  );
}
