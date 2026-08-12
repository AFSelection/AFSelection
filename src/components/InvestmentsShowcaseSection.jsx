import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function InvestmentsShowcaseSection({ onOpenContact }) {
  const investments = [
    {
      id: 'inv1',
      title: 'Torre Alem, Yerba Buena',
      developer: 'Desarrollador: Grupo Constructor Alem',
      risk: 'RIESGO BAJO',
      riskColor: '#10B981',
      minInvestment: 'USD 18.000',
      estimatedReturn: '14-17%',
      termMonths: '18 meses',
      progress: 62,
      location: 'Yerba Buena, Tucumán'
    },
    {
      id: 'inv2',
      title: 'Galpones Ruta 9, Cevil Redondo',
      developer: 'Desarrollador: Fidalgo Inversiones',
      risk: 'RIESGO MEDIO',
      riskColor: '#F59E0B',
      minInvestment: 'USD 35.000',
      estimatedReturn: '19-22%',
      termMonths: '24 meses',
      progress: 70,
      location: 'Cevil Redondo, Tucumán'
    }
  ];

  return (
    <section className="investments-section">
      <div className="investments-header">
        <div>
          <span className="section-pill-badge-gold">
            <TrendingUp size={14} />
            <span>OPORTUNIDADES DE CAPITAL</span>
          </span>
          <h2 className="investments-title">Inversiones con Retorno Estimado</h2>
        </div>

        <button className="btn-pill" onClick={onOpenContact}>
          <span>Ver Todas las Inversiones</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="investments-grid">
        {investments.map((inv) => (
          <div key={inv.id} className="investment-card">
            <div className="inv-top-row">
              <div>
                <h3 className="inv-title">{inv.title}</h3>
                <span className="inv-developer">{inv.developer}</span>
              </div>
              <span className="inv-risk-badge" style={{ background: `${inv.riskColor}15`, color: inv.riskColor, borderColor: `${inv.riskColor}30` }}>
                {inv.risk}
              </span>
            </div>

            <div className="inv-metrics-grid">
              <div className="inv-metric-box">
                <div className="inv-metric-val">{inv.minInvestment}</div>
                <div className="inv-metric-lbl">Inversión mínima</div>
              </div>
              <div className="inv-metric-box">
                <div className="inv-metric-val highlight-green">{inv.estimatedReturn}</div>
                <div className="inv-metric-lbl">Retorno estimado</div>
              </div>
              <div className="inv-metric-box">
                <div className="inv-metric-val">{inv.termMonths}</div>
                <div className="inv-metric-lbl">Plazo estimado</div>
              </div>
              <div className="inv-metric-box">
                <div className="inv-metric-val">{inv.progress}%</div>
                <div className="inv-metric-lbl">Avance de obra</div>
              </div>
            </div>

            <div className="inv-progress-bar-wrap">
              <div className="inv-progress-fill" style={{ width: `${inv.progress}%` }} />
            </div>

            <div className="inv-footer-row">
              <span className="inv-loc">{inv.location}</span>
              <button className="btn-pill" onClick={onOpenContact} style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                <span>Consultar Proyecto</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
