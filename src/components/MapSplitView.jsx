import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Heart, MapPin, ArrowRight, X, List, Map, SlidersHorizontal } from 'lucide-react';
import PropertyMapView from './PropertyMapView';
import FiltersPopup from './FiltersPopup';

// ─── Compact list card ────────────────────────────────────────────────────────
function MapListCard({ item, isHovered, isSelected, isFavorite, onHover, onLeave, onSelect, onToggleFavorite }) {
  const img = item.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';
  const hasCoords = !!(item.coordinates?.lat && item.coordinates?.lng);

  return (
    <div
      className={`msl-card${isHovered ? ' msl-card--hovered' : ''}${isSelected ? ' msl-card--selected' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
    >
      <div className="msl-card-img-wrap">
        <img src={img} alt={item.title} className="msl-card-img" loading="lazy" />
        {item.category && <span className="msl-card-cat">{item.category}</span>}
      </div>
      <div className="msl-card-body">
        <div className="msl-card-top">
          <span className="msl-card-price">
            {item.currency || 'USD'} {item.price?.toLocaleString('es-AR')}
          </span>
          <button
            className={`msl-fav-btn${isFavorite ? ' msl-fav-btn--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          >
            <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="msl-card-title">{item.title}</p>
        <div className="msl-card-loc">
          <MapPin size={11} />
          <span>{item.location || 'Tucumán, Argentina'}</span>
          {!hasCoords && <span className="msl-card-nopin" title="Sin pin en mapa">·</span>}
        </div>
        <div className="msl-card-specs">
          {item.features?.sqm && <span>{item.features.sqm} m²</span>}
          {item.features?.rooms && <span>{item.features.rooms} amb</span>}
          {item.features?.sqm || item.features?.rooms ? null : <span>Ver ficha →</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Floating preview card ────────────────────────────────────────────────────
function FloatingMapCard({ item, isFavorite, onToggleFavorite, onSelect, onClose }) {
  const img = item.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="mfc-root">
      <div className="mfc-inner">
        <div className="mfc-img-wrap">
          <img src={img} alt={item.title} className="mfc-img" />
          <button
            className={`mfc-fav-btn${isFavorite ? ' mfc-fav-btn--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          >
            <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="mfc-body">
          <div className="mfc-price">{item.currency || 'USD'} {item.price?.toLocaleString('es-AR')}</div>
          <p className="mfc-title">{item.title}</p>
          <div className="mfc-loc">
            <MapPin size={12} />
            <span>{item.location || 'Tucumán, Argentina'}</span>
          </div>
          {(item.features?.sqm || item.features?.rooms) && (
            <div className="mfc-specs">
              {item.features?.sqm && <span>{item.features.sqm} m²</span>}
              {item.features?.rooms && <span>{item.features.rooms} amb</span>}
            </div>
          )}
          <button className="mfc-cta" onClick={onSelect}>
            <span>Ver ficha completa</span>
            <ArrowRight size={15} />
          </button>
        </div>
        <button className="mfc-close" onClick={onClose}><X size={16} /></button>
      </div>
    </div>
  );
}

// ─── Main split view ──────────────────────────────────────────────────────────
export default function MapSplitView({
  listings = [],
  onSelectListing,
  favorites = [],
  onToggleFavorite,
  onClose,
  sortBy,          setSortBy,
  priceMin,        setPriceMin,
  priceMax,        setPriceMax,
  selectedCategory, setSelectedCategory,
  availableCategories,
  filterRooms,     setFilterRooms,
  filterCurrency,  setFilterCurrency,
  filterOperationType, setFilterOperationType,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [mobileView, setMobileView] = useState('map');
  const [showFilters, setShowFilters] = useState(false);
  const listRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleMobileView = (view) => {
    setMobileView(view);
    if (view === 'map') setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
  };

  const propiedades = useMemo(() => {
    let list = listings.filter((l) => l.sectionId === 'propiedades');
    if (priceMin !== '') list = list.filter((l) => (l.price ?? 0) >= Number(priceMin));
    if (priceMax !== '') list = list.filter((l) => (l.price ?? 0) <= Number(priceMax));
    if (selectedCategory && selectedCategory !== 'all') list = list.filter((l) => l.category === selectedCategory);
    if (filterCurrency && filterCurrency !== 'all') list = list.filter((l) => l.currency === filterCurrency);
    if (filterOperationType && filterOperationType !== 'all') list = list.filter((l) => l.operationType === filterOperationType);
    if (filterRooms && filterRooms !== 'all') {
      list = list.filter((l) => {
        const r = l.rooms ?? 0;
        return filterRooms === '5+' ? r >= 5 : r === Number(filterRooms);
      });
    }
    const sorted = [...list];
    if (sortBy === 'price_asc')  sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortBy === 'price_desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return sorted;
  }, [listings, sortBy, priceMin, priceMax, selectedCategory, filterCurrency, filterRooms]);

  const withCoords = propiedades.filter((l) => l.coordinates?.lat && l.coordinates?.lng);

  const handlePinClick = (item) => setSelectedPin((prev) => (prev?.id === item.id ? null : item));
  const handleMapClick = () => setSelectedPin(null);

  useEffect(() => {
    if (!selectedPin) return;
    const cardEl = cardRefs.current[selectedPin.id];
    if (cardEl && listRef.current) {
      listRef.current.scrollTo({ top: cardEl.offsetTop - 80, behavior: 'smooth' });
    }
  }, [selectedPin]);

  const activeFilterCount = [
    selectedCategory && selectedCategory !== 'all',
    filterRooms && filterRooms !== 'all',
    filterCurrency && filterCurrency !== 'all',
    filterOperationType && filterOperationType !== 'all',
    priceMin !== '',
    priceMax !== '',
    sortBy !== 'recent',
  ].filter(Boolean).length;

  const handleReset = () => {
    setSortBy('recent');
    setPriceMin('');
    setPriceMax('');
    setSelectedCategory?.('all');
    setFilterRooms?.('all');
    setFilterCurrency?.('all');
    setFilterOperationType?.('all');
  };

  return (
    <div className="mapsplit-root">
      {/* ── Left Panel ── */}
      <div className={`mapsplit-panel${mobileView === 'list' ? ' mapsplit-panel--mobile-show' : ''}`}>
        <div className="mapsplit-panel-header">
          {onClose && (
            <button className="mapsplit-back-btn" onClick={onClose}>
              <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
              <span>Volver</span>
            </button>
          )}
          <p className="mapsplit-section-label">Propiedades</p>
          <div className="mapsplit-panel-title">
            <span className="mapsplit-count">{propiedades.length}</span>
            <span className="mapsplit-label">resultados</span>
          </div>
          {withCoords.length > 0 && (
            <div className="mapsplit-panel-sub">
              <span className="mapsplit-pins-badge">
                <MapPin size={11} /> {withCoords.length} en mapa
              </span>
            </div>
          )}

          {/* Filters button */}
          <button
            className={`mapsplit-filters-btn${activeFilterCount > 0 ? ' mapsplit-filters-btn--active' : ''}`}
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={13} />
            <span>Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
          </button>
        </div>

        <div className="mapsplit-list" ref={listRef}>
          {propiedades.length === 0 ? (
            <div className="mapsplit-empty"><p>Sin propiedades disponibles</p></div>
          ) : (
            propiedades.map((item) => (
              <div key={item.id} ref={(el) => { cardRefs.current[item.id] = el; }}>
                <MapListCard
                  item={item}
                  isHovered={hoveredId === item.id}
                  isSelected={selectedPin?.id === item.id}
                  isFavorite={favorites.includes(item.id)}
                  onHover={() => setHoveredId(item.id)}
                  onLeave={() => setHoveredId(null)}
                  onSelect={() => onSelectListing(item)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Map Panel ── */}
      <div className={`mapsplit-map${mobileView === 'map' ? ' mapsplit-map--mobile-show' : ''}`}>
        <PropertyMapView
          listings={propiedades}
          hoveredId={hoveredId}
          selectedId={selectedPin?.id}
          onPinClick={handlePinClick}
          onMapClick={handleMapClick}
        />
        {propiedades.length === 0 && (
          <div className="mapsplit-map-empty">
            <p>Sin propiedades con los filtros aplicados</p>
          </div>
        )}
        {selectedPin && (
          <FloatingMapCard
            item={selectedPin}
            isFavorite={favorites.includes(selectedPin.id)}
            onToggleFavorite={() => onToggleFavorite(selectedPin.id)}
            onSelect={() => onSelectListing(selectedPin)}
            onClose={() => setSelectedPin(null)}
          />
        )}
      </div>

      {/* ── Mobile Toggle Bar ── */}
      <div className="mapsplit-mobile-bar">
        <button
          className={`mapsplit-mobile-btn${mobileView === 'map' ? ' mapsplit-mobile-btn--active' : ''}`}
          onClick={() => handleMobileView('map')}
        >
          <Map size={16} /><span>Mapa</span>
        </button>
        <button
          className={`mapsplit-mobile-btn${mobileView === 'list' ? ' mapsplit-mobile-btn--active' : ''}`}
          onClick={() => handleMobileView('list')}
        >
          <List size={16} /><span>Lista ({propiedades.length})</span>
        </button>
      </div>

      {/* ── Filters Popup ── */}
      {showFilters && (
        <FiltersPopup
          onClose={() => setShowFilters(false)}
          dark={true}
          activeSection="propiedades"
          sortBy={sortBy}            setSortBy={setSortBy}
          priceMin={priceMin}        setPriceMin={setPriceMin}
          priceMax={priceMax}        setPriceMax={setPriceMax}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories || []}
          filterRooms={filterRooms}               setFilterRooms={setFilterRooms}
          filterCurrency={filterCurrency}          setFilterCurrency={setFilterCurrency}
          filterOperationType={filterOperationType} setFilterOperationType={setFilterOperationType}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
