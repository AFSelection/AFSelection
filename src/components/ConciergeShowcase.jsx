import React from 'react';
import { ShieldCheck, RefreshCw, Award, ArrowUpRight, PhoneCall, CheckCircle } from 'lucide-react';

export default function ConciergeShowcase() {
  return (
    <section className="dark-section-block" style={{ margin: '60px 0', borderRadius: '32px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)' }}>
            GARANTÍA AF SELECTION
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#FFF', marginTop: '6px' }}>
            ATENCIÓN PERSONALIZADA & CONFIANZA
          </h2>
          <p style={{ color: 'var(--text-light-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '10px auto 0', lineHeight: '1.6' }}>
            Un servicio integral diseñado para brindar la máxima tranquilidad en la compra, venta y permuta de vehículos y propiedades.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Pillar 1 */}
          <div className="concierge-card">
            <div className="concierge-icon-wrap">
              <ShieldCheck size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h3 className="concierge-card-title">Inspección Detallada</h3>
            <p className="concierge-card-desc">
              Cada vehículo es sometido a un riguroso chequeo mecánico, prueba de compresión de motor y verificación de documentación antes de publicarse.
            </p>
            <div className="concierge-pill-tag">
              <CheckCircle size={14} />
              <span>100% Verificado</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="concierge-card">
            <div className="concierge-icon-wrap">
              <RefreshCw size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h3 className="concierge-card-title">Permutas & Financiación</h3>
            <p className="concierge-card-desc">
              Aceptamos unidades en parte de pago o inmuebles de menor valor con tasación oficial y rápida respuesta.
            </p>
            <div className="concierge-pill-tag">
              <CheckCircle size={14} />
              <span>Llave por Llave</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="concierge-card">
            <div className="concierge-icon-wrap">
              <Award size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h3 className="concierge-card-title">Asesoramiento Notarial & Gestoría</h3>
            <p className="concierge-card-desc">
              Acompañamiento legal completo, gestoría de transferencias y entrega coordinada para mayor comodidad y seguridad.
            </p>
            <div className="concierge-pill-tag">
              <CheckCircle size={14} />
              <span>Transparencia Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
