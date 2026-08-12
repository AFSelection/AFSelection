import React from 'react';
import { ShieldCheck, RefreshCw, Award, ArrowUpRight, PhoneCall, CheckCircle } from 'lucide-react';

export default function ConciergeShowcase() {
  return (
    <section className="dark-section-block" style={{ margin: '60px 0', borderRadius: '32px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)' }}>
            GARANTÍA DE EXCELENCIA AF SELECTION
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#FFF', marginTop: '6px' }}>
            EXPERIENCIA CONCIERGE & CERTIFICACIÓN VIP
          </h2>
          <p style={{ color: 'var(--text-light-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '10px auto 0', lineHeight: '1.6' }}>
            Un servicio integral diseñado para brindar la máxima tranquilidad en la compra, venta y permuta de vehículos de colección y residencias de lujo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Pillar 1 */}
          <div className="concierge-card">
            <div className="concierge-icon-wrap">
              <ShieldCheck size={28} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h3 className="concierge-card-title">Inspección de 150 Puntos</h3>
            <p className="concierge-card-desc">
              Cada vehículo es sometido a un riguroso escaneo mecánico, prueba de compresión de motor y verificación dominios antes de ingresar a nuestro catálogo.
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
            <h3 className="concierge-card-title">Permutas & Financiación Privada</h3>
            <p className="concierge-card-desc">
              Aceptamos unidades seleccionadas en parte de pago o inmuebles de menor valor con tasación oficial en 24 horas y liquidez garantizada.
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
            <h3 className="concierge-card-title">Asesoramiento Notarial & VIP</h3>
            <p className="concierge-card-desc">
              Acompañamiento legal completo, gestoría de transferencias y entrega a domicilio con transporte cerrado privado para proteger tu privacidad.
            </p>
            <div className="concierge-pill-tag">
              <CheckCircle size={14} />
              <span>Privacidad Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
