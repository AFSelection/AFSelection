import React from 'react';
import { ShieldCheck, CheckCircle2, Award, UserCheck, Sparkles } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <section className="why-choose-section">
      <div className="why-choose-grid">
        {/* Left Column: Authentic Agustín Fidalgo Trust Card */}
        <div className="why-choose-left">
          <div className="curated-badge-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} />
            <span>SELECCIÓN PREMIUM · CATÁLOGO CURADO</span>
          </div>
          
          <h2 className="why-choose-title">
            Todo revisado antes de publicarse
          </h2>

          <div className="verified-agustin-pill">
            <CheckCircle2 size={16} />
            <span>Verificado por Agustín Fidalgo</span>
          </div>

          <p className="why-choose-desc" style={{ marginTop: '20px' }}>
            Cada publicación se revisa antes de subirse. AF Select no es un marketplace abierto: cada operación se coordina directo con Agustín Fidalgo, sin intermediarios extra.
          </p>

          <div className="stats-counters-row">
            <div className="stat-item">
              <div className="stat-number">180+</div>
              <div className="stat-label">Operaciones Cerradas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8 Años</div>
              <div className="stat-label">En el Rubro</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Provincias (Tucumán, Salta, Bs.As.)</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Feature Cards */}
        <div className="why-choose-right">
          <div className="feature-card-slate">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="feature-card-title">180+ Operaciones Cerradas</h3>
              <p className="feature-card-desc">
                Operaciones concluidas con éxito en Tucumán, Salta y Buenos Aires con resguardo notarial y confidencialidad.
              </p>
            </div>
          </div>

          <div className="feature-card-slate">
            <div className="feature-icon-box">
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="feature-card-title">Trato Directo sin Intermediarios</h3>
              <p className="feature-card-desc">
                Coordinación directa para la reserva, inspección y negociación de cada activo automotriz o real estate.
              </p>
            </div>
          </div>

          <div className="feature-card-slate">
            <div className="feature-icon-box">
              <Award size={24} />
            </div>
            <div>
              <h3 className="feature-card-title">Inspección de Dominio & Titularidad</h3>
              <p className="feature-card-desc">
                Verificación de antecedentes, compresión de motor en autos y auditoría de títulos en inmuebles antes de publicar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
