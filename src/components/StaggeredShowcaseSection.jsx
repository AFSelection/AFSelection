import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StaggeredShowcaseSection({ onOpenCatalog }) {
  return (
    <section className="staggered-section">
      <div className="staggered-grid">
        {/* Left Editorial Content */}
        <div className="staggered-left">
          <h2 className="staggered-title">
            No Somos un Concesionario Tradicional
          </h2>

          <p className="staggered-desc">
            Facilitamos la compra y venta de vehículos y propiedades de forma directa. Revisamos cada publicación para garantizar información transparente y un proceso ágil.
          </p>

          <button className="btn-pill btn-pill-dark" onClick={onOpenCatalog} style={{ padding: '14px 28px', fontSize: '0.9rem' }}>
            <span>Explorar Todo el Catálogo</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Right Staggered Offset Image Cards (Image 2 Style) */}
        <div className="staggered-images-row">
          <div className="staggered-card card-tall">
            <img
              src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
              alt="Porsche GT3"
            />
            <div className="staggered-card-overlay">
              <h4>Porsche 911 GT3 RS</h4>
              <p>Edición Limitada 2023</p>
            </div>
          </div>

          <div className="staggered-card card-medium" style={{ marginTop: '36px' }}>
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
              alt="Residencia Nordelta"
            />
            <div className="staggered-card-overlay">
              <h4>Villa Nordelta</h4>
              <p>Residencia sobre el lago</p>
            </div>
          </div>

          <div className="staggered-card card-short" style={{ marginTop: '72px' }}>
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
              alt="BMW M4"
            />
            <div className="staggered-card-overlay">
              <h4>BMW M4 Competition</h4>
              <p>510 HP / 0km</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
