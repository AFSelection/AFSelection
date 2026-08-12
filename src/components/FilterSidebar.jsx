import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  sections,
  activeSection,
  selectedCategory,
  setSelectedCategory,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  selectedCondition,
  setSelectedCondition,
  onResetFilters
}) {
  const currentSection = sections.find((s) => s.id === activeSection);
  const categories = currentSection ? currentSection.categories : [];

  return (
    <aside className="sidebar-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>FILTROS</span>
        <button
          onClick={onResetFilters}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Limpiar filtros"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Dynamic Categories */}
      {categories.length > 0 && (
        <div className="filter-block">
          <span className="filter-section-title">Categorías</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              className={`btn-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="filter-block">
        <span className="filter-section-title">Rango de Precio (USD)</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-canvas)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '6px 10px', fontSize: '0.85rem' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-canvas)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '6px 10px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Condition */}
      <div className="filter-block">
        <span className="filter-section-title">Condición</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            className={`btn-pill ${selectedCondition === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCondition('all')}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Todos
          </button>
          {activeSection === 'autos' ? (
            <>
              <button
                className={`btn-pill ${selectedCondition === '0km' ? 'active' : ''}`}
                onClick={() => setSelectedCondition('0km')}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                0 km
              </button>
              <button
                className={`btn-pill ${selectedCondition === 'Usado' ? 'active' : ''}`}
                onClick={() => setSelectedCondition('Usado')}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Usados
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn-pill ${selectedCondition === 'A Estrenar' ? 'active' : ''}`}
                onClick={() => setSelectedCondition('A Estrenar')}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                A Estrenar
              </button>
              <button
                className={`btn-pill ${selectedCondition === 'Excelente' ? 'active' : ''}`}
                onClick={() => setSelectedCondition('Excelente')}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                Excelente
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
