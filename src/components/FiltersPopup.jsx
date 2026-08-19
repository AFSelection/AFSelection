import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const ROOMS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: '1',   label: '1 amb' },
  { value: '2',   label: '2 amb' },
  { value: '3',   label: '3 amb' },
  { value: '4',   label: '4 amb' },
  { value: '5+',  label: '5+' },
];

const CURRENCY_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'USD', label: 'USD' },
  { value: 'ARS', label: 'ARS' },
];

const OPERATION_OPTIONS = [
  { value: 'all',      label: 'Todos' },
  { value: 'Venta',    label: 'Venta' },
  { value: 'Alquiler', label: 'Alquiler' },
];

const CONDITION_OPTIONS = [
  { value: 'all',       label: 'Todos' },
  { value: '0km',       label: '0 km / Nuevo' },
  { value: 'Usado',     label: 'Usado' },
];

const FUEL_OPTIONS = [
  { value: 'all',      label: 'Todos' },
  { value: 'Nafta',    label: 'Nafta' },
  { value: 'Diesel',   label: 'Diesel' },
  { value: 'Híbrido',  label: 'Híbrido' },
  { value: 'Eléctrico',label: 'Eléctrico' },
];

export default function FiltersPopup({
  onClose,
  dark = false,
  activeSection,
  sortBy,        setSortBy,
  priceMin,      setPriceMin,
  priceMax,      setPriceMax,
  selectedCategory, setSelectedCategory,
  availableCategories = [],
  filterRooms,   setFilterRooms,
  filterCurrency, setFilterCurrency,
  filterOperationType, setFilterOperationType,
  filterCondition, setFilterCondition,
  filterFuel,    setFilterFuel,
  onReset,
}) {
  const isAutos       = activeSection === 'autos';
  const isPropiedades = activeSection === 'propiedades' || activeSection === 'todos' || activeSection === 'all';

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const Chip = ({ value, current, onChange, label }) => (
    <button
      className={`filter-chip${dark ? ' dark' : ''}${current === value ? ' active' : ''}`}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  );

  const Label = ({ children }) => (
    <p className={`fpop-label${dark ? ' dark' : ''}`}>{children}</p>
  );

  return (
    <>
      <div className="fpop-overlay" onClick={onClose} />

      <div className={`fpop-box${dark ? ' fpop-box--dark' : ''}`}>
        {/* Header */}
        <div className="fpop-head">
          <span className="fpop-title">Filtros</span>
          <button className="fpop-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="fpop-body">
          {/* Ordenar por */}
          <div className="fpop-section">
            <Label>Ordenar por</Label>
            <select
              className={`fpop-select${dark ? ' dark' : ''}`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              {isAutos && (
                <>
                  <option value="year_desc">Año más nuevo</option>
                  <option value="km_asc">Menor kilometraje</option>
                </>
              )}
            </select>
          </div>

          {/* Rango de precio */}
          <div className="fpop-section">
            <Label>Rango de precio</Label>
            <div className="fpop-price-row">
              <input
                className={`fpop-price-input${dark ? ' dark' : ''}`}
                type="number"
                placeholder="Mínimo"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <input
                className={`fpop-price-input${dark ? ' dark' : ''}`}
                type="number"
                placeholder="Máximo"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          {/* ── AUTOS filters ── */}
          {isAutos && (
            <>
              {/* Tipo de carrocería */}
              {availableCategories.length > 0 && (
                <div className="fpop-section">
                  <Label>Tipo de carrocería</Label>
                  <div className="filter-chip-group">
                    <Chip value="all" current={selectedCategory || 'all'} onChange={setSelectedCategory} label="Todos" />
                    {availableCategories.map((cat) => (
                      <Chip key={cat} value={cat} current={selectedCategory || 'all'} onChange={setSelectedCategory} label={cat} />
                    ))}
                  </div>
                </div>
              )}

              {/* Condición */}
              <div className="fpop-section">
                <Label>Condición</Label>
                <div className="filter-chip-group">
                  {CONDITION_OPTIONS.map(({ value, label }) => (
                    <Chip key={value} value={value} current={filterCondition || 'all'} onChange={setFilterCondition} label={label} />
                  ))}
                </div>
              </div>

              {/* Combustible */}
              <div className="fpop-section">
                <Label>Combustible</Label>
                <div className="filter-chip-group">
                  {FUEL_OPTIONS.map(({ value, label }) => (
                    <Chip key={value} value={value} current={filterFuel || 'all'} onChange={setFilterFuel} label={label} />
                  ))}
                </div>
              </div>

              {/* Moneda */}
              <div className="fpop-section">
                <Label>Moneda</Label>
                <div className="filter-chip-group">
                  {CURRENCY_OPTIONS.map(({ value, label }) => (
                    <Chip key={value} value={value} current={filterCurrency || 'all'} onChange={setFilterCurrency} label={label} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PROPIEDADES filters ── */}
          {isPropiedades && (
            <>
              {/* Tipo de propiedad */}
              {availableCategories.length > 0 && (
                <div className="fpop-section">
                  <Label>Tipo de propiedad</Label>
                  <div className="filter-chip-group">
                    <Chip value="all" current={selectedCategory || 'all'} onChange={setSelectedCategory} label="Todos" />
                    {availableCategories.map((cat) => (
                      <Chip key={cat} value={cat} current={selectedCategory || 'all'} onChange={setSelectedCategory} label={cat} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ambientes */}
              <div className="fpop-section">
                <Label>Ambientes</Label>
                <div className="filter-chip-group">
                  {ROOMS_OPTIONS.map(({ value, label }) => (
                    <Chip key={value} value={value} current={filterRooms || 'all'} onChange={setFilterRooms} label={label} />
                  ))}
                </div>
              </div>

              {/* Moneda */}
              <div className="fpop-section">
                <Label>Moneda</Label>
                <div className="filter-chip-group">
                  {CURRENCY_OPTIONS.map(({ value, label }) => (
                    <Chip key={value} value={value} current={filterCurrency || 'all'} onChange={setFilterCurrency} label={label} />
                  ))}
                </div>
              </div>

              {/* Tipo de operación */}
              {setFilterOperationType && (
                <div className="fpop-section">
                  <Label>Tipo de operación</Label>
                  <div className="filter-chip-group">
                    {OPERATION_OPTIONS.map(({ value, label }) => (
                      <Chip key={value} value={value} current={filterOperationType || 'all'} onChange={setFilterOperationType} label={label} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="fpop-footer">
          <button className={`fpop-btn-reset${dark ? ' dark' : ''}`} onClick={onReset}>
            Limpiar filtros
          </button>
          <button className={`fpop-btn-apply${dark ? ' dark' : ''}`} onClick={onClose}>
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
}
