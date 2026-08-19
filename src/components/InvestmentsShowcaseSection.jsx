import React, { useRef } from 'react';
import { TrendingUp, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const DEMO_INVESTMENTS = [
  {
    id: 'inv1',
    title: 'Torre Alem, Yerba Buena',
    developer: 'Grupo Constructor Alem',
    risk: 'RIESGO BAJO',
    riskColor: '#10B981',
    minInvestment: 'USD 18.000',
    estimatedReturn: '14-17% Anual',
    termMonths: '18 meses',
    progress: 62,
    location: 'Yerba Buena, Tucumán'
  },
  {
    id: 'inv2',
    title: 'Galpones Ruta 9',
    developer: 'Fidalgo Inversiones',
    risk: 'RIESGO MEDIO',
    riskColor: '#F59E0B',
    minInvestment: 'USD 35.000',
    estimatedReturn: '19-22% Anual',
    termMonths: '24 meses',
    progress: 70,
    location: 'Cevil Redondo, Tucumán'
  },
  {
    id: 'inv3',
    title: 'Residencias del Parque',
    developer: 'Desarrollos Del Sur',
    risk: 'RIESGO BAJO',
    riskColor: '#10B981',
    minInvestment: 'USD 22.000',
    estimatedReturn: '15-18% Anual',
    termMonths: '20 meses',
    progress: 45,
    location: 'San Miguel, Tucumán'
  },
  {
    id: 'inv4',
    title: 'Distrito Comercial Norte',
    developer: 'Boutique Real Estate',
    risk: 'RIESGO MEDIO',
    riskColor: '#F59E0B',
    minInvestment: 'USD 40.000',
    estimatedReturn: '20-24% Anual',
    termMonths: '30 meses',
    progress: 80,
    location: 'Tucumán Capital'
  }
];

function getRiskInfo(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('bajo') || cat.includes('low'))  return { label: 'RIESGO BAJO',  color: '#10B981' };
  if (cat.includes('alto') || cat.includes('high')) return { label: 'RIESGO ALTO',  color: '#EF4444' };
  return { label: 'RIESGO MEDIO', color: '#F59E0B' };
}

function mapListingToInvestment(item) {
  const risk = getRiskInfo(item.category);
  return {
    id: item.id,
    title: item.title,
    developer: item.subtitle || 'AF Select',
    risk: risk.label,
    riskColor: risk.color,
    minInvestment: `${item.currency || 'USD'} ${(item.price ?? 0).toLocaleString('es-AR')}`,
    estimatedReturn: item.fuel || 'Consultar',
    termMonths: item.rooms ? `${item.rooms} meses` : 'Consultar',
    progress: item.surface ? Math.min(100, Number(item.surface)) : 0,
    location: item.location || '',
  };
}

export default function InvestmentsShowcaseSection({ listings = [], onOpenContact }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Use real data if available, otherwise show demo cards
  const investments = listings.length > 0
    ? listings.map(mapListingToInvestment)
    : DEMO_INVESTMENTS;

  return (
    <section className="investments-section" style={{ marginBottom: '60px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'var(--accent-gold)',
            color: '#111317',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 0
          }}>
            <TrendingUp size={20} style={{ display: 'block' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--text-main)', lineHeight: '1.05' }}>
              INVERSIONES DE CAPITAL
            </h2>
          </div>
        </div>

        {/* Crisp Single-Line Action Controls Group */}
        <div className="showcase-actions-group">
          <div className="carousel-nav-arrows">
            <button onClick={() => scroll('left')} className="btn-arrow-circle" title="Anterior">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="btn-arrow-circle" title="Siguiente">
              <ChevronRight size={16} />
            </button>
          </div>

          <button className="btn-square-sm active-btn-dark" onClick={onOpenContact}>
            <span>CONSULTAR PROYECTOS ({investments.length})</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={sliderRef}
        className="showcase-carousel-track investments-carousel-track"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '12px'
        }}
      >
        {investments.map((inv) => (
          <div
            key={inv.id}
            className="investment-compact-card"
            style={{
              width: '320px',
              minWidth: '320px',
              maxWidth: '320px',
              flex: '0 0 320px',
              scrollSnapAlign: 'start'
            }}
          >
            <div className="inv-top-row" style={{ marginBottom: '14px' }}>
              <div>
                <h3 className="inv-title" style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{inv.title}</h3>
                <span className="inv-developer" style={{ fontSize: '0.78rem' }}>{inv.developer}</span>
              </div>
              <span
                className="inv-risk-badge"
                style={{
                  background: `${inv.riskColor}15`,
                  color: inv.riskColor,
                  borderColor: `${inv.riskColor}30`,
                  fontSize: '0.68rem',
                  padding: '3px 8px'
                }}
              >
                {inv.risk}
              </span>
            </div>

            <div className="inv-metrics-grid" style={{ gap: '10px', marginBottom: '14px' }}>
              <div className="inv-metric-box" style={{ padding: '8px 12px' }}>
                <div className="inv-metric-val" style={{ fontSize: '1.05rem' }}>{inv.minInvestment}</div>
                <div className="inv-metric-lbl" style={{ fontSize: '0.7rem' }}>Min. Inversión</div>
              </div>
              <div className="inv-metric-box" style={{ padding: '8px 12px' }}>
                <div className="inv-metric-val highlight-green" style={{ fontSize: '1.05rem' }}>{inv.estimatedReturn}</div>
                <div className="inv-metric-lbl" style={{ fontSize: '0.7rem' }}>Retorno Est.</div>
              </div>
              <div className="inv-metric-box" style={{ padding: '8px 12px' }}>
                <div className="inv-metric-val" style={{ fontSize: '1.05rem' }}>{inv.termMonths}</div>
                <div className="inv-metric-lbl" style={{ fontSize: '0.7rem' }}>Plazo</div>
              </div>
              <div className="inv-metric-box" style={{ padding: '8px 12px' }}>
                <div className="inv-metric-val" style={{ fontSize: '1.05rem' }}>{inv.progress}%</div>
                <div className="inv-metric-lbl" style={{ fontSize: '0.7rem' }}>Avance Obra</div>
              </div>
            </div>

            <div className="inv-progress-bar-wrap" style={{ height: '6px', marginBottom: '14px' }}>
              <div className="inv-progress-fill" style={{ width: `${inv.progress}%` }} />
            </div>

            <div className="inv-footer-row" style={{ paddingTop: '12px' }}>
              <span className="inv-loc" style={{ fontSize: '0.78rem' }}>{inv.location}</span>
              <button
                className="btn-square-sm"
                onClick={onOpenContact}
                style={{ padding: '6px 12px', fontSize: '0.72rem' }}
              >
                <span>CONSULTAR</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
